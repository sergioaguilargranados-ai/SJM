"use server";

import { db } from "./db";
import { organizaciones } from "./schema";
import { eq, sql } from "drizzle-orm";

// ============================================================
// Resolución de Tenant por Dominio
// Equivalente al DomainContext de ERPCubox, pero server-side
// ============================================================

export interface DatosTenant {
  id: string;
  nombre: string;
  lema: string | null;
  logo_url: string | null;
  // Colores de marca
  color_primario: string;
  color_secundario: string;
  color_terciario: string;
  // Contacto
  telefono_contacto: string | null;
  whatsapp_contacto: string | null;
  correo_contacto: string | null;
  direccion_completa: string | null;
  ubicacion_url: string | null;
  horarios_atencion: string | null;
  // Redes
  facebook_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
}

// Dominios que muestran el sitio principal SJM (no son tenants)
const DOMINIOS_PRINCIPALES = [
  "serjema.com",
  "www.serjema.com",
  "serjema.com.mx",
  "www.serjema.com.mx",
  "localhost",
];

/**
 * Resuelve la organización basándose en el hostname del request.
 * Similar a DomainContext.jsx de ERPCubox pero ejecutado en servidor.
 * 
 * Retorna null si es el dominio principal (modo SaaS/SJM Nacional).
 * Retorna los datos del tenant si se encuentra una organización.
 */
export async function resolverTenant(hostname: string): Promise<DatosTenant | null> {
  // Normalizar: quitar www. y puerto
  const dominio = hostname.replace(/^www\./, "").split(":")[0];

  // Si es el dominio principal, mostrar SJM Nacional (no es tenant)
  if (DOMINIOS_PRINCIPALES.includes(dominio) || DOMINIOS_PRINCIPALES.includes(hostname)) {
    return null;
  }

  try {
    // Buscar por dominio_tenant exacto
    const [org] = await db
      .select({
        id: organizaciones.id,
        nombre: organizaciones.nombre,
        lema: organizaciones.lema,
        logo_url: organizaciones.logo_url,
        color_primario: organizaciones.color_primario,
        color_secundario: organizaciones.color_secundario,
        color_terciario: organizaciones.color_terciario,
        telefono_contacto: organizaciones.telefono_contacto,
        whatsapp_contacto: organizaciones.whatsapp_contacto,
        correo_contacto: organizaciones.correo_contacto,
        direccion_completa: organizaciones.direccion_completa,
        ubicacion_url: organizaciones.ubicacion_url,
        horarios_atencion: organizaciones.horarios_atencion,
        facebook_url: organizaciones.facebook_url,
        instagram_url: organizaciones.instagram_url,
        youtube_url: organizaciones.youtube_url,
        dominio_aliases: organizaciones.dominio_aliases,
      })
      .from(organizaciones)
      .where(eq(organizaciones.dominio_tenant, dominio));

    if (org) {
      return {
        ...org,
        color_primario: org.color_primario || "#00A69C",
        color_secundario: org.color_secundario || "#1E3A5F",
        color_terciario: org.color_terciario || "#FFFFFF",
      };
    }

    // Si no se encontró por dominio exacto, buscar en aliases (JSON array)
    const [orgAlias] = await db
      .select({
        id: organizaciones.id,
        nombre: organizaciones.nombre,
        lema: organizaciones.lema,
        logo_url: organizaciones.logo_url,
        color_primario: organizaciones.color_primario,
        color_secundario: organizaciones.color_secundario,
        color_terciario: organizaciones.color_terciario,
        telefono_contacto: organizaciones.telefono_contacto,
        whatsapp_contacto: organizaciones.whatsapp_contacto,
        correo_contacto: organizaciones.correo_contacto,
        direccion_completa: organizaciones.direccion_completa,
        ubicacion_url: organizaciones.ubicacion_url,
        horarios_atencion: organizaciones.horarios_atencion,
        facebook_url: organizaciones.facebook_url,
        instagram_url: organizaciones.instagram_url,
        youtube_url: organizaciones.youtube_url,
      })
      .from(organizaciones)
      .where(sql`${organizaciones.dominio_aliases}::text LIKE ${"%" + dominio + "%"}`);

    if (orgAlias) {
      return {
        ...orgAlias,
        color_primario: orgAlias.color_primario || "#00A69C",
        color_secundario: orgAlias.color_secundario || "#1E3A5F",
        color_terciario: orgAlias.color_terciario || "#FFFFFF",
      };
    }

    // No se encontró ninguna organización para este dominio
    console.warn(`⚠️ Dominio no registrado: ${dominio} — mostrando modo SJM Nacional`);
    return null;
  } catch (error) {
    console.error("❌ Error resolviendo tenant:", error);
    return null;
  }
}

/**
 * Obtiene datos de la organización por ID (para uso en sesión/dashboard)
 */
export async function obtenerOrganizacionPorId(orgId: string): Promise<DatosTenant | null> {
  try {
    const [org] = await db
      .select({
        id: organizaciones.id,
        nombre: organizaciones.nombre,
        lema: organizaciones.lema,
        logo_url: organizaciones.logo_url,
        color_primario: organizaciones.color_primario,
        color_secundario: organizaciones.color_secundario,
        color_terciario: organizaciones.color_terciario,
        telefono_contacto: organizaciones.telefono_contacto,
        whatsapp_contacto: organizaciones.whatsapp_contacto,
        correo_contacto: organizaciones.correo_contacto,
        direccion_completa: organizaciones.direccion_completa,
        ubicacion_url: organizaciones.ubicacion_url,
        horarios_atencion: organizaciones.horarios_atencion,
        facebook_url: organizaciones.facebook_url,
        instagram_url: organizaciones.instagram_url,
        youtube_url: organizaciones.youtube_url,
      })
      .from(organizaciones)
      .where(eq(organizaciones.id, orgId));

    if (!org) return null;

    return {
      ...org,
      color_primario: org.color_primario || "#00A69C",
      color_secundario: org.color_secundario || "#1E3A5F",
      color_terciario: org.color_terciario || "#FFFFFF",
    };
  } catch (error) {
    console.error("❌ Error obteniendo organización:", error);
    return null;
  }
}
