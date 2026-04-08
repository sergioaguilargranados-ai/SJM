import { db } from "./db";
import { organizaciones, planes } from "./schema";
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
  plan: {
    id: string;
    nombre: string;
    clave: string;
  } | null;
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
 */
export async function resolverTenant(hostname: string): Promise<DatosTenant | null> {
  const dominio = hostname.replace(/^www\./, "").split(":")[0];

  if (DOMINIOS_PRINCIPALES.includes(dominio) || DOMINIOS_PRINCIPALES.includes(hostname)) {
    return null;
  }

  try {
    const result = await db
      .select({
        org: organizaciones,
        plan: planes
      })
      .from(organizaciones)
      .leftJoin(planes, eq(organizaciones.plan_id, planes.id))
      .where(eq(organizaciones.dominio_tenant, dominio))
      .limit(1);

    const match = result[0];

    if (match) {
      return {
        ...match.org,
        color_primario: match.org.color_primario || "#00B4AA",
        color_secundario: match.org.color_secundario || "#1E3A5F",
        color_terciario: match.org.color_terciario || "#FFFFFF",
        plan: match.plan ? {
          id: match.plan.id,
          nombre: match.plan.nombre,
          clave: match.plan.clave as any,
        } : null
      };
    }

    // Alias check
    const aliasMatch = await db
      .select({ org: organizaciones, plan: planes })
      .from(organizaciones)
      .leftJoin(planes, eq(organizaciones.plan_id, planes.id))
      .where(sql`${organizaciones.dominio_aliases}::text LIKE ${"%" + dominio + "%"}`)
      .limit(1);

    const aMatch = aliasMatch[0];
    if (aMatch) {
      return {
        ...aMatch.org,
        color_primario: aMatch.org.color_primario || "#00B4AA",
        color_secundario: aMatch.org.color_secundario || "#1E3A5F",
        color_terciario: aMatch.org.color_terciario || "#FFFFFF",
        plan: aMatch.plan ? {
          id: aMatch.plan.id,
          nombre: aMatch.plan.nombre,
          clave: aMatch.plan.clave as any,
        } : null
      };
    }

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
    const result = await db
      .select({
        org: organizaciones,
        plan: planes
      })
      .from(organizaciones)
      .leftJoin(planes, eq(organizaciones.plan_id, planes.id))
      .where(eq(organizaciones.id, orgId))
      .limit(1);

    const match = result[0];
    if (!match) return null;

    return {
      ...match.org,
      color_primario: match.org.color_primario || "#00B4AA",
      color_secundario: match.org.color_secundario || "#1E3A5F",
      color_terciario: match.org.color_terciario || "#FFFFFF",
      plan: match.plan ? {
        id: match.plan.id,
        nombre: match.plan.nombre,
        clave: match.plan.clave as any,
      } : null
    };
  } catch (error) {
    console.error("❌ Error obteniendo organización:", error);
    return null;
  }
}

