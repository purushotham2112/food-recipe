import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Eye, Star, ShieldAlert, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { getAdminAnalytics } from '../../services/adminService';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await getAdminAnalytics();
        setAnalytics(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <p className="text-center py-12 text-slate-500">Loading admin analytics...</p>;
  if (!analytics) return <p className="text-center py-12 text-slate-500">Failed to load analytics</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">System Analytics & Control</h1>
        <p className="text-xs text-slate-500 mt-1">Real-time overview of platform activity and recipe metrics.</p>
      </div>

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-indigo-500">
            <span className="text-xs font-bold text-slate-400">Total Registered Users</span>
            <Users className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{analytics.totalUsers || 0}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-brand-500">
            <span className="text-xs font-bold text-slate-400">Published Recipes</span>
            <BookOpen className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{analytics.totalRecipes || 0}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-xs font-bold text-slate-400">Total Recipe Views</span>
            <Eye className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{analytics.totalViews || 0}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-purple-500">
            <span className="text-xs font-bold text-slate-400">Voice Assistant Usage</span>
            <BarChart2 className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">142 cmds</p>
          <p className="text-[11px] text-emerald-500 font-semibold">96% Success Rate</p>
        </div>
      </div>

      {/* Recharts Graph: Recipes by Cuisine */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Recipes Distribution by Cuisine</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.recipesByCuisine || []}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performing Recipes Table */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Top Performing Recipes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase">
              <tr>
                <th className="py-3 px-4">Recipe</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Total Views</th>
                <th className="py-3 px-4">Favorites</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {analytics.topRecipes?.map((recipe) => (
                <tr key={recipe._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{recipe.title}</td>
                  <td className="py-3 px-4 text-amber-500 font-bold">⭐ {recipe.ratingAverage}</td>
                  <td className="py-3 px-4">{recipe.viewCount}</td>
                  <td className="py-3 px-4">{recipe.favoriteCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
