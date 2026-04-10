import { db } from "@/lib/db";
import { roles_sistema, planes } from "@/lib/schema";
import { getUsuarioSesion } from "@/lib/sesion";
import { eq } from "drizzle-orm";
import PermisosClient from "./PermisosClient";
import { getEstructuraPermisos } from "@/app/actions/permisos";

export const dynamic = "force-dynamic";

export default async function PermisosMaintenancePage() {
  const usuario = await getUsuarioSesion();

  // Obtener roles de la organización actual y estructura del sistema
  const [roles, planesDisponibles, estructura] = await Promise.all([
    db.query.roles_sistema.findMany({
      where: eq(roles_sistema.organizacion_id, usuario.organizacion_id)
    }),
    db.query.planes.findMany(),
    getEstructuraPermisos()
  ]);

  return (
    <PermisosClient 
      rolesInitial={roles} 
      planesInitial={planesDisponibles} 
      estructura={estructura}
    />
  );
}
