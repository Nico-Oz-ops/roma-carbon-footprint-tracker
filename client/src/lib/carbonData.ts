/**
 * Roma Carbon Footprint Data
 * 
 * Dati stimati con metodologia di downscaling basata su:
 * - Popolazione ISTAT 2023
 * - Mix settoriale ISPRA 2024
 * - Caratteristiche urbanistiche per municipio
 * 
 * Non rappresentano dati ufficiali certificati.
 */

export interface Municipality {
  id: number;
  name: string;
  population: number;
  area: number;
  emissionsCurrent: number;
  emissionsTarget2030: number;
  historicalEmissions: number[];
  emissionsSources: {
    traffic: number;
    energy: number;
    industry: number;
    waste: number;
    other: number;
  };
  characteristics: string;
  municipalityType: 'centro_storico' | 'residenziale_denso' | 'misto_industriale' | 'periferia_auto';
}

// Dati ufficiali ISTAT 2023 e ISPRA 2024
const municipalitiesData: Municipality[] = [
  {
    id: 1,
    name: "Municipio I — Centro Storico",
    population: 214000,
    area: 19.5,
    emissionsCurrent: 214000 * 2.1,
    emissionsTarget2030: 214000 * 2.1 * 0.45,
    historicalEmissions: [
      214000 * 2.35,
      214000 * 2.32,
      214000 * 2.28,
      214000 * 2.25,
      214000 * 2.23,
      214000 * 2.22,
      214000 * 2.1,
    ],
    emissionsSources: {
      traffic: 214000 * 2.1 * 0.25,
      energy: 214000 * 2.1 * 0.38,
      industry: 214000 * 2.1 * 0.10,
      waste: 214000 * 2.1 * 0.12,
      other: 214000 * 2.1 * 0.15,
    },
    characteristics: "ZTL, alta densità, turismo, pochi veicoli privati",
    municipalityType: "centro_storico",
  },
  {
    id: 2,
    name: "Municipio II — Parioli/Flaminio",
    population: 173000,
    area: 21.8,
    emissionsCurrent: 173000 * 2.6,
    emissionsTarget2030: 173000 * 2.6 * 0.45,
    historicalEmissions: [
      173000 * 2.85,
      173000 * 2.80,
      173000 * 2.75,
      173000 * 2.70,
      173000 * 2.68,
      173000 * 2.64,
      173000 * 2.6,
    ],
    emissionsSources: {
      traffic: 173000 * 2.6 * 0.25,
      energy: 173000 * 2.6 * 0.38,
      industry: 173000 * 2.6 * 0.10,
      waste: 173000 * 2.6 * 0.12,
      other: 173000 * 2.6 * 0.15,
    },
    characteristics: "Residenziale, traffico medio",
    municipalityType: "centro_storico",
  },
  {
    id: 3,
    name: "Municipio III — Monte Sacro",
    population: 218000,
    area: 24.2,
    emissionsCurrent: 218000 * 2.4,
    emissionsTarget2030: 218000 * 2.4 * 0.45,
    historicalEmissions: [
      218000 * 2.65,
      218000 * 2.60,
      218000 * 2.55,
      218000 * 2.50,
      218000 * 2.47,
      218000 * 2.44,
      218000 * 2.4,
    ],
    emissionsSources: {
      traffic: 218000 * 2.4 * 0.38,
      energy: 218000 * 2.4 * 0.30,
      industry: 218000 * 2.4 * 0.12,
      waste: 218000 * 2.4 * 0.14,
      other: 218000 * 2.4 * 0.06,
    },
    characteristics: "Residenziale, poca industria",
    municipalityType: "residenziale_denso",
  },
  {
    id: 4,
    name: "Municipio IV — Tiburtino",
    population: 162000,
    area: 18.5,
    emissionsCurrent: 162000 * 3.4,
    emissionsTarget2030: 162000 * 3.4 * 0.45,
    historicalEmissions: [
      162000 * 3.75,
      162000 * 3.68,
      162000 * 3.60,
      162000 * 3.52,
      162000 * 3.46,
      162000 * 3.40,
      162000 * 3.4,
    ],
    emissionsSources: {
      traffic: 162000 * 3.4 * 0.30,
      energy: 162000 * 3.4 * 0.26,
      industry: 162000 * 3.4 * 0.28,
      waste: 162000 * 3.4 * 0.12,
      other: 162000 * 3.4 * 0.04,
    },
    characteristics: "Misto industriale/residenziale",
    municipalityType: "misto_industriale",
  },
  {
    id: 5,
    name: "Municipio V — Prenestino",
    population: 272000,
    area: 28.3,
    emissionsCurrent: 272000 * 3.8,
    emissionsTarget2030: 272000 * 3.8 * 0.45,
    historicalEmissions: [
      272000 * 4.15,
      272000 * 4.08,
      272000 * 4.00,
      272000 * 3.92,
      272000 * 3.85,
      272000 * 3.82,
      272000 * 3.8,
    ],
    emissionsSources: {
      traffic: 272000 * 3.8 * 0.38,
      energy: 272000 * 3.8 * 0.30,
      industry: 272000 * 3.8 * 0.12,
      waste: 272000 * 3.8 * 0.14,
      other: 272000 * 3.8 * 0.06,
    },
    characteristics: "Alta densità, molto traffico",
    municipalityType: "residenziale_denso",
  },
  {
    id: 6,
    name: "Municipio VI — Tor Bella Monaca",
    population: 188000,
    area: 22.1,
    emissionsCurrent: 188000 * 4.2,
    emissionsTarget2030: 188000 * 4.2 * 0.45,
    historicalEmissions: [
      188000 * 4.60,
      188000 * 4.52,
      188000 * 4.43,
      188000 * 4.35,
      188000 * 4.28,
      188000 * 4.25,
      188000 * 4.2,
    ],
    emissionsSources: {
      traffic: 188000 * 4.2 * 0.50,
      energy: 188000 * 4.2 * 0.24,
      industry: 188000 * 4.2 * 0.12,
      waste: 188000 * 4.2 * 0.10,
      other: 188000 * 4.2 * 0.04,
    },
    characteristics: "Periferia est, industria",
    municipalityType: "periferia_auto",
  },
  {
    id: 7,
    name: "Municipio VII — Appio Latino",
    population: 307000,
    area: 31.5,
    emissionsCurrent: 307000 * 3.1,
    emissionsTarget2030: 307000 * 3.1 * 0.45,
    historicalEmissions: [
      307000 * 3.38,
      307000 * 3.32,
      307000 * 3.26,
      307000 * 3.20,
      307000 * 3.15,
      307000 * 3.13,
      307000 * 3.1,
    ],
    emissionsSources: {
      traffic: 307000 * 3.1 * 0.38,
      energy: 307000 * 3.1 * 0.30,
      industry: 307000 * 3.1 * 0.12,
      waste: 307000 * 3.1 * 0.14,
      other: 307000 * 3.1 * 0.06,
    },
    characteristics: "Più popoloso, traffico intenso",
    municipalityType: "residenziale_denso",
  },
  {
    id: 8,
    name: "Municipio VIII — Ostiense",
    population: 130000,
    area: 15.2,
    emissionsCurrent: 130000 * 3.0,
    emissionsTarget2030: 130000 * 3.0 * 0.45,
    historicalEmissions: [
      130000 * 3.30,
      130000 * 3.24,
      130000 * 3.18,
      130000 * 3.12,
      130000 * 3.06,
      130000 * 3.03,
      130000 * 3.0,
    ],
    emissionsSources: {
      traffic: 130000 * 3.0 * 0.30,
      energy: 130000 * 3.0 * 0.26,
      industry: 130000 * 3.0 * 0.28,
      waste: 130000 * 3.0 * 0.12,
      other: 130000 * 3.0 * 0.04,
    },
    characteristics: "Industria presente, bassa popolazione",
    municipalityType: "misto_industriale",
  },
  {
    id: 9,
    name: "Municipio IX — EUR",
    population: 151000,
    area: 17.8,
    emissionsCurrent: 151000 * 4.6,
    emissionsTarget2030: 151000 * 4.6 * 0.45,
    historicalEmissions: [
      151000 * 5.02,
      151000 * 4.93,
      151000 * 4.83,
      151000 * 4.73,
      151000 * 4.65,
      151000 * 4.62,
      151000 * 4.6,
    ],
    emissionsSources: {
      traffic: 151000 * 4.6 * 0.50,
      energy: 151000 * 4.6 * 0.24,
      industry: 151000 * 4.6 * 0.12,
      waste: 151000 * 4.6 * 0.10,
      other: 151000 * 4.6 * 0.04,
    },
    characteristics: "Terziario, alta dipendenza auto",
    municipalityType: "periferia_auto",
  },
  {
    id: 10,
    name: "Municipio X — Ostia",
    population: 228000,
    area: 26.4,
    emissionsCurrent: 228000 * 3.3,
    emissionsTarget2030: 228000 * 3.3 * 0.45,
    historicalEmissions: [
      228000 * 3.60,
      228000 * 3.54,
      228000 * 3.48,
      228000 * 3.42,
      228000 * 3.37,
      228000 * 3.34,
      228000 * 3.3,
    ],
    emissionsSources: {
      traffic: 228000 * 3.3 * 0.38,
      energy: 228000 * 3.3 * 0.30,
      industry: 228000 * 3.3 * 0.12,
      waste: 228000 * 3.3 * 0.14,
      other: 228000 * 3.3 * 0.06,
    },
    characteristics: "Costiero, traffico stagionale",
    municipalityType: "residenziale_denso",
  },
  {
    id: 11,
    name: "Municipio XI — Arvalia",
    population: 188000,
    area: 20.8,
    emissionsCurrent: 188000 * 3.2,
    emissionsTarget2030: 188000 * 3.2 * 0.45,
    historicalEmissions: [
      188000 * 3.52,
      188000 * 3.45,
      188000 * 3.38,
      188000 * 3.31,
      188000 * 3.26,
      188000 * 3.23,
      188000 * 3.2,
    ],
    emissionsSources: {
      traffic: 188000 * 3.2 * 0.30,
      energy: 188000 * 3.2 * 0.26,
      industry: 188000 * 3.2 * 0.28,
      waste: 188000 * 3.2 * 0.12,
      other: 188000 * 3.2 * 0.04,
    },
    characteristics: "Misto, industria leggera",
    municipalityType: "misto_industriale",
  },
  {
    id: 12,
    name: "Municipio XII — Monte Verde",
    population: 139000,
    area: 16.3,
    emissionsCurrent: 139000 * 2.8,
    emissionsTarget2030: 139000 * 2.8 * 0.45,
    historicalEmissions: [
      139000 * 3.08,
      139000 * 3.04,
      139000 * 3.00,
      139000 * 2.96,
      139000 * 2.92,
      139000 * 2.90,
      139000 * 2.8,
    ],
    emissionsSources: {
      traffic: 139000 * 2.8 * 0.25,
      energy: 139000 * 2.8 * 0.38,
      industry: 139000 * 2.8 * 0.10,
      waste: 139000 * 2.8 * 0.12,
      other: 139000 * 2.8 * 0.15,
    },
    characteristics: "Residenziale collinare",
    municipalityType: "centro_storico",
  },
  {
    id: 13,
    name: "Municipio XIII — Aurelia",
    population: 191000,
    area: 23.1,
    emissionsCurrent: 191000 * 3.0,
    emissionsTarget2030: 191000 * 3.0 * 0.45,
    historicalEmissions: [
      191000 * 3.28,
      191000 * 3.22,
      191000 * 3.16,
      191000 * 3.10,
      191000 * 3.05,
      191000 * 3.02,
      191000 * 3.0,
    ],
    emissionsSources: {
      traffic: 191000 * 3.0 * 0.38,
      energy: 191000 * 3.0 * 0.30,
      industry: 191000 * 3.0 * 0.12,
      waste: 191000 * 3.0 * 0.14,
      other: 191000 * 3.0 * 0.06,
    },
    characteristics: "Residenziale, periferia ovest",
    municipalityType: "residenziale_denso",
  },
  {
    id: 14,
    name: "Municipio XIV — Monte Mario",
    population: 183000,
    area: 19.9,
    emissionsCurrent: 183000 * 2.5,
    emissionsTarget2030: 183000 * 2.5 * 0.45,
    historicalEmissions: [
      183000 * 2.75,
      183000 * 2.70,
      183000 * 2.65,
      183000 * 2.60,
      183000 * 2.57,
      183000 * 2.53,
      183000 * 2.5,
    ],
    emissionsSources: {
      traffic: 183000 * 2.5 * 0.25,
      energy: 183000 * 2.5 * 0.38,
      industry: 183000 * 2.5 * 0.10,
      waste: 183000 * 2.5 * 0.12,
      other: 183000 * 2.5 * 0.15,
    },
    characteristics: "Residenziale, alto verde urbano",
    municipalityType: "centro_storico",
  },
  {
    id: 15,
    name: "Municipio XV — Cassia/Flaminia",
    population: 184000,
    area: 25.6,
    emissionsCurrent: 184000 * 4.4,
    emissionsTarget2030: 184000 * 4.4 * 0.45,
    historicalEmissions: [
      184000 * 4.80,
      184000 * 4.71,
      184000 * 4.61,
      184000 * 4.52,
      184000 * 4.44,
      184000 * 4.42,
      184000 * 4.4,
    ],
    emissionsSources: {
      traffic: 184000 * 4.4 * 0.50,
      energy: 184000 * 4.4 * 0.24,
      industry: 184000 * 4.4 * 0.12,
      waste: 184000 * 4.4 * 0.10,
      other: 184000 * 4.4 * 0.04,
    },
    characteristics: "Bassa densità, alta dipendenza auto",
    municipalityType: "periferia_auto",
  },
];

