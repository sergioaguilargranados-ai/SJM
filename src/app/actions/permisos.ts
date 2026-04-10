"use server";

import { db } from "@/lib/db";
import { roles_sistema, rol_permisos, usuarios, modulos_sistema, acciones_sistema, funciones_sistema } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Crea o actualiza un rol.
 */
export async function upsertRolAction(organizacionId: string, data: { id?: string, nombre: string, es_admin_sistema?: boolean }) {
  try {
    if (data.id) {
      await db.update(roles_sistema).set({
        nombre: data.nombre,
        es_admin_sistema: data.es_admin_sistema ?? false
      }).where(eq(roles_sistema.id, data.id));
    } else {
      await db.insert(roles_sistema).values({
        organizacion_id: organizacionId,
        nombre: data.nombre,
        es_admin_sistema: data.es_admin_sistema ?? false
      });
    }
    revalidatePath("/configuracion/permisos");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Actualiza los permisos de un rol (limpia y re-inserta)
 */
export async function actualizarPermisosRolAction(rolId: string, accionesIds: string[]) {
  try {
    // 1. Eliminar permisos actuales
    await db.delete(rol_permisos).where(eq(rol_permisos.rol_id, rolId));
    
    // 2. Insertar nuevos permisos si hay
    if (accionesIds.length > 0) {
      const values = accionesIds.map(accionId => ({
        rol_id: rolId,
        accion_id: accionId
      }));
      await db.insert(rol_permisos).values(values);
    }
    
    revalidatePath("/configuracion/permisos");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Asigna un rol a un usuario
 */
export async function asignarRolUsuarioAction(usuarioId: string, rolId: string) {
  try {
    await db.update(usuarios)
      .set({ rol_id: rolId })
      .where(eq(usuarios.id, usuarioId));
    
    revalidatePath("/configuracion/usuarios");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Obtiene la estructura completa de módulos -> funciones -> acciones
 */
export async function getEstructuraPermisos() {
  const modulos = await db.query.modulos_sistema.findMany({
    with: {
      funciones: {
        with: {
          acciones: true
        }
      }
    }
  });
  return modulos;
}

/**
 * Obtiene los IDs de las acciones permitidas para un rol
 */
export async function getAccionesPorRol(rolId: string) {
  const perms = await db.select({ accion_id: rol_permisos.accion_id })
    .from(rol_permisos)
    .where(eq(rol_permisos.rol_id, rolId));
  return perms.map(p => p.accion_id);
}
