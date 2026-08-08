import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePassportData } from '../context/DataContext';
import { MultiLineChart } from '../charts/MultiLineChart';
import { SearchableSelect } from '../components/SearchableSelect';
import { Flag, Bookmark } from 'lucide-react';

export function CountryDetails() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { countryStats, bookmarks, toggleBookmark } = usePassportData();

  const selectedCountryName = searchParams.get('country') || countryStats[0]?.country || 'Japan';
  const targetStat = countryStats.find((s) => s.country.toLowerCase() === selectedCountryName.toLowerCase()) || countryStats[0];

  if (!targetStat) return null;

  // Build time-series chart data
  const yearsList = Array.from({ length: 2026 - 2006 + 1 }, (_, i) => 2006 + i);
  const chartData = yearsList.map((yr) => {
    const entry = targetStat.yearlyData[yr];
    return {
      year: yr,
      Rank: entry ? entry.rank : null,
      Access: entry ? entry.accessCount : null,
    };
  });

  const isBookmarked = bookmarks.includes(targetStat.country);

  return (
    <div className="space-y-6">
      {/* Country Selector Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/60 border border-gray-200/80 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm transition-colors duration-200 relative z-30">
        <div className="flex items-center gap-4">
          <span className="text-4xl">{targetStat.flagEmoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-gray-900 dark:text-slate-100 tracking-tight">
                {targetStat.country}
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700">
                {targetStat.iso3}
              </span>
              <button
                onClick={() => toggleBookmark(targetStat.country)}
                className={`p-1.5 rounded-lg border transition-all ${
                  isBookmarked
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:text-gray-700 dark:hover:text-slate-200'
                }`}
                title="Toggle Bookmark"
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              Capital: {targetStat.capital} • Continent: {targetStat.continent} • Region: {targetStat.unRegion}
            </p>
          </div>
        </div>

        {/* Searchable Dropdown Selector */}
        <div className="flex items-center gap-2">
          <Flag className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          <span className="text-gray-500 dark:text-slate-400 text-xs font-semibold">Select Country:</span>
          <SearchableSelect
            options={countryStats.map((s) => ({
              value: s.country,
              label: `${s.country} (Rank #${s.currentRank})`,
              sublabel: `${s.continent} • ${s.capital}`,
              icon: s.flagEmoji,
              keywords: [s.country, s.iso2, s.iso3, s.capital, s.continent, s.unRegion],
            }))}
            value={targetStat.country}
            onChange={(val) => setSearchParams({ country: val })}
            placeholder="Search for a country..."
            className="min-w-[280px]"
          />
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/90 dark:bg-slate-900/90 border border-amber-500/30 p-5 rounded-2xl backdrop-blur-md space-y-1 shadow-sm transition-colors duration-200">
          <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Current Rank (2026)</span>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400">#{targetStat.currentRank}</div>
          <p className="text-xs text-gray-500 dark:text-slate-400">{targetStat.currentAccess} Visa-Free Destinations</p>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 border border-emerald-500/30 p-5 rounded-2xl backdrop-blur-md space-y-1 shadow-sm transition-colors duration-200">
          <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Historical Best</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">#{targetStat.historicalBestRank}</div>
          <p className="text-xs text-gray-500 dark:text-slate-400">Achieved in Year {targetStat.historicalBestYear}</p>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 border border-rose-500/30 p-5 rounded-2xl backdrop-blur-md space-y-1 shadow-sm transition-colors duration-200">
          <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Historical Worst</span>
          <div className="text-3xl font-black text-rose-600 dark:text-rose-400">#{targetStat.historicalWorstRank}</div>
          <p className="text-xs text-gray-500 dark:text-slate-400">Recorded in Year {targetStat.historicalWorstYear}</p>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 border border-gray-200 dark:border-slate-800 p-5 rounded-2xl backdrop-blur-md space-y-1 shadow-sm transition-colors duration-200">
          <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Volatility Score (SD)</span>
          <div className="text-3xl font-black text-gray-900 dark:text-slate-100">{targetStat.volatilityScore}</div>
          <p className="text-xs text-gray-500 dark:text-slate-400">Stability Index: {targetStat.stabilityScore}%</p>
        </div>
      </div>

      {/* Historical Rank & Access Time Series Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MultiLineChart
          data={chartData}
          lines={[{ key: 'Rank', name: 'Passport Rank', color: '#f59e0b', flag: targetStat.flagEmoji }]}
          title={`20-Year Historical Rank Trajectory (2006–2026)`}
          subtitle="Rank position over time (1 is highest mobility standard)."
          yAxisReversed={true}
          height={320}
        />

        <MultiLineChart
          data={chartData}
          lines={[{ key: 'Access', name: 'Visa-Free Destinations', color: '#0c96eb', flag: targetStat.flagEmoji }]}
          title={`Visa-Free Destination Access Growth`}
          subtitle="Total visa-free / visa-on-arrival accessible countries."
          yAxisReversed={false}
          height={320}
        />
      </div>

      {/* Breakdown Metrics Grid */}
      <div className="bg-white/90 dark:bg-slate-900/90 border border-gray-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4 transition-colors duration-200">
        <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">Historical Snapshot Stats Table</h3>
        <div className="overflow-x-auto border border-gray-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs text-gray-700 dark:text-slate-300">
            <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-gray-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">Rank Position</th>
                <th className="px-4 py-3">Visa-Free Destinations</th>
                <th className="px-4 py-3">YoY Rank Shift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-800/60 font-medium">
              {yearsList.map((yr, idx) => {
                const entry = targetStat.yearlyData[yr];
                const prevEntry = idx > 0 ? targetStat.yearlyData[yearsList[idx - 1]] : null;
                const shift = prevEntry && entry ? entry.rank - prevEntry.rank : 0;

                return (
                  <tr key={yr} className="hover:bg-gray-100/60 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-2.5 font-bold text-gray-800 dark:text-slate-200">{yr}</td>
                    <td className="px-4 py-2.5 text-amber-600 dark:text-amber-400 font-bold">#{entry?.rank ?? 'N/A'}</td>
                    <td className="px-4 py-2.5 text-sky-600 dark:text-sky-400 font-mono">{entry?.accessCount ?? 'N/A'} countries</td>
                    <td className="px-4 py-2.5">
                      {shift < 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Improved {-shift} ranks</span>
                      ) : shift > 0 ? (
                        <span className="text-rose-600 dark:text-rose-400 font-semibold">Dropped +{shift} ranks</span>
                      ) : (
                        <span className="text-gray-400 dark:text-slate-500">Unchanged</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
