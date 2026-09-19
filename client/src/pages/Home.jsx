import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Flame,
  ChefHat,
  ArrowRight,
  TrendingUp,
  Award,
  Heart,
  Utensils,
  Clock,
  CheckCircle2
} from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import RecipeCardSkeleton from '../components/RecipeCardSkeleton';
import { getRecipes } from '../services/recipeService';
import { getCategories } from '../services/categoryService';

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [quickRecipes, setQuickRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [recipesRes, catRes] = await Promise.all([
          getRecipes({ limit: 8, sort: 'popular' }),
          getCategories()
        ]);
        setPopularRecipes(recipesRes.data || []);
        setCategories(catRes.data || []);

        const quickRes = await getRecipes({ limit: 4, sort: 'quickest' });
        setQuickRecipes(quickRes.data || []);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-20 pb-12">
      
      {/* HERO SECTION */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-brand-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-semibold border border-white/10">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            AI-Powered Smart Culinary Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Cook something <span className="bg-gradient-to-r from-brand-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">amazing</span> today.
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            Discover thousands of gourmet recipes, generate custom AI dishes with ingredients in your fridge, organize weekly meal plans, and cook step-by-step with voice control.
          </p>

          {/* Hero Search Box */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 pt-2 max-w-xl">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search chicken biryani, pasta, vegetarian..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
              <Search className="w-5 h-5 absolute left-4 top-4 text-slate-400" />
            </div>
            <button
              type="submit"
              className="px-7 py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2"
            >
              Explore Recipes <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick AI Teaser Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-4 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Try AI Features:</span>
            <Link to="/ai/recipe-generator" className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 transition-colors border border-white/10">
              ✨ Instant AI Recipe Generator
            </Link>
            <Link to="/ai/fridge" className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-300 transition-colors border border-white/10">
              🥦 What's in My Fridge?
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES QUICK CAROUSEL / GRID */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Explore by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Find popular recipes tailored to your cravings
            </p>
          </div>
          <Link to="/categories" className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.slice(0, 5).map((cat) => (
            <Link
              key={cat._id}
              to={`/categories/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 shadow-sm hover:shadow-lg transition-all border border-slate-200/50 dark:border-slate-800"
            >
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=400'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-70 group-hover:opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-4 flex flex-col justify-end">
                <span className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                  {cat.name}
                </span>
                <span className="text-[11px] text-slate-300">{cat.recipeCount || 12}+ recipes</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* POPULAR RECIPES GRID */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-brand-500" />
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Popular Recipes
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Highest rated recipes cooked by thousands of food lovers
              </p>
            </div>
          </div>
          <Link to="/explore" className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
            See All Recipes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <RecipeCardSkeleton key={i} />)
            : popularRecipes.slice(0, 4).map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
        </div>
      </section>

      {/* AI FEATURE SPOTLIGHT BANNER */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-500 via-brand-600 to-orange-600 text-white p-8 sm:p-12 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Smart Fridge Assistant
            </span>
            <h3 className="text-3xl sm:text-4xl font-black leading-tight">
              Don't know what to cook? Let AI inspect your fridge!
            </h3>
            <p className="text-white/90 text-sm leading-relaxed">
              Simply enter the ingredients sitting in your pantry or fridge (e.g. Chicken, Tomato, Rice). RecipeAI calculates the match percentage, shows available items, and tells you what's missing.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/ai/fridge"
                className="px-6 py-3 rounded-xl bg-white text-slate-950 font-bold text-sm shadow-md hover:bg-slate-100 transition-colors"
              >
                Try Fridge Assistant
              </Link>
              <Link
                to="/ai/recipe-generator"
                className="px-6 py-3 rounded-xl bg-slate-950/40 hover:bg-slate-950/60 text-white font-bold text-sm backdrop-blur-md border border-white/20 transition-colors"
              >
                Generate Custom Recipe
              </Link>
            </div>
          </div>

          <div className="bg-slate-950/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-bold text-amber-300">Fridge Input:</span>
              <span className="text-slate-300">Egg, Tomato, Rice, Garlic</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-white/10 p-2.5 rounded-xl">
                <div>
                  <p className="font-bold text-sm text-white">Classic Egg & Tomato Rice Stir-Fry</p>
                  <p className="text-[11px] text-emerald-300 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 92% Ingredient Match
                  </p>
                </div>
                <span className="px-2 py-1 rounded bg-amber-400 text-slate-950 font-extrabold text-[10px]">Easy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK & EASY RECIPES */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-500" />
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Quick 15-Minute Meals
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Perfect for busy weeknights without sacrificing flavor
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <RecipeCardSkeleton key={i} />)
            : quickRecipes.map((recipe) => <RecipeCard key={recipe._id} recipe={recipe} />)}
        </div>
      </section>
    </div>
  );
}
