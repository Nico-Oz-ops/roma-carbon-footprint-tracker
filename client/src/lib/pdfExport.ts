/**
 * PDF Export Utility
 * Generates PDF reports for municipality comparisons
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { municipalities, getSustainabilityScore } from './carbonData';

export interface ComparisonData {
  municipalityIds: number[];
  timestamp: Date;
}

const colors = {
  primary: '#1f5233', // Forest Green
  secondary: '#4a90e2', // Sky Blue
  accent: '#f59e0b', // Warm Amber
  lightBg: '#fef5e7', // Cream
  darkText: '#1a1a1a',
  lightText: '#666666',
};

export async function generateComparisonPDF(municipalityIds: number[], elementId?: string) {
  const selectedMunis = municipalities.filter((m) =>
    municipalityIds.includes(m.id)
  );

  if (selectedMunis.length === 0) {
    alert('Seleziona almeno un municipio per esportare');
    return;
  }

  try {
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;

    let yPosition = margin;

    // Header
    pdf.setFillColor(31, 82, 51); // Forest Green
    pdf.rect(0, 0, pageWidth, 40, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Roma Carbon Footprint Tracker', margin, 15);

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Confronto Emissioni CO₂ - Municipi di Roma', margin, 25);

    pdf.setFontSize(10);
    pdf.text(`Data: ${new Date().toLocaleDateString('it-IT')}`, margin, 33);

    yPosition = 50;

    // Title
    pdf.setTextColor(31, 82, 51);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Analisi Comparativa', margin, yPosition);
    yPosition += 12;

    // Summary Section
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Municipi Confrontati:', margin, yPosition);
    yPosition += 6;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    selectedMunis.forEach((muni) => {
      pdf.text(`• ${muni.name}`, margin + 5, yPosition);
      yPosition += 5;
    });

    yPosition += 5;

    // Key Metrics Table
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(31, 82, 51);
    pdf.text('Metriche Principali', margin, yPosition);
    yPosition += 8;

    // Create table data
    const tableData = [
      [
        'Metrica',
        ...selectedMunis.map((m) => m.name.replace('Municipio ', 'M.')),
      ],
      [
        'Emissioni Totali (k t)',
        ...selectedMunis.map((m) => (m.emissionsCurrent / 1000).toFixed(0)),
      ],
      [
        'Popolazione (k ab)',
        ...selectedMunis.map((m) => (m.population / 1000).toFixed(0)),
      ],
      [
        'Emissioni/ab (t)',
        ...selectedMunis.map((m) =>
          (m.emissionsCurrent / m.population).toFixed(2)
        ),
      ],
      [
        'Score Sostenibilità',
        ...selectedMunis.map((m) => getSustainabilityScore(m)),
      ],
      [
        'Traffico (%)',
        ...selectedMunis.map((m) =>
          ((m.emissionsSources.traffic / m.emissionsCurrent) * 100).toFixed(1)
        ),
      ],
      [
        'Energia (%)',
        ...selectedMunis.map((m) =>
          ((m.emissionsSources.energy / m.emissionsCurrent) * 100).toFixed(1)
        ),
      ],
      [
        'Industria (%)',
        ...selectedMunis.map((m) =>
          ((m.emissionsSources.industry / m.emissionsCurrent) * 100).toFixed(1)
        ),
      ],
      [
        'Rifiuti (%)',
        ...selectedMunis.map((m) =>
          ((m.emissionsSources.waste / m.emissionsCurrent) * 100).toFixed(1)
        ),
      ],
      [
        'Obiettivo 2030 (k t)',
        ...selectedMunis.map((m) => (m.emissionsTarget2030 / 1000).toFixed(0)),
      ],
      [
        'Riduzione Necessaria (%)',
        ...selectedMunis.map((m) => {
          const reduction =
            ((m.emissionsCurrent - m.emissionsTarget2030) /
              m.emissionsCurrent) *
            100;
          return reduction.toFixed(1);
        }),
      ],
    ];

    // Add table
    (pdf as any).autoTable({
      startY: yPosition,
      head: [tableData[0]],
      body: tableData.slice(1),
      margin: { left: margin, right: margin },
      theme: 'grid',
      headStyles: {
        fillColor: [31, 82, 51],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
      },
      bodyStyles: {
        textColor: [26, 26, 26],
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [254, 245, 231],
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
      },
    });

    yPosition = (pdf as any).lastAutoTable.finalY + 10;

    // Detailed Analysis for each municipality
    selectedMunis.forEach((muni, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = margin;
      }

      // Municipality Section
      pdf.setFillColor(74, 144, 226); // Sky Blue
      pdf.rect(margin - 2, yPosition - 5, contentWidth + 4, 8, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${muni.name} - Analisi Dettagliata`, margin, yPosition + 1);

      yPosition += 12;

      // Key info
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');

      const score = getSustainabilityScore(muni);
      const scoreText =
        score === 'A'
          ? 'Eccellente'
          : score === 'B'
            ? 'Buono'
            : score === 'C'
              ? 'Moderato'
              : 'Critico';

      const infoText = [
        `Emissioni Totali: ${(muni.emissionsCurrent / 1000).toFixed(0)}k tonnellate`,
        `Popolazione: ${(muni.population / 1000).toFixed(0)}k abitanti`,
        `Emissioni pro-capite: ${(muni.emissionsCurrent / muni.population).toFixed(2)} t/ab`,
        `Score Sostenibilità: ${score} (${scoreText})`,
        `Obiettivo 2030: ${(muni.emissionsTarget2030 / 1000).toFixed(0)}k tonnellate`,
        `Riduzione necessaria: ${(((muni.emissionsCurrent - muni.emissionsTarget2030) / muni.emissionsCurrent) * 100).toFixed(1)}%`,
      ];

      infoText.forEach((text) => {
        pdf.text(text, margin + 3, yPosition);
        yPosition += 5;
      });

      yPosition += 3;

      // Breakdown
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text('Breakdown per Fonte:', margin + 3, yPosition);
      yPosition += 5;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);

      const sources = [
        {
          name: 'Traffico',
          value: muni.emissionsSources.traffic,
        },
        {
          name: 'Energia',
          value: muni.emissionsSources.energy,
        },
        {
          name: 'Industria',
          value: muni.emissionsSources.industry,
        },
        {
          name: 'Rifiuti',
          value: muni.emissionsSources.waste,
        },
        {
          name: 'Altro',
          value: muni.emissionsSources.other,
        },
      ];

      sources.forEach((source) => {
        const percentage = ((source.value / muni.emissionsCurrent) * 100).toFixed(1);
        pdf.text(
          `${source.name}: ${percentage}% (${(source.value / 1000).toFixed(0)}k t)`,
          margin + 6,
          yPosition
        );
        yPosition += 4;
      });

      yPosition += 5;
    });

    // Add footer
    const totalPages = (pdf as any).internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(9);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        `Pagina ${i} di ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    // Save PDF
    const filename = `confronto-municipi-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);

    return true;
  } catch (error) {
    console.error('Errore durante la generazione del PDF:', error);
    alert('Errore durante la generazione del PDF');
    return false;
  }
}

export async function exportChartToPDF(
  chartCanvasId: string,
  title: string,
  municipalityNames: string[]
) {
  try {
    const canvas = document.getElementById(chartCanvasId) as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas non trovato');
      return false;
    }

    const image = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;

    // Header
    pdf.setFillColor(31, 82, 51);
    pdf.rect(0, 0, pageWidth, 20, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, margin, 12);

    // Add image
    const imgWidth = pageWidth - 2 * margin;
    const imgHeight = (imgWidth * canvas.height) / canvas.width;

    pdf.addImage(image, 'PNG', margin, 25, imgWidth, imgHeight);

    // Footer
    pdf.setFontSize(9);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      `Confronto: ${municipalityNames.join(', ')} - ${new Date().toLocaleDateString('it-IT')}`,
      margin,
      pageHeight - 5
    );

    const filename = `grafico-${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);

    return true;
  } catch (error) {
    console.error('Errore durante l\'esportazione del grafico:', error);
    return false;
  }
}
