import React from 'react';
import { Minus, Plus, Users } from 'lucide-react';

export default function ServingCalculator({ servings, originalServings = 2, onChange }) {
  const handleDecrement = () => {
    if (servings > 1) onChange(servings - 1);
  };

  const handleIncrement = () => {
    if (servings < 20) onChange(servings + 1);
  };

  return (
    <div className="flex items-center gap-3 bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/60 p-2.5 rounded-2xl">
      <div className="flex items-center gap-1.5 text-xs font-bold text-brand-800 dark:text-brand-300 pl-1">
        <Users className="w-4 h-4 text-brand-600 dark:text-brand-400" />
        <span>Servings:</span>
      </div>

      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-brand-100 dark:border-brand-900">
        <button
          onClick={handleDecrement}
          disabled={servings <= 1}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-brand-500 hover:text-white disabled:opacity-40 transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <span className="w-6 text-center font-extrabold text-sm text-slate-900 dark:text-white">
          {servings}
        </span>

        <button
          onClick={handleIncrement}
          disabled={servings >= 20}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-brand-500 hover:text-white disabled:opacity-40 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {servings !== originalServings && (
        <span className="text-[11px] font-medium text-brand-600 dark:text-brand-400 italic">
          (Scaled from {originalServings})
        </span>
      )}
    </div>
  );
}
