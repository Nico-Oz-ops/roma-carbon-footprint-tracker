/**
 * Bubble Map Filters Component
 * Design: Environmental Storytelling Dashboard
 * Allows filtering municipalities by sustainability score (A/B/C/D)
 */

import { CheckCircle2, Circle } from "lucide-react";

interface BubbleMapFiltersProps {
  visibleScores: Set<string>;
  onToggleScore: (score: string) => void;
}

export default function BubbleMapFilters({
  visibleScores,
  onToggleScore,
}: BubbleMapFiltersProps) {
  const scores = [
    {
      label: "A — Eccellente",
      value: "A",
      color: "#22c55e",
      description: "< 2.5 t/ab",
    },
    {
      label: "B — Buono",
      value: "B",
      color: "#bfef45",
      description: "2.5–3.2 t/ab",
    },
    {
      label: "C — Moderato",
      value: "C",
      color: "#f59e0b",
      description: "3.2–4.0 t/ab",
    },
    {
      label: "D — Critico",
      value: "D",
      color: "#ef4444",
      description: "> 4.0 t/ab",
    },
  ];

  const handleSelectAll = () => {
    if (visibleScores.size === 4) {
      // Deselect all
      visibleScores.forEach((score) => onToggleScore(score));
    } else {
      // Select all
      scores.forEach((score) => {
        if (!visibleScores.has(score.value)) {
          onToggleScore(score.value);
        }
      });
    }
  };

  return (
    <div className="card-eco p-6 border border-blue-200/30 rounded-lg slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display font-bold text-foreground">
          Filtra per Score
        </h3>
        <button
          onClick={handleSelectAll}
          className="text-xs font-heading font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          {visibleScores.size === 4 ? "Deseleziona tutto" : "Seleziona tutto"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {scores.map((score) => {
          const isVisible = visibleScores.has(score.value);

          return (
            <button
              key={score.value}
              onClick={() => onToggleScore(score.value)}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 ${
                isVisible
                  ? "border-current bg-opacity-10"
                  : "border-border bg-muted/30 opacity-50 hover:opacity-70"
              }`}
              style={
                isVisible
                  ? {
                      borderColor: score.color,
                      backgroundColor: `${score.color}15`,
                    }
                  : {}
              }
            >
              <div className="flex-shrink-0">
                {isVisible ? (
                  <CheckCircle2
                    className="w-5 h-5"
                    style={{ color: score.color }}
                  />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 text-left">
                <p
                  className="text-sm font-heading font-semibold"
                  style={isVisible ? { color: score.color } : {}}
                >
                  {score.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {score.description}
                </p>
              </div>

              {isVisible && (
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: score.color }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200/30 rounded-lg">
        <p className="text-xs text-muted-foreground">
          <strong>Mostrando:</strong> {visibleScores.size} di 4 categorie
          ({Array.from(visibleScores).sort().join(", ") || "nessuna"})
        </p>
      </div>
    </div>
  );
}
