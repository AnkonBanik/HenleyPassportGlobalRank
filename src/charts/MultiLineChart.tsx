import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface MultiLineChartProps {
  data: any[];
  lines: { key: string; name: string; color: string; flag?: string }[];
  xAxisKey?: string;
  yAxisReversed?: boolean; // Reverse Y-axis for Ranks (1 is top)
  title?: string;
  subtitle?: string;
  height?: number;
}

export function MultiLineChart({
  data,
  lines,
  xAxisKey = 'year',
  yAxisReversed = true,
  title,
  subtitle,
  height = 360,
}: MultiLineChartProps) {
  return (
    <div className="bg-white/90 dark:bg-slate-900/90 border border-gray-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md transition-colors duration-200">
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">{title}</h3>}
          {subtitle && <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      )}

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.3} />
            <XAxis
              dataKey={xAxisKey}
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#94a3b8' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              reversed={yAxisReversed}
              domain={yAxisReversed ? ['auto', 'auto'] : [0, 'auto']}
              tickLine={false}
              axisLine={{ stroke: '#94a3b8' }}
              label={{
                value: yAxisReversed ? 'Rank Position (1 is Best)' : 'Visa-Free Access Count',
                angle: -90,
                position: 'insideLeft',
                fill: '#64748b',
                fontSize: 11,
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#f8fafc',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                fontSize: '12px',
              }}
              formatter={(value: any, name: any) => [`${value}`, `${name}`]}
            />
            <Legend
              wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }}
            />
            {lines.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={`${line.flag ? line.flag + ' ' : ''}${line.name}`}
                stroke={line.color}
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: line.color }}
                activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
