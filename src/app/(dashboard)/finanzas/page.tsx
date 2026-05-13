import { getEventosRecientes } from "@/app/actions/consultas";
import { getResumenFinancieroEvento } from "@/app/actions/finanzas";
import Link from "next/link";
import { Receipt, TrendingUp, TrendingDown, DollarSign, ArrowRight, Calendar, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function FinanzasPage() {
  const { data: eventosData } = await getEventosRecientes();
  
  // Obtener resúmenes de los eventos más recientes (limitado a 5 para no saturar)
  const eventosRecientes = eventosData?.slice(0, 5) || [];
  
  // En un caso real, haríamos un join o una query agregada, 
  // pero para este módulo usaremos lo que tenemos.
  const resumenesPromesas = eventosRecientes.map(e => getResumenFinancieroEvento(e.id));
  const resumenes = await Promise.all(resumenesPromesas);

  const eventosConFinanzas = eventosRecientes.map((e, index) => ({
    ...e,
    finanzas: resumenes[index].data
  }));

  const totalIngresos = eventosConFinanzas.reduce((acc, curr) => acc + (curr.finanzas?.ingresos || 0), 0);
  const totalGastos = eventosConFinanzas.reduce((acc, curr) => acc + (curr.finanzas?.gastos || 0), 0);
  const balanceTotal = totalIngresos - totalGastos;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Finanzas y Rentabilidad</h1>
          <p className="text-slate-500 dark:text-[#8e8ea0] font-medium mt-1">Control de ingresos y egresos por evento</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1a1b26] p-6 rounded-[24px] border border-slate-200 dark:border-[#2a2b3d] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-16 h-16 text-emerald-500" />
          </div>
          <p className="text-xs font-bold text-slate-400 dark:text-[#5e5e72] uppercase tracking-widest mb-1">Ingresos Totales (Recientes)</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white">${totalIngresos.toLocaleString()}</h3>
          <p className="text-[10px] text-emerald-500 font-bold mt-2 flex items-center gap-1">
             <TrendingUp className="w-3 h-3" /> Basado en inscripciones pagadas
          </p>
        </div>

        <div className="bg-white dark:bg-[#1a1b26] p-6 rounded-[24px] border border-slate-200 dark:border-[#2a2b3d] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingDown className="w-16 h-16 text-red-500" />
          </div>
          <p className="text-xs font-bold text-slate-400 dark:text-[#5e5e72] uppercase tracking-widest mb-1">Gastos Operativos (Recientes)</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white">${totalGastos.toLocaleString()}</h3>
          <p className="text-[10px] text-red-500 font-bold mt-2 flex items-center gap-1">
             <TrendingDown className="w-3 h-3" /> Facturas y recibos cargados
          </p>
        </div>

        <div className="bg-white dark:bg-[#1a1b26] p-6 rounded-[24px] border border-slate-200 dark:border-[#2a2b3d] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <DollarSign className="w-16 h-16 text-[#00B4AA]" />
          </div>
          <p className="text-xs font-bold text-slate-400 dark:text-[#5e5e72] uppercase tracking-widest mb-1">Balance Neto</p>
          <h3 className={cn(
            "text-3xl font-black tracking-tight",
            balanceTotal >= 0 ? "text-[#00B4AA]" : "text-red-500"
          )}>
            ${balanceTotal.toLocaleString()}
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-[#8e8ea0] font-bold mt-2">Utilidad real de la operación</p>
        </div>
      </div>

      {/* Lista de Eventos */}
      <div className="bg-white dark:bg-[#1a1b26] rounded-[32px] border border-slate-200 dark:border-[#2a2b3d] shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-[#2a2b3d] flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#00B4AA]" />
            Rentabilidad por Evento
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-[#212230]/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-[#5e5e72] uppercase tracking-widest">Evento</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-[#5e5e72] uppercase tracking-widest text-right">Ingresos</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-[#5e5e72] uppercase tracking-widest text-right">Gastos</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-[#5e5e72] uppercase tracking-widest text-right">Margen</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#2a2b3d]">
              {eventosConFinanzas.map((evento) => (
                <tr key={evento.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{evento.tipo}</span>
                      <span className="text-[10px] text-slate-500 dark:text-[#8e8ea0] flex items-center gap-1 mt-0.5">
                        <Landmark className="w-3 h-3" /> {evento.casa}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">${evento.finanzas?.ingresos.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">${evento.finanzas?.gastos.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={cn(
                      "inline-flex items-center px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                      parseFloat(evento.finanzas?.margen || "0") >= 20 ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400" :
                      parseFloat(evento.finanzas?.margen || "0") > 0 ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400" :

                      "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400"
                    )}>
                      {evento.finanzas?.margen}%
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/finanzas/${evento.id}`}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-[#00B4AA] hover:text-white transition-all inline-flex"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
