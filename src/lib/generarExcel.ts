// Utilidad reutilizable para generación de Excel - SJM Platform
import * as XLSX from "xlsx";

interface ColumnaExcel {
  header: string;
  dataKey: string;
}

interface OpcionesExcel {
  titulo: string;
  columnas: ColumnaExcel[];
  datos: Record<string, any>[];
  nombreArchivo: string;
}

export function generarReporteExcel(opciones: OpcionesExcel) {
  const { titulo, columnas, datos, nombreArchivo } = opciones;

  // Preparar datos
  const headers = columnas.map((c) => c.header);
  const rows = datos.map((row) => columnas.map((c) => row[c.dataKey] ?? "—"));

  // Crear workbook
  const wb = XLSX.utils.book_new();
  
  // Agregar fila de título
  const wsData = [
    [titulo],
    [`Generado: ${new Date().toLocaleDateString("es-MX")} | Total: ${datos.length} registros`],
    [], // Fila vacía
    headers,
    ...rows,
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Ajustar anchos de columnas (auto-resize)
  const colWidths = headers.map((header, idx) => {
    const maxDataLen = Math.max(
      header.length,
      ...rows.map((row) => String(row[idx] || "").length)
    );
    return { wch: Math.min(maxDataLen + 4, 50) };
  });
  ws["!cols"] = colWidths;

  // Merge título
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } },
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Reporte");

  // Descargar
  const ahora = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `${nombreArchivo}_${ahora}.xlsx`);
}
