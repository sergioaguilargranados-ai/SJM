import { getEventoById } from "@/app/actions/consultas";
import { getGastosByEvento, getClasificacionesGasto, getResumenFinancieroEvento } from "@/app/actions/finanzas";
import { GestionGastosClient } from "./GestionGastosClient";
import Link from "next/link";
import { ArrowLeft, Landmark, Calendar, TrendingUp, TrendingDown, DollarSign, PieChart, Info, AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export default async function DetalleFinanzasEventoPage({ params }: { params: { eventoId: string } }) {
  const { eventoId } = params;

  const [
    { data: evento },
    { data: gastos },
    { data: clasificaciones },
    { data: resumen }
  ] = await Promise.all([
    getEventoById(eventoId),
    getGastosByEvento(eventoId),
    getClasificacionesGasto(),
    getResumenFinancieroEvento(eventoId)
  ]);

  if (!evento) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">Evento no encontrado</h1>
        <Link href="/finanzas" className="text-[#00B4AA] mt-4 inline-block hover:underline">Volver a Finanzas</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header con Navegación */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/finanzas" 
          className="flex items-center gap-2 text-xs font-black text-slate-400 dark:text-[#5e5e72] hover:text-[#00B4AA] uppercase tracking-widest transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a Finanzas
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Análisis Financiero</h1>
            <p className="text-slate-500 dark:text-[#8e8ea0] font-medium mt-1 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#00B4AA]" /> {evento.estatus === 'PLANEACION' ? 'En Planeación' : 'Evento Activo'}
            </p>
          </div>
        </div>
      </div>

      {/* Resumen de Rentabilidad (Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1a1b26] p-5 rounded-[24px] border border-slate-200 dark:border-[#2a2b3d] shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ingresos</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">${resumen?.ingresos.toLocaleString()}</h3>
            <TrendingUp className="w-5 h-5 text-emerald-500 mb-1" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1b26] p-5 rounded-[24px] border border-slate-200 dark:border-[#2a2b3d] shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gastos</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-black text-red-600 dark:text-red-400">${resumen?.gastos.toLocaleString()}</h3>
            <TrendingDown className="w-5 h-5 text-red-500 mb-1" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1b26] p-5 rounded-[24px] border border-slate-200 dark:border-[#2a2b3d] shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Margen Neto</p>
          <div className="flex items-end justify-between">
            <h3 className={cn(
              "text-2xl font-black",
              resumen?.balance >= 0 ? "text-[#00B4AA]" : "text-red-500"
            )}>
              ${resumen?.balance.toLocaleString()}
            </h3>
            <DollarSign className="w-5 h-5 text-slate-300 mb-1" />
          </div>
        </div>

        <div className="bg-slate-900 dark:bg-emerald-500 p-5 rounded-[24px] border border-transparent shadow-xl shadow-emerald-500/10">
          <p className="text-[10px] font-black text-emerald-100/60 dark:text-white/60 uppercase tracking-widest mb-1">Rentabilidad</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-black text-white">{resumen?.margen}%</h3>
            <PieChart className="w-5 h-5 text-white/50 mb-1" />
          </div>
        </div>
      </div>

      {/* Alerta de Salud Financiera */}
      {parseFloat(resumen?.margen || "0") < 15 && (

        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-4 rounded-2xl flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-800 dark:text-amber-400">Margen de Rentabilidad Bajo</p>
            <p className="text-xs text-amber-700 dark:text-amber-500/80">Este evento tiene una rentabilidad menor al 15%. Revisa los gastos operativos o considera ajustar el costo al público.</p>
          </div>
        </div>
      )}

      {/* Panel de Gestión de Gastos */}
      <div className="bg-white dark:bg-[#1a1b26] rounded-[40px] border border-slate-200 dark:border-[#2a2b3d] shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00B4AA]/10 flex items-center justify-center text-[#00B4AA]">
                <Receipt className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Desglose de Egresos</h2>
            </div>
          </div>

          <GestionGastosClient 
            eventoId={eventoId} 
            gastos={gastos || []} 
            clasificaciones={clasificaciones || []} 
          />
        </div>
      </div>
    </div>
  );
}

// Iconos locales que no se importaron arriba
function Receipt(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 17.5V6.5" />
    </svg>
  )
}
