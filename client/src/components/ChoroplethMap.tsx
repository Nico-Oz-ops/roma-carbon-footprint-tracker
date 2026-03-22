/**
 * Choropleth Map Component
 * Design: Environmental Storytelling Dashboard
 * Interactive map of Rome municipalities with emissions color coding
 * Layout split: map on left (40%), detail panel on right (60%)
 */

import { useEffect, useRef, useState } from "react";
import { municipalities } from "@/lib/carbonData";
import { ROMA_MUNICIPALITIES_GEOJSON } from "@/lib/romaMunicipalitiesGeoJSON";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, X } from "lucide-react";
import MunicipalityDetailPanel from "./MunicipalityDetailPanel";

interface ChoroplethMapProps {
  onMunicipalityClick?: (municipalityId: number) => void;
}

function getEmissionsColor(emissionsPerCapita: number): string {
  if (emissionsPerCapita < 2.5) return "#22c55e"; // Green - A
  if (emissionsPerCapita < 3.2) return "#bfef45"; // Yellow-Green - B
  if (emissionsPerCapita < 4.0) return "#f59e0b"; // Orange - C
  return "#ef4444"; // Red - D
}

function getScoreLabel(emissionsPerCapita: number): string {
  if (emissionsPerCapita < 2.5) return "A";
  if (emissionsPerCapita < 3.2) return "B";
  if (emissionsPerCapita < 4.0) return "C";
  return "D";
}

export default function ChoroplethMap({ onMunicipalityClick }: ChoroplethMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const geoJsonLayer = useRef<L.GeoJSON | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<number | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map centered on Rome
    map.current = L.map(mapContainer.current).setView([41.9028, 12.4964], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Add GeoJSON layer with proper styling
    geoJsonLayer.current = L.geoJSON(ROMA_MUNICIPALITIES_GEOJSON as any, {
      style: (feature: any) => {
        const municipalityId = feature?.properties?.id;
        const municipality = municipalities.find((m) => m.id === municipalityId);
        const isSelected = municipalityId === selectedMunicipality;

        if (!municipality) {
          return {
            fillColor: "#e5e7eb",
            weight: 2,
            opacity: 1,
            color: "#9ca3af",
            dashArray: "3",
            fillOpacity: 0.3,
          };
        }

        const emissionsPerCapita = municipality.emissionsCurrent / municipality.population;
        const color = getEmissionsColor(emissionsPerCapita);

        return {
          fillColor: color,
          weight: isSelected ? 4 : 2,
          opacity: 1,
          color: isSelected ? "#000000" : "#ffffff",
          dashArray: "",
          fillOpacity: isSelected ? 0.95 : 0.8,
        };
      },
      onEachFeature: (feature: any, layer: any) => {
        const municipalityId = feature.properties?.id;
        const municipality = municipalities.find((m) => m.id === municipalityId);

        if (municipality) {
          const emissionsPerCapita = municipality.emissionsCurrent / municipality.population;
          const score = getScoreLabel(emissionsPerCapita);

          const popupContent = `
            <div style="font-family: 'Open Sans', sans-serif; padding: 12px; min-width: 200px;">
              <strong style="font-family: 'Playfair Display', serif; font-size: 15px; display: block; margin-bottom: 8px;">${municipality.name}</strong>
              <div style="font-size: 12px; line-height: 1.6;">
                <div><strong>Popolazione:</strong> ${(municipality.population / 1000).toFixed(0)}k</div>
                <div><strong>Emissioni totali:</strong> ${(municipality.emissionsCurrent / 1000).toFixed(0)}k t</div>
                <div><strong>Pro-capite:</strong> ${emissionsPerCapita.toFixed(2)} t/ab</div>
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
                  <strong>Score: </strong>
                  <span style="display: inline-block; width: 24px; height: 24px; border-radius: 50%; background-color: ${getEmissionsColor(emissionsPerCapita)}; color: white; text-align: center; line-height: 24px; font-weight: bold; font-size: 13px;">
                    ${score}
                  </span>
                </div>
              </div>
            </div>
          `;

          layer.bindPopup(popupContent);

          layer.on("click", () => {
            setSelectedMunicipality(municipalityId);
            if (onMunicipalityClick) {
              onMunicipalityClick(municipalityId);
            }
            // Aggiorna lo stile del layer
            if (geoJsonLayer.current) {
              geoJsonLayer.current.setStyle((feature: any) => {
                const id = feature?.properties?.id;
                const muni = municipalities.find((m) => m.id === id);
                if (!muni) return {};
                const emPerCap = muni.emissionsCurrent / muni.population;
                const color = getEmissionsColor(emPerCap);
                const isSelected = id === municipalityId;
                return {
                  fillColor: color,
                  weight: isSelected ? 4 : 2,
                  opacity: 1,
                  color: isSelected ? "#000000" : "#ffffff",
                  fillOpacity: isSelected ? 0.95 : 0.8,
                };
              });
            }
          });

          layer.on("mouseover", function (this: L.Layer) {
            if (this instanceof L.Path && municipalityId !== selectedMunicipality) {
              this.setStyle({
                weight: 3,
                opacity: 1,
                fillOpacity: 0.9,
              });
            }
          });

          layer.on("mouseout", function (this: L.Layer) {
            if (this instanceof L.Path && municipalityId !== selectedMunicipality) {
              this.setStyle({
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8,
              });
            }
          });
        }
      },
    }).addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [selectedMunicipality, onMunicipalityClick]);

  const selectedMunicipalityData = selectedMunicipality
    ? municipalities.find((m) => m.id === selectedMunicipality)
    : null;

  if (selectedMunicipalityData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 slide-up">
        {/* Map Container - 40% on desktop */}
        <div className="lg:col-span-2">
          <div className="card-eco p-4 border border-blue-200/30 rounded-lg overflow-hidden">
            <div
              ref={mapContainer}
              className="w-full h-96 lg:h-full rounded-lg border border-border"
            />
          </div>
        </div>

        {/* Detail Panel - 60% on desktop */}
        <div className="lg:col-span-3">
          <div className="card-eco p-8 border border-blue-200/30 rounded-lg relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setSelectedMunicipality(null);
                if (onMunicipalityClick) {
                  onMunicipalityClick(0);
                }
              }}
              className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
              title="Chiudi pannello dettagli"
            >
              <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </button>

            <MunicipalityDetailPanel
              municipalityId={selectedMunicipalityData.id}
              onClose={() => {
                setSelectedMunicipality(null);
                if (onMunicipalityClick) {
                  onMunicipalityClick(0);
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-eco p-8 border border-blue-200/30 slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-full">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-foreground">
            Mappa Coropletica — Emissioni per Municipio
          </h3>
          <p className="text-sm text-muted-foreground">
            Clicca su un municipio per visualizzare i dettagli
          </p>
        </div>
      </div>

      {/* Map Container */}
      <div
        ref={mapContainer}
        className="w-full h-96 rounded-lg border border-border overflow-hidden mb-6"
      />

      {/* Legend */}
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

      {/* Methodology Note */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200/30 rounded-lg">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong>Nota metodologica:</strong> Confini amministrativi da OpenStreetMap/Nominatim. Dati emissioni stimati con downscaling basato su popolazione ISTAT 2023 e mix settoriale ISPRA 2024.
        </p>
      </div>
    </div>
  );
}
