# Roma Carbon Footprint Tracker

## 🇮🇹 Italiano

### Descrizione del Progetto

**Roma Carbon Footprint Tracker** è una dashboard interattiva per il monitoraggio e l'analisi delle emissioni di CO₂ nei 15 municipi di Roma. L'applicazione consente di visualizzare dati ambientali dettagliati, simulare scenari di riduzione delle emissioni e confrontare la sostenibilità tra diversi municipi e capitali europee.

### Caratteristiche Principali

- **Dashboard Completa**: KPI principali, trend storico 2019-2025, emissioni per municipio
- **Breakdown Settoriale**: Visualizzazione delle emissioni per fonte (traffico, energia, industria, rifiuti, altro)
- **Simulatore Interattivo**: Slider per simulare scenari di riduzione con 6 parametri controllabili
- **Classifica Sostenibilità**: Score A/B/C/D per ogni municipio basato su emissioni pro-capite
- **Confronto Municipi**: Seleziona 2-3 municipi per visualizzare dati affiancati con esportazione PDF/CSV
- **Filtri Avanzati**: Filtra per anno, fonte di emissione e intervallo di popolazione
- **Confronto Europeo**: Analisi comparativa con 8 capitali europee (Londra, Amsterdam, Parigi, Vienna, Berlino, Madrid, Bruxelles)
- **Supporto Multilingue**: Italiano e inglese con selettore di lingua in tempo reale

### Tecnologie Utilizzate

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Grafici**: Chart.js con integrazione React
- **Mappe**: Leaflet per visualizzazioni geografiche
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Esportazione**: jsPDF per report PDF, CSV nativo
- **State Management**: React Context API

### Metodologia dei Dati

I dati sono stimati mediante **downscaling** da fonti ufficiali:

- **Popolazione**: ISTAT 2023 (dati ufficiali per i 15 municipi)
- **Mix Settoriale**: ISPRA 2024 (Istituto Superiore per la Protezione e la Ricerca Ambientale)
- **Caratteristiche Urbanistiche**: Analisi per municipio basata su:
  - Densità abitativa
  - Infrastrutture di trasporto pubblico
  - Presenza di industria
  - Gestione rifiuti locale

**Nota**: I dati non rappresentano valori ufficiali certificati, ma stime metodologicamente coerenti basate su fonti pubbliche verificate.

### Link al Sito Pubblicato

🌐 **https://romacarbon-bxdwkeh5.manus.space**

### Installazione e Esecuzione in Locale

#### Prerequisiti

- Node.js 22.13.0 o superiore
- pnpm 10.4.1 o superiore

#### Passaggi di Installazione

1. **Clona il repository**
   ```bash
   git clone https://github.com/yourusername/roma-carbon-tracker.git
   cd roma-carbon-tracker
   ```

2. **Installa le dipendenze**
   ```bash
   pnpm install
   ```

3. **Avvia il server di sviluppo**
   ```bash
   pnpm run dev
   ```
   L'applicazione sarà disponibile su `http://localhost:3000`

4. **Build di produzione**
   ```bash
   pnpm run build
   ```

5. **Anteprima della build**
   ```bash
   pnpm run preview
   ```

#### Comandi Disponibili

- `pnpm run dev` - Avvia il server di sviluppo con hot reload
- `pnpm run build` - Crea la build di produzione
- `pnpm run preview` - Visualizza l'anteprima della build
- `pnpm run check` - Verifica gli errori TypeScript
- `pnpm run format` - Formatta il codice con Prettier

### Struttura del Progetto

```
roma-carbon-tracker/
├── client/
│   ├── public/              # File statici
│   ├── src/
│   │   ├── components/      # Componenti React
│   │   ├── contexts/        # Context API (Lingua, Tema)
│   │   ├── lib/             # Utility e dati
│   │   ├── pages/           # Pagine principali
│   │   ├── App.tsx          # Componente root
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Stili globali
│   └── index.html
├── server/                  # Backend placeholder
├── package.json
└── README.md
```

### Componenti Principali

