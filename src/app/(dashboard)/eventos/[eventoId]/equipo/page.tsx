import { getEventoById, getEquipoByEvento, getServidores } from "@/app/actions/consultas";
import Link from "next/link";
import { ChevronLeft, Users } from "lucide-react";
import EquipoClientView from "./EquipoClientView";

export default async function EquipoEventoPage({ params }: { params: Promise<{ eventoId: string }> }) {
  const { eventoId } = await params;
  const { data: evento } = await getEventoById(eventoId);
  const { data: equipo } = await getEquipoByEvento(eventoId);
  const { data: servidores } = await getServidores();

  if (!evento) {
    return (
      <div className="p-12 text-center bg-white dark:bg-[#1a1b26] rounded-3xl border border-dashed border-slate-200 dark:border-[#3b3c54]">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Evento no encontrado</h2>
        <Link href="/eventos" className="text-blue-600 dark:text-[#e11d48] mt-4 inline-block font-bold">Regresar al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link href={`/eventos/${eventoId}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:hover:text-[#e11d48] transition-colors text-sm font-medium">
        <ChevronLeft className="w-4 h-4" /> Volver a Detalles del Evento
      </Link>

      <div className="bg-white dark:bg-[#1a1b26] rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-[#2a2b3d]">
        <div className="bg-blue-600 dark:bg-[#e11d48] p-8 text-white">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="bg-white/20 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">Equipo de Servicio</span>
              <h1 className="text-4xl font-black tracking-tight uppercase">{evento.nombre_evento || evento.tipo}</h1>
            </div>
            <Users className="w-10 h-10 text-white/50" />
          </div>
        </div>

        <div className="p-8">
           <EquipoClientView 
             evento={evento} 
             equipoActual={equipo || []} 
             servidores={servidores || []} 
           />
        </div>
      </div>
    </div>
  );
}
