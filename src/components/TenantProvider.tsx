"use client";

import React, { createContext, useContext, useEffect } from "react";

// ============================================================
// TenantProvider — Inyecta colores de marca en variables CSS
// Equivalente a applyTheme() del DomainContext de ERPCubox
// ============================================================

export interface TenantData {
  id: string;
  nombre: string;
  lema: string | null;
  logo_url: string | null;
  color_primario: string;
  color_secundario: string;
  color_terciario: string;
  telefono_contacto: string | null;
  whatsapp_contacto: string | null;
  correo_contacto: string | null;
  direccion_completa: string | null;
  ubicacion_url: string | null;
  horarios_atencion: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
}

// Datos por defecto para SJM Nacional (cuando no hay tenant resuelto)
const TENANT_DEFAULT: TenantData = {
  id: "",
  nombre: "SJM Nacional",
  lema: "Servidores de Jesús por María",
  logo_url: "/logo-sjm-oficial.png",
  color_primario: "#00A69C",
  color_secundario: "#1E3A5F",
  color_terciario: "#FFFFFF",
  telefono_contacto: null,
  whatsapp_contacto: null,
  correo_contacto: "sisepuede@serjema.com",
  direccion_completa: null,
  ubicacion_url: null,
  horarios_atencion: null,
  facebook_url: "https://www.facebook.com/servidoresdejesuspormariagdl",
  instagram_url: "https://www.instagram.com/servidorespormaria/",
  youtube_url: null,
};

const TenantContext = createContext<TenantData>(TENANT_DEFAULT);

/**
 * Hook para acceder a los datos del tenant desde cualquier componente
 * Retorna logo, colores, nombre, contacto, etc.
 */
export function useTenant() {
  return useContext(TenantContext);
}

/**
 * Convierte un color hex a HSL para variables CSS de Tailwind
 * (Mismo helper hexToHsl que usamos en ERPCubox DomainContext)
 */
function hexToHsl(hex: string): string {
  let r = 0, g = 0, b = 0;
  if (!hex) return "0 0% 0%";

  if (hex.length === 4) {
    r = parseInt("0x" + hex[1] + hex[1]);
    g = parseInt("0x" + hex[2] + hex[2]);
    b = parseInt("0x" + hex[3] + hex[3]);
  } else if (hex.length === 7) {
    r = parseInt("0x" + hex[1] + hex[2]);
    g = parseInt("0x" + hex[3] + hex[4]);
    b = parseInt("0x" + hex[5] + hex[6]);
  }

  r /= 255; g /= 255; b /= 255;
  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;
  let h = 0, s = 0, l = 0;

  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);
  if (h < 0) h += 360;
  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return `${h} ${s}% ${l}%`;
}

interface TenantProviderProps {
  children: React.ReactNode;
  tenant?: TenantData | null; // Datos del server, null = SJM Nacional default
}

export function TenantProvider({ children, tenant }: TenantProviderProps) {
  const data = tenant || TENANT_DEFAULT;

  // Inyectar colores de marca como variables CSS dinámicas
  useEffect(() => {
    const root = document.documentElement;

    // Variables CSS personalizadas del tenant
    root.style.setProperty("--tenant-primario", data.color_primario);
    root.style.setProperty("--tenant-secundario", data.color_secundario);
    root.style.setProperty("--tenant-terciario", data.color_terciario);

    // Versiones HSL para Tailwind si se necesitan
    root.style.setProperty("--tenant-primario-hsl", hexToHsl(data.color_primario));
    root.style.setProperty("--tenant-secundario-hsl", hexToHsl(data.color_secundario));

    return () => {
      root.style.removeProperty("--tenant-primario");
      root.style.removeProperty("--tenant-secundario");
      root.style.removeProperty("--tenant-terciario");
      root.style.removeProperty("--tenant-primario-hsl");
      root.style.removeProperty("--tenant-secundario-hsl");
    };
  }, [data]);

  return (
    <TenantContext.Provider value={data}>
      {children}
    </TenantContext.Provider>
  );
}
