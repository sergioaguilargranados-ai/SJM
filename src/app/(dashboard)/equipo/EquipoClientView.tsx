"use client";

import { TablaConsulta } from "@/components/TablaConsulta";
import { UsersRound } from "lucide-react";

export default function EquipoClientView({ datos }: { datos: any[] }) {
  return (
    <TablaConsulta
      datos={datos}
      titulo="Equipo Asignado por Evento"
      subtitulo="Control de servidores asignados a cada retiro, con cargo, aportación y estatus."
      icono={<UsersRound className="w-6 h-6 text-blue-600 dark:text-[#e11d48]" />}
      camposFiltro={["servidor_nombre", "cargo", "evento_tipo", "asignaciones"]}
      totalLabel="Total Asignaciones"
      nombrePDF="Reporte_EquipoEventos"
      columnas={[
        {
          header: "Servidor",
          accessorKey: "servidor_nombre",
          cell: (val: any) => (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 dark:bg-[#2a2b3d] dark:text-slate-300 flex items-center justify-center font-bold text-xs shadow-inner">
                {val?.charAt(0) || "S"}
              </div>
              <span className="font-bold text-slate-900 dark:text-white">{val || "Sin asignar"}</span>
            </div>
          ),
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
          header: "Cargo en Evento",
          accessorKey: "cargo",
          cell: (val: any) => (
            <span className="inline-flex bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-0.5 rounded text-[11px] font-bold">
              {val || "Sin cargo"}
            </span>
          ),
        },
        {
          header: "Asignaciones",
          accessorKey: "asignaciones",
          cell: (val: any) => <span className="text-xs text-slate-600 dark:text-slate-300">{val || "—"}</span>,
        },
        {
          header: "Aportación",
          accessorKey: "aportacion_economica",
          halign: "right" as const,
          cell: (val: any) => <span className="font-bold text-emerald-600 dark:text-emerald-400">${Number(val || 0).toLocaleString("es-MX")}</span>,
        },
        {
          header: "Estatus",
          accessorKey: "estatus",
          halign: "center" as const,
          cell: (val: any) => {
            const colores: Record<string, string> = {
              ACTIVO: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
              CONFIRMADO: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
              BAJA: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            };
            return (
              <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${colores[val] || "bg-slate-100 text-slate-600"}`}>
                {val || "ACTIVO"}
              </span>
            );
          },
        },
      ]}
    />
  );
}
