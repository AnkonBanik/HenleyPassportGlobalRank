export interface PassportEntry {
  country: string;
  rank: number;
  accessCount: number | null;
  year: number;
}

export interface CountryMetadata {
  name: string;
  iso2: string;
  iso3: string;
  flagEmoji: string;
  flagUrl?: string;
  capital: string;
  continent: string;
  unRegion: string;
}

export interface EnrichedPassportRecord {
  id: string;
  country: string;
  iso2: string;
  iso3: string;
  flagEmoji: string;
  capital: string;
  continent: string;
  unRegion: string;
  rank: number;
  accessCount: number;
  year: number;
}

export interface CountryHistoricalStats {
  country: string;
  iso2: string;
  iso3: string;
  flagEmoji: string;
  capital: string;
  continent: string;
  unRegion: string;
  currentRank: number;
  currentAccess: number;
  historicalBestRank: number;
  historicalBestYear: number;
  historicalWorstRank: number;
  historicalWorstYear: number;
  averageRank: number;
  medianRank: number;
  averageAccess: number;
  volatilityScore: number; // Standard deviation of rank
  stabilityScore: number;  // 100 - normalized volatility
  overallImprovement: number; // Rank difference 2006 to 2026 (negative means improved rank position)
  overallAccessGain: number; // Access difference 2006 to 2026
  yoyRankChange: number; // 2025 -> 2026
  yoyAccessChange: number; // 2025 -> 2026
  yearlyData: Record<number, { rank: number; accessCount: number }>;
}

export interface FilterState {
  searchQuery: string;
  selectedYear: number;
  selectedContinent: string;
  selectedRegion: string;
  topN: number | null;
  bottomN: number | null;
  minRank: number;
  maxRank: number;
  rankTrendFilter: 'all' | 'improved' | 'declined' | 'stable';
  selectedCountries: string[]; // For comparison page (up to 5)
}

export interface ExecutiveSummaryMetrics {
  totalCountries: number;
  bestRankedCountry: { country: string; rank: number; access: number; flag: string };
  lowestRankedCountry: { country: string; rank: number; access: number; flag: string };
  largestImprovement: { country: string; rankDiff: number; accessDiff: number; flag: string };
  largestDecline: { country: string; rankDiff: number; accessDiff: number; flag: string };
  averageGlobalRank: number;
  medianGlobalRank: number;
  averageGlobalAccess: number;
  countriesImproved: number;
  countriesDeclined: number;
  countriesStable: number;
  mostStablePassport: { country: string; volatility: number; flag: string };
  mostVolatilePassport: { country: string; volatility: number; flag: string };
}
