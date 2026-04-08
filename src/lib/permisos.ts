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

  const modulosPermitidos = accesos[planClave] || accesos.landing;

  // Si la clave de función solicitada no está en los permitidos del plan, redirigir
  if (!modulosPermitidos.some(m => claveFunc.startsWith(m))) {
    console.warn(`🚫 Acceso denegado a ${claveFunc} para plan ${planClave}`);
    redirect("/dashboard?error=plan_insuficiente");
  }

  return { planClave, orgId };
}
