import Papa from 'papaparse';
import { PassportEntry, EnrichedPassportRecord } from '../types';
import { getCountryMetadata } from '../constants/countryMetadata';

export interface RawCsvRow {
  COUNTRY: string;
  RANK: string;
  'ACCESS TO COUNTRIES': string;
  YEAR: string;
}

export async function loadPassportDataset(csvPath: string = '/henley_passport_data_updated.csv'): Promise<{
  records: EnrichedPassportRecord[];
  years: number[];
  continents: string[];
  regions: string[];
}> {
  const response = await fetch(csvPath);
  const csvText = await response.text();

  const parsed = Papa.parse<RawCsvRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const records: EnrichedPassportRecord[] = [];
  const yearsSet = new Set<number>();
  const continentsSet = new Set<string>();
  const regionsSet = new Set<string>();

  parsed.data.forEach((row, index) => {
    const countryName = row.COUNTRY?.trim();
    if (!countryName) return;

    const rankVal = parseFloat(row.RANK);
    const yearVal = parseInt(row.YEAR, 10);
    let accessVal = parseFloat(row['ACCESS TO COUNTRIES']);

    if (isNaN(rankVal) || isNaN(yearVal)) return;

    // Handle missing access counts by estimation based on rank if needed
    if (isNaN(accessVal)) {
      // Approximate access count: max accessible is ~195, minimum ~25
      accessVal = Math.max(25, Math.round(195 - (rankVal * 1.5)));
    }

    const metadata = getCountryMetadata(countryName);

    yearsSet.add(yearVal);
    continentsSet.add(metadata.continent);
    regionsSet.add(metadata.unRegion);

    records.push({
      id: `${metadata.iso3}-${yearVal}-${index}`,
      country: countryName,
      iso2: metadata.iso2,
      iso3: metadata.iso3,
      flagEmoji: metadata.flagEmoji,
      capital: metadata.capital,
      continent: metadata.continent,
      unRegion: metadata.unRegion,
      rank: rankVal,
      accessCount: accessVal,
      year: yearVal,
    });
  });

  const sortedYears = Array.from(yearsSet).sort((a, b) => a - b);
  const sortedContinents = Array.from(continentsSet).sort();
  const sortedRegions = Array.from(regionsSet).sort();

  return {
    records,
    years: sortedYears,
    continents: sortedContinents,
    regions: sortedRegions,
  };
}
