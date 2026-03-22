/**
 * Global Breakdown Component
 * Design: Environmental Storytelling Dashboard
 * Shows the global breakdown of emissions by source
 * (traffic, energy, industry, waste, other)
 */

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useLanguage } from "@/contexts/LanguageContext";
import { getGlobalBreakdown } from "@/lib/carbonData";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function GlobalBreakdown() {
  const { t } = useLanguage();
  const breakdown = getGlobalBreakdown();
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

  const data = {
    labels: [t('breakdown.traffic'), t('breakdown.energy'), t('breakdown.industry'), t('breakdown.waste'), t('breakdown.other')],
    datasets: [
      {
        data: [
          breakdown.traffic,
          breakdown.energy,
          breakdown.industry,
          breakdown.waste,
          breakdown.other,
        ],
        backgroundColor: [
          "oklch(0.55 0.18 200)", // Sky Blue - Traffic
          "oklch(0.65 0.20 55)", // Warm Amber - Energy
          "oklch(0.35 0.15 30)", // Dark Orange - Industry
          "oklch(0.42 0.12 142)", // Forest Green - Waste
          "oklch(0.65 0.15 142)", // Light Green - Other
        ],
        borderColor: "#fff",
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: {
            family: "'Poppins', sans-serif",
            size: 12,
          } as any,
          color: "oklch(0.25 0.02 65)",
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle",
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
        borderColor: "oklch(0.42 0.12 142)",
        borderWidth: 1,
        callbacks: {
          label: function (context: any) {
            const value = context.parsed;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${(value / 1000000).toFixed(2)}M ${t('kpi.metricsUnit')} (${percentage}%)`;
          },
        },
      },
    },
  };

  const sourceDetails = [
    {
      name: t('breakdown.traffic'),
      value: breakdown.traffic,
      color: "bg-blue-500",
      icon: "🚗",
      description: "Veicoli privati, trasporto merci",
    },
    {
      name: t('breakdown.energy'),
      value: breakdown.energy,
      color: "bg-amber-500",
      icon: "⚡",
      description: "Riscaldamento, elettricità",
    },
    {
      name: t('breakdown.industry'),
      value: breakdown.industry,
      color: "bg-orange-600",
      icon: "🏭",
      description: "Processi produttivi",
    },
    {
      name: t('breakdown.waste'),
      value: breakdown.waste,
      color: "bg-green-700",
      icon: "♻️",
      description: "Gestione e smaltimento",
    },
    {
      name: t('breakdown.other'),
      value: breakdown.other,
      color: "bg-green-500",
      icon: "📊",
      description: "Altre fonti",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Donut Chart */}
      <div className="card-eco p-8 border border-amber-200/30 slide-up">
        <div className="mb-6">
          <h3 className="text-2xl font-display font-bold text-foreground mb-2">
            {t('breakdown.title')}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t('breakdown.title')}
          </p>
        </div>
        <div className="relative h-80">
          <Doughnut data={data} options={options} />
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="card-eco p-8 border border-amber-200/30 slide-up" style={{ animationDelay: "100ms" }}>
        <h3 className="text-2xl font-display font-bold text-foreground mb-6">
          {t('detail.emissionSources')}
        </h3>

        <div className="space-y-4">
          {sourceDetails.map((source, index) => {
            const percentage = ((source.value / total) * 100).toFixed(1);
            return (
              <div
                key={source.name}
                className="slide-up p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{source.icon}</span>
                    <div>
                      <p className="font-heading font-semibold text-foreground">
                        {source.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {source.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-foreground">
                      {percentage}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(source.value / 1000000).toFixed(2)}M t
                    </p>
                  </div>
                </div>

                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
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

        <div className="mt-6 pt-6 border-t border-amber-200/30">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{t('ranking.emissions')}:</span> {(total / 1000000).toFixed(2)}M {t('kpi.metricsUnit')}
          </p>
        </div>
      </div>
    </div>
  );
}
