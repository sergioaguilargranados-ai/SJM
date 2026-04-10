import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowRight, Heart, CalendarDays } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog SJM | Servidores de Jesús por María",
  description: "Reflexiones, testimonios y crónicas de la vida de la comunidad SJM.",
};

const articulos = [
  {
    titulo: "La Gracia del Primer Retiro",
    extracto: "Compartimos la experiencia de más de 40 servidores que participaron en el retiro de iniciación en Querétaro, donde el Espíritu Santo se hizo presente de manera poderosa.",
    fecha: "02 Abr 2026",
    categoria: "Testimonios",
    imagen: "📖",
  },
  {
    titulo: "Claves para una Coordinación Efectiva",
    extracto: "Cinco principios fundamentales que todo coordinador de retiro debe conocer para guiar a su equipo con excelencia y humildad.",
    fecha: "28 Mar 2026",
    categoria: "Formación",
    imagen: "🎯",
  },
  {
    titulo: "Crónica: Diplomado en Línea — 1ª Generación",
    extracto: "Más de 150 inscritos en la primera generación del Diplomado de Talleres en Línea. Un nuevo capítulo para la formación a distancia en SJM.",
    fecha: "20 Mar 2026",
    categoria: "Noticias",
    imagen: "🌐",
  },
  {
    titulo: "Oración por las Familias",
    extracto: "Reflexión del Padre Director sobre la importancia de cubrir con oración a cada familia que se acerca a nuestros retiros matrimoniales.",
    fecha: "15 Mar 2026",
    categoria: "Espiritualidad",
    imagen: "🙏",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-400 rounded-full blur-[180px] opacity-10 dark:opacity-15" />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" /> Blog Oficial
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Vida y Misión
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-3 max-w-xl mx-auto">
            Reflexiones, testimonios y noticias de la comunidad Servidores de Jesús por María.
          </p>
        </div>
      </section>

      {/* Grid de artículos */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {articulos.map((art, idx) => (
            <article
              key={idx}
              className="bg-white dark:bg-[#1a1b26] border border-slate-200 dark:border-[#2a2b3d] rounded-2xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 group"
            >
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{art.imagen}</span>
                  <div>
                    <span className="inline-block bg-slate-100 dark:bg-[#2a2b3d] text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      {art.categoria}
                    </span>
                    <p className="text-xs text-slate-400 dark:text-[#8e8ea0] mt-0.5 flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" /> {art.fecha}
                    </p>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                  {art.titulo}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {art.extracto}
                </p>
                <div className="mt-6">
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all cursor-pointer">
                    Leer más <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            ¿Quieres compartir tu testimonio o contribuir al blog?
          </p>
          <Link
            href="/contactanos"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
          >
            <BookOpen className="w-4 h-4" /> Contáctanos
          </Link>
        </div>
      </div>
    </div>
  );
}
