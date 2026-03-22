/**
 * KPI Cards Component
 * Design: Environmental Storytelling Dashboard
 * Displays key performance indicators for Rome's carbon emissions
 * - Total emissions
 * - Best/worst municipality
 * - 2030 target
 */

import { getTotalEmissions, getEmissionsTarget2030, getBestMunicipality, getWorstMunicipality } from "@/lib/carbonData";
import { useLanguage } from "@/contexts/LanguageContext";
import { Leaf, TrendingDown, AlertCircle, Target } from "lucide-react";

export default function KPICards() {
  const { t } = useLanguage();
  const totalEmissions = getTotalEmissions();
  const target2030 = getEmissionsTarget2030();
  const bestMuni = getBestMunicipality();
  const worstMuni = getWorstMunicipality();
  const reductionNeeded = totalEmissions - target2030;
  const reductionPercentage = ((reductionNeeded / totalEmissions) * 100).toFixed(1);

  const formatNumber = (num: number) => {
    return (num / 1000).toFixed(0) + "k";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Emissions */}
      <div className="card-eco slide-up p-6 border border-green-200/30">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-heading text-muted-foreground mb-1">{t('kpi.totalEmissions')} 2025</p>
            <p className="text-3xl font-display font-bold text-foreground">
              {formatNumber(totalEmissions)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{t('kpi.metricsUnit')}</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <AlertCircle className="w-6 h-6 text-green-700" />
          </div>
        </div>
        <div className="pt-4 border-t border-green-200/30">
          <p className="text-xs text-muted-foreground">Trend: -1.2% vs 2024</p>
        </div>
      </div>

      {/* Best Municipality */}
      <div className="card-eco slide-up p-6 border border-emerald-200/30" style={{ animationDelay: "100ms" }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-heading text-muted-foreground mb-1">{t('kpi.bestMunicipality')}</p>
            <p className="text-2xl font-display font-bold text-foreground">
              {bestMuni.name}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {(bestMuni.emissionsCurrent / bestMuni.population).toFixed(2)} t/ab
            </p>
          </div>
          <div className="p-3 bg-emerald-100 rounded-full">
            <Leaf className="w-6 h-6 text-emerald-700" />
          </div>
        </div>
        <div className="pt-4 border-t border-emerald-200/30">
          <p className="text-xs text-muted-foreground">{t('detail.perCapita')}</p>
        </div>
      </div>

      {/* Worst Municipality */}
      <div className="card-eco slide-up p-6 border border-orange-200/30" style={{ animationDelay: "200ms" }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-heading text-muted-foreground mb-1">{t('kpi.worstMunicipality')}</p>
            <p className="text-2xl font-display font-bold text-foreground">
              {worstMuni.name}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {(worstMuni.emissionsCurrent / worstMuni.population).toFixed(2)} t/ab
            </p>
          </div>
          <div className="p-3 bg-orange-100 rounded-full">
            <AlertCircle className="w-6 h-6 text-orange-700" />
          </div>
        </div>
        <div className="pt-4 border-t border-orange-200/30">
          <p className="text-xs text-muted-foreground">{t('detail.perCapita')}</p>
        </div>
      </div>

      {/* 2030 Target */}
      <div className="card-eco slide-up p-6 border border-blue-200/30" style={{ animationDelay: "300ms" }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-heading text-muted-foreground mb-1">{t('kpi.target2030')}</p>
            <p className="text-3xl font-display font-bold text-foreground">
              {reductionPercentage}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">{t('detail.reductionNeeded')}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <Target className="w-6 h-6 text-blue-700" />
          </div>
        </div>
        <div className="pt-4 border-t border-blue-200/30">
          <p className="text-xs text-muted-foreground">
            Da {formatNumber(totalEmissions)} a {formatNumber(target2030)}
          </p>
        </div>
      </div>
    </div>
  );
}
