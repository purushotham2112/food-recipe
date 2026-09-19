import React, { useState } from 'react';
import { Sparkles, ChefHat, Save, Calendar, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { generateAIRecipe } from '../services/aiService';
import { createRecipe } from '../services/recipeService';
import { getCategories } from '../services/categoryService';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function AIRecipeGenerator() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState('Chicken, Tomato, Garlic, Rice');
  const [cuisine, setCuisine] = useState('Asian');
  const [diet, setDiet] = useState('Balanced');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [disclaimer, setDisclaimer] = useState('');
  const [savedMsg, setSavedMsg] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      setLoading(true);
      setSavedMsg('');
      const res = await generateAIRecipe({ prompt, cuisine, diet });
      setAiResult(res.data);
      setDisclaimer(res.disclaimer);
    } catch (err) {
      alert(err.message || 'AI Recipe generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToMyRecipes = async () => {
    if (!isAuthenticated) return navigate('/login');
    if (!aiResult) return;

    try {
      // Get category ID
      const catsRes = await getCategories();
      const firstCatId = catsRes.data?.[0]?._id;

      await createRecipe({
        title: aiResult.title,
        description: aiResult.description,
        preparationTime: aiResult.preparationTime || 15,
        cookingTime: aiResult.cookingTime || 20,
        servings: aiResult.servings || 2,
        difficulty: aiResult.difficulty || 'Medium',
        cuisine: aiResult.cuisine || 'Fusion',
        category: firstCatId,
        ingredients: aiResult.ingredients || [],
        instructions: aiResult.instructions || [],
        nutrition: aiResult.nutrition || {},
        tags: aiResult.tags || ['AI Generated']
      });

      setSavedMsg('✅ Recipe saved to your published cookbooks!');
      setTimeout(() => setSavedMsg(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to save recipe');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs border border-amber-500/20">
          <Sparkles className="w-4 h-4 text-amber-500" /> RecipeAI Studio
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Recipe Generator
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Type the ingredients in your pantry or your culinary craving, and our AI chef will construct an instant step-by-step recipe.
        </p>
      </div>

      {/* Input Generator Form */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
        <form onSubmit={handleGenerate} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Available Ingredients or Dish Prompt
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Chicken, Tomato, Spinach, Olive Oil"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Preferred Cuisine</label>
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-brand-500"
              >
                <option value="Asian">Asian</option>
                <option value="Italian">Italian</option>
                <option value="Indian">Indian</option>
                <option value="Mexican">Mexican</option>
                <option value="Mediterranean">Mediterranean</option>
                <option value="American">American</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Dietary Preference</label>
              <select
                value={diet}
                onChange={(e) => setDiet(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-brand-500"
              >
                <option value="Balanced">Balanced</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="High-Protein">High-Protein</option>
                <option value="Gluten-Free">Gluten-Free</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-white font-extrabold text-sm shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" /> AI Chef is Cooking Recipe...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" /> Generate AI Recipe
              </>
            )}
          </button>
        </form>
      </div>

      {/* RESULT DISCARD / SAVE VIEW */}
      {aiResult && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-brand-500/30 shadow-2xl space-y-8 animate-fade-in">
          
          {savedMsg && (
            <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs text-center shadow-md">
              {savedMsg}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div>
              <span className="text-xs font-extrabold text-amber-500 uppercase tracking-widest">
                Generated Recipe
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {aiResult.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">{aiResult.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveToMyRecipes}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-2 shadow-md"
              >
                <Save className="w-4 h-4" /> Save Recipe
              </button>
            </div>
          </div>

          {/* Quick Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
              <p className="text-slate-400">Prep Time</p>
              <p className="font-bold text-sm text-slate-900 dark:text-white">{aiResult.preparationTime} min</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
              <p className="text-slate-400">Cook Time</p>
              <p className="font-bold text-sm text-slate-900 dark:text-white">{aiResult.cookingTime} min</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
              <p className="text-slate-400">Difficulty</p>
              <p className="font-bold text-sm text-brand-600">{aiResult.difficulty}</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
              <p className="text-slate-400">Calories</p>
              <p className="font-bold text-sm text-amber-500">{aiResult.nutrition?.calories || 420} kcal</p>
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Required Ingredients</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {aiResult.ingredients?.map((ing, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex justify-between">
                  <span className="font-semibold">{ing.name}</span>
                  <span className="font-bold text-brand-600">{ing.quantity} {ing.unit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Step-by-Step Method</h3>
            <div className="space-y-3 text-xs">
              {aiResult.instructions?.map((step) => (
                <div key={step.stepNumber} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-500 text-white font-bold flex items-center justify-center flex-shrink-0">
                    {step.stepNumber}
                  </span>
                  <div>
                    {step.title && <p className="font-bold text-slate-900 dark:text-white mb-1">{step.title}</p>}
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Disclaimer */}
          {disclaimer && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-500 mt-0.5" />
              <span>{disclaimer}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
