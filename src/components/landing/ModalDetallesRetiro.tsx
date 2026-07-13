"use client";

import { X, Calendar, MapPin, Users, DollarSign, Clock, Share2, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ModalDetallesRetiroProps {
  retiro: any;
  onClose: () => void;
}

export function ModalDetallesRetiro({ retiro, onClose }: ModalDetallesRetiroProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [imageExpanded, setImageExpanded] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!isMounted) return null;

  const formatFechaHora = (fecha: any) => {
    if (!fecha) return "Por confirmar";
    const d = new Date(fecha);
    const datePart = d.toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" });
    const timePart = d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "UTC" });
    return `${datePart} - ${timePart}`;
  };

  const shareUrl = `${window.location.origin}/retiros-eventos/${retiro.id}`;
  const shareTitle = `¡Te invito a ${retiro.nombre_evento}!`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: "Hola, quiero compartir contigo esta invitación, a ver que te parece, en la liga más información.\\n\\n" + (retiro.descripcion || "No te pierdas este evento."),
          url: shareUrl,
        });
      } catch (err) {
        console.error("Error al compartir", err);
      }
    } else {
      // Fallback
      navigator.clipboard.writeText(shareUrl);
      toast.success("Enlace copiado al portapapeles");
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        onClick={onClose}
      >
        <div 
          className="bg-white dark:bg-[#1a1b26] rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón Cerrar (Mobile flotante) */}
          <button 
            onClick={onClose}
            className="md:hidden absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Columna Izquierda: Cartel */}
          <div className="w-full md:w-5/12 bg-slate-100 dark:bg-[#0f1015] relative min-h-[300px] md:min-h-[500px]">
            {retiro.imagen_cartel_url ? (
              <Image
                src={retiro.imagen_cartel_url}
                alt={retiro.nombre_evento}
                fill
                className="object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                onClick={() => setImageExpanded(true)}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                <Calendar className="w-16 h-16 opacity-50 mb-4" />
                <p>Sin cartel asignado</p>
              </div>
            )}
            
            {/* Gradiente sutil para integración */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
              <span className={`text-xs px-3 py-1.5 rounded-full font-bold uppercase ${retiro.estatus === "PROXIMA" ? "bg-blue-600 text-white" : retiro.estatus === "EN_CURSO" ? "bg-green-600 text-white" : "bg-slate-800 text-white"}`}>
                {retiro.estatus === "PROXIMA" ? "Próximo" : retiro.estatus === "EN_CURSO" ? "En Curso" : retiro.estatus}
              </span>
            </div>
          </div>

          {/* Columna Derecha: Contenido */}
          <div className="w-full md:w-7/12 flex flex-col max-h-[80vh] overflow-y-auto">
            <div className="p-6 md:p-8 flex-1">
              {/* Botón Cerrar Desktop */}
              <div className="hidden md:flex justify-end mb-2">
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">
                {retiro.nombre_evento}
              </h2>

              <div className="flex flex-wrap gap-3 text-sm mb-6">
                {retiro.tipo_evento && <span className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-md"><Calendar className="w-4 h-4" /> {retiro.tipo_evento}</span>}
                {retiro.sede_nombre && <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md"><MapPin className="w-4 h-4 text-slate-400" /> {retiro.sede_nombre}</span>}
                {retiro.cupo_maximo && <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md"><Users className="w-4 h-4 text-slate-400" /> Cupo: {retiro.cupo_maximo}</span>}
                {retiro.costo && <span className="flex items-center gap-1.5 text-green-700 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-md"><DollarSign className="w-4 h-4" /> ${retiro.costo}</span>}
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 mb-6 space-y-2">
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <Clock className="w-5 h-5 text-blue-500 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Inicia:</p>
                    <p>{formatFechaHora(retiro.fecha_inicio)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <div className="w-5 shrink-0 flex justify-center"><div className="w-1 h-4 bg-slate-300 dark:bg-slate-700" /></div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Termina:</p>
                    <p>{formatFechaHora(retiro.fecha_fin)}</p>
                  </div>
                </div>
              </div>

              {retiro.descripcion && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-500" /> Descripción
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm whitespace-pre-wrap leading-relaxed">
                    {retiro.descripcion}
                  </p>
                </div>
              )}

              {retiro.requisitos && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                    <Info className="w-5 h-5 text-orange-500" /> Requisitos
                  </h3>
                  <div className="bg-orange-50 dark:bg-orange-950/20 text-orange-800 dark:text-orange-200 p-4 rounded-xl text-sm whitespace-pre-wrap leading-relaxed border border-orange-100 dark:border-orange-900/30">
                    {retiro.requisitos}
                  </div>
                </div>
              )}

              {retiro.recomendaciones && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                    <Info className="w-5 h-5 text-purple-500" /> Recomendaciones
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm whitespace-pre-wrap leading-relaxed">
                    {retiro.recomendaciones}
                  </p>
                </div>
              )}

              {retiro.politica_cancelacion && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                    <Info className="w-5 h-5 text-red-500" /> Política de Cancelación
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm whitespace-pre-wrap leading-relaxed bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                    {retiro.politica_cancelacion}
                  </p>
                </div>
              )}
            </div>

            {/* Footer con acciones */}
            <div className="p-4 md:p-6 border-t border-slate-100 dark:border-[#2a2b3d] bg-slate-50 dark:bg-[#1a1b26]/90 backdrop-blur-sm flex flex-wrap gap-3 justify-end items-center sticky bottom-0">
              <button 
                onClick={handleShare}
                className="mr-auto flex items-center gap-2 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 font-medium transition-colors p-2"
                title="Compartir"
              >
                <Share2 className="w-5 h-5" />
                <span className="hidden sm:inline">Compartir</span>
              </button>
              
              <button 
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              >
                Regresar
              </button>
              
              <Link 
                href={`/registro/${retiro.id}`}
                className="px-8 py-2.5 rounded-xl font-black text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
              >
                ¡INSCRIBETE!
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Visor de Imagen Expandida */}
      {imageExpanded && retiro.imagen_cartel_url && (
        <div 
          className="fixed inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center p-4 sm:p-8 backdrop-blur-xl"
          onClick={() => setImageExpanded(false)}
        >
          <button 
            onClick={() => setImageExpanded(false)}
            className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative w-full h-[85vh] max-w-5xl mx-auto flex items-center justify-center">
            <Image
              src={retiro.imagen_cartel_url}
              alt={retiro.nombre_evento}
              fill
              className="object-contain"
            />
          </div>
          
          {/* Botones rápidos de compartir en el visor */}
          <div className="mt-6 flex items-center gap-4 text-white">
             <button onClick={(e) => { e.stopPropagation(); handleShare(); }} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full font-medium transition-colors">
               <Share2 className="w-5 h-5" /> Compartir Cartel
             </button>
          </div>
        </div>
      )}
    </>
  );
}
