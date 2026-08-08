import React, { useState } from 'react';
import { usePassportData } from '../context/DataContext';
import { ContinentAverageChart } from '../charts/ContinentAverageChart';
import { ScatterPlotChart } from '../charts/ScatterPlotChart';
import { RankDistributionChart } from '../charts/RankDistributionChart';
import { Globe } from 'lucide-react';
import { calculateMedian } from '../utils/analyticsEngine';

export function RegionalAnalytics() {
  const { filteredRecords, filters } = usePassportData();
  const [activeTab, setActiveTab] = useState<'continent' | 'region'>('continent');

  // Compute breakdown by continent or UN region
  const groupMap = new Map<string, { totalRank: number; totalAccess: number; ranks: number[]; count: number }>();

  filteredRecords.forEach((r) => {
    const key = activeTab === 'continent' ? r.continent : r.unRegion;
    if (!groupMap.has(key)) {
      groupMap.set(key, { totalRank: 0, totalAccess: 0, ranks: [], count: 0 });
    }
    const item = groupMap.get(key)!;
    item.totalRank += r.rank;
    item.totalAccess += r.accessCount;
    item.ranks.push(r.rank);
    item.count += 1;
  });

  const regionalTableData = Array.from(groupMap.entries()).map(([groupName, data]) => ({
    groupName,
    averageRank: Number((data.totalRank / data.count).toFixed(1)),
    medianRank: Number(calculateMedian(data.ranks).toFixed(1)),
    averageAccess: Number((data.totalAccess / data.count).toFixed(1)),
    bestRank: Math.min(...data.ranks),
    worstRank: Math.max(...data.ranks),
    count: data.count,
  })).sort((a, b) => a.averageRank - b.averageRank);

  const continentChartData = regionalTableData.map((d) => ({
    regionName: d.groupName,
    averageRank: d.averageRank,
    averageAccess: d.averageAccess,
    count: d.count,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/60 border border-gray-200/80 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            <Globe className="w-4 h-4" />
            Geographic Intelligence Engine
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-slate-100 tracking-tight mt-1">
            Regional Mobility Analytics ({filters.selectedYear})
          </h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            Aggregated passport rank distribution, continent averages, and regional inequality metrics.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-950 p-1 rounded-xl border border-gray-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('continent')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'continent'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
            }`}
          >
            By Continent
          </button>
          <button
            onClick={() => setActiveTab('region')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'region'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
            }`}
          >
            By UN Region
          </button>
        </div>
      </div>

      {/* Regional Chart Visualization */}
      <ContinentAverageChart data={continentChartData} title={`Average Passport Mobility (${activeTab === 'continent' ? 'Continent' : 'UN Region'})`} />

      {/* Aggregated Table Matrix */}
      <div className="bg-white/90 dark:bg-slate-900/90 border border-gray-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4 transition-colors duration-200">
        <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">
          Regional Performance Matrix ({activeTab === 'continent' ? 'Continents' : 'UN Regions'})
        </h3>

        <div className="overflow-x-auto border border-gray-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs text-gray-700 dark:text-slate-300">
            <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-gray-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Region Name</th>
                <th className="px-4 py-3">Passports Count</th>
                <th className="px-4 py-3">Average Rank</th>
                <th className="px-4 py-3">Median Rank</th>
                <th className="px-4 py-3">Avg Visa-Free Access</th>
                <th className="px-4 py-3">Strongest Passport Rank</th>
                <th className="px-4 py-3">Weakest Passport Rank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-800/60 font-medium">
              {regionalTableData.map((row) => (
                <tr key={row.groupName} className="hover:bg-gray-100/60 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-bold text-gray-900 dark:text-slate-100">{row.groupName}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-slate-400 font-mono">{row.count}</td>
                  <td className="px-4 py-3 text-amber-600 dark:text-amber-400 font-bold">#{row.averageRank}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-slate-300 font-mono">#{row.medianRank}</td>
                  <td className="px-4 py-3 text-sky-600 dark:text-sky-400 font-mono font-bold">{row.averageAccess} countries</td>
                  <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-bold">#{row.bestRank}</td>
                  <td className="px-4 py-3 text-rose-600 dark:text-rose-400 font-bold">#{row.worstRank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scatter & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScatterPlotChart data={filteredRecords} title="Regional Scatter Density" />
        <RankDistributionChart data={filteredRecords} title="Regional Density Spread" />
      </div>
    </div>
  );
}
