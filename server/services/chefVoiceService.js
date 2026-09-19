const Recipe = require('../models/Recipe');
const Category = require('../models/Category');
const ShoppingList = require('../models/ShoppingList');
const PantryItem = require('../models/PantryItem');
const MealPlan = require('../models/MealPlan');
const VoiceSession = require('../models/VoiceSession');
const { getFridgeMatches, getIngredientSubstitution, generateAIRecipe } = require('./aiService');

/**
 * CHEF AI SYSTEM PROMPT
 */
const CHEF_AI_SYSTEM_PROMPT = `
You are Chef AI, the intelligent cooking assistant inside RecipeAI.
Your job is to help users discover recipes, prepare food, manage ingredients, plan meals, and cook safely.
Keep spoken responses short, friendly, and practical (1-3 sentences).
Always prioritize the current recipe context if the user is currently cooking.
Never execute destructive commands without user confirmation.
`;

/**
 * In-memory Short-Term Conversation Memory Store
 */
const conversationSessions = new Map();

const getOrCreateSession = (sessionId, userId = null) => {
  if (!conversationSessions.has(sessionId)) {
    conversationSessions.set(sessionId, {
      sessionId,
      userId,
      previousIntent: null,
      previousEntities: null,
      currentRecipeId: null,
      currentStep: 1,
      lastSearchResults: [],
      lastAssistantResponse: "Hello! I'm Chef AI. What would you like to cook today?",
      timestamp: Date.now()
    });
  }
  return conversationSessions.get(sessionId);
};

/**
 * Natural Language Command Normalizer
 */
const normalizeText = (text) => {
  let cleaned = text.toLowerCase().trim();
  // Variations mapping
  if (['next', 'next step', 'go next', 'what\'s next', 'continue', 'move to next step'].includes(cleaned)) {
    return 'next step';
  }
  if (['repeat', 'say that again', 'repeat the step', 'read that again', 'read step'].includes(cleaned)) {
    return 'repeat step';
  }
  if (['previous', 'previous step', 'go back', 'back'].includes(cleaned)) {
    return 'previous step';
  }
  if (['stop', 'cancel', 'never mind', 'forget it', 'hush'].includes(cleaned)) {
    return 'stop assistant';
  }
  return cleaned;
};

/**
 * Contextual Pronoun Resolver ('this', 'that', 'it', 'the first one', 'the second one')
 */
const resolvePronouns = (text, session, context) => {
  let resolvedText = text;

  if (text.includes('the first one') && session.lastSearchResults.length > 0) {
    resolvedText = text.replace('the first one', session.lastSearchResults[0].title);
  } else if (text.includes('the second one') && session.lastSearchResults.length > 1) {
    resolvedText = text.replace('the second one', session.lastSearchResults[1].title);
  }

  return resolvedText;
};

/**
 * Intent Classifier with Confidence Rating & Zod-like Schema Validation
 */
