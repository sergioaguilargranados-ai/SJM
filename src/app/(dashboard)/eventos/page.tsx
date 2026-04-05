import { getEventosRecientes } from "@/app/actions/consultas";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Download, Search, Plus, CalendarDays, MapPin, Target, DollarSign, Users, ChevronRight } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function ReporteRetiros() {
  const { data: eventos, success } = await getEventosRecientes();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header ERPCubox Style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1a1b26] p-6 rounded-xl border border-slate-200 dark:border-[#2a2b3d] shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
             <CalendarDays className="w-6 h-6 text-blue-600 dark:text-[#e11d48]" /> 
             Gestión de Retiros y Eventos
          </h1>
          <p className="text-sm text-slate-500 dark:text-[#8e8ea0] mt-1 italic">
            Planificación operativa y financiera de la obra.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/eventos/nuevo" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-[#e11d48] dark:hover:bg-[#be123c] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-100 dark:shadow-none">
            <Plus className="w-4 h-4" />
            Programar Retiro
          </Link>
        </div>
      </div>

      {/* Grid de Eventos / Retiros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!success || !eventos || eventos.length === 0 ? (
          <div className="md:col-span-3 py-20 text-center bg-white dark:bg-[#1a1b26] border border-dashed border-slate-300 dark:border-[#3b3c54] rounded-2xl">
             <Target className="w-12 h-12 text-slate-300 dark:text-[#3b3c54] mx-auto mb-4" />
             <p className="text-slate-600 dark:text-slate-400 font-medium">No hay retiros programados próximamente.</p>
             <Link href="/eventos/nuevo" className="text-blue-600 dark:text-[#e11d48] text-sm font-bold mt-2 inline-block">Comienza creando uno aquí</Link>
          </div>
        ) : (
          eventos.map((evt: any) => (
            <div key={evt.id} className="group bg-white dark:bg-[#1a1b26] border border-slate-200 dark:border-[#2a2b3d] rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col border-b-4 border-b-blue-600 dark:border-b-[#e11d48]">
               
               <div className="p-5 flex-1 space-y-4">
                  {/* Badge Estatus */}
                  <div className="flex justify-between items-start">
                     <span className={cn(
                       "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded",
                       evt.estatus === 'PLANEACION' ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                     )}>
                        {evt.estatus}
                     </span>
                     <div className="p-2 bg-slate-50 dark:bg-[#2a2b3d] rounded-lg">
                        <Users className="w-4 h-4 text-slate-400" />
                     </div>
                  </div>

                  <div className="space-y-1">
                     <h3 className="font-extrabold text-slate-900 dark:text-white text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-[#e11d48] transition-colors">{evt.tipo}</h3>
                     <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#8e8ea0] text-xs">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{evt.casa}</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-100 dark:border-[#2a2b3d]">
                     <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Fecha Inicio</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{evt.fecha_inicio ? format(new Date(evt.fecha_inicio), "dd MMM, yy", { locale: es }) : "TBD"}</p>
                     </div>
                     <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Costo Público</p>
                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">${evt.costo || "0"}</p>
                     </div>
                  </div>
               </div>

               <Link href={`/eventos/${evt.id}`} className="bg-slate-50 dark:bg-[#151621] p-4 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#e11d48] transition-colors">
                  VER DETALLES OPERATIVOS
                  <ChevronRight className="w-4 h-4" />
               </Link>
            </div>
          ))
        )}
      </div>

      {/* Floating Section for Reports/Exports */}
      <div className="bg-blue-600 dark:bg-[#e11d48] p-6 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-200 dark:shadow-none">
         <div className="flex items-center gap-4 text-center md:text-left">
            <div className="p-3 bg-white/20 rounded-xl">
               <DollarSign className="w-6 h-6" />
            </div>
            <div>
               <h4 className="font-bold text-lg leading-tight">Módulo de Ingresos SJM</h4>
               <p className="text-blue-100 dark:text-rose-100/80 text-sm">Gestiona donativos, becas y pagos de inscripciones de forma centralizada.</p>
            </div>
         </div>
         <button className="bg-white text-blue-600 dark:text-[#e11d48] px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors shrink-0">
            Exportar Corte de Caja
         </button>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
