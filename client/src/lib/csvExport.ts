/**
 * CSV Export Utility
 * Generates CSV files for municipality comparisons with detailed data
 */

import { municipalities, getSustainabilityScore, getGlobalBreakdown } from './carbonData';

/**
 * Escape CSV values to handle commas, quotes, and newlines
 */
function escapeCSV(value: string | number | boolean): string {
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

/**
 * Generate CSV content from array of arrays
 */
function generateCSVContent(data: (string | number)[][]): string {
  return data
    .map((row) => row.map((cell) => escapeCSV(cell)).join(','))
    .join('\n');
}

/**
 * Download CSV file
 */
function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Generate comprehensive CSV export for municipality comparison
 */
export function generateComparisonCSV(municipalityIds: number[]): boolean {
  try {
    const selectedMunis = municipalities.filter((m) =>
      municipalityIds.includes(m.id)
    );

    if (selectedMunis.length === 0) {
      alert('Seleziona almeno un municipio per esportare');
      return false;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `confronto-municipi-${timestamp}.csv`;

    // Main comparison table
    const comparisonData: (string | number)[][] = [
      [
        'Metrica',
        ...selectedMunis.map((m) => m.name),
      ],
      [
        'Emissioni Totali (tonnellate)',
        ...selectedMunis.map((m) => m.emissionsCurrent),
      ],
      [
        'Emissioni Totali (k tonnellate)',
        ...selectedMunis.map((m) => (m.emissionsCurrent / 1000).toFixed(2)),
      ],
      [
        'Popolazione (abitanti)',
        ...selectedMunis.map((m) => m.population),
      ],
      [
        'Popolazione (k abitanti)',
        ...selectedMunis.map((m) => (m.population / 1000).toFixed(2)),
      ],
      [
        'Emissioni pro-capite (t/ab)',
        ...selectedMunis.map((m) =>
          (m.emissionsCurrent / m.population).toFixed(4)
        ),
      ],
      [
        'Score Sostenibilità',
        ...selectedMunis.map((m) => getSustainabilityScore(m)),
      ],
      [
        'Area (km²)',
        ...selectedMunis.map((m) => m.area),
      ],
      [
        'Densità Emissioni (t/km²)',
        ...selectedMunis.map((m) => (m.emissionsCurrent / m.area).toFixed(2)),
      ],
    ];

    // Emissions by source
    const sourceData: (string | number)[][] = [
      [''],
      ['EMISSIONI PER FONTE (tonnellate)'],
      [
        'Fonte',
        ...selectedMunis.map((m) => m.name),
      ],
      [
        'Traffico',
        ...selectedMunis.map((m) => m.emissionsSources.traffic),
      ],
      [
        'Energia',
        ...selectedMunis.map((m) => m.emissionsSources.energy),
      ],
      [
        'Industria',
        ...selectedMunis.map((m) => m.emissionsSources.industry),
      ],
      [
        'Rifiuti',
        ...selectedMunis.map((m) => m.emissionsSources.waste),
      ],
      [
        'Altro',
        ...selectedMunis.map((m) => m.emissionsSources.other),
      ],
    ];

    // Emissions by source (percentage)
    const sourcePercentageData: (string | number)[][] = [
      [''],
      ['EMISSIONI PER FONTE (%)'],
      [
        'Fonte',
        ...selectedMunis.map((m) => m.name),
      ],
      [
        'Traffico',
        ...selectedMunis.map((m) =>
          ((m.emissionsSources.traffic / m.emissionsCurrent) * 100).toFixed(2)
        ),
      ],
      [
        'Energia',
        ...selectedMunis.map((m) =>
          ((m.emissionsSources.energy / m.emissionsCurrent) * 100).toFixed(2)
        ),
      ],
      [
        'Industria',
        ...selectedMunis.map((m) =>
          ((m.emissionsSources.industry / m.emissionsCurrent) * 100).toFixed(2)
        ),
      ],
      [
        'Rifiuti',
        ...selectedMunis.map((m) =>
          ((m.emissionsSources.waste / m.emissionsCurrent) * 100).toFixed(2)
        ),
      ],
      [
        'Altro',
        ...selectedMunis.map((m) =>
          ((m.emissionsSources.other / m.emissionsCurrent) * 100).toFixed(2)
        ),
      ],
    ];

    // 2030 Targets
    const targetData: (string | number)[][] = [
      [''],
      ['OBIETTIVI 2030'],
      [
        'Metrica',
        ...selectedMunis.map((m) => m.name),
      ],
      [
        'Target 2030 (tonnellate)',
        ...selectedMunis.map((m) => m.emissionsTarget2030),
      ],
      [
        'Target 2030 (k tonnellate)',
        ...selectedMunis.map((m) => (m.emissionsTarget2030 / 1000).toFixed(2)),
      ],
      [
        'Riduzione Necessaria (tonnellate)',
        ...selectedMunis.map((m) => m.emissionsCurrent - m.emissionsTarget2030),
      ],
      [
        'Riduzione Necessaria (%)',
        ...selectedMunis.map((m) => {
          const reduction =
            ((m.emissionsCurrent - m.emissionsTarget2030) /
              m.emissionsCurrent) *
            100;
          return reduction.toFixed(2);
        }),
      ],
    ];

    // Historical data
    const historicalData: (string | number)[][] = [
      [''],
      ['TREND STORICO (tonnellate)'],
      [
        'Anno',
        ...selectedMunis.map((m) => m.name),
      ],
      ...selectedMunis[0].historicalEmissions.map((_, yearIndex) => {
        const year = 2019 + yearIndex;
        return [
          year,
          ...selectedMunis.map((m) => m.historicalEmissions[yearIndex]),
        ];
      }),
    ];

    // Combine all data
    const allData = [
      ...comparisonData,
      ...sourceData,
      ...sourcePercentageData,
      ...targetData,
      ...historicalData,
      [
        '',
      ],
      [
        'Data di esportazione',
        new Date().toLocaleString('it-IT'),
      ],
      [
        'Numero di municipi',
        selectedMunis.length,
      ],
    ];

    const csvContent = generateCSVContent(allData);
    downloadCSV(csvContent, filename);

    return true;
  } catch (error) {
    console.error('Errore durante la generazione del CSV:', error);
    alert('Errore durante la generazione del CSV');
    return false;
  }
}

/**
 * Generate detailed CSV with individual municipality data
 */
export function generateDetailedMunicipalityCSV(municipalityIds: number[]): boolean {
  try {
    const selectedMunis = municipalities.filter((m) =>
      municipalityIds.includes(m.id)
    );

    if (selectedMunis.length === 0) {
      alert('Seleziona almeno un municipio per esportare');
      return false;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `dettagli-municipi-${timestamp}.csv`;

    const detailedData: (string | number)[][] = [
      [
        'Municipio',
        'Emissioni Totali (t)',
        'Popolazione (ab)',
        'Emissioni/ab (t)',
        'Area (km²)',
        'Densità Emissioni (t/km²)',
        'Score',
        'Traffico (t)',
        'Traffico (%)',
        'Energia (t)',
        'Energia (%)',
        'Industria (t)',
        'Industria (%)',
        'Rifiuti (t)',
        'Rifiuti (%)',
        'Altro (t)',
        'Altro (%)',
        'Target 2030 (t)',
        'Riduzione Necessaria (t)',
        'Riduzione Necessaria (%)',
      ],
    ];

    selectedMunis.forEach((muni) => {
      detailedData.push([
        muni.name,
        muni.emissionsCurrent,
        muni.population,
        (muni.emissionsCurrent / muni.population).toFixed(4),
        muni.area,
        (muni.emissionsCurrent / muni.area).toFixed(2),
        getSustainabilityScore(muni),
        muni.emissionsSources.traffic,
        ((muni.emissionsSources.traffic / muni.emissionsCurrent) * 100).toFixed(2),
        muni.emissionsSources.energy,
        ((muni.emissionsSources.energy / muni.emissionsCurrent) * 100).toFixed(2),
        muni.emissionsSources.industry,
        ((muni.emissionsSources.industry / muni.emissionsCurrent) * 100).toFixed(2),
        muni.emissionsSources.waste,
        ((muni.emissionsSources.waste / muni.emissionsCurrent) * 100).toFixed(2),
        muni.emissionsSources.other,
        ((muni.emissionsSources.other / muni.emissionsCurrent) * 100).toFixed(2),
        muni.emissionsTarget2030,
        muni.emissionsCurrent - muni.emissionsTarget2030,
        (
          ((muni.emissionsCurrent - muni.emissionsTarget2030) /
            muni.emissionsCurrent) *
          100
        ).toFixed(2),
      ]);
    });

    const csvContent = generateCSVContent(detailedData);
    downloadCSV(csvContent, filename);

    return true;
  } catch (error) {
    console.error('Errore durante la generazione del CSV dettagliato:', error);
    alert('Errore durante la generazione del CSV dettagliato');
    return false;
  }
}

/**
 * Generate CSV with historical trend data
 */
export function generateHistoricalTrendCSV(municipalityIds: number[]): boolean {
  try {
    const selectedMunis = municipalities.filter((m) =>
      municipalityIds.includes(m.id)
    );

    if (selectedMunis.length === 0) {
      alert('Seleziona almeno un municipio per esportare');
      return false;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `trend-storico-${timestamp}.csv`;

    const trendData: (string | number)[][] = [
      [
        'Anno',
        ...selectedMunis.map((m) => m.name),
      ],
    ];

    // Add historical data for each year
    selectedMunis[0].historicalEmissions.forEach((_, yearIndex) => {
      const year = 2019 + yearIndex;
      trendData.push([
        year,
        ...selectedMunis.map((m) => m.historicalEmissions[yearIndex]),
      ]);
    });

    // Add percentage change
    trendData.push(['']);
    trendData.push([
      'Variazione 2019-2025 (%)',
      ...selectedMunis.map((m) => {
        const change =
          ((m.historicalEmissions[6] - m.historicalEmissions[0]) /
            m.historicalEmissions[0]) *
          100;
        return change.toFixed(2);
      }),
    ]);

    const csvContent = generateCSVContent(trendData);
    downloadCSV(csvContent, filename);

    return true;
  } catch (error) {
    console.error('Errore durante la generazione del CSV trend:', error);
    alert('Errore durante la generazione del CSV trend');
    return false;
  }
}
