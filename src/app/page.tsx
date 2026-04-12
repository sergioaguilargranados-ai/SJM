import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, Heart, BookOpen, ShoppingBag, Users, Calendar, MapPin, Phone,
  Mail, MessageCircle, ChevronDown, Star, Globe, Shield, ShieldCheck,
  Music, HelpCircle, ExternalLink, Sparkles, Flame, Baby, Cross,
  HandHeart
} from "lucide-react";
import { CenefaNavbar } from "@/components/landing/CenefaNavbar";
import { FooterPublico } from "@/components/landing/FooterPublico";
import { resolverTenant } from "@/lib/tenant";
import { HeroCarrusel } from "@/components/landing/HeroCarrusel";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { WhatsAppWidget } from "@/components/landing/WhatsAppWidget";

export const metadata = {
  title: "Servidores de Jesús por María | Un Don del Espíritu Santo en nuestro tiempo",
  description: "Evangelización, retiros de sanación interior, formación cristiana y acompañamiento espiritual. Configurados con Cristo compasivo y misericordioso.",
};

const appVersion = "v1.166 - SJM Platform Premium • Compilación: 11-04-2026 09:53 PM";

// ============================================================
// SECCION PROMOCIONAL — Componente reutilizable para la landing
// Cada sección promocional dirige a una página y tiene agenda
// ============================================================

interface SeccionPromoProps {
  titulo: string;
  subtitulo: string;
  descripcion?: string;
  botonTexto: string;
  botonHref: string;
  botonAgendaTexto?: string;
  botonAgendaHref?: string;
  imagenFondo?: boolean;
  colorDe?: string;
  colorA?: string;
  icono: React.ReactNode;
  invertido?: boolean;
}

