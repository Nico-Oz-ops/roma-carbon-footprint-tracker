/**
 * Advanced Filters Component
 * Design: Environmental Storytelling Dashboard
 * Allows filtering by year, emission source, and population range
 */

import { useState } from "react";
import { municipalities } from "@/lib/carbonData";
import { FilterOptions, EmissionSource, getPopulationRanges } from "@/lib/filterUtils";
import { Filter, X } from "lucide-react";

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

const EMISSION_SOURCES: Array<{ value: EmissionSource; label: string; color: string }> = [
  { value: "all", label: "Tutte le fonti", color: "bg-slate-500" },
  { value: "traffic", label: "Traffico", color: "bg-orange-500" },
  { value: "energy", label: "Energia", color: "bg-yellow-500" },
  { value: "industry", label: "Industria", color: "bg-red-500" },
  { value: "waste", label: "Rifiuti", color: "bg-green-600" },
  { value: "other", label: "Altro", color: "bg-purple-500" },
];

const YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025];

export default function AdvancedFilters({
  onFiltersChange,
  initialFilters,
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters || {});
  const [isExpanded, setIsExpanded] = useState(false);

  const populationRanges = getPopulationRanges(municipalities);

  const handleYearChange = (year: number | undefined) => {
    const newFilters = { ...filters, year };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSourceChange = (source: EmissionSource | undefined) => {
    const newFilters = { ...filters, emissionSource: source };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePopulationRangeChange = (min?: number, max?: number) => {
    const newFilters = {
      ...filters,
      populationMin: min,
      populationMax: max,
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleCustomPopulationChange = (type: "min" | "max", value: number | undefined) => {
    const newFilters = {
      ...filters,
      [type === "min" ? "populationMin" : "populationMax"]: value,
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  const hasActiveFilters =
    filters.year !== undefined ||
    filters.emissionSource !== undefined ||
    filters.populationMin !== undefined ||
    filters.populationMax !== undefined;

  return (
    <div className="card-eco p-6 border border-blue-200/30 slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Filter className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-foreground">
              Filtri Avanzati
            </h3>
            <p className="text-sm text-muted-foreground">
              Analizza i dati per anno, fonte e popolazione
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <svg
            className={`w-5 h-5 text-muted-foreground transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-6 pt-4 border-t border-border">
          {/* Year Filter */}
          <div>
            <label className="block text-sm font-heading font-semibold text-foreground mb-3">
              Anno
            </label>
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
              {YEARS.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearChange(filters.year === year ? undefined : year)}
                  className={`px-3 py-2 rounded-lg font-heading font-semibold text-sm transition-all ${
                    filters.year === year
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Emission Source Filter */}
          <div>
            <label className="block text-sm font-heading font-semibold text-foreground mb-3">
              Fonte di Emissione
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {EMISSION_SOURCES.map((source) => (
                <button
                  key={source.value}
                  onClick={() =>
                    handleSourceChange(
                      filters.emissionSource === source.value ? undefined : source.value
                    )
                  }
                  className={`px-4 py-2 rounded-lg font-heading font-semibold text-sm transition-all flex items-center gap-2 ${
                    filters.emissionSource === source.value
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${source.color}`} />
                  {source.label}
                </button>
              ))}
            </div>
          </div>

          {/* Population Range Filter */}
          <div>
            <label className="block text-sm font-heading font-semibold text-foreground mb-3">
              Intervallo di Popolazione
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {populationRanges.ranges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => handlePopulationRangeChange(range.min, range.max)}
                  className={`px-3 py-2 rounded-lg font-heading font-semibold text-sm transition-all ${
                    filters.populationMin === range.min &&
                    filters.populationMax === range.max
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* Custom Range Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Min (abitanti)
                </label>
                <input
                  type="number"
                  value={filters.populationMin || ""}
                  onChange={(e) =>
                    handleCustomPopulationChange(
                      "min",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  placeholder="Min"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm font-heading text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Max (abitanti)
                </label>
                <input
                  type="number"
                  value={filters.populationMax || ""}
                  onChange={(e) =>
                    handleCustomPopulationChange(
                      "max",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  placeholder="Max"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm font-heading text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="w-full px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-heading font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancella Filtri
            </button>
          )}

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg">
              <p className="text-xs font-heading font-semibold text-primary mb-2">
                Filtri Attivi:
              </p>
              <div className="flex flex-wrap gap-2">
                {filters.year && (
                  <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded font-heading font-semibold">
                    Anno: {filters.year}
                  </span>
                )}
                {filters.emissionSource && filters.emissionSource !== "all" && (
                  <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded font-heading font-semibold">
                    Fonte: {EMISSION_SOURCES.find((s) => s.value === filters.emissionSource)?.label}
                  </span>
                )}
                {(filters.populationMin !== undefined || filters.populationMax !== undefined) && (
                  <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded font-heading font-semibold">
                    Pop: {filters.populationMin || "0"} - {filters.populationMax || "∞"}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