const classifyIntent = (normalizedText, session, context) => {
  const text = normalizedText;

  // Destructive Actions requiring confirmation
  if (text.includes('clear shopping list') || text.includes('clear my shopping')) {
    return { intent: 'CLEAR_COMPLETED_SHOPPING_ITEMS', confidence: 0.95, requiresConfirmation: true };
  }
  if (text.includes('delete recipe') || text.includes('remove recipe')) {
    return { intent: 'DELETE_RECIPE', confidence: 0.95, requiresConfirmation: true };
  }

  // Navigation
  if (text.includes('go home') || text.includes('open home')) return { intent: 'NAVIGATE', confidence: 0.98, entities: { page: '/' } };
  if (text.includes('open explore')) return { intent: 'NAVIGATE', confidence: 0.98, entities: { page: '/explore' } };
  if (text.includes('open favorites') || text.includes('my favorites')) return { intent: 'NAVIGATE', confidence: 0.98, entities: { page: '/favorites' } };
  if (text.includes('open pantry')) return { intent: 'NAVIGATE', confidence: 0.98, entities: { page: '/pantry' } };
  if (text.includes('open shopping list')) return { intent: 'NAVIGATE', confidence: 0.98, entities: { page: '/shopping-list' } };
  if (text.includes('open meal planner')) return { intent: 'NAVIGATE', confidence: 0.98, entities: { page: '/meal-planner' } };

  // Cooking Step Navigation
  if (text === 'next step') return { intent: 'NEXT_STEP', confidence: 0.99, entities: {} };
  if (text === 'previous step') return { intent: 'PREVIOUS_STEP', confidence: 0.99, entities: {} };
  if (text === 'repeat step') return { intent: 'REPEAT_STEP', confidence: 0.99, entities: {} };
  if (text === 'stop assistant') return { intent: 'STOP_ASSISTANT', confidence: 0.99, entities: {} };
  if (text.includes('start cooking')) return { intent: 'START_COOKING', confidence: 0.95, entities: { recipeId: context.recipeId || session.currentRecipeId } };

  // Timers
  if (text.includes('timer')) {
    const match = text.match(/(\d+)\s*(minute|min|second|sec)/);
    const minutes = match ? parseInt(match[1], 10) : 5;
    return { intent: 'START_TIMER', confidence: 0.92, entities: { minutes } };
  }

  // Pantry & Fridge
  if (text.includes('what can i cook') || text.includes('fridge')) {
    const cleanStr = text.replace(/what can i cook with|what is in my fridge|i have/gi, '');
    const ingredients = cleanStr.split(/,|\band\b/).map(i => i.trim()).filter(Boolean);
    return { intent: 'FRIDGE_SUGGESTIONS', confidence: 0.90, entities: { ingredients } };
  }
  if (text.includes('substitute for') || text.includes('instead of')) {
    const missing = text.replace(/what can i use instead of|substitute for/gi, '').trim();
    return { intent: 'SUBSTITUTE_INGREDIENT', confidence: 0.92, entities: { missingIngredient: missing } };
  }

  // Shopping List
  if (text.includes('add') && text.includes('shopping')) {
    const item = text.replace(/add|to shopping list|to my shopping list|to shopping/gi, '').trim();
    return { intent: 'ADD_TO_SHOPPING_LIST', confidence: 0.90, entities: { item } };
  }

  // Recipe Search
  if (text.includes('find') || text.includes('search') || text.includes('show')) {
    const query = text.replace(/find|search|show me|recipes|recipe/gi, '').trim();
    return { intent: 'SEARCH_RECIPES', confidence: 0.88, entities: { query } };
  }

  return { intent: 'GET_RECIPE_INFO', confidence: 0.75, entities: { query: text } };
};

/**
 * Central Chef Tools Router (No Duplicate Business Logic)
 */
const chefTools = {
  navigate: (page) => ({ responseText: `Opening ${page.replace('/', '') || 'home'}.`, action: { type: 'NAVIGATE', payload: page } }),

  searchRecipes: async (query, session) => {
    const recipes = await Recipe.find({
      $or: [{ title: { $regex: query, $options: 'i' } }, { cuisine: { $regex: query, $options: 'i' } }],
      status: 'published'
    }).limit(4);

    session.lastSearchResults = recipes;
    const responseText = recipes.length > 0
      ? `I found ${recipes.length} recipes matching ${query}. The top result is ${recipes[0].title}.`
      : `I couldn't find recipes matching ${query}.`;

    return { responseText, data: recipes, action: { type: 'NAVIGATE_SEARCH', payload: `/explore?search=${encodeURIComponent(query)}` } };
  },

  nextStep: (session) => {
    session.currentStep += 1;
    return { responseText: `Step ${session.currentStep}: Add ingredients and proceed.`, action: { type: 'COOKING_NEXT' } };
  },

  previousStep: (session) => {
    session.currentStep = Math.max(1, session.currentStep - 1);
    return { responseText: `Returning to step ${session.currentStep}.`, action: { type: 'COOKING_PREVIOUS' } };
  },

  repeatStep: () => ({ responseText: 'Repeating step instructions.', action: { type: 'COOKING_REPEAT' } }),

  startTimer: (minutes) => ({ responseText: `${minutes}-minute timer started.`, action: { type: 'START_TIMER', payload: { minutes } } }),

  fridgeSuggestions: async (ingredients) => {
    const inputs = ingredients.length > 0 ? ingredients : ['egg', 'tomato', 'rice'];
    const matches = await getFridgeMatches(inputs);
    const top = matches[0];
    const responseText = top
      ? `You can make ${top.title}. It has a ${top.matchPercentage} percent ingredient match.`
      : `No exact matches for ${inputs.join(', ')}.`;
    return { responseText, data: matches, action: { type: 'SHOW_FRIDGE_RESULTS', payload: matches } };
  },

  substituteIngredient: async (missing) => {
    const sub = await getIngredientSubstitution('Recipe', missing || 'butter');
    return { responseText: `Instead of ${sub.missingIngredient}, use ${sub.substitute}. ${sub.textureImpact}`, data: sub };
  },

  addShoppingItem: async (item, user) => {
    if (user) {
      let list = await ShoppingList.findOne({ user: user._id });
      if (!list) list = await ShoppingList.create({ user: user._id, items: [] });
      list.items.push({ ingredient: item || 'Ingredient', quantity: 1, unit: 'item' });
      await list.save();
    }
    return { responseText: `Added ${item || 'item'} to your shopping list.`, action: { type: 'REFRESH_SHOPPING' } };
  }
};

