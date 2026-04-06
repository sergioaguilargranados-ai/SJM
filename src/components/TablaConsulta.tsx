"use client";

import { useState, useMemo } from "react";
import { Search, Calendar, FileText, Download, X, Table2 } from "lucide-react";
import { generarReportePDF } from "@/lib/generarPDF";
import { generarReporteExcel } from "@/lib/generarExcel";

// ============================================================
// Componente reutilizable TablaConsulta - Patrón ERPCubox
// Filtro por palabra, filtro por rango de fechas, exportar PDF
// ============================================================

interface Columna {
  header: string;
  accessorKey: string;
  cell?: (valor: any, row: any) => React.ReactNode;
  pdfKey?: string; // Key alterna para el PDF
  halign?: "left" | "center" | "right";
}

interface Props {
  datos: any[];
  columnas: Columna[];
  titulo: string;
  subtitulo?: string;
  icono?: React.ReactNode;
  camposFiltro?: string[];       // Campos de texto para buscar
  campoFechaDesde?: string;      // Campo de fecha para filtrar (ej: "creado_en")
  campoFechaHasta?: string;      // Si es diferente al campo desde
  mostrarFiltroFecha?: boolean;
  nombrePDF?: string;
  acciones?: React.ReactNode;     // Botones extra (Nuevo, Importar etc)
  filaVacia?: React.ReactNode;    // Componente cuando no hay datos
  totalLabel?: string;
}

function formatearFechaInput(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toISOString().slice(0, 10);
}

function inicioMes(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
}

function hoy(): string {
  return new Date().toISOString().slice(0, 10);
}

