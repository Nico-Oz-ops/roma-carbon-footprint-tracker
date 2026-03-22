/**
 * Export Menu Component
 * Design: Environmental Storytelling Dashboard
 * Provides options to export comparison data in different formats
 */

import { useState } from "react";
import { Download, ChevronDown, FileText, Table } from "lucide-react";
import {
  generateComparisonPDF,
} from "@/lib/pdfExport";
import {
  generateComparisonCSV,
  generateDetailedMunicipalityCSV,
  generateHistoricalTrendCSV,
} from "@/lib/csvExport";

interface ExportMenuProps {
  municipalityIds: number[];
}

export default function ExportMenu({ municipalityIds }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<string | null>(null);

  const handleExport = async (type: string) => {
    setIsExporting(true);
    setExportType(type);

    try {
      switch (type) {
        case "pdf":
          await generateComparisonPDF(municipalityIds);
          break;
        case "csv-comparison":
          generateComparisonCSV(municipalityIds);
          break;
        case "csv-detailed":
          generateDetailedMunicipalityCSV(municipalityIds);
          break;
        case "csv-trend":
          generateHistoricalTrendCSV(municipalityIds);
          break;
      }
      setIsOpen(false);
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const exportOptions = [
    {
      id: "pdf",
      label: "Esporta come PDF",
      description: "Report formattato con grafici e tabelle",
      icon: FileText,
    },
    {
      id: "csv-comparison",
      label: "CSV - Confronto Completo",
      description: "Tabella comparativa con tutte le metriche",
      icon: Table,
    },
    {
      id: "csv-detailed",
      label: "CSV - Dettagli Municipi",
      description: "Una riga per municipio con tutti i dati",
      icon: Table,
    },
    {
      id: "csv-trend",
      label: "CSV - Trend Storico",
      description: "Dati storici 2019-2025 per analisi temporale",
      icon: Table,
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting || municipalityIds.length === 0}
        className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground font-heading font-semibold rounded-full hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="w-5 h-5" />
        {isExporting ? `Esportazione in corso...` : "Esporta Dati"}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-xl z-20 min-w-80 overflow-hidden">
          <div className="p-3 border-b border-border/50 bg-muted/30">
            <p className="text-xs font-heading font-semibold text-muted-foreground">
              Seleziona formato di esportazione
            </p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {exportOptions.map((option) => {
              const Icon = option.icon;
              const isLoading = isExporting && exportType === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => handleExport(option.id)}
                  disabled={isExporting}
                  className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border/30 last:border-b-0 flex items-start gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                      {isLoading ? "Generazione in corso..." : option.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {option.description}
                    </p>
                  </div>
                  {isLoading && (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-3 border-t border-border/50 bg-muted/30">
            <p className="text-xs text-muted-foreground">
              💡 I file CSV sono ideali per analisi approfondite in Excel o altri software
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
