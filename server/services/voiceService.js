const Recipe = require('../models/Recipe');
const Category = require('../models/Category');
const ShoppingList = require('../models/ShoppingList');
const PantryItem = require('../models/PantryItem');
const MealPlan = require('../models/MealPlan');
const { getFridgeMatches, getIngredientSubstitution, generateAIRecipe } = require('./aiService');

/**
 * Voice Intent Classification & Tool Router Engine
 */

const detectIntentAndEntities = (transcript, context = {}) => {
  const text = transcript.toLowerCase().trim();

  // 1. Navigation Commands
  if (text.includes('go home') || text.includes('open home')) return { intent: 'NAVIGATE', entities: { page: '/' } };
  if (text.includes('open explore') || text.includes('show explore')) return { intent: 'NAVIGATE', entities: { page: '/explore' } };
  if (text.includes('open my favorites') || text.includes('show favorites')) return { intent: 'NAVIGATE', entities: { page: '/favorites' } };
  if (text.includes('open pantry') || text.includes('show my pantry')) return { intent: 'NAVIGATE', entities: { page: '/pantry' } };
  if (text.includes('open shopping list') || text.includes('show shopping')) return { intent: 'NAVIGATE', entities: { page: '/shopping-list' } };
  if (text.includes('open meal planner') || text.includes('show meal planner')) return { intent: 'NAVIGATE', entities: { page: '/meal-planner' } };
  if (text.includes('open ai studio') || text.includes('recipe generator')) return { intent: 'NAVIGATE', entities: { page: '/ai/recipe-generator' } };

  // 2. Cooking Mode Commands (Step Navigation & Controls)
  if (text.includes('next step') || text.includes('next')) return { intent: 'NEXT_STEP', entities: {} };
  if (text.includes('previous step') || text.includes('back')) return { intent: 'PREVIOUS_STEP', entities: {} };
  if (text.includes('repeat') || text.includes('read step')) return { intent: 'REPEAT_STEP', entities: {} };
  if (text.includes('start cooking')) return { intent: 'START_COOKING', entities: { recipeId: context.recipeId } };

  // 3. Timers
  if (text.includes('set a timer') || text.includes('timer for')) {
    const timeMatch = text.match(/(\d+)\s*(minute|min|second|sec)/);
    const minutes = timeMatch ? parseInt(timeMatch[1], 10) : 5;
    return { intent: 'START_TIMER', entities: { durationMinutes: minutes } };
  }
  if (text.includes('pause timer')) return { intent: 'PAUSE_TIMER', entities: {} };
  if (text.includes('stop timer') || text.includes('cancel timer')) return { intent: 'STOP_TIMER', entities: {} };

  // 4. Fridge & Pantry Commands
  if (text.includes('what can i cook') || text.includes('what\'s in my fridge') || text.includes('fridge')) {
    const ingMatch = text.replace(/what can i cook with|what is in my fridge|i have/gi, '').split(/,|\band\b/);
    const ingredients = ingMatch.map(i => i.trim()).filter(Boolean);
    return { intent: 'FRIDGE_SUGGESTIONS', entities: { ingredients } };
  }
  if (text.includes('substitute for') || text.includes('instead of')) {
    const missing = text.replace(/what can i use instead of|substitute for/gi, '').trim();
    return { intent: 'SUBSTITUTE_INGREDIENT', entities: { missingIngredient: missing } };
  }

  // 5. Shopping List Commands
  if (text.includes('add to shopping list') || text.includes('add to my shopping')) {
    const itemStr = text.replace(/add|to shopping list|to my shopping list|to shopping/gi, '').trim();
    return { intent: 'ADD_TO_SHOPPING_LIST', entities: { item: itemStr } };
  }

  // 6. Recipe Search Commands
  if (text.includes('find') || text.includes('search') || text.includes('show me')) {
    const query = text.replace(/find|search|show me|recipes|recipe/gi, '').trim();
    return { intent: 'SEARCH_RECIPES', entities: { query } };
  }

  // Default General Query / AI Assistance
  return { intent: 'GET_RECIPE_INFO', entities: { query: text } };
};

const executeVoiceAction = async (intent, entities, context, user) => {
  switch (intent) {
    case 'NAVIGATE':
      return {
        responseText: `Navigating to ${entities.page.replace('/', '') || 'home'}.`,
        action: { type: 'NAVIGATE', payload: entities.page }
      };

    case 'NEXT_STEP':
      return {
        responseText: 'Moving to the next cooking step.',
        action: { type: 'COOKING_NEXT' }
      };

    case 'PREVIOUS_STEP':
      return {
        responseText: 'Returning to the previous cooking step.',
        action: { type: 'COOKING_PREVIOUS' }
      };

    case 'REPEAT_STEP':
      return {
        responseText: 'Repeating current step.',
        action: { type: 'COOKING_REPEAT' }
      };

    case 'START_TIMER':
      return {
        responseText: `Timer started for ${entities.durationMinutes} minutes.`,
        action: { type: 'START_TIMER', payload: { minutes: entities.durationMinutes } }
      };

    case 'FRIDGE_SUGGESTIONS': {
      const inputs = entities.ingredients.length > 0 ? entities.ingredients : ['egg', 'tomato', 'rice'];
      const matches = await getFridgeMatches(inputs);
      const topMatch = matches[0];
      const reply = topMatch
        ? `You can make ${topMatch.title}. It has a ${topMatch.matchPercentage} percent match with your ingredients.`
        : `I searched recipes for ${inputs.join(', ')}.`;
      return {
        responseText: reply,
        data: matches,
        action: { type: 'SHOW_FRIDGE_RESULTS', payload: matches }
      };
    }

    case 'SUBSTITUTE_INGREDIENT': {
      const sub = await getIngredientSubstitution('Recipe', entities.missingIngredient || 'butter');
      return {
        responseText: `Instead of ${sub.missingIngredient}, you can use ${sub.substitute}. ${sub.textureImpact}`,
        data: sub
      };
    }

    case 'ADD_TO_SHOPPING_LIST': {
      if (user) {
        let list = await ShoppingList.findOne({ user: user._id });
        if (!list) list = await ShoppingList.create({ user: user._id, items: [] });
        list.items.push({ ingredient: entities.item || 'Ingredient', quantity: 1, unit: 'item' });
        await list.save();
      }
      return {
        responseText: `Added ${entities.item || 'item'} to your shopping list.`,
        action: { type: 'REFRESH_SHOPPING' }
      };
    }

    case 'SEARCH_RECIPES': {
      const q = entities.query || 'delicious';
      const recipes = await Recipe.find({
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { cuisine: { $regex: q, $options: 'i' } }
        ],
        status: 'published'
      }).limit(4);

      const count = recipes.length;
      const responseText = count > 0
        ? `I found ${count} recipes matching ${q}. The top result is ${recipes[0].title}.`
        : `I could not find any recipes matching ${q}.`;

      return {
        responseText,
        data: recipes,
        action: { type: 'NAVIGATE_SEARCH', payload: `/explore?search=${encodeURIComponent(q)}` }
      };
    }

    default:
      return {
        responseText: "I'm Chef AI. How can I help you cook today?",
        action: null
      };
  }
};

const processVoiceCommand = async ({ transcript, context = {}, user = null }) => {
  const { intent, entities } = detectIntentAndEntities(transcript, context);
  const result = await executeVoiceAction(intent, entities, context, user);

  return {
    success: true,
    transcript,
    intent,
    entities,
    responseText: result.responseText,
    action: result.action,
    data: result.data || null
  };
};

module.exports = {
  detectIntentAndEntities,
  executeVoiceAction,
  processVoiceCommand
};
