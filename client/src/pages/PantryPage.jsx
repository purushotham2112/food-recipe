import React, { useState, useEffect } from 'react';
import { Box, Plus, Trash2, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { getPantryItems, addPantryItem, deletePantryItem } from '../services/pantryService';

export default function PantryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ingredient, setIngredient] = useState('');
  const [quantity, setQuantity] = useState(500);
  const [unit, setUnit] = useState('g');
  const [expiryDate, setExpiryDate] = useState('');

  useEffect(() => {
    fetchPantry();
  }, []);

  const fetchPantry = async () => {
    try {
      setLoading(true);
      const res = await getPantryItems();
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!ingredient.trim()) return;

    try {
      const res = await addPantryItem({ ingredient, quantity, unit, expiryDate });
      setItems([...items, res.data]);
      setIngredient('');
      setExpiryDate('');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePantryItem(id);
      setItems(items.filter((i) => i._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Expired':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300';
      case 'Expiring Soon':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
      case 'Low Stock':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300';
      default:
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Box className="w-8 h-8 text-amber-500" /> Smart Pantry Manager
        </h1>
        <p className="text-sm text-slate-500 mt-1">Track ingredient quantities and expiration dates automatically.</p>
      </div>

      {/* Add Item Form */}
      <form onSubmit={handleAddItem} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">Add Pantry Stock Item</h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Ingredient name (e.g. Rice, Milk)..."
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            className="sm:col-span-2 px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Qty"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          />
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400"
          />
        </div>
        <button type="submit" className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors">
          <Plus className="w-4 h-4" /> Save Pantry Stock
        </button>
      </form>

      {/* Grid of Pantry Items */}
      {loading ? (
        <p className="text-center text-slate-500 py-12">Loading pantry stock...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <Box className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your pantry inventory is empty</h3>
          <p className="text-xs text-slate-500">Track your kitchen ingredients to receive smart meal suggestions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item._id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${getStatusBadge(item.status)}`}>
                    {item.status || 'Available'}
                  </span>
                  <button onClick={() => handleDelete(item._id)} className="text-slate-400 hover:text-rose-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{item.ingredient}</h4>
                <p className="text-xs font-bold text-brand-600 dark:text-brand-400">{item.quantity} {item.unit}</p>
              </div>

              {item.expiryDate && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Expires: {new Date(item.expiryDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
