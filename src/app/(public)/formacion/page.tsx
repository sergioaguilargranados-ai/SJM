import { Metadata } from "next";
import { GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "Formación | SJM",
  description: "Cursos de formación cristiana con contenido y exámenes en línea.",
};

export default function FormacionPage() {
  return (
    <div className="min-h-screen">
      <section className="py-16 md:py-24 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <GraduationCap className="w-14 h-14 text-violet-500 mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">Formación</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-4">Cursos de formación cristiana y contenido educativo</p>
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-white dark:bg-[#1a1b26] rounded-2xl p-12 border border-slate-200 dark:border-[#2a2b3d] text-center">
          <GraduationCap className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">Cursos de formación próximamente</p>
          <p className="text-sm text-slate-400 mt-2">Incluirá contenido del blog y sistema de exámenes en línea (Fase 6).</p>
        </div>
      </div>
    </div>
  );
}
