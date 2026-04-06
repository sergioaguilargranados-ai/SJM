"use client";

import { TablaConsulta } from "@/components/TablaConsulta";
import { ModalCatalogo } from "@/components/forms/ModalCatalogo";
import { Receipt } from "lucide-react";
import { crearGastoEventoAction } from "@/app/actions/catalogos";

export default function FinanzasClientView({ gastos, eventos, clasificaciones }: { gastos: any[]; eventos: any[]; clasificaciones: any[] }) {
  const totalGastos = gastos.reduce((sum, g) => sum + Number(g.monto || 0), 0);

  // Preparar opciones para el select de evento y clasificación (se pasan como placeholder)
  const eventosInfo = eventos.map((e: any) => `${e.id?.substring(0, 8)} | ${e.tipo_evento || "Evento"}`).join(", ");
  const clasifInfo = clasificaciones.map((c: any) => `${c.id?.substring(0, 8)} | ${c.nombre}`).join(", ");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* KPIs Resumen Financiero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1a1b26] p-6 rounded-2xl border border-slate-200 dark:border-[#2a2b3d] shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Egresos Registrados</p>
          <h2 className="text-3xl font-black text-red-600 dark:text-red-400">${totalGastos.toLocaleString("es-MX")}</h2>
        </div>
        <div className="bg-white dark:bg-[#1a1b26] p-6 rounded-2xl border border-slate-200 dark:border-[#2a2b3d] shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Movimientos</p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">{gastos.length}</h2>
        </div>
        <div className="bg-white dark:bg-[#1a1b26] p-6 rounded-2xl border border-slate-200 dark:border-[#2a2b3d] shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Promedio por Gasto</p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            ${gastos.length > 0 ? (totalGastos / gastos.length).toFixed(0) : "0"}
          </h2>
        </div>
      </div>

      {/* Tabla de Gastos */}
      <TablaConsulta
        datos={gastos}
        titulo="Módulo de Finanzas - Gastos por Evento"
        subtitulo="Control detallado de egresos por evento, clasificados por categoría."
        icono={<Receipt className="w-6 h-6 text-blue-600 dark:text-[#e11d48]" />}
        camposFiltro={["descripcion", "clasificacion", "evento_tipo", "registrado_por_nombre"]}
        campoFechaDesde="fecha_gasto"
        mostrarFiltroFecha={true}
        totalLabel="Total Gastos"
        nombrePDF="Reporte_Gastos_Eventos"
        acciones={
          <ModalCatalogo
            titulo="Registrar Nuevo Gasto"
            textoBoton="Nuevo Gasto"
            campos={[
              { nombre: "evento_id", label: "ID de Evento (UUID)", requerido: true, placeholder: "Pegar UUID del evento" },
              { nombre: "clasificacion_id", label: "ID de Clasificación (UUID)", requerido: true, placeholder: "Pegar UUID de clasificación" },
              { nombre: "monto", label: "Monto ($)", tipo: "number", requerido: true, placeholder: "500" },
              { nombre: "descripcion", label: "Descripción del Gasto", placeholder: "Ej: Compra de papelería para dinámicas" },
              { nombre: "fecha_gasto", label: "Fecha del Gasto", placeholder: "2026-04-05" },
            ]}
            onSubmit={crearGastoEventoAction}
          />
        }
        columnas={[
          {
            header: "Evento",
            accessorKey: "evento_tipo",
            cell: (val: any) => (
              <span className="inline-flex bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded text-[11px] font-bold">
                {val || "Sin evento"}
              </span>
            ),
          },
          {
            header: "Clasificación",
            accessorKey: "clasificacion",
            cell: (val: any) => (
              <span className="inline-flex bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-0.5 rounded text-[11px] font-bold">
                {val || "Sin clasificar"}
              </span>
            ),
          },
          { header: "Descripción", accessorKey: "descripcion" },
          {
            header: "Monto",
            accessorKey: "monto",
            halign: "right" as const,
            cell: (val: any) => <span className="font-bold text-red-600 dark:text-red-400">${Number(val || 0).toLocaleString("es-MX")}</span>,
          },
          {
            header: "Fecha Gasto",
            accessorKey: "fecha_gasto",
            cell: (val: any) => {
              if (!val) return "—";
              try { return <span className="text-xs">{new Date(val).toLocaleDateString("es-MX")}</span>; } catch { return "—"; }
            },
          },
          { header: "Registró", accessorKey: "registrado_por_nombre" },
        ]}
      />
    </div>
  );
}
