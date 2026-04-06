"use client";

import { TablaConsulta } from "@/components/TablaConsulta";
import { ModalCatalogo } from "@/components/forms/ModalCatalogo";
import { BotonEditar, BotonEliminar } from "@/components/forms/AccionesCatalogo";
import { Landmark } from "lucide-react";
import { crearSedeAction, actualizarSedeAction, eliminarSedeAction } from "@/app/actions/catalogos";

export function SedesClientView({ datos, organizacionId }: { datos: any[]; organizacionId: string }) {
  return (
    <TablaConsulta
      datos={datos}
      titulo="Catálogo de Sedes"
      subtitulo="Sucursales o sedes de la organización."
      icono={<Landmark className="w-6 h-6 text-blue-600 dark:text-[#e11d48]" />}
      camposFiltro={["nombre", "organizacion"]}
      totalLabel="Total Sedes"
      nombrePDF="Catalogo_Sedes"
      acciones={
        <ModalCatalogo
          titulo="Nueva Sede"
          textoBoton="Nueva Sede"
          campos={[{ nombre: "nombre", label: "Nombre de la Sede", requerido: true, placeholder: "Ej: Sede Monterrey" }]}
          datosExtra={{ organizacion_id: organizacionId }}
          onSubmit={crearSedeAction}
        />
      }
      columnas={[
        {
          header: "Nombre",
          accessorKey: "nombre",
          cell: (val: any) => <span className="font-bold text-slate-900 dark:text-white">{val}</span>,
        },
        { header: "Organización", accessorKey: "organizacion" },
        {
          header: "Acciones",
          accessorKey: "id",
          halign: "center" as const,
          cell: (_val: any, row: any) => (
            <div className="flex items-center justify-center gap-1">
              <BotonEditar id={row.id} titulo="Editar Sede" campos={[{ nombre: "nombre", label: "Nombre de la Sede" }]} datosActuales={{ nombre: row.nombre }} onSubmit={actualizarSedeAction} />
              <BotonEliminar id={row.id} nombre={row.nombre} onEliminar={eliminarSedeAction} />
            </div>
          ),
        },
      ]}
    />
  );
}
