import { db } from "@/lib/db";
import { roles_sistema } from "@/lib/schema";
import { getUsuarioSesion } from "@/lib/sesion";
import { eq } from "drizzle-orm";
import { getUsuariosOrganizacion } from "@/app/actions/usuarios";
import UsuariosClient from "./UsuariosClient";

export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  const usuario = await getUsuarioSesion();

  const [usuariosList, roles] = await Promise.all([
    getUsuariosOrganizacion(usuario.organizacion_id),
    db.query.roles_sistema.findMany({
      where: eq(roles_sistema.organizacion_id, usuario.organizacion_id)
    })
  ]);

  return (
    <UsuariosClient 
      usuariosInitial={usuariosList} 
      roles={roles} 
    />
  );
}
