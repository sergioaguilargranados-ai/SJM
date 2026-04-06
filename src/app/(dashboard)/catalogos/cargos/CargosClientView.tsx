"use client";

import { TablaConsulta } from "@/components/TablaConsulta";
import { ModalCatalogo } from "@/components/forms/ModalCatalogo";
import { BotonEditar, BotonEliminar } from "@/components/forms/AccionesCatalogo";
import { Award } from "lucide-react";
import { crearCargoAction, actualizarCargoAction, eliminarCargoAction } from "@/app/actions/catalogos";

export default function CargosClientView({ datos }: { datos: any[] }) {
  return (
    <TablaConsulta
      datos={datos}
      titulo="Catálogo de Cargos"
      subtitulo="Roles jerárquicos dentro de la comunidad (Coordinador, Subcoordinador, Apoyo)."
      icono={<Award className="w-6 h-6 text-blue-600 dark:text-[#e11d48]" />}
      camposFiltro={["nombre"]}
      totalLabel="Total Cargos"
      nombrePDF="Catalogo_Cargos"
      acciones={
        <ModalCatalogo
          titulo="Nuevo Cargo"
          textoBoton="Nuevo Cargo"
          campos={[{ nombre: "nombre", label: "Nombre del Cargo", requerido: true, placeholder: "Ej: Coordinador" }]}
          onSubmit={crearCargoAction}
        />
      }
      columnas={[
        {
          header: "Cargo",
          accessorKey: "nombre",
          cell: (val: any) => <span className="font-bold text-slate-900 dark:text-white">{val}</span>,
        },
        {
          header: "Acciones",
          accessorKey: "id",
          halign: "center" as const,
          cell: (_val: any, row: any) => (
            <div className="flex items-center justify-center gap-1">
              <BotonEditar id={row.id} titulo="Editar Cargo" campos={[{ nombre: "nombre", label: "Nombre del Cargo" }]} datosActuales={{ nombre: row.nombre }} onSubmit={actualizarCargoAction} />
              <BotonEliminar id={row.id} nombre={row.nombre} onEliminar={eliminarCargoAction} />
            </div>
          ),
        },
      ]}
    />
  );
}
