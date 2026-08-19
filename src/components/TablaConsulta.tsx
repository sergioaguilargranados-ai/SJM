"use client";

import { useState, useMemo } from "react";
import { Search, Calendar, FileText, Download, X, Table2, Columns, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { generarReportePDF } from "@/lib/generarPDF";
import { generarReporteExcel } from "@/lib/generarExcel";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  ocultarEnUI?: boolean;
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
  renderCard?: (item: any) => React.ReactNode; // Optional card render function for grid view
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

export function obtenerEdadCalculada(row: any): number | null {
  if (row?.edad != null && row?.edad !== "" && !isNaN(Number(row.edad)) && Number(row.edad) > 0) {
    return Number(row.edad);
  }
  if (row?.fecha_nacimiento) {
    const fn = new Date(row.fecha_nacimiento);
    if (!isNaN(fn.getTime())) {
      const hoy = new Date();
      let edad = hoy.getFullYear() - fn.getFullYear();
      const m = hoy.getMonth() - fn.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < fn.getDate())) {
        edad--;
      }
      if (edad >= 0 && edad <= 120) {
        return edad;
      }
    }
  }
  return null;
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
  renderCard,
}: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [fechaDesde, setFechaDesde] = useState(inicioMes());
  const [fechaHasta, setFechaHasta] = useState(hoy());
  const [viewMode, setViewMode] = useState<"table" | "grid">(renderCard ? "grid" : "table");
  
  // Estados de Ordenamiento
  const [criterioOrden, setCriterioOrden] = useState<string>("DEFAULT");
  const [columnaOrdenKey, setColumnaOrdenKey] = useState<string | null>(null);
  const [direccionOrden, setDireccionOrden] = useState<"asc" | "desc">("asc");

  // Column Visibility
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    columnas.forEach(col => {
      initial[col.accessorKey] = !col.ocultarEnUI;
    });
    return initial;
  });

  const columnasVisibles = columnas.filter(col => columnVisibility[col.accessorKey]);

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

  // Ordenar datos
  const datosOrdenados = useMemo(() => {
    const list = [...datosFiltrados];

    // Presets de ordenamiento
    if (criterioOrden === "SEXO_EDAD_ASC" || criterioOrden === "SEXO_EDAD_DESC") {
      return list.sort((a, b) => {
        const sexA = (a.sexo || "Z").toString().trim().toUpperCase();
        const sexB = (b.sexo || "Z").toString().trim().toUpperCase();
        const compSex = sexA.localeCompare(sexB, "es", { sensitivity: "base" });
        if (compSex !== 0) return compSex;

        const edadA = obtenerEdadCalculada(a) ?? 999;
        const edadB = obtenerEdadCalculada(b) ?? 999;
        return criterioOrden === "SEXO_EDAD_ASC" ? edadA - edadB : edadB - edadA;
      });
    }

    if (criterioOrden === "NOMBRE_ASC") {
      return list.sort((a, b) => (a.nombre_asistente || a.nombre || "").localeCompare(b.nombre_asistente || b.nombre || "", "es", { sensitivity: "base" }));
    }
    if (criterioOrden === "NOMBRE_DESC") {
      return list.sort((a, b) => (b.nombre_asistente || b.nombre || "").localeCompare(a.nombre_asistente || a.nombre || "", "es", { sensitivity: "base" }));
    }

    if (criterioOrden === "EDAD_ASC") {
      return list.sort((a, b) => {
        const eA = obtenerEdadCalculada(a) ?? 999;
        const eB = obtenerEdadCalculada(b) ?? 999;
        return eA - eB;
      });
    }
    if (criterioOrden === "EDAD_DESC") {
      return list.sort((a, b) => {
        const eA = obtenerEdadCalculada(a) ?? -1;
        const eB = obtenerEdadCalculada(b) ?? -1;
        return eB - eA;
      });
    }

    if (criterioOrden === "FECHA_DESC") {
      return list.sort((a, b) => {
        const fA = a.creado_en || a.fecha_inicio || a.fecha_creacion || 0;
        const fB = b.creado_en || b.fecha_inicio || b.fecha_creacion || 0;
        return new Date(fB).getTime() - new Date(fA).getTime();
      });
    }
    if (criterioOrden === "FECHA_ASC") {
      return list.sort((a, b) => {
        const fA = a.creado_en || a.fecha_inicio || a.fecha_creacion || 0;
        const fB = b.creado_en || b.fecha_inicio || b.fecha_creacion || 0;
        return new Date(fA).getTime() - new Date(fB).getTime();
      });
    }

    // Clic en encabezado de columna
    if (columnaOrdenKey) {
      return list.sort((a, b) => {
        if (columnaOrdenKey === "edad") {
          const valA = obtenerEdadCalculada(a) ?? (direccionOrden === "asc" ? 999 : -1);
          const valB = obtenerEdadCalculada(b) ?? (direccionOrden === "asc" ? 999 : -1);
          return direccionOrden === "asc" ? valA - valB : valB - valA;
        }

        const valA = a[columnaOrdenKey];
        const valB = b[columnaOrdenKey];

        if (valA == null && valB == null) return 0;
        if (valA == null) return 1;
        if (valB == null) return -1;

        if (typeof valA === "number" && typeof valB === "number") {
          return direccionOrden === "asc" ? valA - valB : valB - valA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        return direccionOrden === "asc" 
          ? strA.localeCompare(strB, "es", { sensitivity: "base" })
          : strB.localeCompare(strA, "es", { sensitivity: "base" });
      });
    }

    return list;
  }, [datosFiltrados, criterioOrden, columnaOrdenKey, direccionOrden]);

  const toggleOrdenColumna = (key: string) => {
    setCriterioOrden("CUSTOM");
    if (columnaOrdenKey === key) {
      if (direccionOrden === "asc") {
        setDireccionOrden("desc");
      } else {
        setColumnaOrdenKey(null);
        setCriterioOrden("DEFAULT");
      }
    } else {
      setColumnaOrdenKey(key);
      setDireccionOrden("asc");
    }
  };

  // Exportar PDF
  const exportarPDF = () => {
    const columnasReporte = columnasVisibles.map((col) => ({
      header: col.header,
      dataKey: col.pdfKey || col.accessorKey,
      halign: col.halign,
    }));

    const datosReporte = datosOrdenados.map((row) => {
      const fila: Record<string, any> = {};
      columnasVisibles.forEach((col) => {
        const key = col.pdfKey || col.accessorKey;
        if (key === "edad" || col.accessorKey === "edad") {
          const calc = obtenerEdadCalculada(row);
          fila[key] = calc != null ? `${calc} años` : (row[key] ?? "");
        } else {
          fila[key] = row[key] ?? row[col.accessorKey] ?? "";
        }
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
    const columnasReporte = columnasVisibles.map((col) => ({
      header: col.header,
      dataKey: col.pdfKey || col.accessorKey,
    }));

    const datosReporte = datosOrdenados.map((row) => {
      const fila: Record<string, any> = {};
      columnasVisibles.forEach((col) => {
        const key = col.pdfKey || col.accessorKey;
        if (key === "edad" || col.accessorKey === "edad") {
          const calc = obtenerEdadCalculada(row);
          fila[key] = calc != null ? `${calc} años` : (row[key] ?? "");
        } else {
          fila[key] = row[key] ?? row[col.accessorKey] ?? "";
        }
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
    setCriterioOrden("DEFAULT");
    setColumnaOrdenKey(null);
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
              <p className="text-xl font-bold text-slate-900 dark:text-white">{datosOrdenados.length}</p>
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
          <div className="space-y-1.5 flex-1 min-w-[180px]">
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

          {/* Ordenar Por */}
          <div className="space-y-1.5 min-w-[210px]">
            <label className="text-[10px] text-slate-500 dark:text-[#8e8ea0] font-bold uppercase tracking-wider flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3" /> Ordenar por
            </label>
            <Select 
              value={criterioOrden} 
              onValueChange={(val) => { 
                setCriterioOrden(val); 
                setColumnaOrdenKey(null); 
              }}
            >
              <SelectTrigger className="h-9 text-xs bg-white dark:bg-[#0f1015] border-slate-300 dark:border-[#3b3c54]">
                <SelectValue placeholder="Orden predeterminado" />
              </SelectTrigger>
              <SelectContent className="dark:bg-[#1a1b26] dark:border-[#2a2b3d]">
                <SelectItem value="DEFAULT">📌 Predeterminado</SelectItem>
                <SelectItem value="SEXO_EDAD_ASC">🛏️ Sexo ➔ Edad (Menor a Mayor)</SelectItem>
                <SelectItem value="SEXO_EDAD_DESC">🛏️ Sexo ➔ Edad (Mayor a Menor)</SelectItem>
                <SelectItem value="NOMBRE_ASC">👤 Nombre (A ➔ Z)</SelectItem>
                <SelectItem value="NOMBRE_DESC">👤 Nombre (Z ➔ A)</SelectItem>
                <SelectItem value="EDAD_ASC">🎂 Edad (Menor a Mayor)</SelectItem>
                <SelectItem value="EDAD_DESC">🎂 Edad (Mayor a Menor)</SelectItem>
                <SelectItem value="FECHA_DESC">📅 Registro (Más Recientes)</SelectItem>
                <SelectItem value="FECHA_ASC">📅 Registro (Más Antiguos)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Limpiar */}
          {(busqueda || fechaDesde !== inicioMes() || fechaHasta !== hoy() || criterioOrden !== "DEFAULT" || columnaOrdenKey !== null) && (
            <button
              onClick={limpiarFiltros}
              className="h-9 px-3 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-[#3b3c54] rounded-md hover:bg-slate-50 dark:hover:bg-[#2a2b3d] transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Limpiar
            </button>
          )}
        </div>

        {/* Acciones */}
        <div className="flex flex-wrap items-center justify-end gap-3 shrink-0">
          {renderCard && (
            <div className="flex bg-slate-100 dark:bg-[#0f1015] rounded-md p-1 border border-slate-200 dark:border-[#3b3c54]">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                  viewMode === "grid" 
                    ? "bg-white dark:bg-[#1a1b26] text-blue-600 dark:text-[#e11d48] shadow-sm" 
                    : "text-slate-500 dark:text-[#8e8ea0] hover:text-slate-900 dark:hover:text-slate-300"
                }`}
              >
                Fichas
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                  viewMode === "table" 
                    ? "bg-white dark:bg-[#1a1b26] text-blue-600 dark:text-[#e11d48] shadow-sm" 
                    : "text-slate-500 dark:text-[#8e8ea0] hover:text-slate-900 dark:hover:text-slate-300"
                }`}
              >
                Lista
              </button>
            </div>
          )}

          {/* Botón Columnas */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 px-3 text-xs font-bold bg-white dark:bg-[#1a1b26] border-slate-300 dark:border-[#3b3c54]">
                <Columns className="w-3.5 h-3.5 mr-2 text-slate-400" />
                Columnas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 max-h-80 overflow-y-auto dark:bg-[#1a1b26] dark:border-[#2a2b3d] p-1.5 shadow-xl">
              <div className="flex items-center justify-between px-2 py-1.5 pb-2 border-b border-slate-100 dark:border-[#2a2b3d] mb-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    const allVis: Record<string, boolean> = {};
                    columnas.forEach(col => allVis[col.accessorKey] = true);
                    setColumnVisibility(allVis);
                  }}
                  className="text-[10px] font-bold text-blue-600 dark:text-[#e11d48] hover:underline"
                >
                  Mostrar todas
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    const initial: Record<string, boolean> = {};
                    columnas.forEach(col => {
                      initial[col.accessorKey] = !col.ocultarEnUI;
                    });
                    setColumnVisibility(initial);
                  }}
                  className="text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:underline"
                >
                  Restablecer
                </button>
              </div>
              {columnas.map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.accessorKey}
                  className="text-xs font-medium cursor-pointer"
                  checked={columnVisibility[col.accessorKey]}
                  onSelect={(e) => e.preventDefault()}
                  onCheckedChange={(checked) => 
                    setColumnVisibility(prev => ({ ...prev, [col.accessorKey]: checked }))
                  }
                >
                  {col.header}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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

      {/* Contenido (Tabla o Grid) */}
      <div className="bg-white dark:bg-[#1a1b26] border border-slate-200 dark:border-[#2a2b3d] rounded-xl shadow-sm overflow-hidden flex flex-col">
        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-[#151621] text-slate-800 dark:text-slate-200 font-semibold text-xs border-b border-slate-200 dark:border-[#2a2b3d]">
                <tr>
                  {columnasVisibles.map((col) => {
                    const esColumnaActiva = columnaOrdenKey === col.accessorKey;
                    return (
                      <th
                        key={col.accessorKey}
                        onClick={() => toggleOrdenColumna(col.accessorKey)}
                        className={`px-5 py-3.5 font-semibold cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-[#2a2b3d] transition-colors ${
                          col.halign === "center" ? "text-center" : col.halign === "right" ? "text-right" : ""
                        }`}
                      >
                        <div className={`inline-flex items-center gap-1.5 ${col.halign === "center" ? "justify-center" : col.halign === "right" ? "justify-end" : ""}`}>
                          {col.header}
                          {esColumnaActiva ? (
                            direccionOrden === "asc" ? (
                              <ArrowUp className="w-3.5 h-3.5 text-blue-600 dark:text-[#e11d48]" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-blue-600 dark:text-[#e11d48]" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3 h-3 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100" />
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#2a2b3d]">
                {datosOrdenados.length === 0 ? (
                  <tr>
                    <td colSpan={columnasVisibles.length} className="px-6 py-16 text-center">
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
                  datosOrdenados.map((row, idx) => (
                    <tr
                      key={row.id || idx}
                      className="hover:bg-slate-50 dark:hover:bg-[#2a2b3d]/30 transition-colors"
                    >
                      {columnasVisibles.map((col) => (
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
        ) : (
          <div className="p-6">
            {datosOrdenados.length === 0 ? (
              <div className="py-16 text-center">
                {filaVacia || (
                  <div className="space-y-2">
                    <FileText className="w-12 h-12 text-slate-300 dark:text-[#3b3c54] mx-auto" />
                    <p className="text-slate-600 dark:text-slate-400 font-medium text-base">
                      Sin registros encontrados
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {renderCard && datosOrdenados.map((row, idx) => renderCard(row))}
              </div>
            )}
          </div>
        )}

        {/* Footer: Resumen */}
        {datosOrdenados.length > 0 && (
          <div className="px-5 py-3 bg-slate-50 dark:bg-[#151621] border-t border-slate-200 dark:border-[#2a2b3d] text-xs text-slate-500 dark:text-[#8e8ea0] flex justify-between items-center">
            <span>
              Mostrando <span className="font-bold text-slate-700 dark:text-white">{datosOrdenados.length}</span> de{" "}
              <span className="font-bold text-slate-700 dark:text-white">{datos.length}</span> registros
            </span>
            <span className="text-[10px] font-mono">SJM Platform</span>
          </div>
        )}
      </div>
    </div>
  );
}
