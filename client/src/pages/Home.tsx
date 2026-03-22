/**
 * Home Page - Roma Carbon Footprint Tracker
 * Design: Environmental Storytelling Dashboard
 * 
 * Main dashboard showing:
 * - KPI cards
 * - Historical trend chart
 * - Municipality emissions bars
 * - Global breakdown
 * - Interactive simulator
 * - Sustainability ranking
 * - Detail panel for selected municipality
 */

import { useState } from "react";
import KPICards from "@/components/KPICards";
import TrendChart from "@/components/TrendChart";
import MunicipalityBars from "@/components/MunicipalityBars";
import GlobalBreakdown from "@/components/GlobalBreakdown";
import InteractiveSimulator from "@/components/InteractiveSimulator";
import SustainabilityRanking from "@/components/SustainabilityRanking";
import MunicipalityDetailPanel from "@/components/MunicipalityDetailPanel";
import ComparisonSelector from "@/components/ComparisonSelector";
import ComparisonPanel from "@/components/ComparisonPanel";
import AdvancedFilters from "@/components/AdvancedFilters";
import FilteredDataView from "@/components/FilteredDataView";
import EuropeanComparison from "@/components/EuropeanComparison";
import LanguageSelector from "@/components/LanguageSelector";
import { Leaf } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { FilterOptions } from "@/lib/filterUtils";

export default function Home() {
  const { t } = useLanguage();
  const [selectedMunicipalityId, setSelectedMunicipalityId] = useState<number | null>(null);
  const [comparisonMunicipalities, setComparisonMunicipalities] = useState<number[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState<FilterOptions>({});

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-200/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-full">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-display font-bold text-foreground">
                {t('header.title')}
              </h1>
            </div>
            <LanguageSelector />
          </div>
          <p className="text-muted-foreground ml-11">
            {t('header.subtitle')}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* KPI Cards */}
        <section>
          <KPICards />
        </section>

        {/* Trend Chart */}
        <section>
          <TrendChart />
        </section>



        {/* Municipality Bars */}
        <section>
          <MunicipalityBars onSelectMunicipality={setSelectedMunicipalityId} />
        </section>

        {/* Global Breakdown */}
        <section>
          <GlobalBreakdown />
        </section>

        {/* Interactive Simulator */}
        <section>
          <InteractiveSimulator />
        </section>

        {/* Sustainability Ranking */}
        <section>
          <SustainabilityRanking />
        </section>

        {/* Comparison Section */}
        <section>
          <div className="space-y-8">
            <ComparisonSelector
              selectedMunicipalities={comparisonMunicipalities}
              onSelectionChange={setComparisonMunicipalities}
            />
            {comparisonMunicipalities.length > 0 && (
              <ComparisonPanel municipalityIds={comparisonMunicipalities} />
            )}
          </div>
        </section>

        {/* Advanced Filters Section */}
        <section>
          <div className="space-y-8">
            <AdvancedFilters
              onFiltersChange={setAdvancedFilters}
              initialFilters={advancedFilters}
            />
            <FilteredDataView filters={advancedFilters} />
          </div>
        </section>

        {/* European Comparison Section */}
        <section>
          <EuropeanComparison />
        </section>
      </main>

      {/* Municipality Detail Panel */}
      <MunicipalityDetailPanel
        municipalityId={selectedMunicipalityId}
        onClose={() => setSelectedMunicipalityId(null)}
      />

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-heading font-semibold text-foreground mb-2">
                {t('footer.information')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t('footer.informationText')}
              </p>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-foreground mb-2">
                {t('footer.objectives')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t('footer.objectivesText')}
              </p>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-foreground mb-2">
                {t('footer.methodology')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t('footer.methodologyText')}
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </footer>

      {/* Detail Panel */}
      {selectedMunicipalityId && (
        <MunicipalityDetailPanel
          municipalityId={selectedMunicipalityId}
          onClose={() => setSelectedMunicipalityId(null)}
        />
      )}


    </div>
  );
}
