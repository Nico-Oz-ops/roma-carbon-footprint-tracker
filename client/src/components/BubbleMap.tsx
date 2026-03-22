/**
 * Bubble Map Component
 * Design: Environmental Storytelling Dashboard
 * Interactive bubble map where circle size = emissions, color = sustainability score
 */

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  generateBubbleMapGeoJSON,
  getEmissionsColor,
  calculateBubbleRadius,
  getBubbleMapStats,
  type BubbleFeature,
} from "@/lib/romaBubbleMapData";
import { MapPin } from "lucide-react";
import MunicipalityDetailPanel from "./MunicipalityDetailPanel";
import BubbleMapFilters from "./BubbleMapFilters";

interface BubbleMapProps {
  onMunicipalityClick?: (municipalityId: number) => void;
}

export default function BubbleMap({ onMunicipalityClick }: BubbleMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const circleMarkers = useRef<Map<number, L.CircleMarker>>(new Map());
  const [selectedMunicipality, setSelectedMunicipality] = useState<number | null>(null);
  const [hoveredMunicipality, setHoveredMunicipality] = useState<number | null>(null);
  const [visibleScores, setVisibleScores] = useState<Set<string>>(new Set(["A", "B", "C", "D"]));
  const bubbleDataRef = useRef<BubbleFeature[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map centered on Rome
    map.current = L.map(mapContainer.current).setView([41.9028, 12.4964], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Generate bubble map data
    const bubbleData = generateBubbleMapGeoJSON();
    bubbleDataRef.current = bubbleData.features;

    // Add circle markers for each municipality
    bubbleData.features.forEach((feature: BubbleFeature) => {
      const { coordinates } = feature.geometry;
      const { id, name, emissionsCurrent, emissionsPerCapita, score } = feature.properties;

      const radius = calculateBubbleRadius(emissionsCurrent);
      const color = getEmissionsColor(score);

      const circleMarker = L.circleMarker([coordinates[1], coordinates[0]], {
        radius,
        fillColor: color,
        color: "#ffffff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      }).addTo(map.current!);

      // Tooltip on hover
      const tooltip = `
        <div style="font-family: 'Open Sans', sans-serif; font-size: 12px; font-weight: 600;">
          <strong>${name}</strong><br/>
          <span style="color: #666;">Emissioni: ${(emissionsCurrent / 1000).toFixed(0)}k t</span><br/>
          <span style="color: #666;">Pro-capite: ${emissionsPerCapita.toFixed(2)} t/ab</span><br/>
          <span style="display: inline-block; margin-top: 4px; padding: 2px 8px; background-color: ${color}; color: white; border-radius: 4px; font-size: 11px; font-weight: bold;">
            Score ${score}
          </span>
        </div>
      `;

      circleMarker.bindTooltip(tooltip, {
        permanent: false,
        direction: "top",
        offset: [0, -radius - 10],
      });

      // Hover effects
      circleMarker.on("mouseover", function (this: L.CircleMarker) {
        setHoveredMunicipality(id);
        if (selectedMunicipality !== id) {
          this.setStyle({
            weight: 3,
            opacity: 1,
            fillOpacity: 0.95,
          });
        }
      });

      circleMarker.on("mouseout", function (this: L.CircleMarker) {
        setHoveredMunicipality(null);
        if (selectedMunicipality !== id) {
          this.setStyle({
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
          });
        }
      });

      // Click to select
      circleMarker.on("click", () => {
        if (visibleScores.has(score)) {
          setSelectedMunicipality(id);
          if (onMunicipalityClick) {
            onMunicipalityClick(id);
          }
        }
      });

      circleMarkers.current.set(id, circleMarker);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      circleMarkers.current.clear();
    };
  }, [onMunicipalityClick, visibleScores]);

  // Update circle styles and visibility when selection or filters change
  useEffect(() => {
    circleMarkers.current.forEach((marker, id) => {
      const feature = bubbleDataRef.current.find((f) => f.properties.id === id);
      const isVisible = feature && visibleScores.has(feature.properties.score);

      if (isVisible) {
        if (id === selectedMunicipality) {
          marker.setStyle({
            weight: 4,
            opacity: 1,
            fillOpacity: 0.95,
            color: "#000000",
          });
        } else if (id === hoveredMunicipality) {
          marker.setStyle({
            weight: 3,
            opacity: 1,
            fillOpacity: 0.9,
          });
        } else {
          marker.setStyle({
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
            color: "#ffffff",
          });
        }
        if (map.current && !map.current.hasLayer(marker)) {
          marker.addTo(map.current);
        }
      } else {
        if (map.current && map.current.hasLayer(marker)) {
          marker.removeFrom(map.current);
        }
      }
    });
  }, [selectedMunicipality, hoveredMunicipality, visibleScores]);

  const handleToggleScore = (score: string) => {
    const newVisibleScores = new Set(visibleScores);
    if (newVisibleScores.has(score)) {
      newVisibleScores.delete(score);
    } else {
      newVisibleScores.add(score);
    }
    setVisibleScores(newVisibleScores);
  };

  const stats = getBubbleMapStats();

  // Render map only (no modal panel here)
  return (
    <div className="space-y-6 slide-up">
      {/* Filters */}
      <BubbleMapFilters
        visibleScores={visibleScores}
        onToggleScore={handleToggleScore}
      />

      {/* Map Card */}
      <div className="card-eco p-8 border border-blue-200/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-full">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-foreground">
              Bubble Map — Emissioni per Municipio
            </h3>
            <p className="text-sm text-muted-foreground">
              Clicca su un cerchio per visualizzare i dettagli
            </p>
          </div>
        </div>

        {/* Map Container */}
        <div
          ref={mapContainer}
          className="w-full h-96 rounded-lg border border-border overflow-hidden mb-6"
        />

        {/* Legend */}
        <div className="space-y-6">
          {/* Score Legend */}
          <div>
            <p className="text-sm font-heading font-semibold text-foreground mb-3">
              Scala Sostenibilità
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: "#22c55e" }} />
                <div>
                  <p className="text-sm font-heading font-semibold text-foreground">A</p>
                  <p className="text-xs text-muted-foreground">&lt; 2.5 t/ab</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: "#bfef45" }} />
                <div>
                  <p className="text-sm font-heading font-semibold text-foreground">B</p>
                  <p className="text-xs text-muted-foreground">2.5–3.2 t/ab</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: "#f59e0b" }} />
                <div>
                  <p className="text-sm font-heading font-semibold text-foreground">C</p>
                  <p className="text-xs text-muted-foreground">3.2–4.0 t/ab</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: "#ef4444" }} />
                <div>
                  <p className="text-sm font-heading font-semibold text-foreground">D</p>
                  <p className="text-xs text-muted-foreground">&gt; 4.0 t/ab</p>
                </div>
              </div>
            </div>
          </div>

          {/* Size Legend */}
          <div>
            <p className="text-sm font-heading font-semibold text-foreground mb-3">
              Dimensione Cerchio = Emissioni Totali
            </p>
            <div className="flex items-end gap-6">
              <div className="flex flex-col items-center">
                <div
                  className="rounded-full border-2 border-primary/50 mb-2"
                  style={{
                    width: `${stats.minRadius * 2}px`,
                    height: `${stats.minRadius * 2}px`,
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Min: {(stats.minEmissions / 1000).toFixed(0)}k t
                </p>
              </div>
              <div className="flex-1 h-px bg-border" />
              <div className="flex flex-col items-center">
                <div
                  className="rounded-full border-2 border-primary/50 mb-2"
                  style={{
                    width: `${stats.maxRadius * 2}px`,
                    height: `${stats.maxRadius * 2}px`,
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Max: {(stats.maxEmissions / 1000).toFixed(0)}k t
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Methodology Note */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200/30 rounded-lg">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Nota metodologica:</strong> Centroidi da OpenStreetMap. Dati emissioni stimati con downscaling basato su popolazione ISTAT 2023 e mix settoriale ISPRA 2024.
          </p>
        </div>
      </div>


    </div>
  );
}
