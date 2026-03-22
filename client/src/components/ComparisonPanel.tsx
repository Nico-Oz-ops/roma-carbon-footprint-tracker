/**
 * Comparison Panel Component
 * Design: Environmental Storytelling Dashboard
 * Shows side-by-side comparison of 2-3 municipalities with:
 * - Key metrics comparison
 * - Emissions breakdown comparison
 * - Bar charts for visual comparison
 * - Sustainability scores
 */

import { municipalities, getSustainabilityScore } from "@/lib/carbonData";
import ExportMenu from "./ExportMenu";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { TrendingDown } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ComparisonPanelProps {
  municipalityIds: number[];
}

export default function ComparisonPanel({ municipalityIds }: ComparisonPanelProps) {
  if (municipalityIds.length === 0) return null;

  const selectedMunis = municipalities.filter((m) =>
    municipalityIds.includes(m.id)
  );

  const colors = [
    "oklch(0.55 0.18 200)", // Sky Blue
    "oklch(0.42 0.12 142)", // Forest Green
    "oklch(0.65 0.20 55)", // Warm Amber
  ];

  // Chart data for emissions comparison
  const emissionsChartData = {
    labels: selectedMunis.map((m) => m.name),
    datasets: [
      {
        label: "Emissioni Totali",
        data: selectedMunis.map((m) => m.emissionsCurrent),
        backgroundColor: colors.slice(0, selectedMunis.length),
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const emissionsChartOptions = {
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
            return `${(value / 1000000).toFixed(2)}M tonnellate`;
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
            size: 11,
          } as any,
          color: "oklch(0.55 0.016 285.938)",
        },
      },
    },
  };

  // Chart data for per capita emissions
  const perCapitaChartData = {
    labels: selectedMunis.map((m) => m.name),
    datasets: [
      {
        label: "Emissioni per Abitante",
        data: selectedMunis.map((m) => m.emissionsCurrent / m.population),
        backgroundColor: colors.slice(0, selectedMunis.length),
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const perCapitaChartOptions = {
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
            return `${value.toFixed(2)} tonnellate/ab`;
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
            return value.toFixed(2);
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
            size: 11,
          } as any,
          color: "oklch(0.55 0.016 285.938)",
        },
      },
    },
  };

  const getScoreColor = (score: string): string => {
    switch (score) {
      case "A":
        return "bg-emerald-500";
      case "B":
        return "bg-lime-500";
      case "C":
        return "bg-amber-500";
      case "D":
        return "bg-orange-600";
      default:
        return "bg-gray-500";
    }
  };

  const getScoreBgColor = (score: string): string => {
    switch (score) {
      case "A":
        return "bg-emerald-50";
      case "B":
        return "bg-lime-50";
      case "C":
        return "bg-amber-50";
      case "D":
        return "bg-orange-50";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div className="space-y-8">
      {/* Export Menu */}
      <div className="flex justify-end">
        <ExportMenu municipalityIds={municipalityIds} />
      </div>

      {/* Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Total Emissions */}
        <div className="card-eco p-8 border border-blue-200/30 slide-up">
          <h3 className="text-xl font-display font-bold text-foreground mb-6">
            Emissioni Totali
          </h3>
          <div className="relative h-64">
            <Bar data={emissionsChartData} options={emissionsChartOptions} />
          </div>
        </div>

        {/* Per Capita Emissions */}
        <div className="card-eco p-8 border border-green-200/30 slide-up" style={{ animationDelay: "100ms" }}>
          <h3 className="text-xl font-display font-bold text-foreground mb-6">
            Emissioni per Abitante
          </h3>
          <div className="relative h-64">
            <Bar data={perCapitaChartData} options={perCapitaChartOptions} />
          </div>
        </div>
      </div>

      {/* Detailed Comparison Table */}
      <div className="card-eco p-8 border border-amber-200/30 slide-up" style={{ animationDelay: "200ms" }}>
        <h3 className="text-xl font-display font-bold text-foreground mb-6">
          Confronto Dettagliato
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-heading font-semibold text-foreground">
                  Metrica
                </th>
                {selectedMunis.map((muni) => (
                  <th
                    key={muni.id}
                    className="text-left py-3 px-4 font-heading font-semibold text-foreground"
                  >
                    {muni.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 text-muted-foreground">Emissioni Totali</td>
                {selectedMunis.map((muni) => (
                  <td key={muni.id} className="py-3 px-4 font-display font-bold text-foreground">
                    {(muni.emissionsCurrent / 1000).toFixed(0)}k t
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 text-muted-foreground">Popolazione</td>
                {selectedMunis.map((muni) => (
                  <td key={muni.id} className="py-3 px-4 font-display font-bold text-foreground">
                    {(muni.population / 1000).toFixed(0)}k ab
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 text-muted-foreground">Emissioni/ab</td>
                {selectedMunis.map((muni) => (
                  <td key={muni.id} className="py-3 px-4 font-display font-bold text-foreground">
                    {(muni.emissionsCurrent / muni.population).toFixed(2)} t
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 text-muted-foreground">Score Sostenibilità</td>
                {selectedMunis.map((muni) => {
                  const score = getSustainabilityScore(muni);
                  return (
                    <td key={muni.id} className="py-3 px-4">
                      <div className={`${getScoreColor(score)} w-8 h-8 rounded-full flex items-center justify-center text-white font-display font-bold`}>
                        {score}
                      </div>
                    </td>
                  );
                })}
              </tr>
              <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 text-muted-foreground">Traffico</td>
                {selectedMunis.map((muni) => (
                  <td key={muni.id} className="py-3 px-4 font-display font-bold text-foreground">
                    {((muni.emissionsSources.traffic / muni.emissionsCurrent) * 100).toFixed(1)}%
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 text-muted-foreground">Energia</td>
                {selectedMunis.map((muni) => (
                  <td key={muni.id} className="py-3 px-4 font-display font-bold text-foreground">
                    {((muni.emissionsSources.energy / muni.emissionsCurrent) * 100).toFixed(1)}%
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 text-muted-foreground">Industria</td>
                {selectedMunis.map((muni) => (
                  <td key={muni.id} className="py-3 px-4 font-display font-bold text-foreground">
                    {((muni.emissionsSources.industry / muni.emissionsCurrent) * 100).toFixed(1)}%
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 text-muted-foreground">Rifiuti</td>
                {selectedMunis.map((muni) => (
                  <td key={muni.id} className="py-3 px-4 font-display font-bold text-foreground">
                    {((muni.emissionsSources.waste / muni.emissionsCurrent) * 100).toFixed(1)}%
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 text-muted-foreground">Obiettivo 2030</td>
                {selectedMunis.map((muni) => (
                  <td key={muni.id} className="py-3 px-4 font-display font-bold text-primary">
                    {(muni.emissionsTarget2030 / 1000).toFixed(0)}k t
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Reduction Target Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 slide-up" style={{ animationDelay: "300ms" }}>
        {selectedMunis.map((muni) => {
          const reductionNeeded = muni.emissionsCurrent - muni.emissionsTarget2030;
          const reductionPercentage = (reductionNeeded / muni.emissionsCurrent) * 100;

          return (
            <div
              key={muni.id}
              className="card-eco p-6 border border-blue-200/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-200 rounded-full">
                  <TrendingDown className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-foreground">
                    {muni.name}
                  </p>
                  <p className="text-xs text-muted-foreground">Obiettivo 2030</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Riduzione Necessaria</p>
                  <p className="text-2xl font-display font-bold text-blue-700">
                    {reductionPercentage.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Tonnellate da Ridurre</p>
                  <p className="text-lg font-display font-bold text-foreground">
                    {(reductionNeeded / 1000).toFixed(0)}k t
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