function SeccionPromo({
  titulo, subtitulo, descripcion, botonTexto, botonHref,
  botonAgendaTexto, botonAgendaHref, colorDe, colorA, icono, invertido
}: SeccionPromoProps) {
  return (
    <section className={`py-16 md:py-24 ${invertido ? "bg-slate-50 dark:bg-[#151621]" : ""}`}>
      <ScrollReveal className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Icono decorativo */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#1a1b26] dark:to-[#2a2b3d] flex items-center justify-center shadow-lg">
              {icono}
            </div>
          </div>

          {/* Contenido */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {titulo}
            </h2>
            <p className="text-sm md:text-base font-bold text-[#00B4AA] uppercase tracking-wider mt-1">
              {subtitulo}
            </p>
            {descripcion && (
              <p className="text-slate-600 dark:text-slate-400 mt-3 text-[15px] leading-relaxed max-w-xl">{descripcion}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            {botonAgendaTexto && botonAgendaHref && (
              <Link
                href={botonAgendaHref}
                className="flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-[#1a1b26]/80 px-6 text-sm font-bold text-slate-700 dark:text-slate-300 hover:border-[#00B4AA] hover:text-[#00B4AA] transition-all"
              >
                <Calendar className="w-4 h-4" /> {botonAgendaTexto}
              </Link>
            )}
            <Link
              href={botonHref}
              className="btn-glow group flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 text-sm font-bold shadow-lg shadow-blue-200/50 dark:shadow-none"
            >
              {botonTexto} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

export default async function Home() {
  const tenant = await resolverTenant();
  const logoUrl = tenant?.logo_url || "/logo-sjm-oficial.png";
  const nombreOrg = tenant?.nombre || "SJM Nacional";
  const lemaOrg = tenant?.lema || "Servidores de Jesús por María";

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0f1015] font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30">
      
      {/* 1. CENEFA TRASLÚCIDA AL 70% — Sticky */}
      <CenefaNavbar transparencia={70} logoUrl={logoUrl} nombreOrg={nombreOrg} lemaOrg={lemaOrg} />

      {/* 2. CARRUSEL DE IMÁGENES AUTOMÁTICO */}
      <HeroCarrusel />

      {/* 3. BIENVENIDA — Logo grande + nombre + lema */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-400 rounded-full blur-[150px] opacity-10 dark:opacity-15" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-rose-400 rounded-full blur-[150px] opacity-10 dark:opacity-15" />
        </div>

        <ScrollReveal className="max-w-6xl mx-auto px-6 relative z-10" delay={200}>
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Logo grande — izquierda */}
            <div className="shrink-0">
              <Image src={logoUrl} alt={nombreOrg} width={200} height={200} className="drop-shadow-2xl hover:scale-105 transition-transform rounded-2xl" />
            </div>

            {/* Texto — derecha */}
            <div className="text-center md:text-left">
              <p className="text-sm font-bold text-[#00B4AA] tracking-widest uppercase mb-3">
                Un Don del Espíritu Santo en nuestro tiempo
              </p>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05]" style={{ color: "var(--tenant-primario, #1E3A5F)" }}>
                Servidores de{" "}
                <span className="text-gradient-animated text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-rose-600 dark:from-blue-400 dark:via-purple-400 dark:to-rose-400">
                  Jesús por María
                </span>
              </h1>
              <p className="max-w-xl text-lg text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
                Configurados con Cristo compasivo y misericordioso, anunciamos la Buena Nueva,
                haciendo presente la misericordia de Dios y su redención a los más necesitados.
              </p>

              {/* Cita Benedicto XVI */}
              <div className="mt-6 p-4 bg-slate-50 dark:bg-[#1a1b26] rounded-xl border border-slate-200 dark:border-[#2a2b3d] max-w-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                  &ldquo;Vuestro celo nace de haber descubierto la belleza de Cristo...&rdquo;
                </p>
                <p className="text-[10px] text-slate-400 dark:text-[#8e8ea0] mt-2 font-bold">— BENEDICTO XVI, 2007</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 4. "NO ESTAS SOLO" */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 dark:from-slate-900 dark:via-slate-800 dark:to-[#0f1015] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full blur-[200px]" />
        </div>
        <ScrollReveal className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <HandHeart className="w-16 h-16 text-white/60 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            No estás solo
          </h2>
          <p className="text-xl text-white/70 mt-4 font-medium">
            ¿Quieres que oremos juntos por ti?
          </p>
          <Link
            href="/llama-de-amor"
            className="btn-glow group inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-white text-blue-700 px-10 text-lg font-bold shadow-xl mt-8"
          >
            <Heart className="w-5 h-5" /> Si quieres ayuda, estamos para ti <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </ScrollReveal>
      </section>

      {/* 5. RETIROS DE SANACIÓN INTERIOR */}
      <SeccionPromo
        titulo="Retiros de Sanación Interior"
        subtitulo="Evangelizarte para Sanarte"
        descripcion="Un encuentro con Cristo Jesús para la curación de las etapas de la vida. Recupera la espiritualidad de la autoestima como clave para la conversión."
        botonTexto="Ver Detalles"
        botonHref="/sanacion-interior"
        botonAgendaTexto="Próximos Retiros"
        botonAgendaHref="/retiros-eventos"
        icono={<Cross className="w-12 h-12 text-blue-600 dark:text-blue-400" />}
      />

      {/* 6. MATRIMONIOS */}
      <SeccionPromo
        titulo="¿Problemas en tu matrimonio?"
        subtitulo={'Jesús es la solución · "Hagan lo que Él les diga..."'}
        descripcion=""
        botonTexto="Ver Detalles"
        botonHref="/matrimonios"
        botonAgendaTexto="Agenda Matrimonial"
        botonAgendaHref="/retiros-eventos"
        icono={<Heart className="w-12 h-12 text-rose-500" />}
        invertido
      />

      {/* 7. JÓVENES — ELEMÁ */}
      <SeccionPromo
        titulo="Tú el Joven de Hoy"
        subtitulo='ELEMÁ — "Ejército del Más Amado" · Es tu momento, caminemos juntos'
        descripcion=""
        botonTexto="Ver Detalles"
        botonHref="/jovenes"
        botonAgendaTexto="Próximas Fechas"
        botonAgendaHref="/retiros-eventos"
        icono={<Flame className="w-12 h-12 text-orange-500" />}
      />

      {/* 8. MUNDO INFANTIL */}
      <SeccionPromo
        titulo="Mundo Infantil"
        subtitulo="¡Vamos a jugar y a aprender con Jesús!"
        descripcion=""
        botonTexto="Ver Detalles"
        botonHref="/mundo-infantil"
        botonAgendaTexto="Próximas Actividades"
        botonAgendaHref="/retiros-eventos"
        icono={<Baby className="w-12 h-12 text-green-500" />}
        invertido
      />

      {/* 9. TESTIMONIOS */}
      <section className="py-16 md:py-24">
        <ScrollReveal className="max-w-6xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
            <Star className="w-3.5 h-3.5" /> Testimonios
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            ¿Quieres saber cómo Jesús impactó la vida de otros?
          </h2>
          <Link
            href="/testimonios"
            className="btn-glow group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 text-sm font-bold mt-8 shadow-lg"
          >
            Ver Testimonios <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </ScrollReveal>
      </section>

      {/* 10. TIENDA ONLINE */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-[#151621]">
        <ScrollReveal className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Tienda Online</h2>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mt-1">
                Con lo que nos sostenemos y tenemos exclusivo para ti
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm italic">
                La mayoría hechos con nuestras manos, hechas para ti...
              </p>
            </div>
            <Link
              href="/tienda"
              className="btn-glow group flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-8 text-sm font-bold shadow-lg shadow-emerald-200/50 dark:shadow-none"
            >
              <ShoppingBag className="w-4 h-4" /> Ver Tienda <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* 11. CENTROS SJM */}
      <SeccionPromo
        titulo="Sedes o Centros de Evangelización SJM"
        subtitulo="Estamos cerca de ti..."
        descripcion=""
        botonTexto="Ver Centros"
        botonHref="/centros"
        icono={<MapPin className="w-12 h-12 text-purple-600 dark:text-purple-400" />}
      />

      {/* 12. DONACIONES */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-orange-500 animate-shimmer" />
        <ScrollReveal className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Heart className="w-16 h-16 text-white/80 mx-auto mb-6 animate-pulse-soft" />
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Tu aportación transforma vidas
          </h2>
          <p className="text-lg text-white/80 mt-4 max-w-xl mx-auto">
            &ldquo;Dad y se os dará&rdquo; — Cada donativo hace posible que más personas vivan la experiencia de un retiro de sanación interior.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="/donativos" className="btn-glow group flex h-14 items-center justify-center gap-3 rounded-2xl bg-white text-rose-600 px-10 text-lg font-bold shadow-xl">
              <Heart className="w-5 h-5" /> Quiero Donar
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* 13. ¿NECESITAS AYUDA? */}
      <section className="py-16 md:py-20 bg-slate-50 dark:bg-[#151621]">
        <ScrollReveal className="max-w-4xl mx-auto px-6 text-center">
          <HelpCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            ¿Necesitas ayuda?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3 max-w-md mx-auto">
            Estamos aquí para escucharte y acompañarte en tu camino.
          </p>
          <Link
            href="/ayuda"
            className="btn-glow group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 text-white px-8 text-sm font-bold mt-6 shadow-lg"
          >
            Ir a Ayuda <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </ScrollReveal>
      </section>

      {/* 14. CONTÁCTANOS */}
      <section className="py-16 md:py-20">
        <ScrollReveal className="max-w-4xl mx-auto px-6 text-center">
          <Phone className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Contáctanos
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3 max-w-md mx-auto">
            Queremos saber de ti. Escríbenos o llámanos.
          </p>
          <Link
            href="/contactanos"
            className="btn-glow group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 text-sm font-bold mt-6 shadow-lg"
          >
            Ver Contacto <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </ScrollReveal>
      </section>

      {/* FOOTER — Negro degradado a gris */}
      <FooterPublico version={appVersion} logoUrl={logoUrl} organizacion={nombreOrg} correo={tenant?.correo_contacto || undefined} telefono={tenant?.telefono_contacto || undefined} facebook_url={tenant?.facebook_url || undefined} instagram_url={tenant?.instagram_url || undefined} youtube_url={tenant?.youtube_url || undefined} />

      {/* WIDGET FLOTANTE WHATSAPP (solo si hay número configurado) */}
      {tenant?.whatsapp_contacto && (
        <WhatsAppWidget telefono={tenant.whatsapp_contacto} nombreOrg={nombreOrg} />
      )}
    </div>
  );
}
