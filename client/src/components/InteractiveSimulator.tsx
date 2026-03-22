/**
 * Interactive Simulator Component
 * Design: Environmental Storytelling Dashboard
 * Allows users to adjust parameters and see projected emission reductions
 * - Public transit increase
 * - Electric vehicles increase
 * - Renewable energy increase
 * - Thermal insulation improvement
 */

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { calculateSimulatorProjection } from "@/lib/carbonData";
import { Zap, Leaf, Wind, Home } from "lucide-react";

export default function InteractiveSimulator() {
  const { t } = useLanguage();
  const [publicTransit, setPublicTransit] = useState(20);
  const [electricVehicles, setElectricVehicles] = useState(15);
  const [renewables, setRenewables] = useState(25);
  const [thermalInsulation, setThermalInsulation] = useState(10);
  const [industry, setIndustry] = useState(0);
  const [waste, setWaste] = useState(0);

  const projection = calculateSimulatorProjection(
    publicTransit,
    electricVehicles,
    renewables,
    thermalInsulation,
    industry,
    waste
  );

  const sliders = [
    {
      label: t('simulator.publicTransport'),
      value: publicTransit,
      onChange: setPublicTransit,
      icon: "🚌",
      description: "Incremento utilizzo trasporto pubblico",
      color: "from-blue-500 to-blue-600",
    },
    {
      label: t('simulator.electricVehicles'),
      value: electricVehicles,
      onChange: setElectricVehicles,
      icon: "🔋",
      description: "Percentuale di auto elettriche",
      color: "from-green-500 to-green-600",
    },
    {
      label: t('simulator.renewables'),
      value: renewables,
      onChange: setRenewables,
      icon: "☀️",
      description: "Incremento energia da fonti rinnovabili",
      color: "from-amber-500 to-amber-600",
    },
    {
      label: t('simulator.thermalInsulation'),
      value: thermalInsulation,
      onChange: setThermalInsulation,
      icon: "🏠",
      description: "Miglioramento isolamento edifici",
      color: "from-orange-500 to-orange-600",
    },
    {
      label: t('simulator.industry'),
      value: industry,
      onChange: setIndustry,
      icon: "🏭",
      description: "Impatto max 8% delle emissioni industriali",
      color: "from-purple-500 to-purple-600",
    },
    {
      label: t('simulator.waste'),
      value: waste,
      onChange: setWaste,
      icon: "♻️",
      description: "Impatto max 5% delle emissioni da rifiuti",
      color: "from-teal-500 to-teal-600",
    },
  ];

  return (
    <div className="card-eco p-8 border border-blue-200/30 slide-up">
      <div className="mb-8">
        <h3 className="text-2xl font-display font-bold text-foreground mb-2">
          {t('simulator.title')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('simulator.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sliders */}
        <div className="space-y-6">
          {sliders.map((slider, index) => (
            <div
              key={slider.label}
              className="slide-up p-5 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{slider.icon}</span>
                  <div>
                    <p className="font-heading font-semibold text-foreground">
                      {slider.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {slider.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-primary text-lg">
                    {slider.value}%
                  </p>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={slider.value}
                onChange={(e) => slider.onChange(parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
              />

              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Current Emissions */}
          <div className="slide-up p-6 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-200/30" style={{ animationDelay: "50ms" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-200 rounded-full">
                <AlertCircle className="w-5 h-5 text-red-700" />
              </div>
              <p className="font-heading font-semibold text-foreground">
                {t('simulator.currentEmissions')}
              </p>
            </div>
            <p className="text-3xl font-display font-bold text-red-700">
              {(projection.currentEmissions / 1000000).toFixed(2)}M
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('kpi.metricsUnit')}
            </p>
          </div>

          {/* Projected Emissions */}
          <div className="slide-up p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/30" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-200 rounded-full">
                <TrendingDown className="w-5 h-5 text-green-700" />
              </div>
              <p className="font-heading font-semibold text-foreground">
                {t('simulator.projectedEmissions')}
              </p>
            </div>
            <p className="text-3xl font-display font-bold text-green-700">
              {(projection.projectedEmissions / 1000000).toFixed(2)}M
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('kpi.metricsUnit')}
            </p>
          </div>

          {/* Reduction */}
          <div className="slide-up p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/30" style={{ animationDelay: "150ms" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-200 rounded-full">
                <Leaf className="w-5 h-5 text-blue-700" />
              </div>
              <p className="font-heading font-semibold text-foreground">
                {t('simulator.reduction')}
              </p>
            </div>
            <p className="text-3xl font-display font-bold text-blue-700">
              {projection.reductionPercentage.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {(projection.reduction / 1000000).toFixed(2)}M {t('kpi.metricsUnit')}
            </p>
          </div>

          {/* Comparison with 2030 Target */}
          <div className="slide-up p-6 rounded-2xl bg-muted/50 border border-primary/20" style={{ animationDelay: "200ms" }}>
            <p className="font-heading font-semibold text-foreground mb-3">
              {t('kpi.target2030')}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Proiezione attuale:</span>
                <span className="font-display font-bold text-foreground">
                  {(projection.projectedEmissions / 1000000).toFixed(2)}M
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Obiettivo 2030:</span>
                <span className="font-display font-bold text-foreground">
                  ~2.60M
                </span>
              </div>
              <div className="pt-2 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Gap:</span>
                  <span className={`font-display font-bold ${
                    projection.projectedEmissions <= 2600000
                      ? "text-green-700"
                      : "text-orange-700"
                  }`}>
                    {projection.projectedEmissions <= 2600000
                      ? "✓ Raggiungibile"
                      : `${((projection.projectedEmissions - 2600000) / 1000000).toFixed(2)}M da ridurre`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <div className="mt-8 pt-6 border-t border-blue-200/30 flex justify-center mb-8">
        <button
          onClick={() => {
            setPublicTransit(20);
            setElectricVehicles(15);
            setRenewables(25);
            setThermalInsulation(10);
            setIndustry(0);
            setWaste(0);
          }}
          className="px-6 py-2 bg-primary text-primary-foreground font-heading font-semibold rounded-full hover:shadow-lg transition-all duration-300"
        >
          {t('filters.clear')}
        </button>
      </div>

      {/* Explanatory Note */}
      <div className="p-5 bg-amber-50 border border-amber-200/30 rounded-lg">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Note:</strong> {t('simulator.note')}
        </p>
      </div>
    </div>
  );
}

// Import icons
import { AlertCircle, TrendingDown } from "lucide-react";
