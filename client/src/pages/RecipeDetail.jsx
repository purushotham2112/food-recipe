import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  Users,
  Star,
  Heart,
  Share2,
  Calendar,
  ShoppingBag,
  Play,
  ChefHat,
  CheckSquare,
  Square,
  AlertCircle,
  MessageSquare,
  Send
} from 'lucide-react';
import ServingCalculator from '../components/ServingCalculator';
import RecipeCardSkeleton from '../components/RecipeCardSkeleton';
import { getRecipeBySlug, toggleFavorite, createRecipeReview, getRecipeReviews } from '../services/recipeService';
import { addShoppingItem } from '../services/shoppingService';
import { createMealPlan } from '../services/mealPlanService';
import useAuthStore from '../store/authStore';

export default function RecipeDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [servings, setServings] = useState(2);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [isFav, setIsFav] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const res = await getRecipeBySlug(slug);
        const data = res.data;
        setRecipe(data);
        setServings(data.servings || 2);

        // Fetch reviews
        if (data._id) {
          const revRes = await getRecipeReviews(data._id);
          setReviews(revRes.data || []);
        }
      } catch (err) {
        console.error('Failed to load recipe detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [slug]);

  const toggleIngredientCheck = (idx) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) return navigate('/login');
    try {
      const res = await toggleFavorite(recipe._id);
      setIsFav(res.isFavorite);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAllToShoppingList = async () => {
    if (!isAuthenticated) return navigate('/login');
    try {
      const ratio = servings / (recipe.servings || 2);
      for (const ing of recipe.ingredients) {
        const scaledQty = Math.round((ing.quantity * ratio) * 10) / 10;
        await addShoppingItem({
          ingredient: ing.name,
          quantity: scaledQty,
          unit: ing.unit
        });
      }
      setMessage('✅ All ingredients added to your Shopping List!');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickAddMealPlan = async () => {
    if (!isAuthenticated) return navigate('/login');
    try {
      const today = new Date().toISOString().split('T')[0];
      await createMealPlan({
        date: today,
        mealType: 'dinner',
        recipe: recipe._id,
        servings
      });
      setMessage('📅 Added recipe to today\'s Dinner Meal Plan!');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate('/login');
    if (!newComment.trim()) return;

    try {
      setSubmittingReview(true);
      const res = await createRecipeReview(recipe._id, {
        rating: newRating,
        comment: newComment
      });
      setReviews([res.data, ...reviews]);
      setNewComment('');
      setMessage('⭐ Review submitted successfully!');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <RecipeCardSkeleton />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recipe not found</h2>
        <Link to="/explore" className="text-brand-600 font-semibold mt-4 inline-block hover:underline">
          Return to explore page
        </Link>
      </div>
    );
  }

  const ratio = servings / (recipe.servings || 2);

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      
      {/* Toast Banner Notification */}
      {message && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-xs animate-bounce">
          {message}
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400">
          <span className="uppercase tracking-wider px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-900">
            {recipe.cuisine}
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {recipe.category?.name || 'Recipe'}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {recipe.title}
        </h1>

        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          {recipe.description}
        </p>

        {/* Author & Stats Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-b border-slate-200/80 dark:border-slate-800 py-4">
          <Link to={`/chefs/${recipe.author?._id}`} className="flex items-center gap-3 group">
            <img
              src={recipe.author?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
              alt={recipe.author?.name}
              className="w-10 h-10 rounded-full object-cover group-hover:scale-105 transition-transform"
            />
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                {recipe.author?.name || 'Chef'}
              </p>
              <p className="text-xs text-slate-500">Executive Recipe Creator</p>
            </div>
          </Link>

          <div className="flex items-center gap-6 text-xs text-slate-600 dark:text-slate-400 font-semibold">
            <div className="flex items-center gap-1.5 text-amber-500 font-bold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span className="text-sm">{recipe.ratingAverage || 4.8}</span>
              <span className="text-slate-400 font-normal">({recipe.ratingCount || 12} reviews)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-500" />
              <span>{recipe.totalTime} mins</span>
            </div>
          </div>
        </div>
      </div>

      {/* RECIPE HERO IMAGE & ACTION BAR */}
      <div className="space-y-6">
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-xl bg-slate-900">
          <img
            src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1200'}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />

          {/* Quick Floating Action Bar */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <button
              onClick={handleFavoriteClick}
              className="p-3 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white hover:text-rose-500 shadow-xl backdrop-blur-md transition-transform active:scale-95"
            >
              <Heart className={`w-5 h-5 ${isFav ? 'text-rose-500 fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="p-3 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white hover:text-brand-500 shadow-xl backdrop-blur-md transition-transform active:scale-95"
              title="Copy Recipe Link"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={`/cooking/${recipe._id}`}
            className="flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-white font-extrabold text-sm shadow-lg shadow-brand-500/20 transition-all"
          >
            <Play className="w-5 h-5 fill-white" /> Start Interactive Cooking Mode
          </Link>

          <button
            onClick={handleAddAllToShoppingList}
            className="flex items-center gap-2 py-3.5 px-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-500" /> Add to Shopping List
          </button>

          <button
            onClick={handleQuickAddMealPlan}
            className="flex items-center gap-2 py-3.5 px-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Calendar className="w-4 h-4 text-indigo-500" /> Meal Planner
          </button>
        </div>
      </div>

      {/* MAIN TWO COLUMN LAYOUT (INGREDIENTS + INSTRUCTIONS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN: INGREDIENTS & SERVING CALCULATOR */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-brand-500" /> Ingredients
              </h3>
            </div>

            {/* Serving Calculator */}
            <ServingCalculator
              servings={servings}
              originalServings={recipe.servings || 2}
              onChange={(newServings) => setServings(newServings)}
            />

            {/* Ingredients Checklist */}
            <div className="space-y-3 pt-2">
              {recipe.ingredients?.map((ing, idx) => {
                const scaledQty = Math.round((ing.quantity * ratio) * 10) / 10;
                const isChecked = !!checkedIngredients[idx];

                return (
                  <div
                    key={idx}
                    onClick={() => toggleIngredientCheck(idx)}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer select-none transition-all ${
                      isChecked
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900 text-slate-400 line-through'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-800 text-slate-900 dark:text-white hover:border-brand-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      )}
                      <span className="text-sm font-semibold">{ing.name}</span>
                    </div>

                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                      {scaledQty} {ing.unit}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* NUTRITION FACTS CARD */}
          {recipe.nutrition && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                Nutrition Information (Per Serving)
              </h4>
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900">
                  <p className="font-black text-base">{recipe.nutrition.calories || 350}</p>
                  <p className="text-[10px] uppercase font-bold text-amber-600">Calories</p>
                </div>
                <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-900">
                  <p className="font-black text-base">{recipe.nutrition.protein || 24}g</p>
                  <p className="text-[10px] uppercase font-bold text-blue-600">Protein</p>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900">
                  <p className="font-black text-base">{recipe.nutrition.carbohydrates || 45}g</p>
                  <p className="text-[10px] uppercase font-bold text-emerald-600">Carbs</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: STEP-BY-STEP INSTRUCTIONS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-sm">
            <h3 className="font-extrabold text-2xl text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
              Cooking Instructions
            </h3>

            <div className="space-y-6">
              {recipe.instructions?.map((step) => (
                <div key={step.stepNumber} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-2xl bg-brand-500 text-white font-extrabold text-base flex items-center justify-center flex-shrink-0 shadow-md shadow-brand-500/20">
                    {step.stepNumber}
                  </div>
                  <div className="space-y-1.5 flex-1 pt-1">
                    {step.title && (
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">
                        {step.title}
                      </h4>
                    )}
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* REVIEWS & COMMENTS SECTION */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-500" /> Community Reviews ({reviews.length})
              </h3>
            </div>

            {/* Leave Review Form */}
            {isAuthenticated ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4 bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">Leave your rating & review</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1 focus:outline-none"
                      >
                        <Star className={`w-5 h-5 ${star <= newRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  rows="3"
                  placeholder="How did your recipe turn out? Write your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-brand-500"
                />
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Review
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900 text-xs flex items-center justify-between">
                <span>Please log in to leave a review and rate this recipe.</span>
                <Link to="/login" className="font-bold text-brand-600 hover:underline">Log In</Link>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4 pt-2">
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No reviews submitted yet. Be the first to try and review!</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev._id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                          alt={rev.user?.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{rev.user?.name || 'User'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="font-bold text-xs">{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
