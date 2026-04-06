// Utilidad reutilizable para generación de reportes PDF - SJM Platform
// Patrón tomado de ERPCubox: ReporteClientesPDFButton pattern

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ColumnaReporte {
  header: string;
  dataKey: string;
  halign?: "left" | "center" | "right";
}

interface OpcionesReporte {
  titulo: string;
  subtitulo?: string;
  columnas: ColumnaReporte[];
  datos: Record<string, any>[];
  nombreArchivo: string;
  orientacion?: "portrait" | "landscape";
  fechaInicio?: string;
  fechaFin?: string;
}

export function generarReportePDF(opciones: OpcionesReporte) {
  const { titulo, subtitulo, columnas, datos, nombreArchivo, orientacion = "landscape", fechaInicio, fechaFin } = opciones;

  const doc = new jsPDF({ orientation: orientacion as "portrait" | "landscape", unit: "mm", format: "letter" });

  // Header corporativo
  const anchoPagina = doc.internal.pageSize.getWidth();

  // Barra azul superior
  doc.setFillColor(37, 99, 235); // Blue-600
  doc.rect(0, 0, anchoPagina, 28, "F");

  // Título
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text(titulo, 14, 12);

  // Subtitulo
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 220, 255);
  doc.text(subtitulo || "Servidores de Jesús por María - Plataforma SJM", 14, 19);

  // Fecha y hora de generación
  const ahora = new Date();
  const fechaGeneracion = ahora.toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "America/Mexico_City" });
  doc.setFontSize(8);
  doc.setTextColor(200, 220, 255);
  doc.text(`Generado: ${fechaGeneracion}`, anchoPagina - 14, 12, { align: "right" });

  // Rango de fechas si aplica
  if (fechaInicio && fechaFin) {
    doc.text(`Periodo: ${fechaInicio} — ${fechaFin}`, anchoPagina - 14, 19, { align: "right" });
  }

  // Total registros badge
  doc.setFontSize(8);
  doc.text(`Total: ${datos.length} registros`, anchoPagina - 14, 25, { align: "right" });

  // Tabla con autoTable
  autoTable(doc, {
    startY: 34,
    head: [columnas.map(c => c.header)],
    body: datos.map(row => columnas.map(c => row[c.dataKey] ?? "—")),
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      textColor: [40, 40, 40],
      lineColor: [220, 220, 220],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [30, 41, 59], // Slate-800
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 7.5,
      halign: "left",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // Slate-50
    },
    columnStyles: columnas.reduce((acc, col, idx) => {
      if (col.halign) acc[idx] = { halign: col.halign as "left" | "center" | "right" };
      return acc;
    }, {} as Record<number, { halign: "left" | "center" | "right" }>),
    margin: { left: 10, right: 10 },
    didDrawPage: (data: any) => {
      // Pie de página en cada página
      const alturaPagina = doc.internal.pageSize.getHeight();
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text("SJM Platform — Reporte generado automáticamente", 14, alturaPagina - 8);
      doc.text(`Página ${data.pageNumber}`, anchoPagina - 14, alturaPagina - 8, { align: "right" });
    },
  });

  // Guardar
  doc.save(`${nombreArchivo}_${ahora.toISOString().slice(0, 10)}.pdf`);
}
