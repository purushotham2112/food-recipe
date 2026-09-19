import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Heart, ChefHat, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import { toggleFavorite } from '../services/recipeService';

export default function RecipeCard({ recipe, onFavoriteToggle }) {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isFav, setIsFav] = useState(recipe?.isFavorite || false);
  const [favCount, setFavCount] = useState(recipe?.favoriteCount || 0);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const res = await toggleFavorite(recipe._id);
      setIsFav(res.isFavorite);
      setFavCount(res.favoriteCount);
      if (onFavoriteToggle) onFavoriteToggle(recipe._id, res.isFavorite);
    } catch (err) {
      console.error('Error toggling favorite:', err.message);
    }
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300';
      case 'Hard':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300';
      default:
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/80 dark:border-slate-800 flex flex-col h-full transition-all duration-300"
    >
      <Link to={`/recipes/${recipe.slug}`} className="flex flex-col h-full">
        
        {/* Recipe Image & Overlay Badges */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600'}
            alt={recipe.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Top Left Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md ${getDifficultyBadge(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
            {recipe.dietTypes?.[0] && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-900/80 text-white backdrop-blur-md">
                {recipe.dietTypes[0]}
              </span>
            )}
          </div>

          {/* Top Right Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:text-rose-500 dark:hover:text-rose-400 shadow-md backdrop-blur-md transition-all transform hover:scale-110 active:scale-95"
            title="Save to favorites"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : ''}`} />
          </button>

          {/* Bottom Overlay Info (Time & Category) */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
            <span className="flex items-center gap-1 bg-slate-900/70 backdrop-blur-md px-2.5 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {recipe.totalTime} min
            </span>

            {recipe.category?.name && (
              <span className="bg-slate-900/70 backdrop-blur-md px-2.5 py-1 rounded-full truncate max-w-[120px]">
                {recipe.category.name}
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col flex-1 justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                {recipe.cuisine}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{recipe.ratingAverage || 4.8}</span>
                <span className="text-slate-400 dark:text-slate-500 font-normal">({recipe.ratingCount || 12})</span>
              </div>
            </div>

            <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug">
              {recipe.title}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {recipe.description}
            </p>
          </div>

          {/* Footer Author & Stats */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <img
                src={recipe.author?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                alt={recipe.author?.name || 'Chef'}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="font-medium truncate max-w-[100px]">{recipe.author?.name || 'RecipeAI Chef'}</span>
            </div>

            <span className="text-[11px] text-slate-400">{favCount} saves</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
