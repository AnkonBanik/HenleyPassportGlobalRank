import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Scale, Flag, Globe, ShieldCheck, Activity } from 'lucide-react';
import { usePassportData } from '../../context/DataContext';

export function Sidebar() {
  const { filters } = usePassportData();

  const navItems = [
    {
      to: '/',
      label: 'Executive Dashboard',
      icon: LayoutDashboard,
      badge: 'Main',
    },
    {
      to: '/compare',
      label: 'Country Comparison',
      icon: Scale,
      badge: `${filters.selectedCountries.length} Selected`,
    },
    {
      to: '/details',
      label: 'Country Details',
      icon: Flag,
    },
    {
      to: '/regional',
      label: 'Regional Analytics',
      icon: Globe,
    },
  ];

  return (
    <aside className="w-64 border-r border-gray-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 flex flex-col justify-between h-screen sticky top-0 shrink-0 transition-colors duration-200">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-200/80 dark:border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <ShieldCheck className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-gray-900 dark:text-slate-100 leading-none">
              HENLEY PASSPORT
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-600 dark:text-amber-400">
              Analytics Studio
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
            Navigation Menu
          </div>

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-700 dark:text-amber-400 border border-amber-500/30 shadow-sm font-bold'
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100/80 dark:hover:bg-slate-900/80 border border-transparent'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer System Status */}
      <div className="p-4 border-t border-gray-200/80 dark:border-slate-800/80">
        <div className="bg-gray-50 dark:bg-slate-900/60 border border-gray-200/80 dark:border-slate-800/80 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-500 dark:text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 animate-pulse" />
              Engine Status
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">ONLINE</span>
          </div>
          <p className="text-[10px] text-gray-400 dark:text-slate-500">
            Henley Dataset: 2006–2026 (Historical In-Memory Index)
          </p>
        </div>
      </div>
    </aside>
  );
}
