"use client";

import { TablaConsulta } from "@/components/TablaConsulta";
import { ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ModalCrearServidor } from "@/components/forms/ModalCrearServidor";
import { ModalImportarServidores } from "@/components/forms/ModalImportarServidores";

export default function ServidoresClientView({ servidores, sedes, sedeId, organizacionId }: {
  servidores: any[];
  sedes: any[];
  sedeId: string;
  organizacionId: string;
}) {
  return (
    <TablaConsulta
      datos={servidores}
      titulo="Catálogo Directivo de Servidores"
      subtitulo="Organización y administración del capital humano de la comunidad."
      icono={<ShieldCheck className="w-6 h-6 text-blue-600 dark:text-[#e11d48]" />}
      camposFiltro={["nombre_completo", "correo", "celular", "sede"]}
      totalLabel="Total Activos"
      nombrePDF="Padron_Servidores"
      acciones={
        <>
          <ModalImportarServidores sedeId={sedeId} organizacionId={organizacionId} />
          <ModalCrearServidor sedes={sedes} />
        </>
      }
      columnas={[
        {
          header: "Gafete / Identidad",
          accessorKey: "nombre_completo",
          pdfKey: "nombre_completo",
          cell: (val: any, row: any) => (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 dark:bg-[#2a2b3d] dark:text-slate-300 flex items-center justify-center font-bold shadow-inner">
                {val?.charAt(0) || "U"}
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white leading-none">{val || "Usuario Sin Nombre"}</div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-[#8e8ea0] mt-1">ID: {row.id?.substring(0, 8)}</div>
              </div>
            </div>
          ),
        },
        {
          header: "Contacto Directo",
          accessorKey: "celular",
          cell: (val: any, row: any) => (
            <div>
              <div className="font-medium text-slate-800 dark:text-slate-200">{val || "Sin teléfono"}</div>
              <div className="text-xs text-slate-500 dark:text-[#8e8ea0] mt-0.5">{row.correo}</div>
            </div>
          ),
        },
        {
          header: "Sede / Ingreso",
          accessorKey: "sede",
          cell: (val: any, row: any) => (
            <div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{val}</div>
              <div className="text-xs text-slate-500 dark:text-[#8e8ea0] mt-0.5">
                Ingreso: {row.fecha_ingreso ? format(new Date(row.fecha_ingreso), "dd MMM yyyy", { locale: es }) : "No Especificado"}
              </div>
            </div>
          ),
        },
        {
          header: "Estatus",
          accessorKey: "estatus",
          halign: "center" as const,
          cell: (val: any) =>
            val ? (
              <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Activo
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Baja
              </span>
            ),
        },
      ]}
    />
  );
}
