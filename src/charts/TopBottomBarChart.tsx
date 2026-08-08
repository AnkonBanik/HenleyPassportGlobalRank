import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { EnrichedPassportRecord } from '../types';

interface TopBottomBarChartProps {
  data: EnrichedPassportRecord[];
  title: string;
  type: 'top' | 'bottom';
  height?: number;
}

export function TopBottomBarChart({ data, title, type, height = 320 }: TopBottomBarChartProps) {
  // Sort data
  const sorted = [...data].sort((a, b) => (type === 'top' ? a.rank - b.rank : b.rank - a.rank)).slice(0, 10);

  const chartData = sorted.map((d) => ({
    name: `${d.flagEmoji} ${d.country}`,
    rank: d.rank,
    access: d.accessCount,
    country: d.country,
    flag: d.flagEmoji,
  }));

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 border border-gray-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 uppercase tracking-wider">{title}</h3>
        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400 font-semibold border border-gray-200 dark:border-slate-700">
          {type === 'top' ? 'Rank 1 - 10' : 'Lowest Ranked'}
        </span>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" horizontal={false} opacity={0.3} />
            <XAxis type="number" stroke="#64748b" fontSize={11} axisLine={{ stroke: '#94a3b8' }} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#94a3b8' }}
              width={130}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#f8fafc',
                fontSize: '12px',
              }}
              formatter={(val: any) => [`Rank ${val}`, 'Rank Position']}
            />
            <Bar dataKey="rank" radius={[0, 6, 6, 0]} barSize={16}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    type === 'top'
                      ? `hsl(${40 + index * 4}, 90%, ${55 - index * 2}%)`
                      : `hsl(${0 + index * 4}, 75%, ${55 - index * 2}%)`
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