- **KPICards**: Metriche principali (emissioni totali, municipio migliore/peggiore, obiettivo 2030)
- **TrendChart**: Grafico trend storico 2019-2025
- **MunicipalityBars**: Barre colorate per emissioni per municipio
- **GlobalBreakdown**: Donut chart breakdown per fonte
- **InteractiveSimulator**: Simulatore con 6 slider
- **SustainabilityRanking**: Classifica A/B/C/D
- **ComparisonPanel**: Confronto tra municipi
- **EuropeanComparison**: Confronto con capitali europee
- **AdvancedFilters**: Filtri per anno, fonte, popolazione

### Licenza

MIT

### Contatti e Contributi

Per domande, segnalazioni di bug o contributi, apri una issue o una pull request nel repository.

---

## 🇬🇧 English

### Project Description

**Roma Carbon Footprint Tracker** is an interactive dashboard for monitoring and analyzing CO₂ emissions across Rome's 15 municipalities. The application enables detailed environmental data visualization, emission reduction scenario simulation, and sustainability comparison between different municipalities and European capitals.

### Key Features

- **Complete Dashboard**: Main KPIs, historical trend 2019-2025, emissions by municipality
- **Sectoral Breakdown**: Emissions visualization by source (traffic, energy, industry, waste, other)
- **Interactive Simulator**: Sliders to simulate reduction scenarios with 6 controllable parameters
- **Sustainability Ranking**: Score A/B/C/D for each municipality based on per-capita emissions
- **Municipality Comparison**: Select 2-3 municipalities to view side-by-side data with PDF/CSV export
- **Advanced Filters**: Filter by year, emission source, and population range
- **European Comparison**: Comparative analysis with 8 European capitals (London, Amsterdam, Paris, Vienna, Berlin, Madrid, Brussels)
- **Multilingual Support**: Italian and English with real-time language selector

### Technologies Used

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Charts**: Chart.js with React integration
- **Maps**: Leaflet for geographic visualizations
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Export**: jsPDF for PDF reports, native CSV
- **State Management**: React Context API

### Data Methodology

Data is estimated through **downscaling** from official sources:

- **Population**: ISTAT 2023 (official data for 15 municipalities)
- **Sectoral Mix**: ISPRA 2024 (Italian Institute for Environmental Protection and Research)
- **Urban Characteristics**: Per-municipality analysis based on:
  - Population density
  - Public transport infrastructure
  - Industrial presence
  - Local waste management

**Note**: Data does not represent certified official values, but methodologically consistent estimates based on verified public sources.

### Published Website Link

🌐 **https://romacarbon-bxdwkeh5.manus.space**

### Installation and Local Execution

#### Prerequisites

- Node.js 22.13.0 or higher
- pnpm 10.4.1 or higher

#### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/roma-carbon-tracker.git
   cd roma-carbon-tracker
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm run dev
   ```
   The application will be available at `http://localhost:3000`

4. **Production build**
   ```bash
   pnpm run build
   ```

5. **Preview the build**
   ```bash
   pnpm run preview
   ```

#### Available Commands

- `pnpm run dev` - Start development server with hot reload
- `pnpm run build` - Create production build
- `pnpm run preview` - Preview the build
- `pnpm run check` - Check TypeScript errors
- `pnpm run format` - Format code with Prettier

### Project Structure

```
roma-carbon-tracker/
├── client/
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # Context API (Language, Theme)
│   │   ├── lib/             # Utilities and data
│   │   ├── pages/           # Main pages
│   │   ├── App.tsx          # Root component
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Global styles
│   └── index.html
├── server/                  # Backend placeholder
├── package.json
└── README.md
```

### Main Components

- **KPICards**: Main metrics (total emissions, best/worst municipality, 2030 target)
- **TrendChart**: Historical trend chart 2019-2025
- **MunicipalityBars**: Color-coded bars for municipality emissions
- **GlobalBreakdown**: Donut chart breakdown by source
- **InteractiveSimulator**: Simulator with 6 sliders
- **SustainabilityRanking**: A/B/C/D ranking
- **ComparisonPanel**: Municipality comparison
- **EuropeanComparison**: Comparison with European capitals
- **AdvancedFilters**: Filters for year, source, population

### License

MIT

### Contact and Contributions

For questions, bug reports, or contributions, please open an issue or pull request in the repository.
