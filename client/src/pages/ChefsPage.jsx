import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Users, BookOpen } from 'lucide-react';
import api from '../services/api';

export default function ChefsPage() {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/users/chefs');
        setChefs(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChefs();
  }, []);

  return (
    <div className="space-y-8 pb-16">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <ChefHat className="w-8 h-8 text-brand-500" /> Master Chefs & Recipe Creators
        </h1>
        <p className="text-sm text-slate-500 mt-1">Follow world-class culinary artists and home creators on RecipeAI.</p>
      </div>

      {loading ? (
        <p className="text-center py-12 text-slate-500">Loading master chefs...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {chefs.map((chef) => (
            <Link
              key={chef._id}
              to={`/chefs/${chef._id}`}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col items-center text-center space-y-3"
            >
              <img
                src={chef.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                alt={chef.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-brand-500 shadow-md"
              />
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{chef.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{chef.bio || 'Professional Chef'}</p>
              </div>

              <div className="pt-2 flex items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-brand-500" /> {chef.recipeCount || 0} recipes</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-indigo-500" /> {chef.followers?.length || 0} followers</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
