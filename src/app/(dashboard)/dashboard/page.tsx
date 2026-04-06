import { getDashboardStats } from "@/app/actions/catalogos";
import { getEventosRecientes } from "@/app/actions/consultas";
import { Users, CalendarDays, ClipboardList, Receipt, TrendingUp, TrendingDown, DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [statsRes, eventosRes] = await Promise.all([getDashboardStats(), getEventosRecientes()]);
  const stats = statsRes.data;
  const eventos = eventosRes.data || [];

  // Próximos eventos (los más recientes o con fecha futura)
  const proximosEventos = eventos.slice(0, 3);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Panel de Control</h1>
        <p className="text-sm text-slate-500 dark:text-[#8e8ea0] mt-1">Indicadores en tiempo real basados en datos de la plataforma.</p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Servidores Activos */}
        <div className="bg-white dark:bg-[#1a1b26] rounded-2xl border border-slate-200 dark:border-[#2a2b3d] shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/20">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.servidores_activos}</p>
          <p className="text-xs text-slate-500 dark:text-[#8e8ea0] font-medium mt-1">Servidores Activos</p>
        </div>

        {/* Total Eventos */}
        <div className="bg-white dark:bg-[#1a1b26] rounded-2xl border border-slate-200 dark:border-[#2a2b3d] shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/20">
              <CalendarDays className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.total_eventos}</p>
          <p className="text-xs text-slate-500 dark:text-[#8e8ea0] font-medium mt-1">Eventos Registrados</p>
        </div>

        {/* Total Inscripciones */}
        <div className="bg-white dark:bg-[#1a1b26] rounded-2xl border border-slate-200 dark:border-[#2a2b3d] shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/20">
              <ClipboardList className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.total_inscripciones}</p>
          <p className="text-xs text-slate-500 dark:text-[#8e8ea0] font-medium mt-1">Inscripciones Totales</p>
        </div>

        {/* Balance */}
        <div className="bg-white dark:bg-[#1a1b26] rounded-2xl border border-slate-200 dark:border-[#2a2b3d] shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2.5 rounded-xl ${stats.balance >= 0 ? "bg-emerald-100 dark:bg-emerald-900/20" : "bg-red-100 dark:bg-red-900/20"}`}>
              <DollarSign className={`w-5 h-5 ${stats.balance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`} />
            </div>
          </div>
          <p className={`text-3xl font-black ${stats.balance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
            ${stats.balance.toLocaleString("es-MX")}
          </p>
          <p className="text-xs text-slate-500 dark:text-[#8e8ea0] font-medium mt-1">Balance (Ingresos - Egresos)</p>
        </div>
      </div>

      {/* Resumen Financiero Detallado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1a1b26] rounded-2xl border border-slate-200 dark:border-[#2a2b3d] shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Ingresos por Aportaciones</h3>
          </div>
          <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400">${stats.total_ingresos.toLocaleString("es-MX")}</p>
          <p className="text-xs text-slate-500 dark:text-[#8e8ea0] mt-2">Suma de depósitos + pagos en efectivo de todos los inscritos.</p>
        </div>
        <div className="bg-white dark:bg-[#1a1b26] rounded-2xl border border-slate-200 dark:border-[#2a2b3d] shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Egresos por Gastos</h3>
          </div>
          <p className="text-4xl font-black text-red-600 dark:text-red-400">${stats.total_egresos.toLocaleString("es-MX")}</p>
          <p className="text-xs text-slate-500 dark:text-[#8e8ea0] mt-2">Total de gastos registrados para todos los eventos.</p>
        </div>
      </div>

      {/* Accesos Rápidos y Próximos Eventos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accesos Rápidos */}
        <div className="bg-white dark:bg-[#1a1b26] rounded-2xl border border-slate-200 dark:border-[#2a2b3d] shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">Accesos Rápidos</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { nombre: "Servidores", href: "/servidores", icono: Users, color: "bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400" },
              { nombre: "Eventos", href: "/eventos", icono: CalendarDays, color: "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400" },
              { nombre: "Inscripciones", href: "/inscripciones", icono: ClipboardList, color: "bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400" },
              { nombre: "Finanzas", href: "/finanzas", icono: Receipt, color: "bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400" },
            ].map((item) => (
              <Link
                key={item.nombre}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-xl ${item.color} border border-transparent hover:border-slate-200 dark:hover:border-[#2a2b3d] transition-all hover:shadow-sm`}
              >
                <item.icono className="w-5 h-5" />
                <span className="text-sm font-bold">{item.nombre}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-50" />
              </Link>
            ))}
          </div>
        </div>

        {/* Últimos Eventos */}
        <div className="bg-white dark:bg-[#1a1b26] rounded-2xl border border-slate-200 dark:border-[#2a2b3d] shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">Eventos Recientes</h3>
          {proximosEventos.length === 0 ? (
            <div className="py-8 text-center">
              <CalendarDays className="w-10 h-10 text-slate-300 dark:text-[#3b3c54] mx-auto mb-2" />
              <p className="text-sm text-slate-500 dark:text-[#8e8ea0]">No hay eventos registrados aún.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {proximosEventos.map((evento: any) => (
                <Link
                  key={evento.id}
                  href={`/eventos/${evento.id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#151621] border border-slate-100 dark:border-[#2a2b3d] hover:bg-slate-100 dark:hover:bg-[#2a2b3d] transition-colors"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{evento.tipo_evento || "Evento"}</p>
                    <p className="text-xs text-slate-500 dark:text-[#8e8ea0]">Cupo: {evento.cupo_maximo || "Sin límite"}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${evento.estatus === "ABIERTO" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>
                    {evento.estatus || "ABIERTO"}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
