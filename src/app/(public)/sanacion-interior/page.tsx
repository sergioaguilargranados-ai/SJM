import { Metadata } from "next";
import { resolverTenant } from "@/lib/tenant";
import { obtenerSeccionesPagina, obtenerGaleria } from "@/app/actions/contenido";
import { SeccionContenido, GaleriaPublica } from "@/components/landing/ComponentesLanding";
import { Cross } from "lucide-react";

export const metadata: Metadata = {
  title: "Sanación Interior - Magnificat | SJM",
  description: "Magnificat - Curación de Amor al Rescate. Retiros de sanación interior a través de las verdades del Evangelio.",
};

export default async function SanacionInteriorPage() {
  const tenant = await resolverTenant();
  const orgId = tenant?.id;

  let seccionesCMS: any[] = [];
  let galeriaCMS: any[] = [];
  if (orgId) {
    seccionesCMS = await obtenerSeccionesPagina(orgId, "sanacion-interior");
    galeriaCMS = await obtenerGaleria(orgId, "sanacion-interior");
  }
  return (
    <div className="min-h-screen">
      <section className="py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-400 rounded-full blur-[180px] opacity-10" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-400 rounded-full blur-[180px] opacity-10" />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500 text-transparent bg-clip-text">
            Magnificat
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mt-3 font-medium italic">
            Curación de Amor al Rescate
          </p>
          <Cross className="w-12 h-12 text-purple-500 mx-auto mt-6" />
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-6">
            Retiros de Sanación Interior
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-3 max-w-xl mx-auto">
            Evangelizarte para Sanarte — Un encuentro con Cristo Jesús para la curación de las etapas de la vida
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-white dark:bg-[#1a1b26] rounded-2xl p-8 border border-slate-200 dark:border-[#2a2b3d] mb-12">
          <blockquote className="text-lg text-slate-600 dark:text-slate-400 italic text-center">
            &ldquo;Vengan a mí todos los que están cargados y abrumados que yo les daré descanso&rdquo;
          </blockquote>
          <p className="text-sm text-slate-400 text-center mt-2 font-bold">— Jesús</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Columna Principal - Secciones */}
          <div className={`flex-1 space-y-20 ${galeriaCMS.length > 0 ? "lg:w-2/3" : "w-full"}`}>
            {seccionesCMS.map((seccion, idx) => (
              <SeccionContenido
                key={seccion.id}
                id={`sec-${idx}`}
                titulo={seccion.titulo || ""}
                subtitulo={seccion.subtitulo || ""}
                contenido={seccion.contenido || ""}
                autoria={seccion.autoria || ""}
                imagenUrl={seccion.imagen_url}
                videoUrl={seccion.video_url}
                indice={idx}
              />
            ))}
            {seccionesCMS.length === 0 && (
              <p className="text-center text-slate-500 dark:text-slate-400 italic">
                Aún no hay contenido publicado para esta sección.
              </p>
            )}
          </div>
          
          {/* Columna Lateral - Galería */}
          {galeriaCMS.length > 0 && (
            <div className="lg:w-1/3">
              <div className="sticky top-32">
                <GaleriaPublica fotos={galeriaCMS} compacta={true} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );



