import React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ZAxis,
} from 'recharts';
import { EnrichedPassportRecord } from '../types';

interface ScatterPlotChartProps {
  data: EnrichedPassportRecord[];
  title?: string;
  height?: number;
}

export function ScatterPlotChart({
  data,
  title = 'Access Count vs Rank Position Scatter Correlation',
  height = 340,
}: ScatterPlotChartProps) {
  const scatterData = data.map((d) => ({
    x: d.accessCount,
    y: d.rank,
    name: `${d.flagEmoji} ${d.country}`,
    continent: d.continent,
  }));

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 border border-gray-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md transition-colors duration-200">
      {title && <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 uppercase tracking-wider mb-4">{title}</h3>}

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.3} />
            <XAxis
              type="number"
              dataKey="x"
              name="Visa-Free Access Count"
              stroke="#64748b"
              fontSize={11}
              unit=" destinations"
              label={{ value: 'Visa-Free Destinations Access', position: 'bottom', offset: 0, fill: '#64748b', fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Rank"
              stroke="#64748b"
              fontSize={11}
              reversed
              label={{ value: 'Passport Rank (1 is Best)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
            />
            <ZAxis range={[60, 60]} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#f8fafc',
                fontSize: '12px',
              }}
              formatter={(val: any, name: any) => {
                if (name === 'Visa-Free Access Count') return [`${val} countries`, 'Access'];
                if (name === 'Rank') return [`Rank ${val}`, 'Position'];
                return [val, name];
              }}
              labelFormatter={(_, payload) => {
                if (payload && payload.length > 0) {
                  return payload[0].payload.name;
                }
                return '';
              }}
            />
            <Scatter name="Passports" data={scatterData} fill="#f59e0b" opacity={0.85} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
