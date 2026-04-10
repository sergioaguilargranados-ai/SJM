"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ============================================================
// HeroCarrusel — Carrusel automático de imágenes para el hero
// Usa imágenes del CMS o fallback a gradientes decorativos
// ============================================================

interface Slide {
  imagen_url?: string;
  titulo?: string;
  subtitulo?: string;
  gradiente?: string;
}

interface HeroCarruselProps {
  slides?: Slide[];
  intervalo?: number; // ms entre slides, default 6000
  altura?: string; // tailwind class, default h-[450px]
}

const slidesDefault: Slide[] = [
  {
    gradiente: "from-slate-900 via-blue-950 to-purple-950",
    titulo: "Servidores de Jesús por María",
    subtitulo: "Configurados con Cristo compasivo y misericordioso",
  },
  {
    gradiente: "from-indigo-950 via-purple-950 to-rose-950",
    titulo: "Retiros de Sanación Interior",
    subtitulo: "La otra opción cuando lo has intentado todo",
  },
  {
    gradiente: "from-emerald-950 via-teal-950 to-cyan-950",
    titulo: "Evangelización y Caridad",
    subtitulo: "Un Don del Espíritu Santo en nuestro tiempo",
  },
  {
    gradiente: "from-amber-950 via-orange-950 to-red-950",
    titulo: "Únete a nuestra Misión",
    subtitulo: "Donde haya corazones rotos, ahí estaremos",
  },
];

export function HeroCarrusel({
  slides = slidesDefault,
  intervalo = 6000,
  altura = "h-[300px] md:h-[450px]",
}: HeroCarruselProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (idx: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(idx);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, slides.length, goTo]);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, intervalo);
    return () => clearInterval(timer);
  }, [next, intervalo]);

  return (
    <section className={`relative ${altura} overflow-hidden`}>
      {/* Slides */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            idx === current
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          }`}
        >
          {slide.imagen_url ? (
            <Image
              src={slide.imagen_url}
              alt={slide.titulo || `Slide ${idx + 1}`}
              fill
              className="object-cover"
              priority={idx === 0}
            />
          ) : (
            <div
              className={`absolute inset-0 bg-gradient-to-br ${slide.gradiente || "from-slate-900 to-blue-900"}`}
            >
              {/* Efectos decorativos */}
              <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-white/3 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: "2s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
            </div>
          )}

          {/* Overlay con texto */}
          {(slide.titulo || slide.subtitulo) && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center px-6 max-w-3xl">
                {slide.titulo && (
                  <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-lg">
                    {slide.titulo}
                  </h2>
                )}
                {slide.subtitulo && (
                  <p className="text-base md:text-xl text-white/70 mt-3 font-medium drop-shadow">
                    {slide.subtitulo}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Gradient overlay bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-[#0f1015] z-20 pointer-events-none" />

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all hover:scale-110"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all hover:scale-110"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === current
                  ? "w-8 h-2 bg-white"
                  : "w-2 h-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Ir a slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
