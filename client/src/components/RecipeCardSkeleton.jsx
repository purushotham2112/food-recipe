import React from 'react';

export default function RecipeCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800 animate-pulse flex flex-col h-full">
      <div className="aspect-[4/3] w-full bg-slate-200 dark:bg-slate-800" />
      <div className="p-5 space-y-3 flex-1">
        <div className="flex justify-between items-center">
          <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
          <div className="h-3 w-12 bg-slate-200 dark:bg-slate-800 rounded-full" />
        </div>
        <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="pt-4 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
          <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
          <div className="h-3 w-10 bg-slate-200 dark:bg-slate-800 rounded-md" />
        </div>
      </div>
    </div>
  );
}