export function TablaConsulta({
  datos,
  columnas,
  titulo,
  subtitulo,
  icono,
  camposFiltro = [],
  campoFechaDesde,
  campoFechaHasta,
  mostrarFiltroFecha = false,
  nombrePDF = "Reporte_SJM",
  acciones,
  filaVacia,
  totalLabel,
}: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [fechaDesde, setFechaDesde] = useState(inicioMes());
  const [fechaHasta, setFechaHasta] = useState(hoy());

  // Filtrar datos
  const datosFiltrados = useMemo(() => {
    return datos.filter((row) => {
      // Filtro de búsqueda por texto
      if (busqueda.trim()) {
        const termino = busqueda.toLowerCase();
        const coincide = camposFiltro.some((campo) => {
          const valor = row[campo];
          if (!valor) return false;
          return String(valor).toLowerCase().includes(termino);
        });
        if (!coincide) return false;
      }

      // Filtro de fecha
      if (mostrarFiltroFecha && campoFechaDesde) {
        const campoFecha = row[campoFechaDesde];
        if (campoFecha) {
          const fechaRow = new Date(campoFecha).toISOString().slice(0, 10);
          if (fechaRow < fechaDesde || fechaRow > fechaHasta) return false;
        }
      }

      return true;
    });
  }, [datos, busqueda, fechaDesde, fechaHasta, camposFiltro, campoFechaDesde, mostrarFiltroFecha]);

  // Exportar PDF
  const exportarPDF = () => {
    const columnasReporte = columnas.map((col) => ({
      header: col.header,
      dataKey: col.pdfKey || col.accessorKey,
      halign: col.halign,
    }));

    const datosReporte = datosFiltrados.map((row) => {
      const fila: Record<string, any> = {};
      columnas.forEach((col) => {
        const key = col.pdfKey || col.accessorKey;
        fila[key] = row[key] ?? row[col.accessorKey] ?? "";
      });
      return fila;
    });

    generarReportePDF({
      titulo,
      subtitulo: subtitulo || "Plataforma SJM",
      columnas: columnasReporte,
      datos: datosReporte,
      nombreArchivo: nombrePDF,
      fechaInicio: mostrarFiltroFecha ? fechaDesde : undefined,
      fechaFin: mostrarFiltroFecha ? fechaHasta : undefined,
    });
  };

  // Exportar Excel
  const exportarExcel = () => {
    const columnasReporte = columnas.map((col) => ({
      header: col.header,
      dataKey: col.pdfKey || col.accessorKey,
    }));

    const datosReporte = datosFiltrados.map((row) => {
      const fila: Record<string, any> = {};
      columnas.forEach((col) => {
        const key = col.pdfKey || col.accessorKey;
        fila[key] = row[key] ?? row[col.accessorKey] ?? "";
      });
      return fila;
    });

    generarReporteExcel({
      titulo,
      columnas: columnasReporte,
      datos: datosReporte,
      nombreArchivo: nombrePDF,
    });
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setFechaDesde(inicioMes());
    setFechaHasta(hoy());
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-slate-100 dark:bg-[#1a1b26] p-4 rounded-xl border border-slate-200 dark:border-[#2a2b3d] shadow-sm items-center w-full">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              {icono}
              {titulo}
            </h1>
            {subtitulo && (
              <p className="text-sm text-slate-500 dark:text-[#8e8ea0] mt-1">{subtitulo}</p>
            )}
          </div>
          <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-[#2a2b3d]">
            <div className="text-right">
              <p className="text-xs text-slate-500 dark:text-[#8e8ea0] font-medium uppercase tracking-wider">
                {totalLabel || "Total Registros"}
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{datosFiltrados.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Filtros ERPCubox */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white dark:bg-[#1a1b26] p-4 rounded-xl border border-slate-200 dark:border-[#2a2b3d] shadow-sm">
        <div className="flex flex-wrap gap-3 items-end flex-1">
          {/* Filtro por fechas */}
          {mostrarFiltroFecha && (
            <>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 dark:text-[#8e8ea0] font-bold uppercase tracking-wider">
                  Desde
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="date"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                    className="pl-8 h-9 w-40 rounded-md border border-slate-300 dark:border-[#3b3c54] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-[#e11d48] text-slate-900 dark:text-white transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 dark:text-[#8e8ea0] font-bold uppercase tracking-wider">
                  Hasta
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="date"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                    className="pl-8 h-9 w-40 rounded-md border border-slate-300 dark:border-[#3b3c54] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-[#e11d48] text-slate-900 dark:text-white transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          {/* Búsqueda por palabra */}
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-[10px] text-slate-500 dark:text-[#8e8ea0] font-bold uppercase tracking-wider">
              Buscar
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Escribe para filtrar..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-9 h-9 w-full rounded-md border border-slate-300 dark:border-[#3b3c54] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-[#e11d48] text-slate-900 dark:text-white transition-colors"
              />
            </div>
          </div>

          {/* Limpiar */}
          {(busqueda || fechaDesde !== inicioMes() || fechaHasta !== hoy()) && (
            <button
              onClick={limpiarFiltros}
              className="h-9 px-3 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-[#3b3c54] rounded-md hover:bg-slate-50 dark:hover:bg-[#2a2b3d] transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Limpiar
            </button>
          )}
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Botón PDF */}
          <button
            onClick={exportarPDF}
            className="h-9 px-4 flex items-center gap-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 dark:bg-rose-600 dark:hover:bg-rose-700 rounded-md transition-colors shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" /> PDF
          </button>
          {/* Botón Excel */}
          <button
            onClick={exportarExcel}
            className="h-9 px-4 flex items-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-md transition-colors shadow-sm"
          >
            <Table2 className="w-3.5 h-3.5" /> Excel
          </button>
          {acciones}
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white dark:bg-[#1a1b26] border border-slate-200 dark:border-[#2a2b3d] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-[#151621] text-slate-800 dark:text-slate-200 font-semibold text-xs border-b border-slate-200 dark:border-[#2a2b3d]">
              <tr>
                {columnas.map((col) => (
                  <th
                    key={col.accessorKey}
                    className={`px-5 py-3.5 font-semibold ${col.halign === "center" ? "text-center" : col.halign === "right" ? "text-right" : ""}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#2a2b3d]">
              {datosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={columnas.length} className="px-6 py-16 text-center">
                    {filaVacia || (
                      <div className="space-y-2">
                        <FileText className="w-12 h-12 text-slate-300 dark:text-[#3b3c54] mx-auto" />
                        <p className="text-slate-600 dark:text-slate-400 font-medium text-base">
                          Sin registros encontrados
                        </p>
                        <p className="text-slate-500 dark:text-[#8e8ea0] text-sm">
                          Ajusta los filtros o agrega nuevos datos.
                        </p>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                datosFiltrados.map((row, idx) => (
                  <tr
                    key={row.id || idx}
                    className="hover:bg-slate-50 dark:hover:bg-[#2a2b3d]/30 transition-colors"
                  >
                    {columnas.map((col) => (
                      <td
                        key={col.accessorKey}
                        className={`px-5 py-3.5 ${col.halign === "center" ? "text-center" : col.halign === "right" ? "text-right" : ""}`}
                      >
                        {col.cell ? col.cell(row[col.accessorKey], row) : (row[col.accessorKey] ?? "—")}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer: Resumen */}
        {datosFiltrados.length > 0 && (
          <div className="px-5 py-3 bg-slate-50 dark:bg-[#151621] border-t border-slate-200 dark:border-[#2a2b3d] text-xs text-slate-500 dark:text-[#8e8ea0] flex justify-between items-center">
            <span>
              Mostrando <span className="font-bold text-slate-700 dark:text-white">{datosFiltrados.length}</span> de{" "}
              <span className="font-bold text-slate-700 dark:text-white">{datos.length}</span> registros
            </span>
            <span className="text-[10px] font-mono">SJM Platform</span>
          </div>
        )}
      </div>
    </div>
  );
}
