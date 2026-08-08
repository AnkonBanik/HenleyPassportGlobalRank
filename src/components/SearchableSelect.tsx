import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';

export interface SearchableSelectOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: string;
  keywords?: string[];
  disabled?: boolean;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className = '',
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filtered = options.filter((opt) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    const matchLabel = String(opt.label).toLowerCase().includes(q);
    const matchSublabel = opt.sublabel ? String(opt.sublabel).toLowerCase().includes(q) : false;
    const matchValue = String(opt.value).toLowerCase().includes(q);
    const matchKeywords = opt.keywords
      ? opt.keywords.some((k) => k && String(k).toLowerCase().includes(q))
      : false;

    return matchLabel || matchSublabel || matchValue || matchKeywords;
  });

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm text-gray-900 dark:text-amber-400 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/50 hover:border-amber-500/50 transition-all cursor-pointer shadow-sm"
      >
        {selectedOption ? (
          <>
            {selectedOption.icon && <span>{selectedOption.icon}</span>}
            <span className="truncate">{selectedOption.label}</span>
          </>
        ) : (
          <span className="text-gray-400 dark:text-slate-500 font-medium">{placeholder}</span>
        )}
        <ChevronDown
          className={`w-4 h-4 ml-auto text-gray-400 dark:text-slate-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full min-w-[280px] max-h-[320px] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="p-2 border-b border-gray-200 dark:border-slate-800">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder="Type country, ISO code, capital..."
                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg pl-8 pr-8 py-1.5 text-xs text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
          <div className="overflow-y-auto max-h-[250px] p-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-xs text-gray-400 dark:text-slate-500 text-center">
                No matching countries found
              </div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  disabled={opt.disabled}
                  onClick={() => {
                    if (opt.disabled) return;
                    onChange(opt.value);
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition-all ${
                    opt.disabled
                      ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-slate-500'
                      : opt.value === value
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold'
                      : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/80 font-medium'
                  }`}
                >
                  {opt.icon && <span className="text-sm">{opt.icon}</span>}
                  <span className="truncate">{opt.label}</span>
                  {opt.sublabel && (
                    <span className="ml-auto text-[10px] text-gray-400 dark:text-slate-500 whitespace-nowrap">
                      {opt.sublabel}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
