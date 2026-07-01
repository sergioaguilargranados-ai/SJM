"use client";

import { TablaConsulta } from "@/components/TablaConsulta";
import { ModalCatalogo } from "@/components/forms/ModalCatalogo";
import { Building2 } from "lucide-react";
import { crearOrganizacionAction } from "@/app/actions/configuracion";

export default function OrganizacionesClient({ datos }: { datos: any[] }) {
  return (
    <TablaConsulta
      datos={datos}
      titulo="Organizaciones (Marca Blanca)"
      subtitulo="Control de las organizaciones, grupos o diócesis registradas en la plataforma."
      icono={<Building2 className="w-6 h-6 text-blue-600 dark:text-[#e11d48]" />}
      camposFiltro={["nombre", "dominio_tenant"]}
      totalLabel="Organizaciones"
      nombrePDF="Reporte_Organizaciones"
      acciones={
        <ModalCatalogo
          titulo="Registrar Organización"
          textoBoton="Nueva Organización"
          campos={[
            { nombre: "nombre", label: "Nombre del Grupo/Movimiento", requerido: true, placeholder: "Ej: Jóvenes de la Luz" },
            { nombre: "dominio_tenant", label: "Dominio (Sin http/www)", placeholder: "Ej: jovenesdelaluz.org" },
            { nombre: "logo_url", label: "Logo", tipo: "file" },
            { nombre: "color_primario", label: "Color Primario (Hex)", placeholder: "#00B4AA" },
            { nombre: "color_secundario", label: "Color Secundario (Hex)", placeholder: "#1E3A5F" },
          ]}
          onSubmit={crearOrganizacionAction}
        />
      }
      columnas={[
        {
          header: "Organización",
          accessorKey: "nombre",
          cell: (val: any, row: any) => (
            <div className="flex items-center gap-3">
              {row.logo_url ? (
                <img src={row.logo_url} alt="Logo" className="w-8 h-8 rounded object-cover border border-slate-200 bg-white" />
              ) : (
                <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                  {val?.charAt(0)}
                </div>
              )}
              <div>
                <span className="font-bold text-slate-900 dark:text-white">{val}</span>
                {row.lema && <div className="text-[10px] text-slate-500 mt-0.5">{row.lema}</div>}
              </div>
            </div>
          ),
        },
        { 
          header: "Dominio", 
          accessorKey: "dominio_tenant",
          cell: (val: any) => val ? (
            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-mono text-slate-600 dark:text-slate-400">
              {val}
            </span>
          ) : "—"
        },
        { 
          header: "Colores", 
          accessorKey: "color_primario",
          cell: (val: any, row: any) => (
            <div className="flex gap-1">
              {row.color_primario && <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: row.color_primario }} title="Primario" />}
              {row.color_secundario && <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: row.color_secundario }} title="Secundario" />}
            </div>
          )
        },
        { header: "Contacto", accessorKey: "telefono_contacto" },
      ]}
    />
  );
}
