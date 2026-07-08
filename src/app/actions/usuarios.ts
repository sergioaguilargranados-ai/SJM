"use server";

import { db } from "@/lib/db";
import { usuarios, roles_sistema, organizaciones } from "@/lib/schema";
import { eq, desc, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

/**
 * Obtiene todos los usuarios de una organización con sus roles.
 */
export async function getUsuariosOrganizacion(organizacionId: string) {
  try {
    const list = await db.query.usuarios.findMany({
      where: eq(usuarios.organizacion_id, organizacionId),
      with: {
        rol: true
      },
      orderBy: [desc(usuarios.creado_en)]
    });
    return list;
  } catch (err) {
    console.error("Error getUsuariosOrganizacion:", err);
    return [];
  }
}

/**
 * Elimina un usuario (soft delete o hard delete según dicte la política)
 * Por ahora hard delete para limpieza de pruebas
 */
export async function eliminarUsuarioAction(id: string) {
  try {
    await db.delete(usuarios).where(eq(usuarios.id, id));
    revalidatePath("/configuracion/usuarios");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function registrarUsuarioPublicoAction(data: { nombre: string, correo: string, telefono: string, password: string }) {
  try {
    // Verificar si el correo o celular ya existe
    const existente = await db.query.usuarios.findFirst({
      where: or(
        eq(usuarios.correo, data.correo.toLowerCase()),
        eq(usuarios.celular, data.telefono)
      )
    });

    if (existente) {
      if (existente.correo === data.correo.toLowerCase()) {
        return { success: false, error: "El correo electrónico ya está registrado." };
      }
      if (existente.celular === data.telefono) {
        return { success: false, error: "El número de celular ya está registrado." };
      }
      return { success: false, error: "El usuario ya existe." };
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data.password, salt);

    // Obtener la organización por defecto (SJM Nacional)
    const orgDefecto = await db.query.organizaciones.findFirst();
    if (!orgDefecto) {
      return { success: false, error: "No se encontró la organización base en el sistema." };
    }

    // Insertar el nuevo usuario sin rol asignado (null por defecto)
    await db.insert(usuarios).values({
      organizacion_id: orgDefecto.id,
      nombre_completo: data.nombre,
      correo: data.correo.toLowerCase(),
      celular: data.telefono,
      contrasena_hash: hash,
      foto_perfil_url: "/placeholder-user.jpg",
      creado_en: new Date()
    });

    return { success: true };
  } catch (err: any) {
    console.error("Error en registro:", err);
    return { success: false, error: err.message || "Error al registrar el usuario" };
  }
}
