import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { usuarios, sedes } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { PerfilClientView } from "./PerfilClientView";

export const metadata = {
  title: "Mi Perfil | SJM Nacional",
};

export default async function PerfilPage() {
  const session = await auth();
  if (!session?.user?.usuario_id) redirect("/login");

  // Obtener datos completos del usuario
  const [usuario] = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.id, session.user.usuario_id));

  if (!usuario) redirect("/login");

  // Obtener lista de sedes para el combo
  const listaSedes = await db
    .select({ id: sedes.id, nombre: sedes.nombre })
    .from(sedes)
    .where(eq(sedes.organizacion_id, usuario.organizacion_id));

  return (
    <PerfilClientView
      usuario={{
        id: usuario.id,
        nombre_completo: usuario.nombre_completo,
        correo: usuario.correo,
        celular: usuario.celular || "",
        fecha_nacimiento: usuario.fecha_nacimiento || "",
        foto_perfil_url: usuario.foto_perfil_url || "",
        es_servidor: usuario.es_servidor || false,
        sede_id: usuario.sede_id || "",
      }}
      sedes={listaSedes}
    />
  );
}
