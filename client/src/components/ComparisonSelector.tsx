/**
 * Comparison Selector Component
 * Design: Environmental Storytelling Dashboard
 * Allows users to select 2-3 municipalities for side-by-side comparison
 */

import { municipalities } from "@/lib/carbonData";
import { X, Plus } from "lucide-react";
import { useState } from "react";

interface ComparisonSelectorProps {
  selectedMunicipalities: number[];
  onSelectionChange: (ids: number[]) => void;
}

export default function ComparisonSelector({
  selectedMunicipalities,
  onSelectionChange,
}: ComparisonSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddMunicipality = (id: number) => {
    if (selectedMunicipalities.length < 3 && !selectedMunicipalities.includes(id)) {
      onSelectionChange([...selectedMunicipalities, id]);
    }
  };

  const handleRemoveMunicipality = (id: number) => {
    onSelectionChange(selectedMunicipalities.filter((m) => m !== id));
  };

  const selectedMunis = municipalities.filter((m) =>
    selectedMunicipalities.includes(m.id)
  );

  const availableMunis = municipalities.filter(
    (m) => !selectedMunicipalities.includes(m.id)
  );

  return (
    <div className="card-eco p-6 border border-blue-200/30 slide-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-display font-bold text-foreground">
            Confronta Municipi
          </h3>
          <p className="text-sm text-muted-foreground">
            Seleziona 2-3 municipi per visualizzare i dati affiancati
          </p>
        </div>
        <div className="text-sm font-heading font-semibold text-muted-foreground">
          {selectedMunicipalities.length}/3
        </div>
      </div>

      {/* Selected Municipalities */}
      <div className="mb-4">
        {selectedMunis.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {selectedMunis.map((muni) => (
              <div
                key={muni.id}
                className="p-3 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-between"
              >
                <span className="font-heading font-semibold text-foreground">
                  {muni.name}
                </span>
                <button
                  onClick={() => handleRemoveMunicipality(muni.id)}
                  className="p-1 hover:bg-primary/20 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-primary" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Nessun municipio selezionato
          </p>
        )}
      </div>

      {/* Dropdown to add municipalities */}
      {selectedMunicipalities.length < 3 && (
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg border border-border flex items-center justify-between transition-colors"
          >
            <span className="text-sm font-heading text-foreground">
              + Aggiungi municipio
            </span>
            <Plus className="w-4 h-4 text-muted-foreground" />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
              {availableMunis.map((muni) => (
                <button
                  key={muni.id}
                  onClick={() => {
                    handleAddMunicipality(muni.id);
                    if (selectedMunicipalities.length + 1 === 3) {
                      setIsOpen(false);
                    }
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border/50 last:border-b-0 flex items-center justify-between group"
                >
                  <div>
                    <p className="font-heading font-semibold text-foreground group-hover:text-primary">
                      {muni.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(muni.emissionsCurrent / 1000).toFixed(0)}k tonnellate
                    </p>
                  </div>
                  <Plus className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Clear all button */}
      {selectedMunicipalities.length > 0 && (
        <button
          onClick={() => onSelectionChange([])}
          className="mt-4 w-full px-4 py-2 text-sm font-heading text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg hover:bg-muted/50"
        >
          Cancella selezione
        </button>
      )}
    </div>
  );
}
