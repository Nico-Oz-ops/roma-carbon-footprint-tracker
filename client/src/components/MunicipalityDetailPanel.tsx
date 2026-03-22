/**
 * Municipality Detail Panel Component
 * Design: Environmental Storytelling Dashboard
 * Shows detailed breakdown of emissions for a selected municipality
 * - Animated bars with absolute values and percentages
 * - Donut chart with distribution
 * - Close button
 */

import { municipalities, getSustainabilityScore } from "@/lib/carbonData";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { X, TrendingDown } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

interface MunicipalityDetailPanelProps {
  municipalityId: number | null;
  onClose: () => void;
}

export default function MunicipalityDetailPanel({
  municipalityId,
  onClose,
}: MunicipalityDetailPanelProps) {
  if (!municipalityId) return null;

  const municipality = municipalities.find((m) => m.id === municipalityId);
  if (!municipality) return null;

  const total = Object.values(municipality.emissionsSources).reduce((a, b) => a + b, 0);
  const score = getSustainabilityScore(municipality);

  const sourcesList = [
    {
      name: "Traffico",
      value: municipality.emissionsSources.traffic,
      color: "bg-blue-500",
      icon: "🚗",
    },
    {
      name: "Energia",
      value: municipality.emissionsSources.energy,
      color: "bg-amber-500",
      icon: "⚡",
    },
    {
      name: "Industria",
      value: municipality.emissionsSources.industry,
      color: "bg-orange-600",
      icon: "🏭",
    },
    {
      name: "Rifiuti",
      value: municipality.emissionsSources.waste,
      color: "bg-green-700",
      icon: "♻️",
    },
    {
      name: "Altro",
      value: municipality.emissionsSources.other,
      color: "bg-green-500",
      icon: "📊",
    },
  ];

  const donutData = {
    labels: sourcesList.map((s) => s.name),
    datasets: [
      {
        data: sourcesList.map((s) => s.value),
        backgroundColor: [
          "oklch(0.55 0.18 200)",
          "oklch(0.65 0.20 55)",
          "oklch(0.35 0.15 30)",
          "oklch(0.42 0.12 142)",
          "oklch(0.65 0.15 142)",
        ],
        borderColor: "#fff",
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: {
            family: "'Poppins', sans-serif",
            size: 11,
          } as any,
          color: "oklch(0.25 0.02 65)",
          padding: 12,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "oklch(0.25 0.02 65)",
        titleFont: {
          family: "'Playfair Display', serif",
          size: 12,
          weight: "bold" as any,
        },
        bodyFont: {
          family: "'Open Sans', sans-serif",
          size: 10,
        } as any,
        padding: 8,
        borderColor: "oklch(0.42 0.12 142)",
        borderWidth: 1,
        callbacks: {
          label: function (context: any) {
            const value = context.parsed;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${(value / 1000).toFixed(0)}k tonnellate (${percentage}%)`;
          },
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

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-200/30 p-6 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-2">
              {municipality.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              Analisi dettagliata delle emissioni CO₂
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Emissioni Totali</p>
              <p className="text-2xl font-display font-bold text-foreground">
                {(municipality.emissionsCurrent / 1000).toFixed(0)}k
              </p>
              <p className="text-xs text-muted-foreground mt-1">tonnellate</p>
            </div>

            <div className="p-4 rounded-2xl bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Popolazione</p>
              <p className="text-2xl font-display font-bold text-foreground">
                {(municipality.population / 1000).toFixed(0)}k
              </p>
              <p className="text-xs text-muted-foreground mt-1">abitanti</p>
            </div>

            <div className="p-4 rounded-2xl bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Emissioni/ab</p>
              <p className="text-2xl font-display font-bold text-foreground">
                {(municipality.emissionsCurrent / municipality.population).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">tonnellate</p>
            </div>

            <div className={`p-4 rounded-2xl ${getScoreColor(score)} text-white`}>
              <p className="text-xs opacity-90 mb-1">Score Sostenibilità</p>
              <p className="text-3xl font-display font-bold">{score}</p>
              <p className="text-xs opacity-90 mt-1">
                {score === "A"
                  ? "Eccellente"
                  : score === "B"
                  ? "Buono"
                  : score === "C"
                  ? "Moderato"
                  : "Critico"}
              </p>
            </div>
          </div>

          {/* Breakdown and Donut */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Animated Bars */}
            <div>
              <h3 className="text-xl font-display font-bold text-foreground mb-6">
                Breakdown per Fonte
              </h3>
              <div className="space-y-4">
                {sourcesList.map((source, index) => {
                  const percentage = ((source.value / total) * 100).toFixed(1);
                  return (
                    <div
                      key={source.name}
                      className="slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{source.icon}</span>
                          <p className="font-heading font-semibold text-foreground">
                            {source.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-display font-bold text-foreground">
                            {percentage}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(source.value / 1000).toFixed(0)}k t
                          </p>
                        </div>
                      </div>

                      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`${source.color} h-full rounded-full transition-all duration-500 chart-bar-animate`}
                          style={{
                            width: `${percentage}%`,
                            animationDelay: `${index * 100}ms`,
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Donut Chart */}
            <div>
              <h3 className="text-xl font-display font-bold text-foreground mb-6">
                Distribuzione Visuale
              </h3>
              <div className="relative h-80">
                <Doughnut data={donutData} options={donutOptions} />
              </div>
            </div>
          </div>

          {/* Targets */}
          <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200/30">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-200 rounded-full">
                <TrendingDown className="w-5 h-5 text-blue-700" />
              </div>
              <div className="flex-1">
                <h4 className="font-heading font-semibold text-foreground mb-2">
                  Obiettivo 2030
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Target 2030</p>
                    <p className="text-lg font-display font-bold text-foreground">
                      {(municipality.emissionsTarget2030 / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Riduzione Necessaria</p>
                    <p className="text-lg font-display font-bold text-blue-700">
                      {(
                        ((municipality.emissionsCurrent - municipality.emissionsTarget2030) /
                          municipality.emissionsCurrent) *
                        100
                      ).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Tonnellate da Ridurre</p>
                    <p className="text-lg font-display font-bold text-blue-700">
                      {((municipality.emissionsCurrent - municipality.emissionsTarget2030) / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
