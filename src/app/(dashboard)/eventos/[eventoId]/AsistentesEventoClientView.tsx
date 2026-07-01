"use client";

import { TablaConsulta } from "@/components/TablaConsulta";
import { Users } from "lucide-react";

export default function AsistentesEventoClientView({ inscritos, eventoNombre }: { inscritos: any[], eventoNombre: string }) {
  return (
    <TablaConsulta
      datos={inscritos}
      titulo="Asistentes Registrados"
      subtitulo={`Control de participantes inscritos a ${eventoNombre}`}
      icono={<Users className="w-5 h-5 text-blue-600 dark:text-[#e11d48]" />}
      camposFiltro={["nombre_asistente", "telefono_celular", "pais_ciudad", "ministerio_actual", "sexo"]}
      totalLabel="Asistentes"
      nombrePDF={`Asistentes_${eventoNombre.replace(/\s+/g, "_")}`}
      columnas={[
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
      ]}
    />
  );
}
