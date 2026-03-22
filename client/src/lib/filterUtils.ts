/**
 * Filter Utilities
 * Advanced filtering for municipality data by year, emission source, and population
 */

import { Municipality } from './carbonData';

export type EmissionSource = 'traffic' | 'energy' | 'industry' | 'waste' | 'other' | 'all';

export interface FilterOptions {
  year?: number;
  emissionSource?: EmissionSource;
  populationMin?: number;
  populationMax?: number;
}

/**
 * Get emissions for a specific year from historical data
 */
export function getEmissionsForYear(
  municipality: Municipality,
  year: number
): number {
  const yearIndex = year - 2019;
  if (yearIndex < 0 || yearIndex >= municipality.historicalEmissions.length) {
    return municipality.emissionsCurrent;
  }
  return municipality.historicalEmissions[yearIndex];
}

/**
 * Get emissions for a specific source
 */
export function getEmissionsForSource(
  municipality: Municipality,
  source: EmissionSource
): number {
  if (source === 'all') {
    return municipality.emissionsCurrent;
  }
  return municipality.emissionsSources[source as keyof typeof municipality.emissionsSources];
}

/**
 * Get emissions for a specific source and year
 */
export function getEmissionsForSourceAndYear(
  municipality: Municipality,
  source: EmissionSource,
  year: number
): number {
  const totalEmissions = getEmissionsForYear(municipality, year);
  
  if (source === 'all') {
    return totalEmissions;
  }

  // Calculate the proportion of this source in current year
  const currentSourceEmissions = municipality.emissionsSources[source as keyof typeof municipality.emissionsSources];
  const currentTotalEmissions = municipality.emissionsCurrent;
  const proportion = currentSourceEmissions / currentTotalEmissions;

  // Apply proportion to historical year (simplified model)
  return totalEmissions * proportion;
}

/**
 * Filter municipalities based on criteria
 */
export function filterMunicipalities(
  municipalities: Municipality[],
  filters: FilterOptions
): Municipality[] {
  return municipalities.filter((muni) => {
    // Population filter
    if (filters.populationMin !== undefined && muni.population < filters.populationMin) {
      return false;
    }
    if (filters.populationMax !== undefined && muni.population > filters.populationMax) {
      return false;
    }

    return true;
  });
}

/**
 * Get filtered emissions data for visualization
 */
export function getFilteredEmissionsData(
  municipalities: Municipality[],
  filters: FilterOptions
): Array<{
  id: number;
  name: string;
  emissions: number;
  population: number;
  emissionsPerCapita: number;
}> {
  const filtered = filterMunicipalities(municipalities, filters);

  return filtered.map((muni) => {
    const year = filters.year || 2025;
    const source = filters.emissionSource || 'all';
    
    const emissions = getEmissionsForSourceAndYear(muni, source, year);
    const emissionsPerCapita = emissions / muni.population;

    return {
      id: muni.id,
      name: muni.name,
      emissions,
      population: muni.population,
      emissionsPerCapita,
    };
  });
}

/**
 * Get statistics for filtered data
 */
export function getFilteredStatistics(
  municipalities: Municipality[],
  filters: FilterOptions
): {
  totalEmissions: number;
  averageEmissions: number;
  maxEmissions: number;
  minEmissions: number;
  averagePerCapita: number;
  municipalityCount: number;
} {
  const data = getFilteredEmissionsData(municipalities, filters);

  if (data.length === 0) {
    return {
      totalEmissions: 0,
      averageEmissions: 0,
      maxEmissions: 0,
      minEmissions: 0,
      averagePerCapita: 0,
      municipalityCount: 0,
    };
  }

  const emissions = data.map((d) => d.emissions);
  const perCapita = data.map((d) => d.emissionsPerCapita);

  return {
    totalEmissions: emissions.reduce((a, b) => a + b, 0),
    averageEmissions: emissions.reduce((a, b) => a + b, 0) / data.length,
    maxEmissions: Math.max(...emissions),
    minEmissions: Math.min(...emissions),
    averagePerCapita: perCapita.reduce((a, b) => a + b, 0) / data.length,
    municipalityCount: data.length,
  };
}

/**
 * Get trend data for a specific municipality across years
 */
export function getMunicipalityTrend(
  municipality: Municipality,
  filters: FilterOptions
): Array<{
  year: number;
  emissions: number;
}> {
  const source = filters.emissionSource || 'all';
  const trend = [];

  for (let year = 2019; year <= 2025; year++) {
    const emissions = getEmissionsForSourceAndYear(municipality, source, year);
    trend.push({ year, emissions });
  }

  return trend;
}

/**
 * Get comparison data for multiple municipalities across years
 */
export function getMultiMunicipalityTrend(
  municipalities: Municipality[],
  filters: FilterOptions
): Array<{
  year: number;
  data: Array<{
    id: number;
    name: string;
    emissions: number;
  }>;
}> {
  const source = filters.emissionSource || 'all';
  const trend = [];

  for (let year = 2019; year <= 2025; year++) {
    const yearData = municipalities.map((muni) => ({
      id: muni.id,
      name: muni.name,
      emissions: getEmissionsForSourceAndYear(muni, source, year),
    }));

    trend.push({ year, data: yearData });
  }

  return trend;
}

/**
 * Get source breakdown for filtered municipalities
 */
export function getSourceBreakdown(
  municipalities: Municipality[],
  filters: FilterOptions
): {
  traffic: number;
  energy: number;
  industry: number;
  waste: number;
  other: number;
} {
  const filtered = filterMunicipalities(municipalities, filters);
  const year = filters.year || 2025;

  const breakdown = {
    traffic: 0,
    energy: 0,
    industry: 0,
    waste: 0,
    other: 0,
  };

  filtered.forEach((muni) => {
    const currentTotal = muni.emissionsCurrent;
    const yearTotal = getEmissionsForYear(muni, year);
    const proportion = yearTotal / currentTotal;

    breakdown.traffic += muni.emissionsSources.traffic * proportion;
    breakdown.energy += muni.emissionsSources.energy * proportion;
    breakdown.industry += muni.emissionsSources.industry * proportion;
    breakdown.waste += muni.emissionsSources.waste * proportion;
    breakdown.other += muni.emissionsSources.other * proportion;
  });

  return breakdown;
}

/**
 * Get population ranges for filtering suggestions
 */
export function getPopulationRanges(municipalities: Municipality[]): {
  min: number;
  max: number;
  ranges: Array<{
    label: string;
    min: number;
    max: number;
  }>;
} {
  const populations = municipalities.map((m) => m.population).sort((a, b) => a - b);
  const min = populations[0];
  const max = populations[populations.length - 1];

  return {
    min,
    max,
    ranges: [
      { label: 'Piccoli (< 100k)', min: 0, max: 100000 },
      { label: 'Medi (100k - 300k)', min: 100000, max: 300000 },
      { label: 'Grandi (> 300k)', min: 300000, max: Infinity },
      { label: 'Tutti', min: 0, max: Infinity },
    ],
  };
}
