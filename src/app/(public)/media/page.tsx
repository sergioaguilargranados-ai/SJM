import { Metadata } from "next";
import { Music, Headphones, Video, MonitorPlay } from "lucide-react";
import { resolverTenant } from "@/lib/tenant";
import { obtenerMedia } from "@/app/actions/contenido";

export const metadata: Metadata = {
  title: "Multimedia | Servidores de Jesús por María",
  description: "Música, podcasts y videos de Servidores de Jesús por María.",
};

export default async function MediaPage() {
  const tenant = await resolverTenant();
  const orgId = tenant?.id;

  let media: any[] = [];
  if (orgId) {
    media = await obtenerMedia(orgId);
  }

  const tipoIcon: Record<string, React.ReactNode> = {
    musica: <Music className="w-6 h-6 text-purple-500" />,
    podcast: <Headphones className="w-6 h-6 text-blue-500" />,
    video: <Video className="w-6 h-6 text-red-500" />,
  };

  const tipoColor: Record<string, string> = {
    musica: "from-purple-500 to-violet-600",
    podcast: "from-blue-500 to-cyan-600",
    video: "from-red-500 to-rose-600",
  };

  return (
    <div className="min-h-screen">
      <section className="py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-400 rounded-full blur-[180px] opacity-10" />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <MonitorPlay className="w-14 h-14 text-indigo-500 mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">Multimedia</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-xl mx-auto">Música, podcasts y videos para tu edificación espiritual</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        {media.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-[#1a1b26] rounded-2xl border border-dashed border-slate-300 dark:border-[#2a2b3d]">
            <MonitorPlay className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-500 dark:text-slate-400">Próximamente</h2>
            <p className="text-slate-400 mt-2">Contenido multimedia en preparación.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {media.map((m) => (
              <a key={m.id} href={m.url_contenido} target="_blank" rel="noopener noreferrer" className="bg-white dark:bg-[#1a1b26] rounded-2xl border border-slate-200 dark:border-[#2a2b3d] overflow-hidden hover:shadow-xl transition-all group">
                <div className={`h-36 bg-gradient-to-br ${tipoColor[m.tipo] || "from-slate-300 to-slate-400"} flex items-center justify-center overflow-hidden relative`}>
                  {m.imagen_miniatura_url ? (
                    <img src={m.imagen_miniatura_url} alt={m.titulo} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="text-white/30 scale-150">{tipoIcon[m.tipo]}</div>
                  )}
                  <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-[10px] font-bold uppercase">
                    {m.tipo}
                  </div>
                  {m.duracion && (
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm rounded-md px-2 py-0.5 text-white text-xs font-medium">
                      {m.duracion}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-[#00B4AA] transition-colors">{m.titulo}</h3>
                  {m.artista_autor && <p className="text-sm text-slate-500 mt-0.5">{m.artista_autor}</p>}
                  {m.descripcion && <p className="text-xs text-slate-400 mt-2 line-clamp-2">{m.descripcion}</p>}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
