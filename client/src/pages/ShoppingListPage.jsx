import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Trash2, CheckSquare, Square, RotateCcw } from 'lucide-react';
import {
  getShoppingList,
  addShoppingItem,
  updateShoppingItem,
  deleteShoppingItem,
  clearShoppingList
} from '../services/shoppingService';

export default function ShoppingListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('g');

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await getShoppingList();
      setItems(res.data?.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    try {
      const res = await addShoppingItem({ ingredient: newItem, quantity, unit });
      setItems(res.data?.items || []);
      setNewItem('');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleCheck = async (item) => {
    try {
      const res = await updateShoppingItem(item._id, { checked: !item.checked });
      setItems(res.data?.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const res = await deleteShoppingItem(itemId);
      setItems(res.data?.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Clear all items from your shopping list?')) return;
    try {
      await clearShoppingList();
      setItems([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-8 h-8 text-emerald-500" /> Automated Shopping List
          </h1>
          <p className="text-sm text-slate-500 mt-1">Check off items as you shop in store or online.</p>
        </div>

        {items.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear All
          </button>
        )}
      </div>

      {/* Add Custom Item Form */}
      <form onSubmit={handleAddItem} className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Add custom ingredient (e.g. Milk, Eggs, Flour)..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
        />
        <div className="flex gap-2">
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-20 px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          />
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-16 px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          />
          <button type="submit" className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </form>

      {/* Shopping Items List */}
      {loading ? (
        <p className="text-center text-slate-500 py-12">Loading shopping items...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your shopping list is empty</h3>
          <p className="text-xs text-slate-500">Generate a list from meal plans or add custom items above.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-sm">
          {items.map((item) => (
            <div
              key={item._id}
              className={`p-4 flex items-center justify-between transition-colors ${
                item.checked ? 'bg-slate-50/50 dark:bg-slate-950/40 text-slate-400 line-through' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div onClick={() => handleToggleCheck(item)} className="flex items-center gap-3 cursor-pointer flex-1">
                {item.checked ? <CheckSquare className="w-5 h-5 text-emerald-500" /> : <Square className="w-5 h-5 text-slate-400" />}
                <span className="font-semibold text-sm">{item.ingredient}</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="text-brand-600">{item.quantity} {item.unit}</span>
                <button onClick={() => handleDeleteItem(item._id)} className="text-rose-500 hover:text-rose-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
