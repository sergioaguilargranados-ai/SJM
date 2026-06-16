import { Metadata } from "next";
import { resolverTenant } from "@/lib/tenant";
import { obtenerSeccionesPagina, obtenerGaleria } from "@/app/actions/contenido";
import { SeccionContenido, GaleriaPublica } from "@/components/landing/ComponentesLanding";
import { Flame } from "lucide-react";

export const metadata: Metadata = {
  title: "ELEMÁ - Tú el Joven de Hoy | SJM",
  description: "ELEMÁ - El Ejército del Más Amado. Es tu momento, caminemos juntos.",
};

export default async function JovenesPage() {
  const tenant = await resolverTenant();
  const orgId = tenant?.id;

  let seccionesCMS: any[] = [];
  let galeriaCMS: any[] = [];
  if (orgId) {
    seccionesCMS = await obtenerSeccionesPagina(orgId, "jovenes");
    galeriaCMS = await obtenerGaleria(orgId, "jovenes");
  }
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

      <div className="max-w-7xl mx-auto px-6 pb-20">
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
}





