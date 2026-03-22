/**
 * Municipality Bars Component
 * Design: Environmental Storytelling Dashboard
 * Displays colored bars for each municipality
 * Green = low emissions, Red = high emissions
 * Clickable to open detail panel
 */

import { municipalities } from "@/lib/carbonData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

interface MunicipalityBarsProps {
  onSelectMunicipality: (municipalityId: number) => void;
}

export default function MunicipalityBars({ onSelectMunicipality }: MunicipalityBarsProps) {
  const { t } = useLanguage();
  const maxEmissions = Math.max(...municipalities.map((m) => m.emissionsCurrent));
  const minEmissions = Math.min(...municipalities.map((m) => m.emissionsCurrent));
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const getColor = (emissions: number): string => {
    const normalized = (emissions - minEmissions) / (maxEmissions - minEmissions);

    if (normalized < 0.25) return "bg-emerald-500"; // Verde
    if (normalized < 0.5) return "bg-lime-500"; // Verde-giallo
    if (normalized < 0.75) return "bg-amber-500"; // Giallo-arancione
    return "bg-orange-600"; // Rosso-arancione
  };

  const getColorLabel = (emissions: number): string => {
    const normalized = (emissions - minEmissions) / (maxEmissions - minEmissions);

    if (normalized < 0.25) return t('ranking.scoreA');
    if (normalized < 0.5) return t('ranking.scoreB');
    if (normalized < 0.75) return t('ranking.scoreC');
    return t('ranking.scoreD');
  };

  return (
    <div className="card-eco p-8 border border-green-200/30 slide-up">
      <div className="mb-8">
        <h3 className="text-2xl font-display font-bold text-foreground mb-2">
          {t('municipalities.title')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('municipalities.subtitle')}
        </p>
      </div>

      <div className="space-y-4">
        {municipalities.map((municipality, index) => {
          const percentage = (municipality.emissionsCurrent / maxEmissions) * 100;
          const isHovered = hoveredId === municipality.id;

          return (
            <div
              key={municipality.id}
              className="slide-up cursor-pointer group"
              style={{ animationDelay: `${index * 30}ms` }}
              onMouseEnter={() => setHoveredId(municipality.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectMunicipality(municipality.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <p className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                    {municipality.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(municipality.emissionsCurrent / 1000).toFixed(0)}k tonnellate • {getColorLabel(municipality.emissionsCurrent)}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-display font-bold text-foreground">
                    {(municipality.emissionsCurrent / 1000).toFixed(0)}k
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(municipality.emissionsCurrent / municipality.population).toFixed(2)} t/ab
                  </p>
                </div>
              </div>

              <div className="relative h-8 bg-muted rounded-full overflow-hidden">
                <div
                  className={`${getColor(municipality.emissionsCurrent)} h-full rounded-full transition-all duration-300 ${
                    isHovered ? "shadow-lg" : ""
                  } chart-bar-animate`}
                  style={{
                    width: `${percentage}%`,
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="h-full flex items-center justify-end pr-3">
                    {percentage > 15 && (
                      <span className="text-xs font-bold text-white">
                        {percentage.toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {isHovered && (
                <div className="mt-2 p-3 bg-primary/5 rounded-lg border border-primary/20 fade-in">
                  <p className="text-xs text-foreground">
                    <span className="font-semibold">Obiettivo 2030:</span> {(municipality.emissionsTarget2030 / 1000).toFixed(0)}k tonnellate
                  </p>
                  <p className="text-xs text-foreground mt-1">
                    <span className="font-semibold">Riduzione necessaria:</span>{" "}
                    {(
                      ((municipality.emissionsCurrent - municipality.emissionsTarget2030) /
                        municipality.emissionsCurrent) *
                      100
                    ).toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-green-200/30">
        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-muted-foreground">Basso</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-lime-500"></div>
            <span className="text-muted-foreground">Moderato</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-muted-foreground">Alto</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-600"></div>
            <span className="text-muted-foreground">Critico</span>
          </div>
        </div>
      </div>
    </div>
  );
}
