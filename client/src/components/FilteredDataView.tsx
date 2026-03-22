/**
 * Filtered Data View Component
 * Design: Environmental Storytelling Dashboard
 * Displays filtered emissions data with statistics and visualizations
 */

import { useState } from "react";
import { municipalities } from "@/lib/carbonData";
import {
  FilterOptions,
  getFilteredEmissionsData,
  getFilteredStatistics,
  getSourceBreakdown,
  getMunicipalityTrend,
} from "@/lib/filterUtils";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { TrendingUp, Users, Zap, Leaf } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface FilteredDataViewProps {
  filters: FilterOptions;
}

export default function FilteredDataView({ filters }: FilteredDataViewProps) {
  const filteredData = getFilteredEmissionsData(municipalities, filters);
  const statistics = getFilteredStatistics(municipalities, filters);
  const sourceBreakdown = getSourceBreakdown(municipalities, filters);

  if (filteredData.length === 0) {
    return (
      <div className="card-eco p-8 border border-blue-200/30 text-center slide-up">
        <Leaf className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <p className="text-foreground font-heading font-semibold mb-2">
          Nessun dato disponibile
        </p>
        <p className="text-muted-foreground text-sm">
          Prova a modificare i filtri per visualizzare i dati
        </p>
      </div>
    );
  }

  // Sort by emissions descending
  const sortedData = [...filteredData].sort((a, b) => b.emissions - a.emissions);

  // Chart data for filtered municipalities
  const municipalityChartData = {
    labels: sortedData.map((d) => d.name),
    datasets: [
      {
        label: "Emissioni (tonnellate)",
        data: sortedData.map((d) => d.emissions),
        backgroundColor: sortedData.map((_, i) => {
          const colors = [
            "oklch(0.55 0.18 200)",
            "oklch(0.42 0.12 142)",
            "oklch(0.65 0.20 55)",
            "oklch(0.6 0.15 25)",
            "oklch(0.5 0.14 280)",
            "oklch(0.58 0.16 150)",
            "oklch(0.52 0.12 45)",
            "oklch(0.48 0.14 200)",
            "oklch(0.62 0.18 100)",
            "oklch(0.55 0.15 300)",
            "oklch(0.60 0.17 60)",
            "oklch(0.50 0.13 180)",
          ];
          return colors[i % colors.length];
        }),
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const municipalityChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: "y" as const,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "oklch(0.25 0.02 65)",
        titleFont: {
          family: "'Playfair Display', serif",
          size: 13,
          weight: "bold" as any,
        },
        bodyFont: {
          family: "'Open Sans', sans-serif",
          size: 11,
        } as any,
        padding: 10,
        callbacks: {
          label: function (context: any) {
            const value = context.parsed.x;
            return `${(value / 1000).toFixed(1)}k tonnellate`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "oklch(0.92 0.004 286.32 / 0.5)",
        },
        ticks: {
          font: {
            family: "'Open Sans', sans-serif",
            size: 11,
          } as any,
          color: "oklch(0.55 0.016 285.938)",
          callback: function (value: any) {
            return (value / 1000000).toFixed(1) + "M";
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Open Sans', sans-serif",
            size: 10,
          } as any,
          color: "oklch(0.55 0.016 285.938)",
        },
      },
    },
  };

  // Source breakdown chart
  const sourceChartData = {
    labels: ["Traffico", "Energia", "Industria", "Rifiuti", "Altro"],
    datasets: [
      {
        data: [
          sourceBreakdown.traffic,
          sourceBreakdown.energy,
          sourceBreakdown.industry,
          sourceBreakdown.waste,
          sourceBreakdown.other,
        ],
        backgroundColor: [
          "oklch(0.6 0.15 25)",
          "oklch(0.65 0.20 55)",
          "oklch(0.55 0.18 200)",
          "oklch(0.42 0.12 142)",
          "oklch(0.50 0.13 280)",
        ],
        borderColor: "oklch(1 0 0)",
        borderWidth: 2,
      },
    ],
  };

  const sourceChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: {
            family: "'Open Sans', sans-serif",
            size: 11,
          } as any,
          color: "oklch(0.55 0.016 285.938)",
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "oklch(0.25 0.02 65)",
        titleFont: {
          family: "'Playfair Display', serif",
          size: 13,
          weight: "bold" as any,
        },
        bodyFont: {
          family: "'Open Sans', sans-serif",
          size: 11,
        } as any,
        padding: 10,
        callbacks: {
          label: function (context: any) {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${(value / 1000).toFixed(1)}k t (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-eco p-6 border border-blue-200/30 slide-up">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-200 rounded-full">
              <Zap className="w-5 h-5 text-blue-700" />
            </div>
            <p className="text-xs text-muted-foreground font-heading font-semibold">
              Emissioni Totali
            </p>
          </div>
          <p className="text-2xl font-display font-bold text-foreground">
            {(statistics.totalEmissions / 1000000).toFixed(2)}M
          </p>
          <p className="text-xs text-muted-foreground mt-1">tonnellate</p>
        </div>

        <div className="card-eco p-6 border border-green-200/30 slide-up" style={{ animationDelay: "50ms" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-200 rounded-full">
              <TrendingUp className="w-5 h-5 text-green-700" />
            </div>
            <p className="text-xs text-muted-foreground font-heading font-semibold">
              Media per Municipio
            </p>
          </div>
          <p className="text-2xl font-display font-bold text-foreground">
            {(statistics.averageEmissions / 1000).toFixed(0)}k
          </p>
          <p className="text-xs text-muted-foreground mt-1">tonnellate</p>
        </div>

        <div className="card-eco p-6 border border-amber-200/30 slide-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-200 rounded-full">
              <Users className="w-5 h-5 text-amber-700" />
            </div>
            <p className="text-xs text-muted-foreground font-heading font-semibold">
              Media pro-capite
            </p>
          </div>
          <p className="text-2xl font-display font-bold text-foreground">
            {statistics.averagePerCapita.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">t/abitante</p>
        </div>

        <div className="card-eco p-6 border border-purple-200/30 slide-up" style={{ animationDelay: "150ms" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-200 rounded-full">
              <Leaf className="w-5 h-5 text-purple-700" />
            </div>
            <p className="text-xs text-muted-foreground font-heading font-semibold">
              Municipi Analizzati
            </p>
          </div>
          <p className="text-2xl font-display font-bold text-foreground">
            {statistics.municipalityCount}
          </p>
          <p className="text-xs text-muted-foreground mt-1">su {municipalities.length}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Municipalities Comparison */}
        <div className="card-eco p-8 border border-blue-200/30 slide-up">
          <h3 className="text-xl font-display font-bold text-foreground mb-6">
            Confronto Emissioni
          </h3>
          <div className="relative h-96">
            <Bar data={municipalityChartData} options={municipalityChartOptions} />
          </div>
        </div>

        {/* Source Breakdown */}
        <div className="card-eco p-8 border border-green-200/30 slide-up" style={{ animationDelay: "100ms" }}>
          <h3 className="text-xl font-display font-bold text-foreground mb-6">
            Breakdown per Fonte
          </h3>
          <div className="relative h-96 flex items-center justify-center">
            <Doughnut data={sourceChartData} options={sourceChartOptions} />
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="card-eco p-8 border border-amber-200/30 slide-up" style={{ animationDelay: "200ms" }}>
        <h3 className="text-xl font-display font-bold text-foreground mb-6">
          Dettagli Municipi
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-heading font-semibold text-foreground">
                  Municipio
                </th>
                <th className="text-right py-3 px-4 font-heading font-semibold text-foreground">
                  Emissioni (t)
                </th>
                <th className="text-right py-3 px-4 font-heading font-semibold text-foreground">
                  Popolazione
                </th>
                <th className="text-right py-3 px-4 font-heading font-semibold text-foreground">
                  t/ab
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((muni, index) => (
                <tr
                  key={muni.id}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-4 font-heading font-semibold text-foreground">
                    {muni.name}
                  </td>
                  <td className="py-3 px-4 text-right font-display font-bold text-foreground">
                    {(muni.emissions / 1000).toFixed(0)}k
                  </td>
                  <td className="py-3 px-4 text-right text-muted-foreground">
                    {(muni.population / 1000).toFixed(0)}k
                  </td>
                  <td className="py-3 px-4 text-right font-display font-bold text-primary">
                    {muni.emissionsPerCapita.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
