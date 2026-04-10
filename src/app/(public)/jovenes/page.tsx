import { Metadata } from "next";
import { Flame } from "lucide-react";

export const metadata: Metadata = {
  title: "ELEMÁ - Tú el Joven de Hoy | SJM",
  description: "ELEMÁ - El Ejército del Más Amado. Es tu momento, caminemos juntos.",
};

export default function JovenesPage() {
  return (
    <div className="min-h-screen">
      <section className="py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-orange-400 rounded-full blur-[180px] opacity-15" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-pink-400 rounded-full blur-[180px] opacity-15" />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-8xl font-black tracking-tight bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-transparent bg-clip-text">
            ELEMÁ
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mt-3 font-medium italic">
            El Ejército del Más Amado
          </p>
          <div className="mt-6">
            <Flame className="w-12 h-12 text-orange-500 mx-auto" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-6">
            Tú el Joven de Hoy
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-3">
            Es tu momento, caminemos juntos
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        <p className="text-center text-slate-500 dark:text-slate-400 italic">
          Contenido de secciones y galería de fotos próximamente disponible desde el CMS.
        </p>
      </div>
    </div>
  );
}
