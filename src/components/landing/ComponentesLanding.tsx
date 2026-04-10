"use client";

import { useRef } from "react";
import Image from "next/image";

// ============================================================
// TarjetaMenuSeccion — Tarjeta artística de navegación tipo menú
// Al hacer clic, scroll suave premium a la sección correspondiente
// ============================================================

interface TarjetaMenuSeccionProps {
  titulo: string;
  lema?: string;
  imagenUrl?: string;
  seccionId: string;
  indice?: number;
}

export function TarjetaMenuSeccion({ titulo, lema, imagenUrl, seccionId, indice = 0 }: TarjetaMenuSeccionProps) {
  const scrollToSection = () => {
    const el = document.getElementById(seccionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <button
      onClick={scrollToSection}
      className="group relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-[#2a2b3d]/60 bg-white/80 dark:bg-[#1a1b26]/80 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] text-left w-full"
      style={{ animationDelay: `${indice * 80}ms` }}
    >
      {/* Imagen artística */}
      {imagenUrl && (
        <div className="relative h-28 overflow-hidden">
          <Image
            src={imagenUrl}
            alt={titulo}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
      )}

      {/* Contenido */}
      <div className={`p-4 ${imagenUrl ? '' : 'pt-6'}`}>
        <h3 className="font-black text-sm text-slate-900 dark:text-white tracking-tight group-hover:text-[var(--tenant-primario,#00B4AA)] transition-colors leading-snug">
          {titulo}
        </h3>
        {lema && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium italic">
            {lema}
          </p>
        )}

        {/* Indicador visual de scroll */}
        <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider group-hover:text-[var(--tenant-primario,#00B4AA)] transition-colors">
          <span className="w-4 h-0.5 bg-current rounded-full group-hover:w-6 transition-all" />
          Ver más
        </div>
      </div>
    </button>
  );
}

// ============================================================
// SeccionContenido — Sección reutilizable con imagen artística
// título, subtítulo, contenido, autoría
// ============================================================

interface SeccionContenidoProps {
  id: string;
  titulo: string;
  subtitulo?: string;
  contenido: string;
  autoria?: string;
  imagenUrl?: string;
  imagenNotaPie?: string;
  videoUrl?: string;
  videoNotaPie?: string;
  imagenLado?: "izquierda" | "derecha";
  indice?: number;
}

export function SeccionContenido({
  id,
  titulo,
  subtitulo,
  contenido,
  autoria,
  imagenUrl,
  imagenNotaPie,
  videoUrl,
  videoNotaPie,
  imagenLado = "derecha",
  indice = 0,
}: SeccionContenidoProps) {
  const esImpar = indice % 2 !== 0;
  const lado = imagenLado || (esImpar ? "izquierda" : "derecha");

  return (
    <section id={id} className="scroll-mt-24">
      <div className={`flex flex-col ${lado === "izquierda" ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 lg:gap-12 items-center`}>
        {/* Texto */}
        <div className="flex-1 w-full">
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {titulo}
          </h3>
          {subtitulo && (
            <p className="text-sm font-bold text-[var(--tenant-primario,#00B4AA)] uppercase tracking-wider mt-2">
              {subtitulo}
            </p>
          )}
          <div className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed text-[15px] whitespace-pre-line">
            {contenido}
          </div>
          {autoria && (
            <p className="mt-4 text-[11px] text-slate-400 dark:text-[#5e5e72] italic font-medium">
              — {autoria}
            </p>
          )}
        </div>

        {/* Imagen artística */}
        {imagenUrl && (
          <div className="flex-1 w-full max-w-md">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
              <Image
                src={imagenUrl}
                alt={titulo}
                width={500}
                height={350}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            {imagenNotaPie && (
              <p className="text-[10px] text-slate-400 dark:text-[#5e5e72] mt-2 text-center italic">{imagenNotaPie}</p>
            )}
          </div>
        )}
      </div>

      {/* Video (si existe) */}
      {videoUrl && (
        <div className="mt-8">
          <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video max-w-3xl mx-auto">
            <iframe
              src={videoUrl.replace("watch?v=", "embed/")}
              title={titulo}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          {videoNotaPie && (
            <p className="text-[10px] text-slate-400 dark:text-[#5e5e72] mt-2 text-center italic">{videoNotaPie}</p>
          )}
        </div>
      )}
    </section>
  );
}

// ============================================================
// CarruselImagenes — Carrusel de imágenes con autoplay + notas
// ============================================================

interface ImagenCarrusel {
  url: string;
  nota_pie?: string;
}

interface CarruselImagenesProps {
  imagenes: ImagenCarrusel[];
  altura?: string;
}

export function CarruselImagenes({ imagenes, altura = "h-[500px]" }: CarruselImagenesProps) {
  const [indiceActual, setIndiceActual] = useState(0);

  if (!imagenes || imagenes.length === 0) return null;

  return (
    <div className={`relative w-full ${altura} overflow-hidden rounded-none`}>
      {imagenes.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${idx === indiceActual ? "opacity-100" : "opacity-0"}`}
        >
          <Image src={img.url} alt={img.nota_pie || `Imagen ${idx + 1}`} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {img.nota_pie && (
            <p className="absolute bottom-6 left-6 right-6 text-white/80 text-sm font-medium drop-shadow-lg">
              {img.nota_pie}
            </p>
          )}
        </div>
      ))}

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {imagenes.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setIndiceActual(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${idx === indiceActual ? "bg-white w-8" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}

// Hook para auto-rotación
import { useState, useEffect } from "react";

export function useAutoCarrusel(total: number, intervalo = 5000) {
  const [indice, setIndice] = useState(0);
  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      setIndice((prev) => (prev + 1) % total);
    }, intervalo);
    return () => clearInterval(timer);
  }, [total, intervalo]);
  return [indice, setIndice] as const;
}

// ============================================================
// CintaFotosVertical — Franja vertical de fotos carrusel (20+)
// ============================================================

interface CintaFotosVerticalProps {
  imagenes: string[];
}

export function CintaFotosVertical({ imagenes }: CintaFotosVerticalProps) {
  if (!imagenes || imagenes.length === 0) return null;

  return (
    <div className="relative w-24 md:w-32 lg:w-40 h-full overflow-hidden shrink-0">
      <div className="absolute inset-0">
        <div className="flex flex-col gap-2 animate-scroll-vertical">
          {[...imagenes, ...imagenes].map((img, idx) => (
            <div key={idx} className="relative w-full aspect-square rounded-lg overflow-hidden shrink-0">
              <Image src={img} alt={`Galería ${idx + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>
      {/* Gradientes de fade */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white dark:from-[#0f1015] to-transparent z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-[#0f1015] to-transparent z-10" />
    </div>
  );
}

// ============================================================
// LetreroEspecial — Letrero colorido parametrizado
// ============================================================

interface LetreroEspecialProps {
  texto: string;
  subtitulo?: string;
  estilo?: "colorido" | "juvenil" | "elegante" | "infantil";
  colorTexto?: string;
  fuenteEspecial?: string;
}

export function LetreroEspecial({ texto, subtitulo, estilo = "elegante", colorTexto, fuenteEspecial }: LetreroEspecialProps) {
  const estilos = {
    colorido: "bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 text-transparent bg-clip-text",
    juvenil: "bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-transparent bg-clip-text",
    elegante: "bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 text-transparent bg-clip-text",
    infantil: "bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 text-transparent bg-clip-text",
  };

  return (
    <div className="text-center py-8">
      <h1
        className={`text-5xl md:text-7xl font-black tracking-tight ${estilos[estilo]}`}
        style={{
          fontFamily: fuenteEspecial || "inherit",
          ...(colorTexto ? { color: colorTexto, backgroundImage: "none", WebkitTextFillColor: colorTexto } : {}),
        }}
      >
        {texto}
      </h1>
      {subtitulo && (
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mt-2 font-medium italic">
          {subtitulo}
        </p>
      )}
    </div>
  );
}
