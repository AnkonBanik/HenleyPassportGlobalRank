import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface ContinentAverageChartProps {
  data: { regionName: string; averageRank: number; averageAccess: number; count: number }[];
  title?: string;
  height?: number;
}

export function ContinentAverageChart({
  data,
  title = 'Average Passport Mobility by Region',
  height = 320,
}: ContinentAverageChartProps) {
  return (
    <div className="bg-white/90 dark:bg-slate-900/90 border border-gray-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md transition-colors duration-200">
      {title && <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 uppercase tracking-wider mb-4">{title}</h3>}

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.3} />
            <XAxis
              dataKey="regionName"
              stroke="#64748b"
              fontSize={11}
              angle={-20}
              textAnchor="end"
              interval={0}
            />
            <YAxis stroke="#64748b" fontSize={11} axisLine={{ stroke: '#94a3b8' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#f8fafc',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar dataKey="averageAccess" name="Avg Visa-Free Destinations" fill="#0c96eb" radius={[6, 6, 0, 0]} barSize={28} />
            <Bar dataKey="averageRank" name="Avg Rank Position" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
