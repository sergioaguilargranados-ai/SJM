"use server";

import { db } from "@/lib/db";
import { modulos_sistema, funciones_sistema, acciones_sistema, planes, plan_permisos } from "@/lib/schema";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getPlanes() {
  return await db.select().from(planes).orderBy(planes.nombre);
}

export async function getModulosCompletosAdmin() {
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

export async function upsertModuloAction(data: { id?: string, nombre: string, clave: string, icono?: string | null }) {
  try {
    if (data.id) {
      await db.update(modulos_sistema).set({
        nombre: data.nombre,
        clave: data.clave,
        icono: data.icono,
      }).where(eq(modulos_sistema.id, data.id));
    } else {
      await db.insert(modulos_sistema).values({
        nombre: data.nombre,
        clave: data.clave,
        icono: data.icono,
      });
    }
    revalidatePath("/configuracion/modulos");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteModuloAction(id: string) {
  try {
    await db.delete(modulos_sistema).where(eq(modulos_sistema.id, id));
    revalidatePath("/configuracion/modulos");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: "No se puede eliminar el módulo, asegúrate de eliminar primero sus funciones." };
  }
}

export async function upsertFuncionAction(data: { id?: string, modulo_id: string, nombre: string, clave: string, descripcion?: string | null }) {
  try {
    let resultId = data.id;
    if (data.id) {
      await db.update(funciones_sistema).set({
        modulo_id: data.modulo_id,
        nombre: data.nombre,
        clave: data.clave,
        descripcion: data.descripcion,
      }).where(eq(funciones_sistema.id, data.id));
    } else {
      const inserted = await db.insert(funciones_sistema).values({
        modulo_id: data.modulo_id,
        nombre: data.nombre,
        clave: data.clave,
        descripcion: data.descripcion,
      }).returning({ id: funciones_sistema.id });
      resultId = inserted[0].id;
    }
    revalidatePath("/configuracion/modulos");
    return { success: true, id: resultId };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteFuncionAction(id: string) {
  try {
    await db.delete(funciones_sistema).where(eq(funciones_sistema.id, id));
    revalidatePath("/configuracion/modulos");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: "No se puede eliminar la función, asegúrate de eliminar primero sus acciones." };
  }
}

export async function upsertAccionAction(data: { id?: string, funcion_id: string, nombre: string, clave: string }) {
  try {
    if (data.id) {
      await db.update(acciones_sistema).set({
        funcion_id: data.funcion_id,
        nombre: data.nombre,
        clave: data.clave,
      }).where(eq(acciones_sistema.id, data.id));
    } else {
      await db.insert(acciones_sistema).values({
        funcion_id: data.funcion_id,
        nombre: data.nombre,
        clave: data.clave,
      });
    }
    revalidatePath("/configuracion/modulos");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteAccionAction(id: string) {
  try {
    await db.delete(acciones_sistema).where(eq(acciones_sistema.id, id));
    revalidatePath("/configuracion/modulos");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getPlanPermisos(planId: string) {
  const permisos = await db.select({ funcion_id: plan_permisos.funcion_id })
    .from(plan_permisos)
    .where(eq(plan_permisos.plan_id, planId));
  return permisos.map(p => p.funcion_id);
}

export async function actualizarPlanPermisosAction(planId: string, funcionesIds: string[]) {
  try {
    await db.delete(plan_permisos).where(eq(plan_permisos.plan_id, planId));
    if (funcionesIds.length > 0) {
      const values = funcionesIds.map(fId => ({
        plan_id: planId,
        funcion_id: fId
      }));
      await db.insert(plan_permisos).values(values);
    }
    revalidatePath("/configuracion/modulos");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