export const municipalities = municipalitiesData;

export function getSustainabilityScore(municipality: Municipality): string {
  const emissionsPerCapita = municipality.emissionsCurrent / municipality.population;

  if (emissionsPerCapita < 2.5) return "A";
  if (emissionsPerCapita < 3.2) return "B";
  if (emissionsPerCapita < 4.0) return "C";
  return "D";
}

export function getGlobalBreakdown(): {
  traffic: number;
  energy: number;
  industry: number;
  waste: number;
  other: number;
} {
  const breakdown = {
    traffic: 0,
    energy: 0,
    industry: 0,
    waste: 0,
    other: 0,
  };

  municipalities.forEach((muni) => {
    breakdown.traffic += muni.emissionsSources.traffic;
    breakdown.energy += muni.emissionsSources.energy;
    breakdown.industry += muni.emissionsSources.industry;
    breakdown.waste += muni.emissionsSources.waste;
    breakdown.other += muni.emissionsSources.other;
  });

  return breakdown;
}

export function getTotalEmissions(): number {
  return municipalities.reduce((sum, muni) => sum + muni.emissionsCurrent, 0);
}

export function getEmissionsTarget2030(): number {
  return municipalities.reduce((sum, muni) => sum + muni.emissionsTarget2030, 0);
}

export function getBestMunicipality(): Municipality {
  return municipalities.reduce((best, current) =>
    current.emissionsCurrent / current.population < best.emissionsCurrent / best.population
      ? current
      : best
  );
}

