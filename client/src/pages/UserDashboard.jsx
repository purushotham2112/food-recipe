import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, BookOpen, Heart, Calendar, ShoppingBag, Box, Plus, Sparkles } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { getRecipes } from '../services/recipeService';

export default function UserDashboard() {
  const { user } = useAuthStore();
  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        setLoading(true);
        const res = await getRecipes({ limit: 4 });
        setMyRecipes(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserRecipes();
  }, []);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Profile Overview Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center gap-4">
          <img
            src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
            alt={user?.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-brand-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-500 text-white text-[10px] uppercase font-bold">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">{user?.email}</p>
            <p className="text-xs text-slate-400 mt-1">{user?.bio || 'Passionate home chef on RecipeAI'}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/create-recipe" className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 font-bold text-xs flex items-center gap-1.5 shadow-md">
            <Plus className="w-4 h-4" /> Create Recipe
          </Link>
        </div>
      </div>

      {/* Quick Access Dashboard Tools Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link to="/favorites" className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-2">
          <Heart className="w-6 h-6 text-rose-500" />
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Saved Cookbooks</h4>
          <p className="text-xs text-slate-500">View favorite recipes</p>
        </Link>

        <Link to="/meal-planner" className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-2">
          <Calendar className="w-6 h-6 text-indigo-500" />
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Meal Planner</h4>
          <p className="text-xs text-slate-500">Schedule weekly meals</p>
        </Link>

        <Link to="/shopping-list" className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-2">
          <ShoppingBag className="w-6 h-6 text-emerald-500" />
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Shopping List</h4>
          <p className="text-xs text-slate-500">Automated ingredients</p>
        </Link>

        <Link to="/pantry" className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-2">
          <Box className="w-6 h-6 text-amber-500" />
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Smart Pantry</h4>
          <p className="text-xs text-slate-500">Inventory & expiration</p>
        </Link>
      </div>
    </div>
  );
}
