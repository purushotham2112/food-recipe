import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { getRecipes, deleteRecipe, updateRecipe } from '../../services/recipeService';

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const res = await getRecipes({ limit: 50 });
      setRecipes(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateRecipe(id, { status });
      setRecipes(recipes.map((r) => (r._id === id ? { ...r, status } : r)));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this recipe?')) return;
    try {
      await deleteRecipe(id);
      setRecipes(recipes.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Recipe Moderation</h1>
        <p className="text-xs text-slate-500 mt-1">Review and moderate community user recipes.</p>
      </div>

      {loading ? (
        <p className="py-8 text-center text-slate-500">Loading recipe list...</p>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Recipe Title</th>
                <th className="py-3.5 px-4">Author</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recipes.map((r) => (
                <tr key={r._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{r.title}</td>
                  <td className="py-3 px-4 text-slate-500">{r.author?.name || 'Chef'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      r.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleStatusChange(r._id, r.status === 'published' ? 'rejected' : 'published')}
                      className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold"
                    >
                      {r.status === 'published' ? 'Reject' : 'Publish'}
                    </button>
                    <button onClick={() => handleDelete(r._id)} className="text-rose-500 hover:text-rose-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
