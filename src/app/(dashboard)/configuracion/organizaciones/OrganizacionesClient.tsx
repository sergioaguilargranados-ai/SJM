"use client";

import { useState } from "react";
import { TablaConsulta } from "@/components/TablaConsulta";
import { ModalCatalogo } from "@/components/forms/ModalCatalogo";
import { Building2, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { crearOrganizacionAction, updateOrganizacionAction, deleteOrganizacionAction } from "@/app/actions/configuracion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { sjmToast } from "@/components/ui/SjmToast";
import { useRouter } from "next/navigation";

function AccionesFilaOrganizacion({ row }: { row: any }) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const handleEliminar = async () => {
    if (confirm(`¿Estás seguro de que deseas eliminar la organización "${row.nombre}"?`)) {
      const res = await deleteOrganizacionAction(row.id);
      if (res.success) {
        sjmToast("Éxito", "Organización eliminada", "success");
        router.refresh();
      } else {
        sjmToast("Error", res.error || "Error al eliminar", "error");
      }
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setModalOpen(true)} className="cursor-pointer">
            <Pencil className="mr-2 h-4 w-4 text-blue-500" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEliminar} className="cursor-pointer text-red-600 focus:text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ModalCatalogo
        open={modalOpen}
        onOpenChange={setModalOpen}
        titulo="Editar Organización"
        textoBoton="Guardar Cambios"
        datosIniciales={row}
        campos={[
          { nombre: "nombre", label: "Nombre del Grupo/Movimiento", requerido: true, placeholder: "Ej: Jóvenes de la Luz" },
          { nombre: "dominio_tenant", label: "Dominio (Sin http/www)", placeholder: "Ej: jovenesdelaluz.org" },
          { nombre: "logo_url", label: "Logo", tipo: "file" },
          { nombre: "color_primario", label: "Color Primario (Hex)", placeholder: "#00B4AA" },
          { nombre: "color_secundario", label: "Color Secundario (Hex)", placeholder: "#1E3A5F" },
        ]}
        onSubmit={async (datos) => {
          return await updateOrganizacionAction(row.id, datos);
        }}
      />
    </>
  );
}

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
        {
          header: "",
          accessorKey: "acciones",
          halign: "right",
          ocultarEnUI: false,
          cell: (val: any, row: any) => <AccionesFilaOrganizacion row={row} />
        }
      ]}
    />
  );
}
