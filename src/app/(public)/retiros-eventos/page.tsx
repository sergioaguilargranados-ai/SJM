import { Metadata } from "next";
import { Calendar, MapPin, Users, DollarSign, Clock } from "lucide-react";
import { resolverTenant } from "@/lib/tenant";
import { obtenerAgendaRetiros } from "@/app/actions/contenido";

export const metadata: Metadata = {
  title: "Retiros y Eventos | Servidores de Jesús por María",
  description: "Calendario de retiros de sanación interior, eventos de evangelización y talleres de SJM.",
};

export default async function RetirosEventosPage() {
  const tenant = await resolverTenant();
  const orgId = tenant?.id;

  let retiros: any[] = [];
  if (orgId) {
    retiros = await obtenerAgendaRetiros(orgId);
  }

  const formatFecha = (fecha: any) => {
    if (!fecha) return "Por confirmar";
    return new Date(fecha).toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });
  };

  return (
    <div className="min-h-screen">
      <section className="py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-orange-400 rounded-full blur-[180px] opacity-10" />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Calendar className="w-14 h-14 text-orange-500 mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
            Retiros y Eventos
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-xl mx-auto">
            Agenda de retiros de sanación interior, eventos de conversión y talleres
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        {retiros.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-[#1a1b26] rounded-2xl border border-dashed border-slate-300 dark:border-[#2a2b3d]">
            <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-500 dark:text-slate-400">Próximamente</h2>
            <p className="text-slate-400 mt-2">Estamos preparando nuevos retiros y eventos. ¡Mantente pendiente!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {retiros.map((r, idx) => (
              <div key={r.id} className="bg-white dark:bg-[#1a1b26] rounded-2xl border border-slate-200 dark:border-[#2a2b3d] p-6 md:p-8 hover:shadow-xl transition-all flex flex-col md:flex-row items-start gap-6">
                {/* Fecha visual */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-600 flex flex-col items-center justify-center text-white shrink-0 shadow-lg">
                  <span className="text-xs font-bold uppercase">{r.fecha_inicio ? new Date(r.fecha_inicio).toLocaleDateString("es-MX", { month: "short" }) : "TBD"}</span>
                  <span className="text-3xl font-black leading-none">{r.fecha_inicio ? new Date(r.fecha_inicio).getDate() : "?"}</span>
                </div>

                <div className="flex-1">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">{r.nombre_evento}</h2>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {r.tipo_evento && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-orange-500" /> {r.tipo_evento}</span>}
                    {r.sede_nombre && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-blue-500" /> {r.sede_nombre}</span>}
                    {r.cupo_maximo && <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-green-500" /> Cupo: {r.cupo_maximo}</span>}
                    {r.costo && <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-emerald-500" /> ${r.costo}</span>}
                    {r.hora_entrada && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-purple-500" /> {r.hora_entrada} - {r.hora_salida}</span>}
                  </div>
                  {r.descripcion && <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm leading-relaxed">{r.descripcion}</p>}
                  <p className="text-xs text-slate-400 mt-2">{formatFecha(r.fecha_inicio)} → {formatFecha(r.fecha_fin)}</p>
                </div>

                <div className="shrink-0">
                  <span className={`text-xs px-3 py-1.5 rounded-full font-bold uppercase ${r.estatus === "PROXIMA" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" : r.estatus === "EN_CURSO" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                    {r.estatus === "PROXIMA" ? "Próximo" : r.estatus === "EN_CURSO" ? "En Curso" : r.estatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
