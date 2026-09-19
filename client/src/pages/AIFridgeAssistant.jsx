import React, { useState } from 'react';
import { ChefHat, CheckCircle2, XCircle, Plus, Trash2, ArrowRight } from 'lucide-react';
import { getFridgeMatches } from '../services/aiService';
import { Link } from 'react-router-dom';

export default function AIFridgeAssistant() {
  const [ingredients, setIngredients] = useState(['Egg', 'Tomato', 'Rice', 'Garlic']);
  const [newIngredient, setNewIngredient] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleFindRecipes = async () => {
    if (ingredients.length === 0) return;
    try {
      setLoading(true);
      const res = await getFridgeMatches(ingredients);
      setMatches(res.data || []);
    } catch (err) {
      alert(err.message || 'Failed to fetch fridge matches');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20">
          <ChefHat className="w-4 h-4 text-emerald-500" /> Smart Pantry & Fridge Assistant
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          What's in My Fridge?
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Add your available fridge ingredients below. RecipeAI will scan gourmet recipes to calculate match percentages and show what you can cook right now.
        </p>
      </div>

      {/* Ingredient Tags & Input Form */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
        
        <form onSubmit={handleAddIngredient} className="flex gap-2">
          <input
            type="text"
            placeholder="Add an ingredient (e.g. Chicken, Butter, Paneer)..."
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            className="flex-1 px-4 py-3 text-sm rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </form>

        {/* Ingredients Pills */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Fridge Inventory ({ingredients.length})</span>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900 font-bold text-xs"
              >
                {item}
                <button onClick={() => handleRemoveIngredient(idx)} className="hover:text-rose-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={handleFindRecipes}
          disabled={loading || ingredients.length === 0}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? 'Analyzing Fridge Matches...' : 'Find Matching Recipes'}
        </button>
      </div>

      {/* RESULTS LIST */}
      {matches.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Matching Recipes Found ({matches.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-xs">
                      {item.matchPercentage}% Match
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{item.cuisine} • {item.cookingTime} mins</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{item.title}</h3>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-emerald-600 flex items-center gap-1 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Available Ingredients ({item.availableIngredients.length}):
                      </span>
                      <p className="text-slate-600 dark:text-slate-400 pl-4">{item.availableIngredients.join(', ')}</p>
                    </div>

                    {item.missingIngredients.length > 0 && (
                      <div>
                        <span className="font-bold text-rose-500 flex items-center gap-1 mb-1">
                          <XCircle className="w-3.5 h-3.5" /> Missing Ingredients ({item.missingIngredients.length}):
                        </span>
                        <p className="text-slate-500 dark:text-slate-400 pl-4">{item.missingIngredients.join(', ')}</p>
                      </div>
                    )}
                  </div>
                </div>

                <Link
                  to={`/explore?search=${encodeURIComponent(item.title)}`}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white font-bold text-xs text-center text-slate-900 dark:text-white transition-colors block"
                >
                  View Full Recipe Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
