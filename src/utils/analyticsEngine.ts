import { EnrichedPassportRecord, CountryHistoricalStats, ExecutiveSummaryMetrics } from '../types';

export function calculateStandardDeviation(values: number[]): number {
  if (values.length <= 1) return 0;
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1);
  return Math.sqrt(variance);
}

export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

export function processCountryHistoricalStats(records: EnrichedPassportRecord[]): CountryHistoricalStats[] {
  const countryGroups = new Map<string, EnrichedPassportRecord[]>();
  
  for (const record of records) {
    if (!countryGroups.has(record.country)) {
      countryGroups.set(record.country, []);
    }
    countryGroups.get(record.country)!.push(record);
  }

  const result: CountryHistoricalStats[] = [];

  countryGroups.forEach((countryRecords, countryName) => {
    // Sort by year ascending
    countryRecords.sort((a, b) => a.year - b.year);

    const firstRecord = countryRecords[0];
    const latestRecord = countryRecords[countryRecords.length - 1];

    let bestRank = Infinity;
    let bestYear = firstRecord.year;
    let worstRank = -Infinity;
    let worstYear = firstRecord.year;

    const ranks: number[] = [];
    const accesses: number[] = [];
    const yearlyMap: Record<number, { rank: number; accessCount: number }> = {};

    countryRecords.forEach(r => {
      ranks.push(r.rank);
      accesses.push(r.accessCount);
      yearlyMap[r.year] = { rank: r.rank, accessCount: r.accessCount };

      if (r.rank < bestRank) {
        bestRank = r.rank;
        bestYear = r.year;
      }
      if (r.rank > worstRank) {
        worstRank = r.rank;
        worstYear = r.year;
      }
    });

    const averageRank = Number((ranks.reduce((a, b) => a + b, 0) / ranks.length).toFixed(1));
    const medianRank = Number(calculateMedian(ranks).toFixed(1));
    const averageAccess = Number((accesses.reduce((a, b) => a + b, 0) / accesses.length).toFixed(1));
    
    const volatilityScore = Number(calculateStandardDeviation(ranks).toFixed(2));
    const stabilityScore = Number(Math.max(0, 100 - volatilityScore * 5).toFixed(1));

    // Note: lower rank number is better (Rank 1 is best).
    // Rank 2006 = 80, Rank 2026 = 40 => Overall Improvement = -40 (improved by 40 positions)
    const overallImprovement = latestRecord.rank - firstRecord.rank;
    const overallAccessGain = latestRecord.accessCount - firstRecord.accessCount;

    const prevYearRecord = countryRecords.find(r => r.year === latestRecord.year - 1);
    const yoyRankChange = prevYearRecord ? latestRecord.rank - prevYearRecord.rank : 0;
    const yoyAccessChange = prevYearRecord ? latestRecord.accessCount - prevYearRecord.accessCount : 0;

    result.push({
      country: countryName,
      iso2: firstRecord.iso2,
      iso3: firstRecord.iso3,
      flagEmoji: firstRecord.flagEmoji,
      capital: firstRecord.capital,
      continent: firstRecord.continent,
      unRegion: firstRecord.unRegion,
      currentRank: latestRecord.rank,
      currentAccess: latestRecord.accessCount,
      historicalBestRank: bestRank,
      historicalBestYear: bestYear,
      historicalWorstRank: worstRank,
      historicalWorstYear: worstYear,
      averageRank,
      medianRank,
      averageAccess,
      volatilityScore,
      stabilityScore,
      overallImprovement,
      overallAccessGain,
      yoyRankChange,
      yoyAccessChange,
      yearlyData: yearlyMap,
    });
  });

  return result;
}

