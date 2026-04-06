"use client";

import { TablaConsulta } from "@/components/TablaConsulta";
import { ModalCatalogo } from "@/components/forms/ModalCatalogo";
import { BotonEditar, BotonEliminar } from "@/components/forms/AccionesCatalogo";
import { MapPin } from "lucide-react";
import { crearEstadoAction, actualizarEstadoAction, eliminarEstadoAction } from "@/app/actions/catalogos";

export default function EstadosClientView({ datos }: { datos: any[] }) {
  return (
    <TablaConsulta
      datos={datos}
      titulo="Estados de la República"
      subtitulo="Catálogo geográfico de estados para asignación de ubicaciones."
      icono={<MapPin className="w-6 h-6 text-blue-600 dark:text-[#e11d48]" />}
      camposFiltro={["nombre"]}
      totalLabel="Total Estados"
      nombrePDF="Catalogo_Estados"
      acciones={
        <ModalCatalogo
          titulo="Nuevo Estado"
          textoBoton="Nuevo Estado"
          campos={[{ nombre: "nombre", label: "Nombre del Estado", requerido: true, placeholder: "Ej: Estado de México" }]}
          onSubmit={crearEstadoAction}
        />
      }
      columnas={[
        {
          header: "Estado",
          accessorKey: "nombre",
          cell: (val: any) => <span className="font-bold text-slate-900 dark:text-white">{val}</span>,
        },
        {
          header: "Acciones",
          accessorKey: "id",
          halign: "center" as const,
          cell: (_val: any, row: any) => (
            <div className="flex items-center justify-center gap-1">
              <BotonEditar id={row.id} titulo="Editar Estado" campos={[{ nombre: "nombre", label: "Nombre del Estado" }]} datosActuales={{ nombre: row.nombre }} onSubmit={actualizarEstadoAction} />
              <BotonEliminar id={row.id} nombre={row.nombre} onEliminar={eliminarEstadoAction} />
            </div>
          ),
        },
      ]}
    />
  );
}
