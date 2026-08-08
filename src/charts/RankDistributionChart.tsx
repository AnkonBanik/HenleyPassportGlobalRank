import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { EnrichedPassportRecord } from '../types';

interface RankDistributionChartProps {
  data: EnrichedPassportRecord[];
  title?: string;
  height?: number;
}

export function RankDistributionChart({
  data,
  title = 'Global Rank & Access Density Distribution',
  height = 320,
}: RankDistributionChartProps) {
  const bins = [
    { range: '20-40', count: 0 },
    { range: '41-60', count: 0 },
    { range: '61-80', count: 0 },
    { range: '81-100', count: 0 },
    { range: '101-120', count: 0 },
    { range: '121-140', count: 0 },
    { range: '141-160', count: 0 },
    { range: '161-180', count: 0 },
    { range: '181-200', count: 0 },
  ];

  data.forEach((r) => {
    const acc = r.accessCount;
    if (acc <= 40) bins[0].count++;
    else if (acc <= 60) bins[1].count++;
    else if (acc <= 80) bins[2].count++;
    else if (acc <= 100) bins[3].count++;
    else if (acc <= 120) bins[4].count++;
    else if (acc <= 140) bins[5].count++;
    else if (acc <= 160) bins[6].count++;
    else if (acc <= 180) bins[7].count++;
    else bins[8].count++;
  });

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 border border-gray-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md transition-colors duration-200">
      {title && <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 uppercase tracking-wider mb-4">{title}</h3>}

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <AreaChart data={bins} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <defs>
              <linearGradient id="densityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.3} />
            <XAxis dataKey="range" stroke="#64748b" fontSize={11} />
            <YAxis stroke="#64748b" fontSize={11} label={{ value: 'Number of Passports', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#f8fafc',
                fontSize: '12px',
              }}
              formatter={(val: any) => [`${val} Passports`, 'Frequency']}
              labelFormatter={(label) => `Access Range: ${label} countries`}
            />
            <Area type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#densityGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
