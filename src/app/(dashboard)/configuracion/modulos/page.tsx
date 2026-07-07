import { db } from "@/lib/db";
import { roles_sistema } from "@/lib/schema";
import { getUsuarioSesion } from "@/lib/sesion";
import { eq } from "drizzle-orm";
import { getModulosCompletosAdmin, getPlanes, getPlanPermisos } from "@/app/actions/modulos";
import ModulosClient from "./ModulosClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ModulosPage() {
  const usuario = await getUsuarioSesion();

  // Validar que el usuario tenga un rol
  if (!usuario.rol_id) {
    redirect("/dashboard");
  }

  // Verificar si es admin sistema
  const rol = await db.query.roles_sistema.findFirst({
    where: eq(roles_sistema.id, usuario.rol_id)
  });

  if (!rol || !rol.es_admin_sistema) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Acceso Denegado</h1>
        <p className="mt-2 text-slate-500">No tienes permisos de Super Administrador para ver esta página.</p>
      </div>
    );
  }

  // Obtener datos
  const [modulos, planes] = await Promise.all([
    getModulosCompletosAdmin(),
    getPlanes(),
  ]);

  return <ModulosClient modulosInitial={modulos} planes={planes} />;
}
