import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Moon, Sun, Bookmark, RotateCcw, Share2, Globe2, Menu } from 'lucide-react';
import { useTheme } from '../../theme/ThemeProvider';
import { usePassportData } from '../../context/DataContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { filters, updateFilter, resetFilters, years, bookmarks, toggleBookmark } = usePassportData();
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [copied, setCopied] = useState(false);
  const location = useLocation();

  const isExecutiveDashboard = location.pathname === '/';

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="h-16 border-b border-gray-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 transition-colors duration-200">

      {/* Mobile Menu Hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 transition-all shrink-0"
        aria-label="Open navigation menu"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Search Input - Only shown on Executive Dashboard */}
      {isExecutiveDashboard ? (
        <div className="relative flex-1 max-w-xs sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            placeholder="Search country, capital, ISO..."
            className="w-full bg-gray-100 dark:bg-slate-900/90 border border-gray-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => updateFilter('searchQuery', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>
      ) : (
        <div className="flex-1" />
      )}

      {/* Controls Bar */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Year Selector Dropdown */}
        <div className="flex items-center gap-1 sm:gap-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg px-2 sm:px-3 py-1.5 text-xs text-gray-700 dark:text-slate-300 shadow-sm">
          <Globe2 className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
          <span className="font-medium text-gray-500 dark:text-slate-400 hidden sm:inline">Year:</span>
          <select
            value={filters.selectedYear}
            onChange={(e) => updateFilter('selectedYear', Number(e.target.value))}
            className="bg-transparent font-semibold text-amber-600 dark:text-amber-400 focus:outline-none cursor-pointer"
          >
            {years.map((y) => (
              <option key={y} value={y} className="bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100">
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filters */}
        <button
          onClick={resetFilters}
          title="Reset all filters"
          className="p-2 text-gray-400 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-900 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-slate-800 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Bookmarks Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowBookmarks(!showBookmarks)}
            className="p-2 text-gray-400 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-slate-900 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-slate-800 transition-all relative"
            title="Bookmarked Countries"
          >
            <Bookmark className="w-4 h-4" />
            {bookmarks.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center">
                {bookmarks.length}
              </span>
            )}
          </button>

          {showBookmarks && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-400 mb-2">Bookmarked Passports</h4>
              {bookmarks.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-slate-500 py-2">No bookmarks saved yet.</p>
              ) : (
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {bookmarks.map((c) => (
                    <div
                      key={c}
                      className="flex items-center justify-between text-xs py-1.5 px-2 rounded hover:bg-gray-100 dark:hover:bg-slate-800/80 transition-all"
                    >
                      <span className="text-gray-800 dark:text-slate-200 font-medium">{c}</span>
                      <button
                        onClick={() => toggleBookmark(c)}
                        className="text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Share Button - hidden on very small screens */}
        <button
          onClick={handleShare}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60 hover:bg-gray-50 dark:hover:bg-slate-900 text-xs text-gray-700 dark:text-slate-300 font-medium transition-all shadow-sm"
        >
          <Share2 className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
          <span>{copied ? 'Copied!' : 'Share'}</span>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-2 text-gray-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-slate-900 rounded-lg border border-gray-200 dark:border-transparent hover:border-gray-300 dark:hover:border-slate-800 transition-all"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>
    </header>
  );
}