export function computeExecutiveSummary(
  stats: CountryHistoricalStats[],
  selectedYear: number,
  allRecords: EnrichedPassportRecord[]
): ExecutiveSummaryMetrics {
  const currentYearRecords = allRecords.filter(r => r.year === selectedYear);

  if (stats.length === 0 || currentYearRecords.length === 0) {
    return {
      totalCountries: 0,
      bestRankedCountry: { country: "N/A", rank: 0, access: 0, flag: "🌐" },
      lowestRankedCountry: { country: "N/A", rank: 0, access: 0, flag: "🌐" },
      largestImprovement: { country: "N/A", rankDiff: 0, accessDiff: 0, flag: "🌐" },
      largestDecline: { country: "N/A", rankDiff: 0, accessDiff: 0, flag: "🌐" },
      averageGlobalRank: 0,
      medianGlobalRank: 0,
      averageGlobalAccess: 0,
      countriesImproved: 0,
      countriesDeclined: 0,
      countriesStable: 0,
      mostStablePassport: { country: "N/A", volatility: 0, flag: "🌐" },
      mostVolatilePassport: { country: "N/A", volatility: 0, flag: "🌐" },
    };
  }

  // Sorted by current rank ascending (rank 1 first)
  const sortedCurrent = [...currentYearRecords].sort((a, b) => a.rank - b.rank);
  const best = sortedCurrent[0];
  const lowest = sortedCurrent[sortedCurrent.length - 1];

  const currentRanks = currentYearRecords.map(r => r.rank);
  const currentAccesses = currentYearRecords.map(r => r.accessCount);

  const averageGlobalRank = Number((currentRanks.reduce((a, b) => a + b, 0) / currentRanks.length).toFixed(1));
  const medianGlobalRank = Number(calculateMedian(currentRanks).toFixed(1));
  const averageGlobalAccess = Number((currentAccesses.reduce((a, b) => a + b, 0) / currentAccesses.length).toFixed(1));

  // Improvements / Declines overall (overallImprovement: negative means improved rank)
  const sortedByImprovement = [...stats].sort((a, b) => a.overallImprovement - b.overallImprovement);
  const bestImproved = sortedByImprovement[0]; // e.g. -50 rank improvement
  const worstDeclined = sortedByImprovement[sortedByImprovement.length - 1]; // e.g. +40 rank decline

  let improvedCount = 0;
  let declinedCount = 0;
  let stableCount = 0;

  stats.forEach(s => {
    if (s.overallImprovement < 0) improvedCount++;
    else if (s.overallImprovement > 0) declinedCount++;
    else stableCount++;
  });

  const sortedByVolatility = [...stats].sort((a, b) => a.volatilityScore - b.volatilityScore);
  const mostStable = sortedByVolatility[0];
  const mostVolatile = sortedByVolatility[sortedByVolatility.length - 1];

  return {
    totalCountries: currentYearRecords.length,
    bestRankedCountry: {
      country: best.country,
      rank: best.rank,
      access: best.accessCount,
      flag: best.flagEmoji,
    },
    lowestRankedCountry: {
      country: lowest.country,
      rank: lowest.rank,
      access: lowest.accessCount,
      flag: lowest.flagEmoji,
    },
    largestImprovement: {
      country: bestImproved.country,
      rankDiff: Math.abs(bestImproved.overallImprovement),
      accessDiff: bestImproved.overallAccessGain,
      flag: bestImproved.flagEmoji,
    },
    largestDecline: {
      country: worstDeclined.country,
      rankDiff: worstDeclined.overallImprovement,
      accessDiff: worstDeclined.overallAccessGain,
      flag: worstDeclined.flagEmoji,
    },
    averageGlobalRank,
    medianGlobalRank,
    averageGlobalAccess,
    countriesImproved: improvedCount,
    countriesDeclined: declinedCount,
    countriesStable: stableCount,
    mostStablePassport: {
      country: mostStable.country,
      volatility: mostStable.volatilityScore,
      flag: mostStable.flagEmoji,
    },
    mostVolatilePassport: {
      country: mostVolatile.country,
      volatility: mostVolatile.volatilityScore,
      flag: mostVolatile.flagEmoji,
    },
  };
}
