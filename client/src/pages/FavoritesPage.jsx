import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import RecipeCardSkeleton from '../components/RecipeCardSkeleton';
import { getUserFavorites } from '../services/recipeService';

export default function FavoritesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavs = async () => {
      try {
        setLoading(true);
        const res = await getUserFavorites();
        setRecipes(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavs();
  }, []);

  return (
    <div className="space-y-8 pb-16">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" /> Saved Favorite Recipes
        </h1>
        <p className="text-sm text-slate-500 mt-1">Your personal collection of bookmarked gourmet recipes.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <RecipeCardSkeleton key={i} />)}
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <Heart className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">You haven't saved any recipes yet</h3>
          <p className="text-xs text-slate-500">Click the heart icon on any recipe card to save it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={{ ...recipe, isFavorite: true }} />
          ))}
        </div>
      )}
    </div>
  );
}
