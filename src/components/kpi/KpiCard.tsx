import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: string;
  flag?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: LucideIcon;
  gradient?: string;
  sparklineData?: number[];
}

export function KpiCard({
  title,
  value,
  subtitle,
  badge,
  flag,
  trend,
  trendValue,
  icon: Icon,
  gradient = 'from-amber-500/10 to-amber-500/0 border-amber-500/20',
  sparklineData,
}: KpiCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-gray-200 dark:border-slate-800 p-5 backdrop-blur-md transition-all shadow-sm hover:shadow-xl ${gradient}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
            {title}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            {flag && <span className="text-2xl">{flag}</span>}
            <span className="text-2xl font-black text-gray-900 dark:text-slate-100 tracking-tight">
              {value}
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700/50 text-amber-600 dark:text-amber-400 shrink-0 shadow-sm">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Subtitle & Trend Row */}
      <div className="mt-4 flex items-center justify-between text-xs">
        {subtitle && <span className="text-gray-500 dark:text-slate-400 font-medium">{subtitle}</span>}
        
        {badge && (
          <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 font-medium text-[11px] border border-gray-200 dark:border-slate-700">
            {badge}
          </span>
        )}

        {trend && trendValue && (
          <div
            className={`flex items-center gap-1 font-semibold ${
              trend === 'up'
                ? 'text-emerald-600 dark:text-emerald-400'
                : trend === 'down'
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-gray-500 dark:text-slate-400'
            }`}
          >
            {trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
            {trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
            {trend === 'neutral' && <Minus className="w-3.5 h-3.5" />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      {/* Sparkline Canvas / SVG */}
      {sparklineData && sparklineData.length > 1 && (
        <div className="mt-3 h-8 w-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
            {(() => {
              const min = Math.min(...sparklineData);
              const max = Math.max(...sparklineData);
              const range = max - min || 1;
              const points = sparklineData
                .map((val, idx) => {
                  const x = (idx / (sparklineData.length - 1)) * 100;
                  const y = 28 - ((val - min) / range) * 24;
                  return `${x},${y}`;
                })
                .join(' ');

              return (
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={trend === 'down' ? 'text-rose-500' : 'text-amber-500'}
                  points={points}
                />
              );
            })()}
          </svg>
        </div>
      )}
    </motion.div>
  );
}
