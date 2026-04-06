"use client";

import { TablaConsulta } from "@/components/TablaConsulta";
import { ModalCatalogo } from "@/components/forms/ModalCatalogo";
import { BotonEditar, BotonEliminar } from "@/components/forms/AccionesCatalogo";
import { Home } from "lucide-react";
import { crearCasaRetiroAction, actualizarCasaRetiroAction, eliminarCasaRetiroAction } from "@/app/actions/catalogos";

export default function CasasRetiroClientView({ datos }: { datos: any[] }) {
  return (
    <TablaConsulta
      datos={datos}
      titulo="Casas de Retiro"
      subtitulo="Espacios físicos disponibles para la realización de retiros y encuentros."
      icono={<Home className="w-6 h-6 text-blue-600 dark:text-[#e11d48]" />}
      camposFiltro={["nombre", "domicilio", "encargado"]}
      totalLabel="Total Casas"
      nombrePDF="Catalogo_CasasRetiro"
      acciones={
        <ModalCatalogo
          titulo="Nueva Casa de Retiro"
          textoBoton="Nueva Casa"
          campos={[
            { nombre: "nombre", label: "Nombre", requerido: true, placeholder: "Ej: Casa de Retiro San José" },
            { nombre: "domicilio", label: "Domicilio", placeholder: "Dirección completa" },
            { nombre: "encargado", label: "Encargado", placeholder: "Nombre del administrador" },
            { nombre: "telefonos", label: "Teléfonos", placeholder: "+52 722 000 0000" },
            { nombre: "costo_persona", label: "Costo por Persona ($)", tipo: "number", placeholder: "500" },
            { nombre: "capacidad", label: "Capacidad (personas)", tipo: "number", placeholder: "50" },
          ]}
          onSubmit={crearCasaRetiroAction}
        />
      }
      columnas={[
        {
          header: "Casa de Retiro",
          accessorKey: "nombre",
          cell: (val: any, row: any) => (
            <div>
              <span className="font-bold text-slate-900 dark:text-white">{val}</span>
              {row.domicilio && <div className="text-xs text-slate-500 dark:text-[#8e8ea0] mt-0.5 truncate max-w-[250px]">{row.domicilio}</div>}
            </div>
          ),
        },
        { header: "Encargado", accessorKey: "encargado" },
        { header: "Teléfonos", accessorKey: "telefonos" },
        {
          header: "$/Persona",
          accessorKey: "costo_persona",
          halign: "right" as const,
          cell: (val: any) => <span className="font-bold text-emerald-600 dark:text-emerald-400">${val || "0"}</span>,
        },
        {
          header: "Capacidad",
          accessorKey: "capacidad",
          halign: "center" as const,
          cell: (val: any) => <span className="font-bold">{val || "—"}</span>,
        },
        {
          header: "Estatus",
          accessorKey: "estatus",
          halign: "center" as const,
          cell: (val: any) =>
            val ? (
              <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Activa
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Inactiva
              </span>
            ),
        },
        {
          header: "Acciones",
          accessorKey: "id",
          halign: "center" as const,
          cell: (_val: any, row: any) => (
            <div className="flex items-center justify-center gap-1">
              <BotonEditar
                id={row.id}
                titulo="Editar Casa de Retiro"
                campos={[
                  { nombre: "nombre", label: "Nombre" },
                  { nombre: "domicilio", label: "Domicilio" },
                  { nombre: "encargado", label: "Encargado" },
                  { nombre: "telefonos", label: "Teléfonos" },
                  { nombre: "costo_persona", label: "Costo por Persona ($)", tipo: "number" },
                  { nombre: "capacidad", label: "Capacidad", tipo: "number" },
                ]}
                datosActuales={{
                  nombre: row.nombre,
                  domicilio: row.domicilio || "",
                  encargado: row.encargado || "",
                  telefonos: row.telefonos || "",
                  costo_persona: row.costo_persona || "",
                  capacidad: row.capacidad || "",
                }}
                onSubmit={actualizarCasaRetiroAction}
              />
              <BotonEliminar id={row.id} nombre={row.nombre} onEliminar={eliminarCasaRetiroAction} />
            </div>
          ),
        },
      ]}
    />
  );
}
