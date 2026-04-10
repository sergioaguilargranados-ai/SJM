import { Metadata } from "next";
import { Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Plenitud Matrimonial | SJM",
  description: "¿Problemas en tu matrimonio? Jesús es la solución. Retiros y acompañamiento para matrimonios.",
};

export default function MatrimoniosPage() {
  return (
    <div className="min-h-screen">
      <section className="py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-rose-400 rounded-full blur-[180px] opacity-10" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-amber-300 rounded-full blur-[180px] opacity-10" />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-rose-400 via-pink-500 to-amber-400 text-transparent bg-clip-text">
            Plenitud Matrimonial
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mt-3 font-medium italic">
            &ldquo;Hagan lo que Él les diga…&rdquo;
          </p>
          <Heart className="w-12 h-12 text-rose-500 mx-auto mt-6" />
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-6">
            ¿Problemas en tu matrimonio?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-3">
            Jesús es la solución
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        <p className="text-center text-slate-500 dark:text-slate-400 italic">
          Contenido de secciones, cinta de fotos y agenda próximamente disponible desde el CMS.
        </p>
      </div>
    </div>
  );
}
