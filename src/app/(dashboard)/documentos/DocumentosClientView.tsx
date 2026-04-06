"use client";

import { TablaConsulta } from "@/components/TablaConsulta";
import { ModalCatalogo } from "@/components/forms/ModalCatalogo";
import { FileText, ExternalLink } from "lucide-react";
import { crearDocumentoAction } from "@/app/actions/catalogos";

export default function DocumentosClientView({ datos, organizacionId }: { datos: any[]; organizacionId: string }) {
  return (
    <TablaConsulta
      datos={datos}
      titulo="Gestor Documental"
      subtitulo="Manuales, políticas, cartas, certificados y materiales institucionales."
      icono={<FileText className="w-6 h-6 text-blue-600 dark:text-[#e11d48]" />}
      camposFiltro={["nombre", "descripcion", "nivel_acceso_rol", "organizacion"]}
      campoFechaDesde="fecha_subida"
      mostrarFiltroFecha={true}
      totalLabel="Total Documentos"
      nombrePDF="Reporte_Documentos"
      acciones={
        <ModalCatalogo
          titulo="Registrar Documento"
          textoBoton="Nuevo Documento"
          campos={[
            { nombre: "nombre", label: "Nombre del Documento", requerido: true, placeholder: "Ej: Manual del Coordinador" },
            { nombre: "descripcion", label: "Descripción", placeholder: "Descripción breve" },
            { nombre: "url_archivo", label: "URL del Archivo", requerido: true, tipo: "url", placeholder: "https://..." },
            { nombre: "nivel_acceso_rol", label: "Nivel de Acceso (Rol)", placeholder: "SUPER_ADMIN, ADMIN_ORG, OPERATIVO_SEDE, SERVIDOR" },
          ]}
          datosExtra={{ organizacion_id: organizacionId }}
          onSubmit={crearDocumentoAction}
        />
      }
      columnas={[
        {
          header: "Documento",
          accessorKey: "nombre",
          cell: (val: any, row: any) => (
            <div>
              <span className="font-bold text-slate-900 dark:text-white">{val}</span>
              {row.descripcion && <div className="text-xs text-slate-500 dark:text-[#8e8ea0] mt-0.5 max-w-[300px] truncate">{row.descripcion}</div>}
            </div>
          ),
        },
        {
          header: "Nivel de Acceso",
          accessorKey: "nivel_acceso_rol",
          halign: "center" as const,
          cell: (val: any) => {
            const colores: Record<string, string> = {
              SUPER_ADMIN: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
              ADMIN_ORG: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
              OPERATIVO_SEDE: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
              SERVIDOR: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
            };
            return (
              <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${colores[val] || "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
                {val || "Público"}
              </span>
            );
          },
        },
        { header: "Organización", accessorKey: "organizacion" },
        {
          header: "Archivo",
          accessorKey: "url_archivo",
          halign: "center" as const,
          cell: (val: any) =>
            val ? (
              <a href={val} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 dark:text-[#e11d48] hover:underline text-xs font-bold">
                <ExternalLink className="w-3 h-3" /> Abrir
              </a>
            ) : "—",
        },
        {
          header: "Fecha Subida",
          accessorKey: "fecha_subida",
          cell: (val: any) => {
            if (!val) return "—";
            try { return <span className="text-xs">{new Date(val).toLocaleDateString("es-MX")}</span>; } catch { return "—"; }
          },
        },
      ]}
    />
  );
}
