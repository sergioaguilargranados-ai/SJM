import { Metadata } from "next";
import Link from "next/link";
import { Heart, Phone, MessageCircle, Shield, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Llama de Amor | SJM - Ayuda Urgente 24/7",
  description: "No estás solo. Línea de ayuda, oración y acompañamiento urgente 24/7.",
};

export default function LlamaDeAmorPage() {
  return (
    <div className="min-h-screen">
      <section className="py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-orange-400/10 to-rose-400/10 dark:from-amber-900/10 dark:via-orange-900/10 dark:to-rose-900/10" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-amber-400 rounded-full blur-[180px] opacity-15" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-orange-300 rounded-full blur-[180px] opacity-15" />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-amber-300 via-orange-400 to-rose-500 text-transparent bg-clip-text">
            Llama de Amor
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mt-3 font-medium">
            No estás solo. Estamos aquí para ti.
          </p>
          <Shield className="w-12 h-12 text-amber-500 mx-auto mt-6" />
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 pb-20 space-y-10">
        {/* Oraciones */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl p-8 md:p-12 border border-amber-200/50 dark:border-amber-800/30">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">🙏 Oración para este momento</h2>
          <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed text-lg">
            Señor Jesús, en este momento de angustia vengo a Ti. Tú que has dicho &ldquo;Vengan a mí todos los que están cargados y abrumados que yo les daré descanso&rdquo;. Dame tu paz, sana mis heridas, ilumina mi camino. Amén.
          </p>
        </div>

        {/* Teléfonos de emergencia */}
        <div className="bg-white dark:bg-[#1a1b26] rounded-2xl p-8 border border-slate-200 dark:border-[#2a2b3d] shadow-sm">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <Phone className="w-6 h-6 text-green-500" /> Líneas de Ayuda
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200/50 dark:border-green-800/30">
              <MessageCircle className="w-8 h-8 text-green-500 shrink-0" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">WhatsApp SJM</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Disponible para escucharte</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-800/30">
              <Phone className="w-8 h-8 text-blue-500 shrink-0" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Líneas de Emergencia</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Números configurables desde la administración</p>
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder para agente IA */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-8 border border-blue-200/50 dark:border-blue-800/30 text-center">
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-3">🤖 Asistente Virtual (Próximamente)</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Un agente de IA estará disponible 24/7 para orientarte y conectarte con la ayuda que necesitas.
          </p>
        </div>
      </div>
    </div>
  );
}
