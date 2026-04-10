"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail, Phone, Globe, Users, Heart, ExternalLink } from "lucide-react";

// ============================================================
// FooterPublico — Footer negro degradado a gris, alto y completo
// Parametrizado vía props del tenant, persistente en landing
// ============================================================

interface FooterPublicoProps {
  nombre?: string;
  organizacion?: string; // alias de nombre
  lema?: string;
  logo_url?: string;
  logoUrl?: string; // alias de logo_url
  correo?: string;
  telefono?: string;
  whatsapp?: string;
  direccion?: string;
  ubicacion_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  pagina_web?: string;
  version?: string;
  footerColorInicio?: string;
  footerColorFin?: string;
}

export function FooterPublico({
  nombre,
  organizacion,
  lema = "Servidores de Jesús por María",
  logo_url,
  logoUrl,
  correo = "sisepuede@serjema.com",
  telefono,
  whatsapp,
  direccion,
  ubicacion_url,
  facebook_url = "https://www.facebook.com/servidoresdejesuspormariagdl",
  instagram_url = "https://www.instagram.com/servidorespormaria/",
  youtube_url,
  pagina_web = "www.serjema.com",
  version = "v1.165",
  footerColorInicio = "#000000",
  footerColorFin = "#374151",
}: FooterPublicoProps) {
  // Resolver aliases
  const displayName = organizacion || nombre || "SJM Nacional";
  const displayLogo = logoUrl || logo_url || "/logo-sjm-oficial.png";
  return (
    <footer
      className="text-slate-400 py-16 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${footerColorInicio} 0%, ${footerColorFin} 100%)`,
      }}
    >
      {/* Efecto sutil */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[200px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Branding */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src={displayLogo} alt={displayName} width={40} height={40} className="drop-shadow-lg rounded-lg" />
              <span className="text-white font-black text-lg tracking-tight">{displayName}</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              {lema}. Un Don del Espíritu Santo en nuestro tiempo.
            </p>
            {direccion && (
              <div className="flex items-start gap-2 mt-4 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{direccion}</span>
              </div>
            )}
          </div>

          {/* Navegación */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Navegación</h4>
            <div className="space-y-2 text-sm">
              <Link href="/nosotros" className="block hover:text-white transition-colors">Nosotros</Link>
              <Link href="/retiros-eventos" className="block hover:text-white transition-colors">Retiros y Eventos</Link>
              <Link href="/testimonios" className="block hover:text-white transition-colors">Testimonios</Link>
              <Link href="/centros" className="block hover:text-white transition-colors">Centros SJM</Link>
              <Link href="/jovenes" className="block hover:text-white transition-colors">Jóvenes</Link>
              <Link href="/matrimonios" className="block hover:text-white transition-colors">Matrimonios</Link>
            </div>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Recursos</h4>
            <div className="space-y-2 text-sm">
              <Link href="/crecimientos" className="block hover:text-white transition-colors">Crecimientos</Link>
              <Link href="/tienda" className="block hover:text-white transition-colors">Tienda Online</Link>
              <Link href="/donativos" className="block hover:text-white transition-colors">Donativos</Link>
              <Link href="/media" className="block hover:text-white transition-colors">Música y Videos</Link>
              <Link href="/ayuda" className="block hover:text-white transition-colors">Ayuda</Link>
              <Link href="/dashboard" className="block hover:text-white transition-colors">Plataforma Admin</Link>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Contacto</h4>
            <div className="space-y-3 text-sm">
              {correo && (
                <a href={`mailto:${correo}`} className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail className="w-3.5 h-3.5" /> {correo}
                </a>
              )}
              {telefono && (
                <a href={`tel:${telefono}`} className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-3.5 h-3.5" /> {telefono}
                </a>
              )}
              {pagina_web && (
                <a href={`https://${pagina_web}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Globe className="w-3.5 h-3.5" /> {pagina_web}
                </a>
              )}
              {ubicacion_url && (
                <a href={ubicacion_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                  <MapPin className="w-3.5 h-3.5" /> Ver ubicación
                </a>
              )}
              
              {/* Redes Sociales */}
              <div className="flex items-center gap-3 mt-4 pt-2">
                {facebook_url && (
                  <a href={facebook_url} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-all hover:scale-110">
                    <Users className="w-4 h-4 text-white" />
                  </a>
                )}
                {instagram_url && (
                  <a href={instagram_url} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-pink-500 hover:to-orange-400 transition-all hover:scale-110">
                    <Globe className="w-4 h-4 text-white" />
                  </a>
                )}
                {youtube_url && (
                  <a href={youtube_url} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 transition-all hover:scale-110">
                    <ExternalLink className="w-4 h-4 text-white" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p className="text-slate-500">© 2026 {displayName} — Todos los derechos reservados</p>
          <p className="text-slate-600 flex items-center gap-1">
            Plataforma SJM {version} • Para Gloria de Dios
            <Heart className="w-3 h-3 text-rose-500/50" />
          </p>
        </div>
      </div>
    </footer>
  );
}
