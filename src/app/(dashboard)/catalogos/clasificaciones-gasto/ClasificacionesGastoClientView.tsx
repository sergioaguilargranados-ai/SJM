"use client";

import { TablaConsulta } from "@/components/TablaConsulta";
import { ModalCatalogo } from "@/components/forms/ModalCatalogo";
import { BotonEditar, BotonEliminar } from "@/components/forms/AccionesCatalogo";
import { Wallet } from "lucide-react";
import { crearClasificacionGastoAction, actualizarClasificacionGastoAction, eliminarClasificacionGastoAction } from "@/app/actions/catalogos";

export default function ClasificacionesGastoClientView({ datos }: { datos: any[] }) {
  return (
    <TablaConsulta
      datos={datos}
      titulo="Clasificaciones de Gasto"
      subtitulo="Categorías para la clasificación de egresos por evento (Papelería, Despensa, Estipendios)."
      icono={<Wallet className="w-6 h-6 text-blue-600 dark:text-[#e11d48]" />}
      camposFiltro={["nombre"]}
      totalLabel="Total Clasificaciones"
      nombrePDF="Catalogo_ClasificacionesGasto"
      acciones={
        <ModalCatalogo
          titulo="Nueva Clasificación"
          textoBoton="Nueva Clasificación"
          campos={[{ nombre: "nombre", label: "Nombre de la Clasificación", requerido: true, placeholder: "Ej: Papelería" }]}
          onSubmit={crearClasificacionGastoAction}
        />
      }
      columnas={[
        {
          header: "Clasificación",
          accessorKey: "nombre",
          cell: (val: any) => <span className="font-bold text-slate-900 dark:text-white">{val}</span>,
        },
        {
          header: "Acciones",
          accessorKey: "id",
          halign: "center" as const,
          cell: (_val: any, row: any) => (
            <div className="flex items-center justify-center gap-1">
              <BotonEditar id={row.id} titulo="Editar Clasificación" campos={[{ nombre: "nombre", label: "Nombre" }]} datosActuales={{ nombre: row.nombre }} onSubmit={actualizarClasificacionGastoAction} />
              <BotonEliminar id={row.id} nombre={row.nombre} onEliminar={eliminarClasificacionGastoAction} />
            </div>
          ),
        },
      ]}
    />
  );
}
