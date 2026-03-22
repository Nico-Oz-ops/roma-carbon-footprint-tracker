/**
 * Trend Chart Component
 * Design: Environmental Storytelling Dashboard
 * Shows historical emissions trend from 2019 to 2025
 * with animated line chart
 */

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useLanguage } from "@/contexts/LanguageContext";
import { getHistoricalTrendData } from "@/lib/carbonData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function TrendChart() {
  const { t } = useLanguage();
  const trendData = getHistoricalTrendData();

  const data = {
    labels: trendData.years.map((year) => year.toString()),
    datasets: [
      {
        label: t('trend.emissions'),
        data: trendData.totals,
        borderColor: "oklch(0.42 0.12 142)", // Forest Green
        backgroundColor: "oklch(0.42 0.12 142 / 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "oklch(0.42 0.12 142)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          font: {
            family: "'Poppins', sans-serif",
            size: 13,
            weight: 500 as any,
          },
          color: "oklch(0.25 0.02 65)",
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "oklch(0.25 0.02 65)",
        titleFont: {
          family: "'Playfair Display', serif",
          size: 14,
          weight: "bold" as any,
        },
        bodyFont: {
          family: "'Open Sans', sans-serif",
          size: 12,
        } as any,
        padding: 12,
        borderColor: "oklch(0.42 0.12 142)",
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            const value = context.parsed.y;
            return `${(value / 1000000).toFixed(2)}M ${t('kpi.metricsUnit')}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: "oklch(0.92 0.004 286.32 / 0.5)",
          drawBorder: false,
        },
        ticks: {
          font: {
            family: "'Open Sans', sans-serif",
            size: 11,
          },
          color: "oklch(0.55 0.016 285.938)",
          callback: function (value: any) {
            return (value / 1000000).toFixed(1) + "M";
          },
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: {
            family: "'Open Sans', sans-serif",
            size: 11,
          },
          color: "oklch(0.55 0.016 285.938)",
        },
      },
    },
  };

  return (
    <div className="card-eco p-8 border border-green-200/30 slide-up">
      <div className="mb-6">
        <h3 className="text-2xl font-display font-bold text-foreground mb-2">
          {t('trend.title')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('trend.subtitle')}
        </p>
      </div>
      <div className="relative h-80">
        <Line data={data} options={options} />
      </div>
      <div className="mt-6 pt-6 border-t border-green-200/30">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">2019 (Baseline)</p>
            <p className="text-lg font-display font-bold text-foreground">
              {(trendData.totals[0] / 1000000).toFixed(2)}M
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">2025 (Current)</p>
            <p className="text-lg font-display font-bold text-foreground">
              {(trendData.totals[6] / 1000000).toFixed(2)}M
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">{t('simulator.reduction')}</p>
            <p className="text-lg font-display font-bold text-green-700">
              {(((trendData.totals[0] - trendData.totals[6]) / trendData.totals[0]) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
