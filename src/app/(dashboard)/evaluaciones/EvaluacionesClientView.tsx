"use client";

import { TablaConsulta } from "@/components/TablaConsulta";
import { Star } from "lucide-react";

export default function EvaluacionesClientView({ datos }: { datos: any[] }) {
  return (
    <TablaConsulta
      datos={datos}
      titulo="Evaluaciones Post-Evento"
      subtitulo="Encuestas de satisfacción y retroalimentación de los asistentes."
      icono={<Star className="w-6 h-6 text-blue-600 dark:text-[#e11d48]" />}
      camposFiltro={["asistente", "evento_tipo", "tema_mas_gusto", "comentarios_sugerencias", "oficio_profesion"]}
      totalLabel="Total Evaluaciones"
      nombrePDF="Reporte_Evaluaciones"
      columnas={[
        {
          header: "Asistente",
          accessorKey: "asistente",
          cell: (val: any) => <span className="font-bold text-slate-900 dark:text-white">{val || "Anónimo"}</span>,
        },
        {
          header: "Evento",
          accessorKey: "evento_tipo",
          cell: (val: any) => (
            <span className="inline-flex bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded text-[11px] font-bold">
              {val || "—"}
            </span>
          ),
        },
        {
          header: "¿Cumplió?",
          accessorKey: "cumplio_expectativas",
          halign: "center" as const,
          cell: (val: any) =>
            val === true ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Sí</span>
            ) : val === false ? (
              <span className="text-red-600 dark:text-red-400 font-bold">✗ No</span>
            ) : "—",
        },
        {
          header: "Instalaciones",
          accessorKey: "calificacion_instalaciones",
          halign: "center" as const,
          cell: (val: any) => val != null ? <CalificacionEstrellas valor={val} /> : "—",
        },
        {
          header: "Alimentos",
          accessorKey: "calificacion_alimentos",
          halign: "center" as const,
          cell: (val: any) => val != null ? <CalificacionEstrellas valor={val} /> : "—",
        },
        {
          header: "Organización",
          accessorKey: "calificacion_organizacion",
          halign: "center" as const,
          cell: (val: any) => val != null ? <CalificacionEstrellas valor={val} /> : "—",
        },
        {
          header: "Tema Favorito",
          accessorKey: "tema_mas_gusto",
        },
        {
          header: "¿Integrarse?",
          accessorKey: "gustas_integrarte",
          halign: "center" as const,
          cell: (val: any) =>
            val ? (
              <span className="inline-flex bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded text-[11px] font-bold">Sí</span>
            ) : val === false ? (
              <span className="text-xs text-slate-400">No</span>
            ) : "—",
        },
      ]}
    />
  );
}

function CalificacionEstrellas({ valor }: { valor: number }) {
  const max = 5;
  return (
    <div className="flex items-center justify-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i < valor ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-600"}`}
        />
      ))}
      <span className="text-[10px] font-mono text-slate-400 ml-1">{valor}/{max}</span>
    </div>
  );
}
