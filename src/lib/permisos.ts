import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { planes, plan_permisos, funciones_sistema, organizaciones } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";

/**
 * Valida si la organización del usuario tiene acceso a una función o módulo
 * según su plan de contratación (Landing, Admin, Premium).
 */
export async function validarAccesoPlan(claveFunc: string) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // 1. Obtener la organización y su plan
  const org = await db.query.organizaciones.findFirst({
    where: eq(organizaciones.id, (session.user as any).organizacion_id),
    with: {
      // Usaremos drizzle query si está configurado, sino select manual
    }
  });

  // Nota: Dado que acabamos de crear el esquema, si la organización no tiene plan_id,
  // por defecto para SJM Nacional (nuestro tenant principal) asumiremos Premium.
  
  const orgId = (session.user as any).organizacion_id;
  
  // Consulta directa para mayor seguridad
  const result = await db
    .select({
      planClave: planes.clave
    })
    .from(organizaciones)
    .leftJoin(planes, eq(organizaciones.plan_id, planes.id))
    .where(eq(organizaciones.id, orgId))
    .limit(1);

  const planClave = result[0]?.planClave || "premium"; // Default a premium para SJM mientras migramos

  // Definición de niveles de acceso por plan (Hardcoded para rapidez, luego puede ser DB)
  const accesos: Record<string, string[]> = {
    landing: ["dashboard", "configuracion"],
    admin: ["dashboard", "configuracion", "servidores", "eventos", "inscripciones", "sedes", "ministerios", "tipos-eventos"],
    premium: ["dashboard", "configuracion", "servidores", "eventos", "inscripciones", "sedes", "ministerios", "tipos-eventos", "finanzas", "documentos"]
  };

/**
 * Obtiene la lista de acciones permitidas para el rol del usuario (ej: ["servidores.view", "finanzas.create"])
 */
export async function getPermisosUsuario() {
  const session = await auth();
  if (!session?.user) return [];

  const rolId = (session.user as any).rol_id;
  if (!rolId) return [];

  // 1. Si es Admin de Sistema, tiene todo (mientras terminamos de popular la DB)
  const [rol] = await db.select().from(roles_sistema).where(eq(roles_sistema.id, rolId));
  if (rol?.es_admin_sistema) return ["*"]; // Comodín para acceso total

  // 2. Consultar permisos específicos
  const permisos = await db
    .select({
      modulo: modulos_sistema.clave,
      funcion: funciones_sistema.clave,
      accion: acciones_sistema.clave,
    })
    .from(rol_permisos)
    .innerJoin(acciones_sistema, eq(rol_permisos.accion_id, acciones_sistema.id))
    .innerJoin(funciones_sistema, eq(acciones_sistema.funcion_id, funciones_sistema.id))
    .innerJoin(modulos_sistema, eq(funciones_sistema.modulo_id, modulos_sistema.id))
    .where(eq(rol_permisos.rol_id, rolId));

  // Retornar lista de strings tipo "modulo.accion" o "modulo.funcion.accion"
  return permisos.map(p => `${p.modulo}.${p.accion}`);
}

