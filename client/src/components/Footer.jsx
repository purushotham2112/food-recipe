import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Heart, Sparkles, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                RecipeAI
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              RecipeAI is the next-generation smart culinary platform powered by artificial intelligence. Discover recipes, plan weekly meals, manage smart pantry inventory, and cook with voice assistance.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-brand-950 text-brand-400 border border-brand-800">
                <Sparkles className="w-3.5 h-3.5" /> AI Culinary Engine v2.0
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Platform</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/explore" className="hover:text-brand-400 transition-colors">Explore Recipes</Link></li>
              <li><Link to="/categories" className="hover:text-brand-400 transition-colors">All Categories</Link></li>
              <li><Link to="/chefs" className="hover:text-brand-400 transition-colors">Master Chefs</Link></li>
              <li><Link to="/ai/recipe-generator" className="hover:text-amber-400 transition-colors flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> AI Generator</Link></li>
              <li><Link to="/ai/fridge" className="hover:text-emerald-400 transition-colors">Fridge Assistant</Link></li>
            </ul>
          </div>

          {/* User Tools */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Culinary Tools</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/meal-planner" className="hover:text-brand-400 transition-colors">Meal Planner</Link></li>
              <li><Link to="/shopping-list" className="hover:text-brand-400 transition-colors">Shopping List</Link></li>
              <li><Link to="/pantry" className="hover:text-brand-400 transition-colors">Smart Pantry</Link></li>
              <li><Link to="/favorites" className="hover:text-brand-400 transition-colors">Saved Cookbooks</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Weekly Digest</h4>
            <p className="text-xs text-slate-400 mb-3">Get fresh AI recipes and chef recommendations delivered to your inbox.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to RecipeAI newsletter!'); }} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                className="w-full py-2 px-3 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" /> Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} RecipeAI Platform. Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500 mx-0.5" /> for passionate home cooks.</p>
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-slate-400 transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-slate-400 transition-colors">Contact</Link>
            <span className="text-slate-600">v1.0.0 Stable</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
