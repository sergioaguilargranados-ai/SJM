import { db } from "@/lib/db";
import { organizaciones, planes } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { cache } from "react";

// ============================================================
// Resolver Tenant — Identifica la organización por dominio
// En producción: host → dominio aparcado → organizacion_id
// En dev: fallback a SJM Nacional (primera org de la BD)
// ============================================================

export const resolverTenant = cache(async () => {
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  
  // Buscar organización por dominio personalizado
  const dominio = host.replace(/:.*$/, ""); // quitar puerto

  // Primero intentar por dominio exacto
  const [orgPorDominio] = await db
    .select()
    .from(organizaciones)
    .where(eq(organizaciones.dominio_tenant, dominio))
    .limit(1);

  if (orgPorDominio) return orgPorDominio;

  // Fallback: primera organización (SJM Nacional en dev)
  const [orgDefault] = await db
    .select()
    .from(organizaciones)
    .limit(1);

  return orgDefault || null;
});

/** 
 * Obtener organización por ID con su plan (usado en el dashboard layout).
 * Retorna objeto compatible con TenantData (incluye plan como objeto).
 */
export async function obtenerOrganizacionPorId(id: string) {
  const [row] = await db
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
      plan_id: planes.id,
      plan_nombre: planes.nombre,
      plan_clave: planes.clave,
    })
    .from(organizaciones)
    .leftJoin(planes, eq(organizaciones.plan_id, planes.id))
    .where(eq(organizaciones.id, id))
    .limit(1);

  if (!row) return null;

  return {
    id: row.id,
    nombre: row.nombre,
    lema: row.lema,
    logo_url: row.logo_url,
    color_primario: row.color_primario || "#00B4AA",
    color_secundario: row.color_secundario || "#1E3A5F",
    color_terciario: row.color_terciario || "#FFFFFF",
    telefono_contacto: row.telefono_contacto,
    whatsapp_contacto: row.whatsapp_contacto,
    correo_contacto: row.correo_contacto,
    direccion_completa: row.direccion_completa,
    ubicacion_url: row.ubicacion_url,
    horarios_atencion: row.horarios_atencion,
    facebook_url: row.facebook_url,
    instagram_url: row.instagram_url,
    youtube_url: row.youtube_url,
    plan: row.plan_id ? {
      id: row.plan_id,
      nombre: row.plan_nombre || "Plan Básico",
      clave: row.plan_clave || "landing",
    } : null,
  };
}
