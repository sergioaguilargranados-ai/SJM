import { Metadata } from "next";
import { resolverTenant } from "@/lib/tenant";
import { db } from "@/lib/db";
import { eventos, tipos_eventos, sedes } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Users, DollarSign, Clock, ArrowRight, Share2, Info } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  params: {
    id: string;
  };
}

// Generar Open Graph tags para que al compartir salga la imagen grande
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = params;
  
  const [evento] = await db
    .select()
    .from(eventos)
    .where(eq(eventos.id, id));

  if (!evento) {
    return { title: "Evento no encontrado" };
  }

  const imageUrl = evento.imagen_cartel_url || "https://sjm.misiones.org/default-og.jpg"; // URL fallback

  return {
    title: `${evento.nombre_evento} | Servidores de Jesús por María`,
    description: evento.descripcion?.slice(0, 160) || "Te invitamos a este gran evento.",
    openGraph: {
      title: evento.nombre_evento,
      description: evento.descripcion?.slice(0, 160) || "Te invitamos a este gran evento.",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: evento.nombre_evento,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: evento.nombre_evento,
      description: evento.descripcion?.slice(0, 160) || "Te invitamos a este gran evento.",
      images: [imageUrl],
    },
  };
}

export default async function DetalleRetiroPage({ params }: PageProps) {
  const { id } = params;
  
  const [eventoData] = await db
    .select({
      id: eventos.id,
      nombre_evento: eventos.nombre_evento,
      fecha_inicio: eventos.fecha_inicio,
      fecha_fin: eventos.fecha_fin,
      cupo_maximo: eventos.cupo_maximo,
      costo: eventos.costo_publico,
      descripcion: eventos.descripcion,
      imagen_cartel_url: eventos.imagen_cartel_url,
      requisitos: eventos.requisitos,
      recomendaciones: eventos.recomendaciones,
      politica_cancelacion: eventos.politica_cancelacion,
      estatus: eventos.estatus,
      tipo_evento: tipos_eventos.nombre,
      sede_nombre: sedes.nombre,
    })
    .from(eventos)
    .leftJoin(tipos_eventos, eq(eventos.tipo_evento_id, tipos_eventos.id))
    .leftJoin(sedes, eq(eventos.sede_id, sedes.id))
    .where(eq(eventos.id, id));

  if (!eventoData) {
    notFound();
  }

  const formatFechaHora = (fecha: any) => {
    if (!fecha) return "Por confirmar";
    const d = new Date(fecha);
    const datePart = d.toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" });
    const timePart = d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "UTC" });
    return `${datePart} - ${timePart}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f1015] py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/retiros-eventos" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium mb-6">
          <ArrowRight className="w-5 h-5 rotate-180" />
          Ver todos los retiros
        </Link>
        
        <div className="bg-white dark:bg-[#1a1b26] rounded-3xl w-full shadow-2xl overflow-hidden relative flex flex-col md:flex-row">
          {/* Columna Izquierda: Cartel */}
          <div className="w-full md:w-5/12 bg-slate-100 dark:bg-[#0f1015] relative min-h-[400px] md:min-h-[600px]">
            {eventoData.imagen_cartel_url ? (
              <Image
                src={eventoData.imagen_cartel_url}
                alt={eventoData.nombre_evento}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                <Calendar className="w-16 h-16 opacity-50 mb-4" />
                <p>Sin cartel asignado</p>
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
              <span className={`text-xs px-3 py-1.5 rounded-full font-bold uppercase ${eventoData.estatus === "PROXIMA" ? "bg-blue-600 text-white" : eventoData.estatus === "EN_CURSO" ? "bg-green-600 text-white" : "bg-slate-800 text-white"}`}>
                {eventoData.estatus === "PROXIMA" ? "Próximo" : eventoData.estatus === "EN_CURSO" ? "En Curso" : eventoData.estatus}
              </span>
            </div>
          </div>

          {/* Columna Derecha: Contenido */}
          <div className="w-full md:w-7/12 flex flex-col">
            <div className="p-6 md:p-8 flex-1">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">
                {eventoData.nombre_evento}
              </h1>

              <div className="flex flex-wrap gap-3 text-sm mb-6">
                {eventoData.tipo_evento && <span className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-md"><Calendar className="w-4 h-4" /> {eventoData.tipo_evento}</span>}
                {eventoData.sede_nombre && <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md"><MapPin className="w-4 h-4 text-slate-400" /> {eventoData.sede_nombre}</span>}
                {eventoData.cupo_maximo && <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md"><Users className="w-4 h-4 text-slate-400" /> Cupo: {eventoData.cupo_maximo}</span>}
                {eventoData.costo && <span className="flex items-center gap-1.5 text-green-700 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-md"><DollarSign className="w-4 h-4" /> ${eventoData.costo}</span>}
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 mb-6 space-y-2">
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <Clock className="w-5 h-5 text-blue-500 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Inicia:</p>
                    <p>{formatFechaHora(eventoData.fecha_inicio)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <div className="w-5 shrink-0 flex justify-center"><div className="w-1 h-4 bg-slate-300 dark:bg-slate-700" /></div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Termina:</p>
                    <p>{formatFechaHora(eventoData.fecha_fin)}</p>
                  </div>
                </div>
              </div>

              {eventoData.descripcion && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-500" /> Descripción
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm whitespace-pre-wrap leading-relaxed">
                    {eventoData.descripcion}
                  </p>
                </div>
              )}

              {eventoData.requisitos && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                    <Info className="w-5 h-5 text-orange-500" /> Requisitos
                  </h3>
                  <div className="bg-orange-50 dark:bg-orange-950/20 text-orange-800 dark:text-orange-200 p-4 rounded-xl text-sm whitespace-pre-wrap leading-relaxed border border-orange-100 dark:border-orange-900/30">
                    {eventoData.requisitos}
                  </div>
                </div>
              )}

              {eventoData.recomendaciones && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                    <Info className="w-5 h-5 text-purple-500" /> Recomendaciones
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm whitespace-pre-wrap leading-relaxed">
                    {eventoData.recomendaciones}
                  </p>
                </div>
              )}

              {eventoData.politica_cancelacion && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                    <Info className="w-5 h-5 text-red-500" /> Política de Cancelación
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm whitespace-pre-wrap leading-relaxed bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                    {eventoData.politica_cancelacion}
                  </p>
                </div>
              )}
            </div>

            {/* Footer con acciones */}
            <div className="p-4 md:p-6 border-t border-slate-100 dark:border-[#2a2b3d] bg-slate-50 dark:bg-[#1a1b26] flex flex-wrap gap-3 justify-end items-center mt-auto">
              <Link 
                href={`/registro/${eventoData.id}`}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-black shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 hover:scale-105 transition-transform uppercase tracking-wider"
              >
                ¡INSCRIBETE AHORA!
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
