import { Metadata } from "next";
import { Calendar, MapPin, Users, DollarSign, Clock, ArrowRight } from "lucide-react";
import { resolverTenant } from "@/lib/tenant";
import { obtenerAgendaRetiros } from "@/app/actions/contenido";
import Link from "next/link";
import { EventCard } from "@/components/landing/EventCard";

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
              <EventCard key={r.id} r={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