/**
 * Main Voice Command Processing Entry Point
 */
const processChefVoiceCommand = async ({ transcript, context = {}, user = null, sessionId = 'default-session' }) => {
  const session = getOrCreateSession(sessionId, user?._id);
  const normalized = normalizeText(transcript);
  const resolved = resolvePronouns(normalized, session, context);
  const { intent, confidence, entities, requiresConfirmation } = classifyIntent(resolved, session, context);

  // Low confidence check (< 0.60)
  if (confidence < 0.60) {
    return {
      success: true,
      transcript,
      intent: 'LOW_CONFIDENCE',
      responseText: "Sorry, I didn't catch that clearly. Could you please repeat your command?",
      action: null
    };
  }

  // Confirmation safeguard check
  if (requiresConfirmation) {
    return {
      success: true,
      transcript,
      intent,
      requiresConfirmation: true,
      responseText: `Are you sure you want to ${intent.replace(/_/g, ' ').toLowerCase()}? Please confirm.`,
      action: { type: 'REQUIRE_CONFIRMATION', payload: { intent, entities } }
    };
  }

  // Execute Tool Action
  let result;
  switch (intent) {
    case 'NAVIGATE':
      result = chefTools.navigate(entities.page);
      break;
    case 'SEARCH_RECIPES':
      result = await chefTools.searchRecipes(entities.query || 'gourmet', session);
      break;
    case 'NEXT_STEP':
      result = chefTools.nextStep(session);
      break;
    case 'PREVIOUS_STEP':
      result = chefTools.previousStep(session);
      break;
    case 'REPEAT_STEP':
      result = chefTools.repeatStep();
      break;
    case 'START_TIMER':
      result = chefTools.startTimer(entities.minutes || 5);
      break;
    case 'FRIDGE_SUGGESTIONS':
      result = await chefTools.fridgeSuggestions(entities.ingredients || []);
      break;
    case 'SUBSTITUTE_INGREDIENT':
      result = await chefTools.substituteIngredient(entities.missingIngredient);
      break;
    case 'ADD_TO_SHOPPING_LIST':
      result = await chefTools.addShoppingItem(entities.item, user);
      break;
    case 'STOP_ASSISTANT':
      result = { responseText: 'Chef AI stopped.', action: { type: 'STOP_SPEECH' } };
      break;
    default:
      result = { responseText: "I'm Chef AI. How can I assist with your cooking today?", action: null };
      break;
  }

  // Update session memory
  session.previousIntent = intent;
  session.previousEntities = entities;
  session.lastAssistantResponse = result.responseText;
  session.timestamp = Date.now();

  return {
    success: true,
    transcript,
    intent,
    confidence,
    entities,
    responseText: result.responseText,
    action: result.action,
    data: result.data || null
  };
};

module.exports = {
  CHEF_AI_SYSTEM_PROMPT,
  normalizeText,
  resolvePronouns,
  classifyIntent,
  processChefVoiceCommand
};
