import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  UtensilsCrossed,
  Search,
  Heart,
  User,
  LogOut,
  Sun,
  Moon,
  Sparkles,
  Calendar,
  ShoppingBag,
  Box,
  Menu,
  X,
  ChefHat,
  ShieldAlert
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-gray-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-slate-900 via-brand-700 to-amber-600 dark:from-white dark:via-brand-400 dark:to-amber-400 bg-clip-text text-transparent">
              RecipeAI
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/')
                  ? 'text-brand-600 dark:text-brand-400 font-semibold bg-brand-50/50 dark:bg-brand-950/40'
                  : 'text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400'
              }`}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/explore')
                  ? 'text-brand-600 dark:text-brand-400 font-semibold bg-brand-50/50 dark:bg-brand-950/40'
                  : 'text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400'
              }`}
            >
              Explore
            </Link>
            <Link
              to="/categories"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/categories')
                  ? 'text-brand-600 dark:text-brand-400 font-semibold bg-brand-50/50 dark:bg-brand-950/40'
                  : 'text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400'
              }`}
            >
              Categories
            </Link>
            <Link
              to="/chefs"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/chefs')
                  ? 'text-brand-600 dark:text-brand-400 font-semibold bg-brand-50/50 dark:bg-brand-950/40'
                  : 'text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400'
              }`}
            >
              Chefs
            </Link>

            <Link
              to="/ai/recipe-generator"
              className="px-3 py-2 rounded-lg text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1.5 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              AI Studio
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex flex-1 max-w-xs relative">
            <input
              type="text"
              placeholder="Search recipes, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-full bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all"
            />
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          </form>

          {/* Right Action Icons & User Dropdown */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Dark/Light Mode"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/favorites"
                  className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
                  title="Favorites"
                >
                  <Heart className="w-5 h-5 text-rose-500" />
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-full border border-slate-200 dark:border-slate-700 hover:ring-2 hover:ring-brand-500 transition-all"
                  >
                    <img
                      src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50 text-sm">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="font-semibold text-slate-900 dark:text-white">{user?.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                          {user?.role}
                        </span>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      >
                        <User className="w-4 h-4 text-brand-500" /> Dashboard
                      </Link>

                      <Link
                        to="/meal-planner"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      >
                        <Calendar className="w-4 h-4 text-indigo-500" /> Meal Planner
                      </Link>

                      <Link
                        to="/shopping-list"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      >
                        <ShoppingBag className="w-4 h-4 text-emerald-500" /> Shopping List
                      </Link>

                      <Link
                        to="/pantry"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      >
                        <Box className="w-4 h-4 text-amber-500" /> Smart Pantry
                      </Link>

                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                        >
                          <ShieldAlert className="w-4 h-4" /> Admin Console
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-t border-slate-100 dark:border-slate-800 mt-1"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-500 hover:to-amber-400 rounded-full shadow-md shadow-brand-500/20 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-full bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-brand-500 outline-none"
            />
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          </form>

          <nav className="flex flex-col space-y-1 pt-2 font-medium text-sm">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Home
            </Link>
            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Explore Recipes
            </Link>
            <Link
              to="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Categories
            </Link>
            <Link
              to="/chefs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Top Chefs
            </Link>
            <Link
              to="/ai/recipe-generator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-amber-600 dark:text-amber-400 font-bold flex items-center gap-2 hover:bg-amber-50 dark:hover:bg-amber-950/40"
            >
              <Sparkles className="w-4 h-4" /> AI Recipe Studio
            </Link>
            <Link
              to="/ai/fridge"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
            >
              <ChefHat className="w-4 h-4" /> What's In My Fridge?
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
