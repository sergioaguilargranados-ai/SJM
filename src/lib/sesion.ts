import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Helper para obtener los datos del usuario actual desde la sesión.
 * Usar en Server Components y Server Actions.
 * Si no hay sesión activa, redirige a /login.
 */
export async function getUsuarioSesion() {
  const session = await auth();

  if (!session?.user?.organizacion_id) {
    redirect("/login");
  }

  return {
    usuario_id: session.user.usuario_id,
    organizacion_id: session.user.organizacion_id,
    sede_id: session.user.sede_id,
    rol_id: session.user.rol_id,
    rol_nombre: session.user.rol_nombre,
    nombre_completo: session.user.nombre_completo,
    correo: session.user.email,
    foto: session.user.image,
  };
}

/**
 * Helper para obtener sesión sin forzar redirect (para client components / topbar)
 */
export async function getUsuarioSesionOpcional() {
  const session = await auth();
  if (!session?.user) return null;

  return {
    usuario_id: session.user.usuario_id || "",
    organizacion_id: session.user.organizacion_id || "",
    sede_id: session.user.sede_id,
    rol_nombre: session.user.rol_nombre,
    nombre_completo: session.user.nombre_completo || session.user.name || "",
    correo: session.user.email || "",
    foto: session.user.image || "",
  };
}
