/**
 * European Comparison Component
 * Design: Environmental Storytelling Dashboard
 * Compares Rome's CO2 emissions with major European capitals
 */

import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Globe, TrendingDown, Target } from "lucide-react";

interface CityData {
  name: string;
  emissions: number;
  notes: string;
  isRoma: boolean;
}

const EUROPEAN_CITIES: CityData[] = [
  { name: "Londra", emissions: 2.6, notes: "Congestion charge, ULEZ attiva", isRoma: false },
  { name: "Amsterdam", emissions: 2.8, notes: "Molto ciclabile, energia verde", isRoma: false },
  { name: "Parigi", emissions: 3.1, notes: "Metro esteso, ZFE attiva", isRoma: false },
  { name: "Roma", emissions: 3.2, notes: "Media stimata municipale", isRoma: true },
  { name: "Vienna", emissions: 3.3, notes: "Ottimi trasporti pubblici", isRoma: false },
  { name: "Berlino", emissions: 3.9, notes: "Industria presente", isRoma: false },
  { name: "Madrid", emissions: 4.1, notes: "Alta dipendenza auto", isRoma: false },
  { name: "Bruxelles", emissions: 4.4, notes: "Centro istituzionale EU", isRoma: false },
];

export default function EuropeanComparison() {
  const { t } = useLanguage();
  const chartData = useMemo(() => {
    return EUROPEAN_CITIES.sort((a, b) => a.emissions - b.emissions).map((city) => ({
      name: city.name,
      "t CO₂eq/ab": city.emissions,
      isRoma: city.isRoma,
    }));
  }, []);

  const romaData = EUROPEAN_CITIES.find((c) => c.isRoma)!;
  const bestCity = EUROPEAN_CITIES.reduce((best, city) =>
    city.emissions < best.emissions ? city : best
  );
  const romaPosition = EUROPEAN_CITIES.filter((c) => c.emissions < romaData.emissions).length + 1;
  const gapFromBest = (romaData.emissions - bestCity.emissions).toFixed(1);
  const targetEmissions = 3.1; // Parigi

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const cityInfo = EUROPEAN_CITIES.find((c) => c.name === data.name);
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-blue-200/30">
          <p className="font-heading font-semibold text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data["t CO₂eq/ab"]} t CO₂eq/ab
          </p>
          {cityInfo && (
            <p className="text-xs text-muted-foreground mt-1">{cityInfo.notes}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card-eco p-8 border border-blue-200/30 slide-up space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-full">
          <Globe className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-2xl font-display font-bold text-foreground">
            {t('european.title')}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t('european.subtitle')}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200/30">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" stroke="#6b7280" />
            <YAxis dataKey="name" type="category" stroke="#6b7280" width={110} />
            <Tooltip content={customTooltip} />
            <Bar
              dataKey="t CO₂eq/ab"
              fill="#3b82f6"
              radius={[0, 8, 8, 0]}
              shape={
                <BarShape />
              }
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Position */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-200/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 bg-amber-500 rounded-full" />
            <p className="text-sm font-heading font-semibold text-muted-foreground">
              {t('european.position')}
            </p>
          </div>
          <p className="text-3xl font-display font-bold text-amber-700">
            {romaPosition}ª su 8
          </p>
            <p className="text-xs text-muted-foreground mt-2">
              {t('european.capitals')}
            </p>
        </div>

        {/* Gap from best */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-lg border border-red-200/30">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-600" />
            <p className="text-sm font-heading font-semibold text-muted-foreground">
              {t('european.gapFromBest')}
            </p>
          </div>
          <p className="text-3xl font-display font-bold text-red-700">
            +{gapFromBest} t/ab
          </p>
            <p className="text-xs text-muted-foreground mt-2">
              {t('european.comparedTo')} {bestCity.name}
            </p>
        </div>

        {/* Target */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200/30">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-600" />
            <p className="text-sm font-heading font-semibold text-muted-foreground">
              {t('european.targetTop3')}
            </p>
          </div>
          <p className="text-3xl font-display font-bold text-green-700">
            {targetEmissions} t/ab
          </p>
            <p className="text-xs text-muted-foreground mt-2">
              {t('european.asParis')} (reduction -{(romaData.emissions - targetEmissions).toFixed(1)} t/ab)
            </p>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-blue-200/30">
              <th className="text-left py-3 px-4 font-heading font-semibold text-foreground">
                {t('european.city')}
              </th>
              <th className="text-right py-3 px-4 font-heading font-semibold text-foreground">
                t CO₂eq/ab
              </th>
              <th className="text-left py-3 px-4 font-heading font-semibold text-foreground">
                {t('european.notes')}
              </th>
            </tr>
          </thead>
          <tbody>
            {EUROPEAN_CITIES.sort((a, b) => a.emissions - b.emissions).map((city, idx) => (
              <tr
                key={city.name}
                className={`border-b border-blue-200/20 transition-colors ${
                  city.isRoma
                    ? "bg-blue-50/50 hover:bg-blue-100/50"
                    : "hover:bg-muted/30"
                }`}
              >
                <td className={`py-3 px-4 font-heading font-semibold ${
                  city.isRoma ? "text-primary" : "text-foreground"
                }`}>
                  {idx + 1}. {city.name}
                  {city.isRoma && (
                    <span className="ml-2 inline-block px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded">
                      🏠 Roma
                    </span>
                  )}
                </td>
                <td className={`text-right py-3 px-4 font-display font-bold ${
                  city.isRoma ? "text-primary" : "text-foreground"
                }`}>
                  {city.emissions}
                </td>
                <td className="py-3 px-4 text-muted-foreground">{city.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Methodology Note */}
      <div className="p-4 bg-blue-50 border border-blue-200/30 rounded-lg space-y-2">
        <p className="text-xs font-heading font-semibold text-foreground">{t('european.methodologyNote')}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t('european.methodologyText')}
        </p>
      </div>
    </div>
  );
}

// Custom Bar component to color Roma differently
function BarShape(props: any) {
  const { fill, x, y, width, height, payload } = props;
  const isRoma = payload.name === "Roma";
  const barColor = isRoma ? "#3b82f6" : "#94a3b8";
  const romaColor = "#0284c7";

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={isRoma ? romaColor : barColor}
      rx={4}
    />
  );
}
