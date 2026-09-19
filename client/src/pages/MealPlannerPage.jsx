import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Trash2, ShoppingBag, Check } from 'lucide-react';
import { getMealPlans, deleteMealPlan, generateShoppingFromMealPlans } from '../services/mealPlanService';
import { getRecipes } from '../services/recipeService';
import { Link } from 'react-router-dom';

export default function MealPlannerPage() {
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await getMealPlans();
      setMealPlans(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMealPlan(id);
      setMealPlans(mealPlans.filter(p => p._id !== id));
    } catch (err) {
      alert('Failed to delete meal plan item');
    }
  };

  const handleGenerateShopping = async () => {
    try {
      const res = await generateShoppingFromMealPlans();
      setMsg(res.message || 'Shopping list updated from your meal plan!');
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to generate shopping list');
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-8 h-8 text-indigo-500" /> Weekly Meal Planner
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize your daily meals and aggregate required ingredients automatically into your shopping list.
          </p>
        </div>

        <button
          onClick={handleGenerateShopping}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-md flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" /> Generate Shopping List
        </button>
      </div>

      {msg && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs text-center shadow-md">
          {msg}
        </div>
      )}

      {/* Meal Plans Grid */}
      {loading ? (
        <p className="text-center text-slate-500 py-12">Loading your meal schedule...</p>
      ) : mealPlans.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
          <CalendarIcon className="w-12 h-12 text-indigo-400 mx-auto" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your weekly meal planner is empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse recipes and click "Add to Meal Plan" to start organizing your meals.
          </p>
          <Link to="/explore" className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs inline-block">
            Explore Recipes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mealPlans.map((plan) => (
            <div key={plan._id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-extrabold">
                  <span className="uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
                    {plan.mealType}
                  </span>
                  <span className="text-slate-400">{plan.date}</span>
                </div>

                <h4 className="font-bold text-base text-slate-900 dark:text-white">{plan.recipe?.title || 'Custom Meal'}</h4>
                <p className="text-xs text-slate-500">Servings: {plan.servings}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                <Link to={`/recipes/${plan.recipe?.slug}`} className="text-brand-600 font-bold hover:underline">View Recipe</Link>
                <button onClick={() => handleDelete(plan._id)} className="text-rose-500 hover:text-rose-600 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