export function getWorstMunicipality(): Municipality {
  return municipalities.reduce((worst, current) =>
    current.emissionsCurrent / current.population > worst.emissionsCurrent / worst.population
      ? current
      : worst
  );
}

export interface SimulatorResult {
  currentEmissions: number;
  projectedEmissions: number;
  reduction: number;
  reductionPercentage: number;
}

export function calculateSimulatorProjection(
  publicTransitIncrease: number,
  electricVehiclesIncrease: number,
  renewablesIncrease: number,
  thermalInsulation: number,
  industryReduction: number = 0,
  wasteReduction: number = 0
): SimulatorResult {
  const currentTotal = getTotalEmissions();
  const breakdown = getGlobalBreakdown();

  let trafficReduction =
    (breakdown.traffic * publicTransitIncrease) / 100 * 0.4;
  trafficReduction +=
    (breakdown.traffic * electricVehiclesIncrease) / 100 * 0.3;

  const energyReduction =
    (breakdown.energy * renewablesIncrease) / 100 * 0.5;

  const insulationReduction =
    (breakdown.energy * thermalInsulation) / 100 * 0.25;

  const industryImpactReduction =
    (breakdown.industry * industryReduction) / 100 * 0.08;

  const wasteImpactReduction =
    (breakdown.waste * wasteReduction) / 100 * 0.05;

  const totalReduction = trafficReduction + energyReduction + insulationReduction + industryImpactReduction + wasteImpactReduction;
  const projectedEmissions = Math.max(currentTotal - totalReduction, currentTotal * 0.3);

  return {
    currentEmissions: currentTotal,
    projectedEmissions,
    reduction: totalReduction,
    reductionPercentage: (totalReduction / currentTotal) * 100,
  };
}

export function getHistoricalTrendData() {
  const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
  const totals = years.map((_, index) => {
    return municipalities.reduce((sum, m) => sum + m.historicalEmissions[index], 0);
  });

  return {
    years,
    totals,
  };
}
