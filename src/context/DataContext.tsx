import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { EnrichedPassportRecord, CountryHistoricalStats, ExecutiveSummaryMetrics, FilterState } from '../types';
import { loadPassportDataset } from '../services/csvParser';
import { processCountryHistoricalStats, computeExecutiveSummary } from '../utils/analyticsEngine';

interface DataContextType {
  isLoading: boolean;
  error: string | null;
  allRecords: EnrichedPassportRecord[];
  countryStats: CountryHistoricalStats[];
  years: number[];
  continents: string[];
  regions: string[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  executiveMetrics: ExecutiveSummaryMetrics;
  filteredStats: CountryHistoricalStats[];
  filteredRecords: EnrichedPassportRecord[];
  toggleCountrySelection: (countryName: string) => void;
  bookmarks: string[];
  toggleBookmark: (countryName: string) => void;
}

const defaultFilterState: FilterState = {
  searchQuery: '',
  selectedYear: 2026,
  selectedContinent: 'all',
  selectedRegion: 'all',
  topN: null,
  bottomN: null,
  minRank: 1,
  maxRank: 120,
  rankTrendFilter: 'all',
  selectedCountries: ['Japan', 'Singapore', 'Germany', 'United States', 'India'],
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [allRecords, setAllRecords] = useState<EnrichedPassportRecord[]>([]);
  const [years, setYears] = useState<number[]>([2026]);
  const [continents, setContinents] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>(defaultFilterState);
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('passport-bookmarks');
    return saved ? JSON.parse(saved) : ['Japan', 'Singapore', 'Switzerland'];
  });

  useEffect(() => {
    loadPassportDataset()
      .then((data) => {
        setAllRecords(data.records);
        setYears(data.years);
        setContinents(data.continents);
        setRegions(data.regions);
        if (data.years.length > 0) {
          const maxYr = data.years[data.years.length - 1];
          setFilters((prev) => ({ ...prev, selectedYear: maxYr }));
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load passport dataset:', err);
        setError('Failed to load dataset. Please check CSV configuration.');
        setIsLoading(false);
      });
  }, []);

  const countryStats = useMemo(() => {
    return processCountryHistoricalStats(allRecords);
  }, [allRecords]);

  const filteredStats = useMemo(() => {
    return countryStats.filter((stat) => {
      // Search filter
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchName = stat.country.toLowerCase().includes(query);
        const matchIso = stat.iso2.toLowerCase().includes(query) || stat.iso3.toLowerCase().includes(query);
        const matchCapital = stat.capital.toLowerCase().includes(query);
        if (!matchName && !matchIso && !matchCapital) return false;
      }

      // Continent filter
      if (filters.selectedContinent !== 'all' && stat.continent !== filters.selectedContinent) {
        return false;
      }

      // Region filter
      if (filters.selectedRegion !== 'all' && stat.unRegion !== filters.selectedRegion) {
        return false;
      }

      // Rank Range
      if (stat.currentRank < filters.minRank || stat.currentRank > filters.maxRank) {
        return false;
      }

      // Rank Trend Filter
      if (filters.rankTrendFilter === 'improved' && stat.overallImprovement >= 0) return false;
      if (filters.rankTrendFilter === 'declined' && stat.overallImprovement <= 0) return false;
      if (filters.rankTrendFilter === 'stable' && stat.overallImprovement !== 0) return false;

      return true;
    });
  }, [countryStats, filters]);

  const filteredRecords = useMemo(() => {
    return allRecords.filter((r) => {
      if (r.year !== filters.selectedYear) return false;
      if (filters.selectedContinent !== 'all' && r.continent !== filters.selectedContinent) return false;
      if (filters.selectedRegion !== 'all' && r.unRegion !== filters.selectedRegion) return false;
      return true;
    });
  }, [allRecords, filters.selectedYear, filters.selectedContinent, filters.selectedRegion]);

  const executiveMetrics = useMemo(() => {
    return computeExecutiveSummary(filteredStats, filters.selectedYear, filteredRecords);
  }, [filteredStats, filters.selectedYear, filteredRecords]);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters((prev) => ({
      ...defaultFilterState,
      selectedYear: years.length > 0 ? years[years.length - 1] : 2026,
    }));
  };

  const toggleCountrySelection = (countryName: string) => {
    setFilters((prev) => {
      const exists = prev.selectedCountries.includes(countryName);
      if (exists) {
        return {
          ...prev,
          selectedCountries: prev.selectedCountries.filter((c) => c !== countryName),
        };
      } else {
        if (prev.selectedCountries.length >= 5) {
          return prev; // Limit max 5 countries
        }
        return {
          ...prev,
          selectedCountries: [...prev.selectedCountries, countryName],
        };
      }
    });
  };

  const toggleBookmark = (countryName: string) => {
    setBookmarks((prev) => {
      const updated = prev.includes(countryName)
        ? prev.filter((c) => c !== countryName)
        : [...prev, countryName];
      localStorage.setItem('passport-bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <DataContext.Provider
      value={{
        isLoading,
        error,
        allRecords,
        countryStats,
        years,
        continents,
        regions,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        executiveMetrics,
        filteredStats,
        filteredRecords,
        toggleCountrySelection,
        bookmarks,
        toggleBookmark,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function usePassportData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('usePassportData must be used within a DataProvider');
  }
  return context;
}
