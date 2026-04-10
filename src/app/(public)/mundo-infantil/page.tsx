import { Metadata } from "next";
import { Baby, Gamepad2, BookOpen, Music } from "lucide-react";

export const metadata: Metadata = {
  title: "ELEMA KIDS - Mundo Infantil | SJM",
  description: "¡Vamos a jugar y a aprender con Jesús! Sección infantil de SJM.",
};

export default function MundoInfantilPage() {
  return (
    <div className="min-h-screen">
      <section className="py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-green-400 rounded-full blur-[180px] opacity-15" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-400 rounded-full blur-[180px] opacity-15" />
          <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-yellow-300 rounded-full blur-[180px] opacity-15" />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-8xl font-black tracking-tight bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 text-transparent bg-clip-text" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            ELEMA KIDS
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mt-3 font-bold">
            El Ejército del Más Amado — ¡Para los más pequeños!
          </p>
          <Baby className="w-16 h-16 text-green-500 mx-auto mt-6" />
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-6">
            ¡Vamos a jugar y a aprender con Jesús!
          </h2>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-2xl p-8 border border-green-200/50 dark:border-green-800/30 text-center hover:shadow-xl transition-all hover:-translate-y-1">
            <Gamepad2 className="w-10 h-10 text-green-500 mx-auto mb-4" />
            <h3 className="font-bold text-slate-900 dark:text-white">Juegos</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Juegos divertidos con valores cristianos</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-8 border border-blue-200/50 dark:border-blue-800/30 text-center hover:shadow-xl transition-all hover:-translate-y-1">
            <BookOpen className="w-10 h-10 text-blue-500 mx-auto mb-4" />
            <h3 className="font-bold text-slate-900 dark:text-white">Trivias y Cuentos</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Aprende la palabra de Dios jugando</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-2xl p-8 border border-purple-200/50 dark:border-purple-800/30 text-center hover:shadow-xl transition-all hover:-translate-y-1">
            <Music className="w-10 h-10 text-purple-500 mx-auto mb-4" />
            <h3 className="font-bold text-slate-900 dark:text-white">Videos</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Videos y canciones infantiles</p>
          </div>
        </div>
        <p className="text-center text-slate-500 dark:text-slate-400 italic">
          Contenido de secciones parametrizable próximamente disponible desde el CMS.
        </p>
      </div>
    </div>
  );
}
