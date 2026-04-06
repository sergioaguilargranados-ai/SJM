"use client";

import { TablaConsulta } from "@/components/TablaConsulta";
import { ModalCatalogo } from "@/components/forms/ModalCatalogo";
import { BotonEditar, BotonEliminar } from "@/components/forms/AccionesCatalogo";
import { Music } from "lucide-react";
import { crearMinisterioAction, actualizarMinisterioAction, eliminarMinisterioAction } from "@/app/actions/catalogos";

export default function MinisteriosClientView({ datos, organizacionId }: { datos: any[]; organizacionId: string }) {
  return (
    <TablaConsulta
      datos={datos}
      titulo="Catálogo de Ministerios"
      subtitulo="Áreas de servicio dentro de la comunidad (Música, Liturgia, Cocina, etc.)."
      icono={<Music className="w-6 h-6 text-blue-600 dark:text-[#e11d48]" />}
      camposFiltro={["nombre", "descripcion", "organizacion"]}
      totalLabel="Total Ministerios"
      nombrePDF="Catalogo_Ministerios"
      acciones={
        <ModalCatalogo
          titulo="Nuevo Ministerio"
          textoBoton="Nuevo Ministerio"
          campos={[
            { nombre: "nombre", label: "Nombre del Ministerio", requerido: true, placeholder: "Ej: Música" },
            { nombre: "descripcion", label: "Descripción", placeholder: "Descripción breve del ministerio" },
          ]}
          datosExtra={{ organizacion_id: organizacionId }}
          onSubmit={crearMinisterioAction}
        />
      }
      columnas={[
        {
          header: "Ministerio",
          accessorKey: "nombre",
          cell: (val: any) => <span className="font-bold text-slate-900 dark:text-white">{val}</span>,
        },
        { header: "Descripción", accessorKey: "descripcion" },
        { header: "Organización", accessorKey: "organizacion" },
        {
          header: "Acciones",
          accessorKey: "id",
          halign: "center" as const,
          cell: (_val: any, row: any) => (
            <div className="flex items-center justify-center gap-1">
              <BotonEditar
                id={row.id}
                titulo="Editar Ministerio"
                campos={[
                  { nombre: "nombre", label: "Nombre del Ministerio" },
                  { nombre: "descripcion", label: "Descripción" },
                ]}
                datosActuales={{ nombre: row.nombre, descripcion: row.descripcion || "" }}
                onSubmit={actualizarMinisterioAction}
              />
              <BotonEliminar id={row.id} nombre={row.nombre} onEliminar={eliminarMinisterioAction} />
            </div>
          ),
        },
      ]}
    />
  );
}
