import { Metadata } from "next";
import { Calendar, MapPin, Users, DollarSign, Clock, ArrowRight } from "lucide-react";
import { resolverTenant } from "@/lib/tenant";
import { obtenerAgendaRetiros } from "@/app/actions/contenido";
import Link from "next/link";

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

  const formatFechaHora = (fecha: any) => {
    if (!fecha) return "Por confirmar";
    const d = new Date(fecha);
    const datePart = d.toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" });
    const timePart = d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "UTC" });
    return `${datePart} - ${timePart}`;
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
              <div key={r.id} className="bg-white dark:bg-[#1a1b26] rounded-3xl border border-slate-200 dark:border-[#2a2b3d] p-6 md:p-8 hover:shadow-xl transition-all flex flex-col gap-6">
                
                {/* Cabecera del Evento (Fecha, Título, Info y Botón) */}
                <div className="flex flex-col md:flex-row items-start gap-6">
                  {/* Fecha visual */}
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-600 flex flex-col items-center justify-center text-white shrink-0 shadow-lg">
                    <span className="text-xs font-bold uppercase">{r.fecha_inicio ? new Date(r.fecha_inicio).toLocaleDateString("es-MX", { month: "short", timeZone: "UTC" }) : "TBD"}</span>
                    <span className="text-3xl font-black leading-none">{r.fecha_inicio ? new Date(r.fecha_inicio).toLocaleDateString("es-MX", { day: "numeric", timeZone: "UTC" }) : "?"}</span>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{r.nombre_evento}</h2>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
                      {r.tipo_evento && <span className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-md"><Calendar className="w-4 h-4" /> {r.tipo_evento}</span>}
                      {r.sede_nombre && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {r.sede_nombre}</span>}
                      {r.cupo_maximo && <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-400" /> Cupo: {r.cupo_maximo}</span>}
                      {r.costo && <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-slate-400" /> ${r.costo}</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-sm text-slate-500 font-medium bg-slate-50 dark:bg-slate-800/50 w-fit px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>{formatFechaHora(r.fecha_inicio)}</span>
                      <span className="text-slate-300 dark:text-slate-600 px-1">→</span>
                      <span>{formatFechaHora(r.fecha_fin)}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-3 w-full md:w-auto">
                    <span className={`text-xs px-3 py-1.5 rounded-full font-bold uppercase self-start md:self-end ${r.estatus === "PROXIMA" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" : r.estatus === "EN_CURSO" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                      {r.estatus === "PROXIMA" ? "Próximo" : r.estatus === "EN_CURSO" ? "En Curso" : r.estatus}
                    </span>
                    
                    <Link 
                      href={`/registro/${r.id}`}
                      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-black shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 hover:scale-105 transition-transform uppercase tracking-wider w-full md:w-auto"
                    >
                      ¡INSCRIBETE!
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>

                {/* Descripción (Beneficios, temario, etc) al final */}
                {r.descripcion && (
                  <div className="pt-5 border-t border-slate-100 dark:border-[#2a2b3d]">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{r.descripcion}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



