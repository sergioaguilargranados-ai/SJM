import { getEventoById } from "@/app/actions/consultas";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Copy, ExternalLink, ChevronLeft, Calendar, MapPin, Users, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DetalleEventoPage({ params }: { params: { eventoId: string } }) {
  const { data: evento } = await getEventoById(params.eventoId);

  if (!evento) {
    return (
      <div className="p-12 text-center bg-white dark:bg-[#1a1b26] rounded-3xl border border-dashed border-slate-200 dark:border-[#3b3c54]">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Evento no encontrado</h2>
        <Link href="/eventos" className="text-blue-600 dark:text-[#e11d48] mt-4 inline-block font-bold">Regresar al catálogo</Link>
      </div>
    );
  }

  // Lógica Dinámica de Link de Registro SJM
  const isDiplomado = true; // Por ahora forzamos diplomado para la prueba
  const publicUrl = isDiplomado 
    ? `https://sjm-hdzp.vercel.app/diplomado/registro/${evento.id}`
    : `https://sjm-hdzp.vercel.app/registro/${evento.id}`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link href="/eventos" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:hover:text-[#e11d48] transition-colors text-sm font-medium">
        <ChevronLeft className="w-4 h-4" /> Volver a Gestión de Eventos
      </Link>

      <div className="bg-white dark:bg-[#1a1b26] rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-[#2a2b3d]">
        <div className="bg-blue-600 dark:bg-[#e11d48] p-8 text-white">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="bg-white/20 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">Operación de Evento</span>
              <h1 className="text-4xl font-black tracking-tight uppercase">Panel de Control</h1>
              <p className="text-blue-100 dark:text-rose-100 text-sm font-medium">Evento ID: <span className="font-mono text-xs">{evento.id}</span></p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-10">
          {/* SECCION LINK DE REGISTRO */}
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 shadow-sm">
            <div className="flex-1 space-y-1">
              <h3 className="text-xl font-bold text-blue-900 dark:text-blue-200">Link Público de Registro</h3>
              <p className="text-blue-600/70 dark:text-blue-400 text-sm italic">Copia este link y compártelo con tus asistentes por WhatsApp o Redes Sociales.</p>
              <div className="mt-4 flex items-center gap-2 bg-white dark:bg-black/20 p-3 rounded-xl border border-blue-200 dark:border-blue-800 shadow-inner">
                <code className="text-xs font-mono text-blue-700 dark:text-blue-300 break-all">{publicUrl}</code>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <a href={publicUrl} target="_blank" className="bg-blue-600 hover:bg-blue-700 dark:bg-[#e11d48] dark:hover:bg-[#be123c] text-white h-12 flex items-center justify-center rounded-xl px-8 text-sm font-bold shadow-lg shadow-blue-200 dark:shadow-none transition-all">
                 <ExternalLink className="w-4 h-4 mr-2" /> Abrir Formulario Público
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-6">
                <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-[#2a2b3d] pb-2">Información del Evento</h4>
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 dark:bg-[#151621] rounded-lg">
                        <Calendar className="w-5 h-5 text-slate-400 dark:text-[#8e8ea0]" />
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase">Calendario</p>
                         <p className="font-bold text-slate-700 dark:text-slate-200">
                            {evento.fecha_inicio ? format(new Date(evento.fecha_inicio), "PPPP", { locale: es }) : "TBD"}
                         </p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 dark:bg-[#151621] rounded-lg">
                        <MapPin className="w-5 h-5 text-slate-400 dark:text-[#8e8ea0]" />
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase">Modalidad del Evento</p>
                         <p className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight">On-line / SJM Virtual</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="space-y-6">
                <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-[#2a2b3d] pb-2">Control de Inscripciones</h4>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-slate-50 dark:bg-[#151621] rounded-2xl border border-slate-100 dark:border-[#2a2b3d]">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Cupo Máximo</p>
                      <p className="text-2xl font-black text-slate-800 dark:text-white leading-none mt-1">{evento.cupo_maximo}</p>
                   </div>
                   <div className="p-4 bg-slate-50 dark:bg-[#151621] rounded-2xl border border-slate-100 dark:border-[#2a2b3d]">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Confirmados</p>
                      <p className="text-2xl font-black text-emerald-600 leading-none mt-1">0</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
