import { getDashboardStats, getEventosRecientes } from "@/app/actions/consultas";
import { Users, CalendarDays, TrendingUp, DollarSign, ArrowUpRight, Activity, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [statsRes, eventosRes] = await Promise.all([
    getDashboardStats(),
    getEventosRecientes()
  ]);

  const stats = statsRes.data;
  const eventos = (eventosRes.data || []).slice(0, 3); // Solo los 3 más próximos

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header con Bienvenida Dinámica */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Panel de Control SJM</h1>
          <p className="text-slate-500 dark:text-[#8e8ea0] mt-1 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            Estado actual de la obra y operaciones en tiempo real.
          </p>
        </div>
        <div className="text-right hidden md:block">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Última actualización</p>
           <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{format(new Date(), "dd MMMM, HH:mm", { locale: es })}</p>
        </div>
      </div>

      {/* Grid de KPIs - Estilo Premium ERPCubox */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card: Servidores */}
        <div className="bg-white dark:bg-[#1a1b26] p-6 rounded-2xl border border-slate-200 dark:border-[#2a2b3d] shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl group-hover:bg-blue-600 dark:group-hover:bg-[#e11d48] transition-colors">
              <Users className="w-6 h-6 text-blue-600 dark:text-[#e11d48] group-hover:text-white" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full flex items-center gap-1">
               <ArrowUpRight className="w-3 h-3" /> +12%
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Padrón de Servidores</p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">{stats.servidores}</h2>
        </div>

        {/* Card: Inscripciones */}
        <div className="bg-white dark:bg-[#1a1b26] p-6 rounded-2xl border border-slate-200 dark:border-[#2a2b3d] shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl group-hover:bg-indigo-600 transition-colors">
              <TrendingUp className="w-6 h-6 text-indigo-600 group-hover:text-white" />
            </div>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-full flex items-center gap-1">
               <Activity className="w-3 h-3" /> Activo
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Inscripciones Totales</p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">{stats.inscritos}</h2>
        </div>

        {/* Card: Eventos */}
        <div className="bg-white dark:bg-[#1a1b26] p-6 rounded-2xl border border-slate-200 dark:border-[#2a2b3d] shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl group-hover:bg-amber-600 transition-colors">
              <CalendarDays className="w-6 h-6 text-amber-600 group-hover:text-white" />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Retiros Programados</p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">{stats.eventos}</h2>
        </div>

        {/* Card: Ingresos */}
        <div className="bg-white dark:bg-[#1a1b26] p-6 rounded-2xl border border-slate-200 dark:border-[#2a2b3d] shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl group-hover:bg-emerald-600 transition-colors">
              <DollarSign className="w-6 h-6 text-emerald-600 group-hover:text-white" />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Ingresos Proyectados</p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            ${new Intl.NumberFormat('es-MX').format(stats.ingresos)}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Próximas Actividades */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1b26] border border-slate-200 dark:border-[#2a2b3d] rounded-2xl shadow-sm">
           <div className="p-6 border-b border-slate-100 dark:border-[#2a2b3d] flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                 <Clock className="w-5 h-5 text-blue-500" />
                 Próximos Retiros en Agenda
              </h3>
              <Link href="/eventos" className="text-xs font-bold text-blue-600 dark:text-[#e11d48] hover:underline">VER TODO</Link>
           </div>
           <div className="p-0">
             {eventos.length === 0 ? (
               <div className="p-12 text-center text-slate-400 text-sm italic">No hay eventos próximos.</div>
             ) : (
                <div className="divide-y divide-slate-100 dark:divide-[#2a2b3d]">
                   {eventos.map((evt: any) => (
                      <div key={evt.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-[#151621] transition-colors">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-[#2a2b3d] rounded-xl flex flex-col items-center justify-center text-slate-600 dark:text-slate-300">
                               <span className="text-[10px] font-bold uppercase">{evt.fecha_inicio ? format(new Date(evt.fecha_inicio), "MMM", { locale: es }) : "S/F"}</span>
                               <span className="text-lg font-black leading-none">{evt.fecha_inicio ? format(new Date(evt.fecha_inicio), "dd") : "--"}</span>
                            </div>
                            <div>
                               <p className="font-bold text-slate-900 dark:text-white leading-tight">{evt.tipo}</p>
                               <p className="text-xs text-slate-500 dark:text-[#8e8ea0]">{evt.casa}</p>
                            </div>
                         </div>
                         <Link href={`/eventos`} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                         </Link>
                      </div>
                   ))}
                </div>
             )}
           </div>
        </div>

        {/* Accesos Rápidos / Estado Sede */}
        <div className="space-y-6">
           <div className="bg-blue-600 dark:bg-[#e11d48] p-8 rounded-3xl text-white shadow-xl shadow-blue-100 dark:shadow-none overflow-hidden relative group">
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-2">Acceso a Servidores</h3>
                <p className="text-blue-100 dark:text-rose-100 text-sm mb-6 opacity-90">Gestiona la base de datos de capital humano de la obra.</p>
                <Link href="/servidores" className="bg-white text-blue-600 dark:text-[#e11d48] px-6 py-2.5 rounded-xl font-bold text-sm inline-block shadow-lg hover:scale-105 transition-transform">
                   Gestionar Catálogo
                </Link>
              </div>
              <Users className="w-32 h-32 absolute -bottom-8 -right-8 opacity-10 group-hover:scale-110 transition-transform" />
           </div>

           <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-200 dark:shadow-none overflow-hidden relative group">
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-2">Configuración</h3>
                <p className="text-slate-400 text-sm mb-6 opacity-90">Personaliza los datos de tu sede y marca blanca.</p>
                <Link href="/configuracion" className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl font-bold text-sm inline-block border border-white/20 transition-colors">
                   Ir a Ajustes
                </Link>
              </div>
              <Activity className="w-32 h-32 absolute -bottom-8 -right-8 opacity-10 group-hover:rotate-12 transition-transform" />
           </div>
        </div>

      </div>

    </div>
  );
}
