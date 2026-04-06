"use client";

import { TablaConsulta } from "@/components/TablaConsulta";
import { ModalCatalogo } from "@/components/forms/ModalCatalogo";
import { BotonEditar, BotonEliminar } from "@/components/forms/AccionesCatalogo";
import { Tag } from "lucide-react";
import { crearTipoEventoAction, actualizarTipoEventoAction, eliminarTipoEventoAction } from "@/app/actions/catalogos";

export default function TiposEventosClientView({ datos, organizacionId }: { datos: any[]; organizacionId: string }) {
  return (
    <TablaConsulta
      datos={datos}
      titulo="Tipos de Eventos"
      subtitulo="Clasificación de retiros, talleres, diplomados y encuentros."
      icono={<Tag className="w-6 h-6 text-blue-600 dark:text-[#e11d48]" />}
      camposFiltro={["nombre", "organizacion"]}
      totalLabel="Total Tipos"
      nombrePDF="Catalogo_TiposEventos"
      acciones={
        <ModalCatalogo
          titulo="Nuevo Tipo de Evento"
          textoBoton="Nuevo Tipo"
          campos={[
            { nombre: "nombre", label: "Nombre del Tipo", requerido: true, placeholder: "Ej: Retiro de Iniciación" },
            { nombre: "es_matrimonial", label: "¿Es matrimonial? (Pide datos del cónyuge)", tipo: "checkbox" },
          ]}
          datosExtra={{ organizacion_id: organizacionId }}
          onSubmit={crearTipoEventoAction}
        />
      }
      columnas={[
        {
          header: "Tipo de Evento",
          accessorKey: "nombre",
          cell: (val: any) => <span className="font-bold text-slate-900 dark:text-white">{val}</span>,
        },
        {
          header: "¿Matrimonial?",
          accessorKey: "es_matrimonial",
          halign: "center" as const,
          cell: (val: any) =>
            val ? (
              <span className="inline-flex items-center gap-1.5 bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase">💍 Sí</span>
            ) : (
              <span className="text-xs text-slate-400">No</span>
            ),
        },
        { header: "Organización", accessorKey: "organizacion" },
        {
          header: "Acciones",
          accessorKey: "id",
          halign: "center" as const,
          cell: (_val: any, row: any) => (
            <div className="flex items-center justify-center gap-1">
              <BotonEditar
                id={row.id}
                titulo="Editar Tipo de Evento"
                campos={[
                  { nombre: "nombre", label: "Nombre del Tipo" },
                  { nombre: "es_matrimonial", label: "¿Es matrimonial?", tipo: "checkbox" },
                ]}
                datosActuales={{ nombre: row.nombre, es_matrimonial: row.es_matrimonial }}
                onSubmit={actualizarTipoEventoAction}
              />
              <BotonEliminar id={row.id} nombre={row.nombre} onEliminar={eliminarTipoEventoAction} />
            </div>
          ),
        },
      ]}
    />
  );
}
