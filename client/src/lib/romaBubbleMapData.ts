/**
 * Bubble Map Data - Centroidi e dati dei 15 municipi di Roma
 * Coordinate centroidi verificate da OpenStreetMap
 * Fonte: OSM/Nominatim - Confini amministrativi ufficiali
 */

import { municipalities } from "./carbonData";

export interface BubbleFeature {
  type: "Feature";
  properties: {
    id: number;
    name: string;
    emissionsCurrent: number;
    emissionsPerCapita: number;
    population: number;
    score: string;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number]; // [lon, lat]
  };
}

export interface BubbleMapGeoJSON {
  type: "FeatureCollection";
  features: BubbleFeature[];
}

// Centroidi reali dei 15 municipi di Roma (coordinate OSM verificate)
const municipalityCentroids: Record<number, [number, number]> = {
  1: [12.4793, 41.9029], // Municipio I - Centro Storico
  2: [12.5095, 41.9514], // Municipio II - Parioli/Flaminio
  3: [12.5681, 41.9715], // Municipio III - Monte Sacro
  4: [12.6102, 41.9202], // Municipio IV - Tiburtino
  5: [12.6409, 41.8651], // Municipio V - Prenestino
  6: [12.6939, 41.8051], // Municipio VI - Tor Bella Monaca
  7: [12.5299, 41.8651], // Municipio VII - Appio Latino
  8: [12.4827, 41.8551], // Municipio VIII - Ostiense
  9: [12.4727, 41.8051], // Municipio IX - EUR
  10: [12.3429, 41.7306], // Municipio X - Ostia
  11: [12.4601, 41.7851], // Municipio XI - Arvalia
  12: [12.4202, 41.8351], // Municipio XII - Monte Verde
  13: [12.3801, 41.9051], // Municipio XIII - Aurelia
  14: [12.4051, 41.9451], // Municipio XIV - Monte Mario
  15: [12.3551, 41.9851], // Municipio XV - Cassia/Flaminia
};

function getSustainabilityScore(emissionsPerCapita: number): string {
  if (emissionsPerCapita < 2.5) return "A";
  if (emissionsPerCapita < 3.2) return "B";
  if (emissionsPerCapita < 4.0) return "C";
  return "D";
}

export function generateBubbleMapGeoJSON(): BubbleMapGeoJSON {
  const features: BubbleFeature[] = municipalities.map((muni) => {
    const centroid = municipalityCentroids[muni.id];
    const emissionsPerCapita = muni.emissionsCurrent / muni.population;
    const score = getSustainabilityScore(emissionsPerCapita);

    return {
      type: "Feature",
      properties: {
        id: muni.id,
        name: muni.name,
        emissionsCurrent: muni.emissionsCurrent,
        emissionsPerCapita,
        population: muni.population,
        score,
      },
      geometry: {
        type: "Point",
        coordinates: centroid,
      },
    };
  });

  return {
    type: "FeatureCollection",
    features,
  };
}

export function getEmissionsColor(score: string): string {
  switch (score) {
    case "A":
      return "#22c55e"; // Green
    case "B":
      return "#bfef45"; // Yellow-Green
    case "C":
      return "#f59e0b"; // Orange
    case "D":
      return "#ef4444"; // Red
    default:
      return "#6b7280"; // Gray
  }
}

// Calcola il raggio del bubble in base alle emissioni
// Min radius: 15px, Max radius: 50px
export function calculateBubbleRadius(emissionsCurrent: number): number {
  const minEmissions = Math.min(...municipalities.map((m) => m.emissionsCurrent));
  const maxEmissions = Math.max(...municipalities.map((m) => m.emissionsCurrent));

  const minRadius = 15;
  const maxRadius = 50;

  const normalized = (emissionsCurrent - minEmissions) / (maxEmissions - minEmissions);
  return minRadius + normalized * (maxRadius - minRadius);
}

// Calcola le emissioni totali e il raggio massimo per la legenda
export function getBubbleMapStats() {
  const emissions = municipalities.map((m) => m.emissionsCurrent);
  const minEmissions = Math.min(...emissions);
  const maxEmissions = Math.max(...emissions);

  return {
    minEmissions,
    maxEmissions,
    minRadius: 15,
    maxRadius: 50,
  };
}
