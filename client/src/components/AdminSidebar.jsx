import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FolderTree,
  MessageSquare,
  ShieldAlert,
  BarChart3,
  ArrowLeft
} from 'lucide-react';

export default function AdminSidebar() {
  const location = useLocation();

  const links = [
    { label: 'Overview Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'User Management', path: '/admin/users', icon: Users },
    { label: 'Recipe Moderation', path: '/admin/recipes', icon: BookOpen },
    { label: 'Category Manager', path: '/admin/categories', icon: FolderTree },
    { label: 'Reviews & Comments', path: '/admin/reviews', icon: MessageSquare },
    { label: 'Report Resolution', path: '/admin/reports', icon: ShieldAlert },
    { label: 'Analytics & Insights', path: '/admin/analytics', icon: BarChart3 }
  ];

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 space-y-6 flex-shrink-0">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span className="font-extrabold text-slate-900 dark:text-white text-base">Admin Panel</span>
        </div>
        <Link
          to="/"
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Return to Public Site"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-colors ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
