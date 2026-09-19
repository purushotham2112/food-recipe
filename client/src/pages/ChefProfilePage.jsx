import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserPlus, UserCheck } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import api from '../services/api';
import useAuthStore from '../store/authStore';

export default function ChefProfilePage() {
  const { id } = useParams();
  const { isAuthenticated, user: currentUser } = useAuthStore();

  const [chefData, setChefData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchChef = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/users/chefs/${id}`);
        setChefData(res.data);
        if (currentUser && res.data.chef?.followers?.includes(currentUser._id)) {
          setIsFollowing(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChef();
  }, [id, currentUser]);

  const handleToggleFollow = async () => {
    if (!isAuthenticated) return alert('Please log in to follow chefs.');
    try {
      const res = await api.post(`/users/${id}/follow`);
      setIsFollowing(res.isFollowing);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-center py-12 text-slate-500">Loading chef profile...</p>;
  if (!chefData) return <p className="text-center py-12 text-slate-500">Chef not found</p>;

  const { chef, recipes, recipeCount } = chefData;

  return (
    <div className="space-y-10 pb-16">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <img
            src={chef.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
            alt={chef.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-brand-500 shadow-lg"
          />
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{chef.name}</h1>
            <p className="text-xs text-brand-600 dark:text-brand-400 font-bold uppercase tracking-wider">{chef.role}</p>
            <p className="text-xs text-slate-500 max-w-md">{chef.bio || 'Master Creator'}</p>
          </div>
        </div>

        <button
          onClick={handleToggleFollow}
          className={`px-6 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-md transition-all ${
            isFollowing ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200' : 'bg-brand-600 hover:bg-brand-500 text-white'
          }`}
        >
          {isFollowing ? <UserCheck className="w-4 h-4 text-emerald-500" /> : <UserPlus className="w-4 h-4" />}
          {isFollowing ? 'Following' : 'Follow Chef'}
        </button>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Published Recipes ({recipeCount})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  );
}
