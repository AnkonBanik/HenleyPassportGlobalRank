import React from 'react';
import { usePassportData } from '../context/DataContext';
import { KpiCard } from '../components/kpi/KpiCard';
import { TopBottomBarChart } from '../charts/TopBottomBarChart';
import { ContinentAverageChart } from '../charts/ContinentAverageChart';
import { RankDistributionChart } from '../charts/RankDistributionChart';
import { ScatterPlotChart } from '../charts/ScatterPlotChart';
import { WorldMap } from '../components/map/WorldMap';
import { PassportTable } from '../components/table/PassportTable';
import {
  Globe,
  Trophy,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ExecutiveDashboard() {
  const { executiveMetrics, filteredRecords, filteredStats, filters, updateFilter } = usePassportData();
  const navigate = useNavigate();

  // Continent averages computation for chart
  const continentMap = new Map<string, { totalRank: number; totalAccess: number; count: number }>();
  filteredRecords.forEach((r) => {
    const cont = r.continent;
    if (!continentMap.has(cont)) {
      continentMap.set(cont, { totalRank: 0, totalAccess: 0, count: 0 });
    }
    const item = continentMap.get(cont)!;
    item.totalRank += r.rank;
    item.totalAccess += r.accessCount;
    item.count += 1;
  });

  const continentChartData = Array.from(continentMap.entries()).map(([cont, data]) => ({
    regionName: cont,
    averageRank: Number((data.totalRank / data.count).toFixed(1)),
    averageAccess: Number((data.totalAccess / data.count).toFixed(1)),
    count: data.count,
  }));

  const handleSelectCountry = (countryName: string) => {
    navigate(`/details?country=${encodeURIComponent(countryName)}`);
  };

  return (
    <div className="space-y-6">
      {/* Executive Page Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/60 border border-gray-200/80 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            <Activity className="w-4 h-4" />
            Executive Intelligence Center
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-slate-100 tracking-tight mt-1">
            Global Passport Mobility Index ({filters.selectedYear})
          </h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            Snapshot of {executiveMetrics.totalCountries} passport jurisdictions from 2006–2026 dataset.
          </p>
        </div>

        {/* Global Filter Toolbar */}
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs flex items-center gap-2 shadow-sm">
            <span className="text-gray-500 dark:text-slate-400 font-semibold">Continent:</span>
            <select
              value={filters.selectedContinent}
              onChange={(e) => updateFilter('selectedContinent', e.target.value)}
              className="bg-transparent text-amber-600 dark:text-amber-400 font-bold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100">All Continents</option>
              <option value="Asia" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100">Asia</option>
              <option value="Europe" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100">Europe</option>
              <option value="Americas" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100">Americas</option>
              <option value="Africa" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100">Africa</option>
              <option value="Oceania" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100">Oceania</option>
            </select>
          </div>
        </div>
      </div>

      {/* 12 Executive KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Passport Jurisdictions"
          value={executiveMetrics.totalCountries}
          subtitle="Monitored worldwide"
          badge="Global"
          icon={Globe}
          gradient="from-amber-500/10 to-amber-500/0 border-amber-500/20"
        />

        <KpiCard
          title="Best Ranked Passport"
          value={`Rank #${executiveMetrics.bestRankedCountry.rank}`}
          subtitle={`${executiveMetrics.bestRankedCountry.country} (${executiveMetrics.bestRankedCountry.access} destinations)`}
          flag={executiveMetrics.bestRankedCountry.flag}
          trend="up"
          trendValue="Tier 1"
          icon={Trophy}
          gradient="from-amber-500/15 to-amber-500/0 border-amber-500/30"
        />

        <KpiCard
          title="Lowest Ranked Passport"
          value={`Rank #${executiveMetrics.lowestRankedCountry.rank}`}
          subtitle={`${executiveMetrics.lowestRankedCountry.country} (${executiveMetrics.lowestRankedCountry.access} destinations)`}
          flag={executiveMetrics.lowestRankedCountry.flag}
          trend="down"
          trendValue="Lowest"
          icon={AlertTriangle}
          gradient="from-rose-500/10 to-rose-500/0 border-rose-500/20"
        />

        <KpiCard
          title="Largest Historical Surge"
          value={`+${executiveMetrics.largestImprovement.rankDiff} Ranks`}
          subtitle={`${executiveMetrics.largestImprovement.country} (${executiveMetrics.largestImprovement.accessDiff} access gain)`}
          flag={executiveMetrics.largestImprovement.flag}
          trend="up"
          trendValue="Best Gain"
          icon={TrendingUp}
          gradient="from-emerald-500/10 to-emerald-500/0 border-emerald-500/20"
        />

        <KpiCard
          title="Largest Historical Decline"
          value={`-${executiveMetrics.largestDecline.rankDiff} Ranks`}
          subtitle={`${executiveMetrics.largestDecline.country}`}
          flag={executiveMetrics.largestDecline.flag}
          trend="down"
          trendValue="Biggest Fall"
          icon={TrendingDown}
          gradient="from-rose-500/10 to-rose-500/0 border-rose-500/20"
        />

        <KpiCard
          title="Average Global Rank"
          value={`#${executiveMetrics.averageGlobalRank}`}
          subtitle={`Median: #${executiveMetrics.medianGlobalRank}`}
          icon={BarChart3}
          gradient="from-blue-500/10 to-blue-500/0 border-blue-500/20"
        />

        <KpiCard
          title="Average Visa-Free Access"
          value={`${executiveMetrics.averageGlobalAccess} Countries`}
          subtitle="Global mobility average"
          icon={ShieldCheck}
          gradient="from-blue-500/10 to-blue-500/0 border-blue-500/20"
        />

        <KpiCard
          title="Mobility Surges"
          value={`${executiveMetrics.countriesImproved} Countries`}
          subtitle="Improved rank position since 2006"
          trend="up"
          trendValue={`${Math.round((executiveMetrics.countriesImproved / executiveMetrics.totalCountries) * 100)}%`}
          icon={CheckCircle2}
          gradient="from-emerald-500/10 to-emerald-500/0 border-emerald-500/20"
        />

        <KpiCard
          title="Mobility Drops"
          value={`${executiveMetrics.countriesDeclined} Countries`}
          subtitle="Declined rank position since 2006"
          trend="down"
          trendValue={`${Math.round((executiveMetrics.countriesDeclined / executiveMetrics.totalCountries) * 100)}%`}
          icon={XCircle}
          gradient="from-rose-500/10 to-rose-500/0 border-rose-500/20"
        />

        <KpiCard
          title="Stable Passports"
          value={`${executiveMetrics.countriesStable} Countries`}
          subtitle="Unchanged rank position"
          trend="neutral"
          trendValue="Stable"
          icon={Layers}
          gradient="from-slate-500/10 to-slate-500/0 border-slate-500/20"
        />

        <KpiCard
          title="Most Stable Passport"
          value={executiveMetrics.mostStablePassport.country}
          subtitle={`Volatility SD: ${executiveMetrics.mostStablePassport.volatility}`}
          flag={executiveMetrics.mostStablePassport.flag}
          icon={ShieldCheck}
          gradient="from-amber-500/10 to-amber-500/0 border-amber-500/20"
        />

        <KpiCard
          title="Most Volatile Passport"
          value={executiveMetrics.mostVolatilePassport.country}
          subtitle={`Volatility SD: ${executiveMetrics.mostVolatilePassport.volatility}`}
          flag={executiveMetrics.mostVolatilePassport.flag}
          icon={Zap}
          gradient="from-rose-500/10 to-rose-500/0 border-rose-500/20"
        />
      </div>

      {/* World Map Choropleth */}
      <WorldMap records={filteredRecords} onSelectCountry={handleSelectCountry} />

      {/* Top 10 & Bottom 10 Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopBottomBarChart data={filteredRecords} title="Top 10 Strongest Passports" type="top" />
        <TopBottomBarChart data={filteredRecords} title="Bottom 10 Weakest Passports" type="bottom" />
      </div>

      {/* Continent Averages & Density Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContinentAverageChart data={continentChartData} />
        <RankDistributionChart data={filteredRecords} />
      </div>

      {/* Scatter Plot Correlation */}
      <ScatterPlotChart data={filteredRecords} />

      {/* Interactive Master Grid Table */}
      <PassportTable data={filteredStats} onSelectCountry={handleSelectCountry} />
    </div>
  );
}
