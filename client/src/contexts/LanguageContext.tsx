import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'it' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations object
const translations: Record<Language, Record<string, string>> = {
  it: {
    // Header
    'header.title': 'Roma Carbon Footprint Tracker',
    'header.subtitle': 'Monitoraggio delle emissioni CO₂ nei municipi di Roma',
    
    // KPI Cards
    'kpi.totalEmissions': 'Emissioni Totali',
    'kpi.bestMunicipality': 'Municipio Migliore',
    'kpi.worstMunicipality': 'Municipio Peggiore',
    'kpi.target2030': 'Obiettivo 2030',
    'kpi.metricsUnit': 't CO₂eq',
    'kpi.targetUnit': 't CO₂eq',
    'kpi.perCapita': 'Emissioni/ab',
    
    // Trend Chart
    'trend.title': 'Trend Storico Emissioni',
    'trend.subtitle': '2019-2025',
    'trend.emissions': 'Emissioni (Mt CO₂eq)',
    'trend.year': 'Anno',
    
    // Municipality Bars
    'municipalities.title': 'Emissioni per Municipio',
    'municipalities.subtitle': 'Barre colorate per sostenibilità (verde=basso, rosso=alto)',
    'municipalities.perCapita': 't/ab',
    'municipalities.selectDetail': 'Clicca per dettagli',
    
    // Global Breakdown
    'breakdown.title': 'Breakdown Globale per Fonte',
    'breakdown.traffic': 'Traffico',
    'breakdown.energy': 'Energia',
    'breakdown.industry': 'Industria',
    'breakdown.waste': 'Rifiuti',
    'breakdown.other': 'Altro',
    
    // Interactive Simulator
    'simulator.title': 'Simulatore di Riduzione Emissioni',
    'simulator.subtitle': 'Regola gli slider per simulare scenari di riduzione',
    'simulator.publicTransport': 'Incremento Trasporto Pubblico',
    'simulator.electricVehicles': 'Auto Elettriche',
    'simulator.renewables': 'Energie Rinnovabili',
    'simulator.thermalInsulation': 'Isolamento Termico',
    'simulator.industry': 'Riduzione Industria',
    'simulator.waste': 'Gestione Rifiuti',
    'simulator.currentEmissions': 'Emissioni Attuali',
    'simulator.projectedEmissions': 'Emissioni Stimate',
    'simulator.reduction': 'Riduzione',
    'simulator.note': 'Nota: anche con interventi massimi su trasporti ed energia, industria e rifiuti richiedono politiche strutturali separate. Il target 2030 è raggiungibile solo con un approccio integrato su tutti i settori.',
    
    // Sustainability Ranking
    'ranking.title': 'Classifica Sostenibilità Municipi',
    'ranking.subtitle': 'Score A/B/C/D basato su emissioni pro-capite (ISTAT 2023, ISPRA 2024)',
    'ranking.methodologyNote': 'Nota metodologica',
    'ranking.methodologyText': 'Dati stimati con downscaling basato su popolazione ISTAT 2023, mix settoriale ISPRA 2024 e caratteristiche urbanistiche per municipio. Non rappresentano dati ufficiali certificati.',
    'ranking.score': 'Score',
    'ranking.emissions': 'Emissioni',
    'ranking.perCapita': 't/ab',
    'ranking.population': 'Popolazione',
    'ranking.scoreA': 'Eccellente',
    'ranking.scoreB': 'Buono',
    'ranking.scoreC': 'Moderato',
    'ranking.scoreD': 'Critico',
    'ranking.unknown': 'Sconosciuto',
    'ranking.municipality': 'municipio',
    'ranking.municipalities': 'municipi',
    
    // Comparison Section
    'comparison.title': 'Confronta Municipi',
    'comparison.selectMunicipalities': 'Seleziona 2-3 municipi',
    'comparison.addMunicipality': 'Aggiungi',
    'comparison.removeMunicipality': 'Rimuovi',
    'comparison.export': 'Esporta',
    'comparison.exportPDF': 'PDF',
    'comparison.exportCSVFull': 'CSV - Confronto Completo',
    'comparison.exportCSVDetails': 'CSV - Dettagli Municipi',
    'comparison.exportCSVTrend': 'CSV - Trend Storico',
    'comparison.noMunicipalitiesSelected': 'Seleziona almeno 1 municipio',
    'comparison.totalEmissions': 'Emissioni Totali',
    'comparison.perCapitaEmissions': 'Emissioni Pro-Capite',
    
    // Advanced Filters
    'filters.title': 'Filtri Avanzati',
    'filters.year': 'Anno',
    'filters.emissionSource': 'Fonte Emissione',
    'filters.populationRange': 'Intervallo Popolazione',
    'filters.small': 'Piccoli (<100k)',
    'filters.medium': 'Medi (100k-300k)',
    'filters.large': 'Grandi (>300k)',
    'filters.custom': 'Personalizzato',
    'filters.apply': 'Applica Filtri',
    'filters.clear': 'Cancella Filtri',
    'filters.activeFilters': 'Filtri Attivi',
    
    // European Comparison
    'european.title': 'Roma nel Contesto Europeo',
    'european.subtitle': 'Confronto emissioni pro-capite con principali capitali europee',
    'european.position': 'Posizione Roma',
    'european.capitals': 'capitali europee analizzate',
    'european.gapFromBest': 'Gap dalla migliore',
    'european.comparedTo': 'rispetto a',
    'european.targetTop3': 'Obiettivo per top 3',
    'european.asParis': 'come Parigi',
    'european.city': 'Città',
    'european.emissions': 'Emissioni',
    'european.notes': 'Note',
    'european.methodologyNote': 'Nota metodologica',
    'european.methodologyText': 'Dati aggregati a livello città da CDP Cities, GLA London, Bilan Carbone Paris, Senatsverwaltung Berlin, Ayuntamiento Madrid, Stadt Wien, IBGE-BIM Bruxelles, Gemeente Amsterdam. Anni di riferimento 2022-2023. Non direttamente comparabili per differenze metodologiche tra città.',
    
    // Detail Panel
    'detail.title': 'Dettagli Municipio',
    'detail.backToMap': 'Torna indietro',
    'detail.population': 'Popolazione',
    'detail.totalEmissions': 'Emissioni Totali',
    'detail.perCapita': 'Pro-Capite',
    'detail.sustainabilityScore': 'Score Sostenibilità',
    'detail.emissionSources': 'Fonti di Emissione',
    'detail.breakdownChart': 'Distribuzione Emissioni',
    'detail.target2030': 'Obiettivo 2030',
    'detail.reductionNeeded': 'Riduzione Necessaria',
    
    // Footer
    'footer.information': 'Informazioni',
    'footer.informationText': 'Dati simulati basati su studi ambientali romani e statistiche ISTAT',
    'footer.objectives': 'Obiettivi',
    'footer.objectivesText': 'Raggiungere la neutralità carbonica entro il 2050 con riduzione del 55% entro il 2030',
    'footer.methodology': 'Metodologia',
    'footer.methodologyText': 'Analisi multi-settoriale: traffico, energia, industria, rifiuti',
    'footer.copyright': '© 2025 Roma Carbon Footprint Tracker • Dati aggiornati al 2025',
  },
  en: {
    // Header
    'header.title': 'Roma Carbon Footprint Tracker',
    'header.subtitle': 'CO₂ emissions monitoring across Rome municipalities',
    
    // KPI Cards
    'kpi.totalEmissions': 'Total Emissions',
    'kpi.bestMunicipality': 'Best Municipality',
    'kpi.worstMunicipality': 'Worst Municipality',
    'kpi.target2030': '2030 Target',
    'kpi.metricsUnit': 't CO₂eq',
    'kpi.targetUnit': 't CO₂eq',
    'kpi.perCapita': 'Emissions/ab',
    
    // Trend Chart
    'trend.title': 'Historical Emissions Trend',
    'trend.subtitle': '2019-2025',
    'trend.emissions': 'Emissions (Mt CO₂eq)',
    'trend.year': 'Year',
    
    // Municipality Bars
    'municipalities.title': 'Emissions by Municipality',
    'municipalities.subtitle': 'Color-coded bars for sustainability (green=low, red=high)',
    'municipalities.perCapita': 't/ab',
    'municipalities.selectDetail': 'Click for details',
    
    // Global Breakdown
    'breakdown.title': 'Global Breakdown by Source',
    'breakdown.traffic': 'Traffic',
    'breakdown.energy': 'Energy',
    'breakdown.industry': 'Industry',
    'breakdown.waste': 'Waste',
    'breakdown.other': 'Other',
    
    // Interactive Simulator
    'simulator.title': 'Emissions Reduction Simulator',
    'simulator.subtitle': 'Adjust sliders to simulate reduction scenarios',
    'simulator.publicTransport': 'Public Transport Increase',
    'simulator.electricVehicles': 'Electric Vehicles',
    'simulator.renewables': 'Renewable Energy',
    'simulator.thermalInsulation': 'Thermal Insulation',
    'simulator.industry': 'Industry Reduction',
    'simulator.waste': 'Waste Management',
    'simulator.currentEmissions': 'Current Emissions',
    'simulator.projectedEmissions': 'Projected Emissions',
    'simulator.reduction': 'Reduction',
    'simulator.note': 'Note: Even with maximum interventions on transport and energy, industry and waste require separate structural policies. The 2030 target is achievable only with an integrated approach across all sectors.',
    
    // Sustainability Ranking
    'ranking.title': 'Municipality Sustainability Ranking',
    'ranking.subtitle': 'Score A/B/C/D based on per-capita emissions (ISTAT 2023, ISPRA 2024)',
    'ranking.methodologyNote': 'Methodology Note',
    'ranking.methodologyText': 'Data estimated with downscaling based on ISTAT 2023 population, ISPRA 2024 sectoral mix and urban characteristics per municipality. Do not represent certified official data.',
    'ranking.score': 'Score',
    'ranking.emissions': 'Emissions',
    'ranking.perCapita': 't/ab',
    'ranking.population': 'Population',
    'ranking.scoreA': 'Excellent',
    'ranking.scoreB': 'Good',
    'ranking.scoreC': 'Medium',
    'ranking.scoreD': 'Critical',
    'ranking.unknown': 'Unknown',
    'ranking.municipality': 'municipality',
    'ranking.municipalities': 'municipalities',
    
    // Comparison Section
    'comparison.title': 'Compare Municipalities',
    'comparison.selectMunicipalities': 'Select 2-3 municipalities',
    'comparison.addMunicipality': 'Add',
    'comparison.removeMunicipality': 'Remove',
    'comparison.export': 'Export',
    'comparison.exportPDF': 'PDF',
    'comparison.exportCSVFull': 'CSV - Full Comparison',
    'comparison.exportCSVDetails': 'CSV - Municipality Details',
    'comparison.exportCSVTrend': 'CSV - Historical Trend',
    'comparison.noMunicipalitiesSelected': 'Select at least 1 municipality',
    'comparison.totalEmissions': 'Total Emissions',
    'comparison.perCapitaEmissions': 'Per-Capita Emissions',
    
    // Advanced Filters
    'filters.title': 'Advanced Filters',
    'filters.year': 'Year',
    'filters.emissionSource': 'Emission Source',
    'filters.populationRange': 'Population Range',
    'filters.small': 'Small (<100k)',
    'filters.medium': 'Medium (100k-300k)',
    'filters.large': 'Large (>300k)',
    'filters.custom': 'Custom',
    'filters.apply': 'Apply Filters',
    'filters.clear': 'Clear Filters',
    'filters.activeFilters': 'Active Filters',
    
    // European Comparison
    'european.title': 'Rome in European Context',
    'european.subtitle': 'Per-capita emissions comparison with major European capitals',
    'european.position': 'Rome Position',
    'european.capitals': 'European capitals analyzed',
    'european.gapFromBest': 'Gap from best',
    'european.comparedTo': 'compared to',
    'european.targetTop3': 'Target for top 3',
    'european.asParis': 'like Paris',
    'european.city': 'City',
    'european.emissions': 'Emissions',
    'european.notes': 'Notes',
    'european.methodologyNote': 'Methodology Note',
    'european.methodologyText': 'Data aggregated at city level from CDP Cities, GLA London, Bilan Carbone Paris, Senatsverwaltung Berlin, Ayuntamiento Madrid, Stadt Wien, IBGE-BIM Bruxelles, Gemeente Amsterdam. Reference years 2022-2023. Not directly comparable due to methodological differences between cities.',
    
    // Detail Panel
    'detail.title': 'Municipality Details',
    'detail.backToMap': 'Go back',
    'detail.population': 'Population',
    'detail.totalEmissions': 'Total Emissions',
    'detail.perCapita': 'Per-Capita',
    'detail.sustainabilityScore': 'Sustainability Score',
    'detail.emissionSources': 'Emission Sources',
    'detail.breakdownChart': 'Emissions Distribution',
    'detail.target2030': '2030 Target',
    'detail.reductionNeeded': 'Reduction Needed',
    
    // Footer
    'footer.information': 'Information',
    'footer.informationText': 'Simulated data based on Roman environmental studies and ISTAT statistics',
    'footer.objectives': 'Objectives',
    'footer.objectivesText': 'Achieve carbon neutrality by 2050 with 55% reduction by 2030',
    'footer.methodology': 'Methodology',
    'footer.methodologyText': 'Multi-sectoral analysis: traffic, energy, industry, waste',
    'footer.copyright': '© 2025 Roma Carbon Footprint Tracker • Data updated to 2025',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('it');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
