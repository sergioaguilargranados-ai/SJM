"use client";

import { TablaConsulta } from "@/components/TablaConsulta";
import { ClipboardList } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { SelectorEstatus } from "./SelectorEstatus";

export default function InscripcionesClientView({ datos }: { datos: any[] }) {
  return (
    <TablaConsulta
      datos={datos}
      titulo="Consulta de Inscripciones"
      subtitulo="Historial completo de todas las solicitudes de inscripción a retiros y eventos."
      icono={<ClipboardList className="w-6 h-6 text-blue-600 dark:text-[#e11d48]" />}
      camposFiltro={["nombre_asistente", "correo", "telefono_celular", "pais_ciudad", "ministerio_actual", "evento_tipo"]}
      campoFechaDesde="creado_en"
      mostrarFiltroFecha={true}
      totalLabel="Total Inscripciones"
      nombrePDF="Reporte_Inscripciones"
      columnas={[
        {
          header: "Asistente",
          accessorKey: "nombre_asistente",
          cell: (val: any, row: any) => (
            <div>
              <span className="font-bold text-slate-900 dark:text-white">{val}</span>
              {row.correo && <div className="text-xs text-slate-500 dark:text-[#8e8ea0] mt-0.5">{row.correo}</div>}
            </div>
          ),
        },
        { header: "Correo Electrónico", accessorKey: "correo", ocultarEnUI: true },
        {
          header: "Evento",
          accessorKey: "evento_tipo",
          cell: (val: any) => (
            <span className="inline-flex bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded text-[11px] font-bold">
              {val || "Sin evento"}
            </span>
          ),
        },
        { header: "Celular", accessorKey: "telefono_celular" },
        { header: "Localidad", accessorKey: "pais_ciudad" },
        {
          header: "Estatus",
          accessorKey: "estatus_solicitud",
          halign: "center" as const,
          cell: (_val: any, row: any) => (
            <SelectorEstatus inscripcionId={row.id} estatusActual={row.estatus_solicitud} />
          ),
        },
        {
          header: "Aportación",
          accessorKey: "pago_deposito",
          halign: "right" as const,
          cell: (val: any, row: any) => {
            const total = Number(val || 0) + Number(row.pago_efectivo || 0);
            return <span className="font-bold text-emerald-600 dark:text-emerald-400">${total.toFixed(0)}</span>;
          },
        },
        {
          header: "Fecha",
          accessorKey: "creado_en",
          cell: (val: any) => {
            if (!val) return "—";
            try {
              return <span className="text-xs">{format(new Date(val), "dd MMM yyyy", { locale: es })}</span>;
            } catch {
              return "—";
            }
          },
        },
      ]}
    />
  );
}
