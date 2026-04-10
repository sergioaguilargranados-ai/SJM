import { Metadata } from "next";
import Link from "next/link";
import { Heart, ArrowRight, Star } from "lucide-react";
import { resolverTenant } from "@/lib/tenant";
import { obtenerTestimoniosAprobados } from "@/app/actions/contenido";

export const metadata: Metadata = {
  title: "Testimonios | Servidores de Jesús por María",
  description: "Testimonios de personas cuyas vidas han sido transformadas por el amor de Dios a través de SJM.",
};

// Datos de respaldo si no hay testimonios en el CMS
const testimoniosDefault = [
  { texto: "Llegué roto por dentro. Después del retiro de sanación interior, encontré la paz que había buscado toda mi vida. Jesús realmente sana las heridas del alma.", autor: "Servidor SJM, Guadalajara", estrellas: 5 },
  { texto: "CreeSer me devolvió la esperanza. El acompañamiento, la escucha y la fraternidad me ayudaron a entender que no estoy solo. Dios me ama tal como soy.", autor: "Participante CreeSer, Toluca", estrellas: 5 },
  { texto: "Magnificat fue un antes y un después en mi matrimonio. La sanación interior nos permitió perdonar y reconstruir nuestra relación desde el amor de Cristo.", autor: "Matrimonio SJM, Chiapas", estrellas: 5 },
];

export default async function TestimoniosPage() {
  const tenant = await resolverTenant();
  const orgId = tenant?.id;

  let testimoniosCMS: any[] = [];
  if (orgId) {
    testimoniosCMS = await obtenerTestimoniosAprobados(orgId);
  }

  const testimonios = testimoniosCMS.length > 0
    ? testimoniosCMS.map((t) => ({
        texto: t.texto,
        autor: t.es_anonimo ? "Anónimo" : (t.nombre_autor || "Servidor SJM"),
        estrellas: t.calificacion || 5,
      }))
    : testimoniosDefault;

  return (
    <div className="min-h-screen">
      <section className="py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-amber-400 rounded-full blur-[180px] opacity-10" />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Star className="w-14 h-14 text-amber-500 mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
            Testimonios
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-xl mx-auto">
            Tu testimonio es el mejor instrumento para proclamar la Gloria de Dios
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonios.map((t, idx) => (
            <div key={idx} className="bg-white dark:bg-[#1a1b26] rounded-2xl p-8 border border-slate-200 dark:border-[#2a2b3d] shadow-sm hover:shadow-xl transition-all">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.estrellas }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic">&ldquo;{t.texto}&rdquo;</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-4">{t.autor}</p>
            </div>
          ))}
        </div>

        {/* CTA para agregar testimonio */}
        <div className="text-center bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl p-8 border border-amber-200/50 dark:border-amber-800/30">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">¿Quieres compartir tu testimonio?</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Puede ser anónimo. Tu historia puede inspirar a otros.</p>
          <Link href="/contactanos" className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-amber-500 text-white px-8 text-sm font-bold transition-all hover:scale-105 shadow-lg">
            <Heart className="w-4 h-4" /> Agregar mi Testimonio <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
