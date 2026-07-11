"use client";

import { TablaConsulta } from "@/components/TablaConsulta";
import { Users, Trash2, Pencil } from "lucide-react";
import { eliminarInscripcionAction } from "@/app/actions/inscripciones";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";

export default function AsistentesEventoClientView({ inscritos, eventoNombre, isAdmin }: { inscritos: any[], eventoNombre: string, isAdmin?: boolean }) {
  const [filtroSede, setFiltroSede] = useState("TODAS");
  const [filtroMinisterio, setFiltroMinisterio] = useState("TODOS");

  const handleEliminar = async (id: string) => {
    if (!confirm("¿Eliminar este registro de inscripción?")) return;
    const res = await eliminarInscripcionAction(id);
    if (!res.success) {
      alert("Error: " + res.error);
    }
  };

  const sedesUnicas = useMemo(() => {
    const s = new Set(inscritos.map(i => i.pais_ciudad).filter(Boolean));
    return Array.from(s).sort();
  }, [inscritos]);

  const ministeriosUnicos = useMemo(() => {
    const m = new Set(inscritos.map(i => i.ministerio_actual).filter(Boolean));
    return Array.from(m).sort();
  }, [inscritos]);

  const inscritosFiltrados = useMemo(() => {
    return inscritos.filter(i => {
      if (filtroSede !== "TODAS" && i.pais_ciudad !== filtroSede) return false;
      if (filtroMinisterio !== "TODOS" && i.ministerio_actual !== filtroMinisterio) return false;
      return true;
    });
  }, [inscritos, filtroSede, filtroMinisterio]);

  const columnasBase: any[] = [
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
        <div className="flex items-center gap-2">
          <a href={`/registro/${row.evento_id}?editId=${val}&returnTo=/eventos/${row.evento_id}`} title="Editar en Registro" className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-800/50 rounded-lg transition-colors">
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
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 max-w-7xl mx-auto p-4 bg-white dark:bg-[#1a1b26] rounded-xl border border-slate-200 dark:border-[#2a2b3d] shadow-sm">
        <div className="space-y-1.5 flex-1 min-w-[200px]">
          <label className="text-[10px] text-slate-500 dark:text-[#8e8ea0] font-bold uppercase tracking-wider">Filtrar por Sede (Localidad)</label>
          <Select value={filtroSede} onValueChange={setFiltroSede}>
            <SelectTrigger className="w-full bg-slate-50 dark:bg-[#0f1015]">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODAS">Todas las sedes</SelectItem>
              {sedesUnicas.map((s: string) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 flex-1 min-w-[200px]">
          <label className="text-[10px] text-slate-500 dark:text-[#8e8ea0] font-bold uppercase tracking-wider">Filtrar por Ministerio</label>
          <Select value={filtroMinisterio} onValueChange={setFiltroMinisterio}>
            <SelectTrigger className="w-full bg-slate-50 dark:bg-[#0f1015]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos los ministerios</SelectItem>
              {ministeriosUnicos.map((m: string) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <TablaConsulta
        datos={inscritosFiltrados}
        titulo="Asistentes Registrados"
        subtitulo={`Control de participantes inscritos a ${eventoNombre}`}
        icono={<Users className="w-5 h-5 text-blue-600 dark:text-[#e11d48]" />}
        camposFiltro={["nombre_asistente", "telefono_celular", "pais_ciudad", "ministerio_actual", "sexo"]}
        totalLabel="Asistentes"
        nombrePDF={`Asistentes_${eventoNombre.replace(/\s+/g, "_")}`}
        // @ts-ignore - The structure is correct but typescript might complain about the dynamic push
        columnas={columnasBase}
      />
    </div>
  );
}

