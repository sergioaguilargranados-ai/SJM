"use client";

import { TablaConsulta } from "@/components/TablaConsulta";
import { Users, Trash2, Pencil } from "lucide-react";
import { eliminarInscripcionAction } from "@/app/actions/inscripciones";

export default function AsistentesEventoClientView({ inscritos, eventoNombre, isAdmin }: { inscritos: any[], eventoNombre: string, isAdmin?: boolean }) {

  const handleEliminar = async (id: string) => {
    if (!confirm("¿Eliminar este registro de inscripción?")) return;
    const res = await eliminarInscripcionAction(id);
    if (!res.success) {
      alert("Error: " + res.error);
    }
  };

  const columnasBase = [
    {
      header: "Nombre",
      accessorKey: "nombre_asistente",
      cell: (val: any) => <span className="font-bold text-slate-700 dark:text-slate-200">{val}</span>
    },
    { header: "WhatsApp", accessorKey: "telefono_celular" },
    { header: "Localidad", accessorKey: "pais_ciudad" },
    { header: "Ministerio", accessorKey: "ministerio_actual" },
    { 
      header: "Edad", 
      accessorKey: "edad", 
      halign: "center",
      cell: (val: any) => val ? `${val} años` : "—"
    },
    { 
      header: "Sexo", 
      accessorKey: "sexo", 
      halign: "center",
      cell: (val: any) => {
        if (!val) return "—";
        return <span className="uppercase text-[10px] font-bold tracking-wider px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300">{val}</span>;
      }
    },
    { 
      header: "Gafete", 
      accessorKey: "nombre_gafete",
      ocultarEnUI: true 
    },
    { 
      header: "Alergias/Salud", 
      accessorKey: "condiciones_salud",
      ocultarEnUI: true 
    }
  ];

  if (isAdmin) {
    columnasBase.push({
      header: "Acciones",
      accessorKey: "id",
      halign: "center",
      cell: (val: any, row: any) => (
        <div className="flex items-center justify-center gap-2">
          <a href={`/registro/${row.evento_id}`} title="Editar en Registro" className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-800/50 rounded-lg transition-colors">
            <Pencil className="w-4 h-4" />
          </a>
          <button onClick={() => handleEliminar(val)} title="Eliminar Registro" className="p-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/50 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    });
  }

  return (
    <TablaConsulta
      datos={inscritos}
      titulo="Asistentes Registrados"
      subtitulo={`Control de participantes inscritos a ${eventoNombre}`}
      icono={<Users className="w-5 h-5 text-blue-600 dark:text-[#e11d48]" />}
      camposFiltro={["nombre_asistente", "telefono_celular", "pais_ciudad", "ministerio_actual", "sexo"]}
      totalLabel="Asistentes"
      nombrePDF={`Asistentes_${eventoNombre.replace(/\s+/g, "_")}`}
      // @ts-ignore - The structure is correct but typescript might complain about the dynamic push
      columnas={columnasBase}
    />
  );
}

