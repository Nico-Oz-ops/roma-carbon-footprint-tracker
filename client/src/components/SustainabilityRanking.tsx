/**
 * Sustainability Ranking Component
 * Design: Environmental Storytelling Dashboard
 * Shows sustainability score (A/B/C/D) for each municipality
 * Based on emissions per capita vs average
 */

import { municipalities, getSustainabilityScore } from "@/lib/carbonData";
import { useLanguage } from "@/contexts/LanguageContext";
import { Award, AlertTriangle, TrendingUp } from "lucide-react";

export default function SustainabilityRanking() {
  const { t } = useLanguage();
  // Sort municipalities by score
  const scoredMunicipalities = municipalities
    .map((m) => ({
      ...m,
      score: getSustainabilityScore(m),
    }))
    .sort((a, b) => {
      const scoreOrder = { A: 0, B: 1, C: 2, D: 3 };
      return scoreOrder[a.score as keyof typeof scoreOrder] - scoreOrder[b.score as keyof typeof scoreOrder];
    });

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

  const getScoreDescription = (score: string): string => {
    switch (score) {
      case "A":
        return t('ranking.scoreA');
      case "B":
        return t('ranking.scoreB');
      case "C":
        return t('ranking.scoreC');
      case "D":
        return t('ranking.scoreD');
      default:
        return t('ranking.unknown');
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

  // Group by score
  const groupedByScore = {
    A: scoredMunicipalities.filter((m) => m.score === "A"),
    B: scoredMunicipalities.filter((m) => m.score === "B"),
    C: scoredMunicipalities.filter((m) => m.score === "C"),
    D: scoredMunicipalities.filter((m) => m.score === "D"),
  };

  return (
    <div className="card-eco p-8 border border-green-200/30 slide-up">
      <div className="mb-8">
        <h3 className="text-2xl font-display font-bold text-foreground mb-2">
          {t('ranking.title')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('ranking.subtitle')}
        </p>
      </div>

      {/* Methodology Note */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200/30 rounded-lg">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong>{t('ranking.methodologyNote')}:</strong> {t('ranking.methodologyText')}
        </p>
      </div>

      <div className="space-y-6">
        {["A", "B", "C", "D"].map((score) => {
          const municipalities = groupedByScore[score as keyof typeof groupedByScore];

          if (municipalities.length === 0) return null;

          return (
            <div key={score} className="slide-up" style={{ animationDelay: `${(["A", "B", "C", "D"].indexOf(score)) * 50}ms` }}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`${getScoreColor(score)} w-10 h-10 rounded-full flex items-center justify-center`}>
                  <span className="text-white font-display font-bold text-lg">
                    {score}
                  </span>
                </div>
                <div>
                  <p className="font-heading font-semibold text-foreground">
                    {getScoreDescription(score)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {municipalities.length} {municipalities.length > 1 ? t('ranking.municipalities') : t('ranking.municipality')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {municipalities.map((municipality, index) => {
                  const emissionsPerCapita = municipality.emissionsCurrent / municipality.population;

                  return (
                    <div
                      key={municipality.id}
                      className={`${getScoreBgColor(score)} p-4 rounded-2xl border border-${score === "A" ? "emerald" : score === "B" ? "lime" : score === "C" ? "amber" : "orange"}-200/30 hover:shadow-md transition-shadow slide-up`}
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-heading font-semibold text-foreground">
                            {municipality.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Pop: {(municipality.population / 1000).toFixed(0)}k
                          </p>
                        </div>
                        <div className={`${getScoreColor(score)} w-8 h-8 rounded-full flex items-center justify-center`}>
                          <span className="text-white font-display font-bold text-sm">
                            {score}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-current border-opacity-10">
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground">
                            {t('kpi.perCapita')}
                          </p>
                          <p className="font-display font-bold text-foreground">
                            {emissionsPerCapita.toFixed(2)} t
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-green-200/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-display font-bold text-emerald-700">
              {groupedByScore.A.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{t('ranking.scoreA')} (A)</p>
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-lime-700">
              {groupedByScore.B.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{t('ranking.scoreB')} (B)</p>
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-amber-700">
              {groupedByScore.C.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{t('ranking.scoreC')} (C)</p>
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-orange-700">
              {groupedByScore.D.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{t('ranking.scoreD')} (D)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
