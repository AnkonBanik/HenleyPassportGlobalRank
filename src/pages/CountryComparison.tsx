import React, { useState } from 'react';
import { usePassportData } from '../context/DataContext';
import { MultiLineChart } from '../charts/MultiLineChart';
import { SearchableSelect } from '../components/SearchableSelect';
import { Scale, Trash2, Download } from 'lucide-react';
import { utils, writeFile } from 'xlsx';

const COLOR_PALETTE = ['#f59e0b', '#0c96eb', '#10b981', '#f43f5e', '#8b5cf6'];

export function CountryComparison() {
  const { countryStats, filters, toggleCountrySelection, updateFilter } = usePassportData();
  const [metricMode, setMetricMode] = useState<'rank' | 'access'>('rank');

  const selectedStats = countryStats.filter((s) => filters.selectedCountries.includes(s.country));

  // Build time-series chart data
  const yearsList = Array.from({ length: 2026 - 2006 + 1 }, (_, i) => 2006 + i);

  const chartData = yearsList.map((yr) => {
    const row: Record<string, any> = { year: yr };
    selectedStats.forEach((s) => {
      const entry = s.yearlyData[yr];
      if (entry) {
        row[s.country] = metricMode === 'rank' ? entry.rank : entry.accessCount;
      }
    });
    return row;
  });

  const chartLines = selectedStats.map((s, idx) => ({
    key: s.country,
    name: s.country,
    color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
    flag: s.flagEmoji,
  }));

  const exportCSV = () => {
    const worksheet = utils.json_to_sheet(chartData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Comparison');
    writeFile(workbook, `Passport_Comparison_${metricMode}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/60 border border-gray-200/80 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            <Scale className="w-4 h-4" />
            Multi-Country Mobility Studio
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-slate-100 tracking-tight mt-1">
            Country Passport Comparison
          </h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            Compare historical trajectory, rank stability, and visa-free access for up to 5 countries side-by-side.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-950 p-1 rounded-xl border border-gray-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setMetricMode('rank')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                metricMode === 'rank'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
              }`}
            >
              Rank Position
            </button>
            <button
              onClick={() => setMetricMode('access')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                metricMode === 'access'
                  ? 'bg-sky-500 text-slate-950 shadow-md'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
              }`}
            >
              Visa-Free Access
            </button>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-gray-200 dark:border-slate-700 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Selected Country Chips Selector with Search */}
      <div className="relative z-30 bg-white/90 dark:bg-slate-900/90 border border-gray-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-3 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
            Selected Comparison Passports ({selectedStats.length} / 5)
          </span>
          {selectedStats.length > 0 && (
            <button
              onClick={() => updateFilter('selectedCountries', [])}
              className="text-xs text-rose-500 dark:text-rose-400 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {selectedStats.map((s, idx) => (
            <div
              key={s.country}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold shadow-sm"
              style={{
                borderColor: COLOR_PALETTE[idx % COLOR_PALETTE.length],
                backgroundColor: `${COLOR_PALETTE[idx % COLOR_PALETTE.length]}15`,
                color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
              }}
            >
              <span>{s.flagEmoji}</span>
              <span>{s.country}</span>
              <span className="text-[10px] opacity-75">#{s.currentRank}</span>
              <button
                onClick={() => toggleCountrySelection(s.country)}
                className="ml-1 text-gray-400 hover:text-rose-500"
              >
                ×
              </button>
            </div>
          ))}

          {selectedStats.length < 5 && (
            <SearchableSelect
              options={countryStats.map((cs) => {
                const isSelected = filters.selectedCountries.includes(cs.country);
                return {
                  value: cs.country,
                  label: `${cs.country} (Rank #${cs.currentRank})`,
                  sublabel: isSelected ? 'Already selected' : cs.continent,
                  icon: cs.flagEmoji,
                  keywords: [cs.country, cs.iso2, cs.iso3, cs.capital, cs.continent, cs.unRegion],
                  disabled: isSelected,
                };
              })}
              value=""
              onChange={(val) => toggleCountrySelection(val)}
              placeholder="+ Add Country to Compare..."
              className="min-w-[260px]"
            />
          )}
        </div>
      </div>

      {/* Multi-Line Trend Chart */}
      <MultiLineChart
        data={chartData}
        lines={chartLines}
        title={`Historical Trajectory (2006–2026): ${metricMode === 'rank' ? 'Passport Rank' : 'Visa-Free Access Count'}`}
        subtitle={
          metricMode === 'rank'
            ? 'Lower position (Rank #1) indicates higher global mobility freedom.'
            : 'Number of visa-free / visa-on-arrival accessible destinations worldwide.'
        }
        yAxisReversed={metricMode === 'rank'}
        height={400}
      />

      {/* Detailed Side-by-Side Comparison Matrix */}
      <div className="bg-white/90 dark:bg-slate-900/90 border border-gray-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4 transition-colors duration-200">
        <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">Comparative Metrics Matrix</h3>

        <div className="overflow-x-auto border border-gray-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs text-gray-700 dark:text-slate-300">
            <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-gray-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Metric</th>
                {selectedStats.map((s, idx) => (
                  <th key={s.country} className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: COLOR_PALETTE[idx % COLOR_PALETTE.length] }}
                      ></span>
                      <span>{s.flagEmoji} {s.country}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-800/60 font-medium">
              <tr>
                <td className="px-4 py-3 text-gray-500 dark:text-slate-400 font-semibold">Current Rank (2026)</td>
                {selectedStats.map((s) => (
                  <td key={s.country} className="px-4 py-3 font-bold text-amber-600 dark:text-amber-400">
                    #{s.currentRank}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-500 dark:text-slate-400 font-semibold">Visa-Free Access</td>
                {selectedStats.map((s) => (
                  <td key={s.country} className="px-4 py-3 font-mono font-bold text-sky-600 dark:text-sky-400">
                    {s.currentAccess} countries
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-500 dark:text-slate-400 font-semibold">Historical Best Rank</td>
                {selectedStats.map((s) => (
                  <td key={s.country} className="px-4 py-3 text-emerald-600 dark:text-emerald-400">
                    #{s.historicalBestRank} ({s.historicalBestYear})
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-500 dark:text-slate-400 font-semibold">Historical Worst Rank</td>
                {selectedStats.map((s) => (
                  <td key={s.country} className="px-4 py-3 text-rose-600 dark:text-rose-400">
                    #{s.historicalWorstRank} ({s.historicalWorstYear})
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-500 dark:text-slate-400 font-semibold">Average Rank (2006-2026)</td>
                {selectedStats.map((s) => (
                  <td key={s.country} className="px-4 py-3 font-mono">
                    #{s.averageRank}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-500 dark:text-slate-400 font-semibold">Volatility Index (SD)</td>
                {selectedStats.map((s) => (
                  <td key={s.country} className="px-4 py-3 font-mono">
                    {s.volatilityScore}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-500 dark:text-slate-400 font-semibold">Overall Net Change (2006-2026)</td>
                {selectedStats.map((s) => (
                  <td
                    key={s.country}
                    className={`px-4 py-3 font-bold ${
                      s.overallImprovement < 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : s.overallImprovement > 0
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-gray-500 dark:text-slate-400'
                    }`}
                  >
                    {s.overallImprovement < 0
                      ? `Improved by ${Math.abs(s.overallImprovement)} ranks`
                      : s.overallImprovement > 0
                      ? `Declined by ${s.overallImprovement} ranks`
                      : 'Unchanged'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-500 dark:text-slate-400 font-semibold">Continent & UN Region</td>
                {selectedStats.map((s) => (
                  <td key={s.country} className="px-4 py-3 text-gray-500 dark:text-slate-400">
                    {s.continent} ({s.unRegion})
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
