import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, CalendarDays } from "lucide-react";
import { resolverTenant } from "@/lib/tenant";
import { obtenerArticulosBlog } from "@/app/actions/contenido";

export const metadata: Metadata = {
  title: "Crecimientos | Servidores de Jesús por María",
  description: "Artículos de crecimiento espiritual, reflexiones y enseñanzas de SJM.",
};

export default async function CrecimientosPage() {
  const tenant = await resolverTenant();
  const orgId = tenant?.id;

  let articulos: any[] = [];
  if (orgId) {
    articulos = await obtenerArticulosBlog(orgId, "crecimientos");
  }

  return (
    <div className="min-h-screen">
      <section className="py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-violet-400 rounded-full blur-[180px] opacity-10" />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <BookOpen className="w-14 h-14 text-violet-500 mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">Crecimientos</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-xl mx-auto">Reflexiones, enseñanzas y artículos para tu crecimiento espiritual</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        {articulos.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-[#1a1b26] rounded-2xl border border-dashed border-slate-300 dark:border-[#2a2b3d]">
            <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-500 dark:text-slate-400">Próximamente</h2>
            <p className="text-slate-400 mt-2">Estamos preparando contenido de crecimiento espiritual para ti.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articulos.map((a) => (
              <article key={a.id} className="bg-white dark:bg-[#1a1b26] rounded-2xl border border-slate-200 dark:border-[#2a2b3d] overflow-hidden hover:shadow-xl transition-all group">
                <div className="h-44 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-[#2a2b3d] dark:to-[#1a1b26] flex items-center justify-center overflow-hidden">
                  {a.imagen_portada_url ? (
                    <img src={a.imagen_portada_url} alt={a.titulo} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <BookOpen className="w-10 h-10 text-violet-300" />
                  )}
                </div>
                <div className="p-5">
                  {a.categoria && <span className="text-[10px] text-violet-600 font-bold uppercase tracking-wider">{a.categoria}</span>}
                  <h2 className="font-black text-slate-900 dark:text-white mt-1 text-lg leading-snug">{a.titulo}</h2>
                  {a.extracto && <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-3">{a.extracto}</p>}
                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {a.fecha_publicacion ? new Date(a.fecha_publicacion).toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" }) : ""}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
