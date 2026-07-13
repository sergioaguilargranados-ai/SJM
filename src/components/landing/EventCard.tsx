"use client";

import { Calendar, MapPin, Users, DollarSign, Clock, ArrowRight, Info, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ModalDetallesRetiro } from "./ModalDetallesRetiro";
import Image from "next/image";

interface EventCardProps {
  r: any;
}

export function EventCard({ r }: EventCardProps) {
  const formatFechaHora = (fecha: any) => {
    if (!fecha) return "Por confirmar";
    const d = new Date(fecha);
    const datePart = d.toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" });
    const timePart = d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "UTC" });
    return `${datePart} - ${timePart}`;
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-[#1a1b26] rounded-3xl border border-slate-200 dark:border-[#2a2b3d] p-6 md:p-8 hover:shadow-xl transition-all flex flex-col gap-6">
        
        {/* Cabecera del Evento (Fecha, Título, Info y Botón) */}
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Cartel Miniatura (Nuevo) */}
          <div 
            className="w-24 h-32 md:w-32 md:h-44 shrink-0 rounded-2xl overflow-hidden relative cursor-pointer group shadow-lg bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700"
            onClick={() => setIsModalOpen(true)}
          >
            {r.imagen_cartel_url ? (
              <>
                <Image 
                  src={r.imagen_cartel_url} 
                  alt={r.nombre_evento} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded backdrop-blur-sm">Ver cartel</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                 <ImageIcon className="w-8 h-8 opacity-50 mb-2" />
                 <span className="text-[10px] font-medium uppercase tracking-wider">Sin cartel</span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{r.nombre_evento}</h2>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
              {r.tipo_evento && <span className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-md"><Calendar className="w-4 h-4" /> {r.tipo_evento}</span>}
              {r.sede_nombre && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {r.sede_nombre}</span>}
              {r.cupo_maximo && <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-400" /> Cupo: {r.cupo_maximo}</span>}
              {r.costo && <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-slate-400" /> ${r.costo}</span>}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-3 text-sm text-slate-500 font-medium bg-slate-50 dark:bg-slate-800/50 w-fit px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
              <Clock className="w-4 h-4 text-blue-500 shrink-0" />
              <span>{formatFechaHora(r.fecha_inicio)}</span>
              <span className="text-slate-300 dark:text-slate-600 px-1">→</span>
              <span>{formatFechaHora(r.fecha_fin)}</span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-3 w-full md:w-auto mt-4 md:mt-0">
            <span className={`text-xs px-3 py-1.5 rounded-full font-bold uppercase self-start md:self-end ${r.estatus === "PROXIMA" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" : r.estatus === "EN_CURSO" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
              {r.estatus === "PROXIMA" ? "Próximo" : r.estatus === "EN_CURSO" ? "En Curso" : r.estatus}
            </span>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-bold px-4 py-2 flex items-center justify-center gap-2 transition-colors uppercase tracking-wider w-full md:w-auto"
            >
              <Info className="w-5 h-5" />
              Ver Detalles
            </button>

            <Link 
              href={`/registro/${r.id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-black shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 hover:scale-105 transition-transform uppercase tracking-wider w-full md:w-auto"
            >
              ¡INSCRIBETE!
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Descripción corta */}
        {r.descripcion && (
          <div className="pt-5 border-t border-slate-100 dark:border-[#2a2b3d]">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap line-clamp-2">{r.descripcion}</p>
          </div>
        )}
      </div>
      
      {isModalOpen && (
        <ModalDetallesRetiro retiro={r} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
