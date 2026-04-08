import { db } from "@/lib/db";
import { roles_sistema, planes } from "@/lib/schema";
import { getUsuarioSesion } from "@/lib/sesion";
import { eq } from "drizzle-orm";
import PermisosClient from "./PermisosClient";

export const dynamic = "force-dynamic";

export default async function PermisosMaintenancePage() {
  const usuario = await getUsuarioSesion();

  // Obtener roles de la organización actual
  const roles = await db.query.roles_sistema.findMany({
    where: eq(roles_sistema.organizacion_id, usuario.organizacion_id)
  });

  // Obtener todos los planes disponibles (solo lectura para mantenimiento)
  const planesDisponibles = await db.query.planes.findMany();

  return (
    <PermisosClient 
      rolesInitial={roles} 
      planesInitial={planesDisponibles} 
    />
  );
}
