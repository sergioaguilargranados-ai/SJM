"use server";

import { db } from "@/lib/db";
import { usuarios, roles_sistema } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
