"use client";

import { TablaConsulta } from "@/components/TablaConsulta";
import { ClipboardList } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { SelectorEstatus } from "./SelectorEstatus";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function InscripcionesClientView({ 
  datos,
  catalogoSedes = [],
  catalogoMinisterios = []
}: { 
  datos: any[],
  catalogoSedes?: any[],
  catalogoMinisterios?: any[]
}) {
  const [filtroSede, setFiltroSede] = useState("TODAS");
  const [filtroMinisterio, setFiltroMinisterio] = useState("TODOS");
  const [filtroEvento, setFiltroEvento] = useState("TODOS");
  const [filtroRetiro, setFiltroRetiro] = useState("TODOS");
  const [filtroEstatusRetiro, setFiltroEstatusRetiro] = useState("ACTIVOS");
  const [filtroEdad, setFiltroEdad] = useState("TODAS");

  const sedesList = useMemo(() => {
    if (catalogoSedes.length > 0) return catalogoSedes.map(s => s.nombre).sort();
    const sedes = new Set(datos.map(d => d.pais_ciudad).filter(Boolean));
    return Array.from(sedes).sort();
  }, [datos, catalogoSedes]);

  const ministeriosList = useMemo(() => {
    if (catalogoMinisterios.length > 0) return catalogoMinisterios.map(m => m.nombre).sort();
    const min = new Set(datos.map(d => d.ministerio_actual).filter(Boolean));
    return Array.from(min).sort();
  }, [datos, catalogoMinisterios]);

  const eventosUnicos = useMemo(() => {
    const eventos = new Set(datos.map(d => d.evento_tipo).filter(Boolean));
    return Array.from(eventos).sort();
  }, [datos]);

  const retirosUnicos = useMemo(() => {
    // Solo mostrar los retiros (eventos específicos) que cumplan con el filtro de estatus si está activo
    const filtrados = datos.filter(d => {
      if (filtroEstatusRetiro === "TODOS") return true;
      return ["PLANEACION", "PROXIMA", "EN_CURSO"].includes(d.evento_estatus);
    });
    const ret = new Set(filtrados.map(d => d.evento_nombre).filter(Boolean));
    return Array.from(ret).sort();
  }, [datos, filtroEstatusRetiro]);

  const normalizeString = (str: string | undefined | null) => {
    if (!str) return "";
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const datosFiltrados = useMemo(() => {
    return datos.filter((row) => {
      if (filtroSede !== "TODAS" && normalizeString(row.pais_ciudad) !== normalizeString(filtroSede)) return false;
      if (filtroMinisterio !== "TODOS" && normalizeString(row.ministerio_actual) !== normalizeString(filtroMinisterio)) return false;
      if (filtroEvento !== "TODOS" && row.evento_tipo !== filtroEvento) return false;
      if (filtroRetiro !== "TODOS" && row.evento_nombre !== filtroRetiro) return false;
      
      if (filtroEstatusRetiro === "ACTIVOS") {
        if (!["PLANEACION", "PROXIMA", "EN_CURSO"].includes(row.evento_estatus)) return false;
      }
      
      if (filtroEdad !== "TODAS") {
        const edad = row.edad;
        if (filtroEdad === "0-18" && (edad == null || edad > 18)) return false;
        if (filtroEdad === "19-30" && (edad == null || edad < 19 || edad > 30)) return false;
        if (filtroEdad === "31-50" && (edad == null || edad < 31 || edad > 50)) return false;
        if (filtroEdad === "51+" && (edad == null || edad <= 50)) return false;
      }
      
      return true;
    });
  }, [datos, filtroSede, filtroMinisterio, filtroEvento, filtroRetiro, filtroEstatusRetiro, filtroEdad]);

  // Si cambia el filtro de estatus, limpiar el filtro de retiro si ya no aplica
  const onEstatusRetiroChange = (val: string) => {
    setFiltroEstatusRetiro(val);
    setFiltroRetiro("TODOS");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 max-w-full mx-auto p-4 bg-white dark:bg-[#1a1b26] rounded-xl border border-slate-200 dark:border-[#2a2b3d] shadow-sm">
        <div className="space-y-1.5 min-w-0">
          <label className="text-[10px] text-slate-500 dark:text-[#8e8ea0] font-bold uppercase tracking-wider line-clamp-1">Sede</label>
          <Select value={filtroSede} onValueChange={setFiltroSede}>
            <SelectTrigger className="w-full bg-slate-50 dark:bg-[#0f1015]">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODAS">Todas las sedes</SelectItem>
              {sedesList.map((s: string) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 min-w-0">
          <label className="text-[10px] text-slate-500 dark:text-[#8e8ea0] font-bold uppercase tracking-wider line-clamp-1">Ministerio</label>
          <Select value={filtroMinisterio} onValueChange={setFiltroMinisterio}>
            <SelectTrigger className="w-full bg-slate-50 dark:bg-[#0f1015]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos los ministerios</SelectItem>
              {ministeriosList.map((m: string) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 min-w-0">
          <label className="text-[10px] text-slate-500 dark:text-[#8e8ea0] font-bold uppercase tracking-wider line-clamp-1">Evento (Tipo)</label>
          <Select value={filtroEvento} onValueChange={setFiltroEvento}>
            <SelectTrigger className="w-full bg-slate-50 dark:bg-[#0f1015]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos</SelectItem>
              {eventosUnicos.map((e: string) => (
                <SelectItem key={e} value={e}>{e}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 min-w-0">
          <label className="text-[10px] text-slate-500 dark:text-[#8e8ea0] font-bold uppercase tracking-wider line-clamp-1">Retiros</label>
          <Select value={filtroRetiro} onValueChange={setFiltroRetiro}>
            <SelectTrigger className="w-full bg-slate-50 dark:bg-[#0f1015]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos</SelectItem>
              {retirosUnicos.map((e: string) => (
                <SelectItem key={e} value={e}>{e}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 min-w-0">
          <label className="text-[10px] text-slate-500 dark:text-[#8e8ea0] font-bold uppercase tracking-wider line-clamp-1">Estatus Retiro</label>
          <Select value={filtroEstatusRetiro} onValueChange={onEstatusRetiroChange}>
            <SelectTrigger className="w-full bg-slate-50 dark:bg-[#0f1015]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVOS">Solo Activos</SelectItem>
              <SelectItem value="TODOS">Todos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 min-w-0">
          <label className="text-[10px] text-slate-500 dark:text-[#8e8ea0] font-bold uppercase tracking-wider line-clamp-1">Rango de Edad</label>
          <Select value={filtroEdad} onValueChange={setFiltroEdad}>
            <SelectTrigger className="w-full bg-slate-50 dark:bg-[#0f1015]">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODAS">Todas las edades</SelectItem>
              <SelectItem value="0-18">Menores (0-18)</SelectItem>
              <SelectItem value="19-30">Jóvenes (19-30)</SelectItem>
              <SelectItem value="31-50">Adultos (31-50)</SelectItem>
              <SelectItem value="51+">Mayores (51+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <TablaConsulta
        datos={datosFiltrados}
        titulo="Consulta de Inscripciones"
        subtitulo="Historial completo de todas las solicitudes de inscripción a retiros y eventos."
        icono={<ClipboardList className="w-6 h-6 text-blue-600 dark:text-[#e11d48]" />}
        camposFiltro={["nombre_asistente", "correo", "telefono_celular", "pais_ciudad", "ministerio_actual", "evento_tipo"]}
        campoFechaDesde="creado_en"
        mostrarFiltroFecha={true}
        totalLabel="Total Inscripciones"
        nombrePDF="Reporte_Inscripciones"
        columnas={[
          {
            header: "Asistente",
            accessorKey: "nombre_asistente",
            cell: (val: any, row: any) => (
              <div>
                <span className="font-bold text-slate-900 dark:text-white">{val}</span>
                {row.correo && <div className="text-xs text-slate-500 dark:text-[#8e8ea0] mt-0.5">{row.correo}</div>}
              </div>
            ),
          },
          { header: "Correo Electrónico", accessorKey: "correo", ocultarEnUI: true },
          {
            header: "Evento",
            accessorKey: "evento_tipo",
            cell: (val: any) => (
              <span className="inline-flex bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded text-[11px] font-bold">
                {val || "Sin evento"}
              </span>
            ),
          },
          { header: "Sede (Participante)", accessorKey: "pais_ciudad" },
          { header: "Ministerio", accessorKey: "ministerio_actual" },
          { header: "Edad", accessorKey: "edad", halign: "center", cell: (val: any) => val ? `${val} años` : "—" },
          { header: "Sexo", accessorKey: "sexo", halign: "center", cell: (val: any) => {
            if (!val) return "—";
            return <span className="uppercase text-[10px] font-bold tracking-wider px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300">{val}</span>;
          } },
          { header: "Celular", accessorKey: "telefono_celular" },
          { header: "Localidad", accessorKey: "pais_ciudad" },
          {
            header: "Estatus",
            accessorKey: "estatus_solicitud",
            halign: "center" as const,
            cell: (_val: any, row: any) => (
              <SelectorEstatus inscripcionId={row.id} estatusActual={row.estatus_solicitud} />
            ),
          },
          {
            header: "Aportación",
            accessorKey: "pago_deposito",
            halign: "right" as const,
            cell: (val: any, row: any) => {
              const total = Number(val || 0) + Number(row.pago_efectivo || 0);
              return <span className="font-bold text-emerald-600 dark:text-emerald-400">${total.toFixed(0)}</span>;
            },
          },
          {
            header: "Fecha",
            accessorKey: "creado_en",
            cell: (val: any) => {
              if (!val) return "—";
              try {
                return <span className="text-xs">{format(new Date(val), "dd MMM yyyy", { locale: es })}</span>;
              } catch {
                return "—";
              }
            },
          },
        ]}
      />
    </div>
  );
}
