import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Calendar, Users, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0f1015] font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30">
      
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Background Gradients Decorativos */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20 dark:opacity-30">
           <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400 rounded-full blur-[120px]" />
           <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-emerald-400 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-5xl w-full text-center space-y-10 relative z-10 py-20">
          
          {/* Logo animado */}
          <div className="flex justify-center mb-8 animate-in fade-in zoom-in duration-700">
            <Image
              src="/icon.png"
              alt="SJM Logo"
              width={180}
              height={180}
              className="drop-shadow-2xl hover:scale-105 transition-transform cursor-pointer"
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Plataforma de Gestión <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-400 dark:to-emerald-300">
                Obra SJM Nacional
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Administración centralizada de servidores, retiros espirituales y gestión operativa para la expansión del Reino de Dios.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="group flex h-14 w-full sm:w-auto items-center justify-center gap-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-200 dark:shadow-none"
            >
              Entrar al Sistema
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/registro"
              className="h-14 w-full sm:w-auto flex items-center justify-center rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm px-10 text-lg font-bold text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Registrar Asistente
            </Link>
          </div>
        </div>

        {/* Features Quick Look */}
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-4 gap-6 py-20">
            <div className="p-6 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl hover:shadow-lg transition-shadow">
               <Users className="w-8 h-8 text-blue-500 mb-4" />
               <h3 className="font-bold text-slate-900 dark:text-white mb-1">Capital Humano</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400">Padrón unificado de servidores y sus niveles de formación.</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl hover:shadow-lg transition-shadow">
               <Calendar className="w-8 h-8 text-emerald-500 mb-4" />
               <h3 className="font-bold text-slate-900 dark:text-white mb-1">Eventos</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400">Programación de retiros, cursos y encuentros nacionales.</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl hover:shadow-lg transition-shadow">
               <ShieldCheck className="w-8 h-8 text-amber-500 mb-4" />
               <h3 className="font-bold text-slate-900 dark:text-white mb-1">Seguridad</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400">Acceso protegido mediante Google Auth y roles definidos.</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl hover:shadow-lg transition-shadow">
               <Heart className="w-8 h-8 text-rose-500 mb-4" />
               <h3 className="font-bold text-slate-900 dark:text-white mb-1">Misión</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400">Trazabilidad del impacto espiritual en cada comunidad.</p>
            </div>
        </div>
      </main>

      {/* Footer Minimalista */}
      <footer className="py-10 border-t border-slate-100 dark:border-slate-900 text-center">
         <p className="text-slate-400 text-sm">
            © 2026 Servidores de Jesús por María • Gestión de Obra v1.015
         </p>
      </footer>
    </div>
  );
}
