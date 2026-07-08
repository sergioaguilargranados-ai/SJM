"use server";

import { db } from "@/lib/db";
import { organizaciones } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateOrganizacionAction(id: string, data: any) {
  try {
    await db.update(organizaciones)
      .set({
        nombre: data.nombre,
        lema: data.lema,
        logo_url: data.logo_url,
        telefono_contacto: data.telefono_contacto,
        whatsapp_contacto: data.whatsapp_contacto,
        correo_contacto: data.correo_contacto,
        direccion_completa: data.direccion_completa,
        ubicacion_url: data.ubicacion_url,
        horarios_atencion: data.horarios_atencion,
        facebook_url: data.facebook_url,
        instagram_url: data.instagram_url,
        color_primario: data.color_primario,
        color_secundario: data.color_secundario,
        color_terciario: data.color_terciario,
      })
      .where(eq(organizaciones.id, id));

    revalidatePath("/configuracion");
    revalidatePath("/", "layout");
    
    return { success: true };
  } catch (error) {
    console.error("Error actualizando organizaci贸n:", error);
    return { success: false, error: "No se pudo guardar la configuraci贸n" };
  }
}

export async function getOrganizaciones() {
  try {
    const data = await db.select().from(organizaciones).orderBy(organizaciones.nombre);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: "No se pudieron obtener las organizaciones" };
  }
}

export async function crearOrganizacionAction(data: any) {
  try {
    // Generate simple ID if not provided by DB automatically, though UUID handles it.
    await db.insert(organizaciones).values({
      nombre: data.nombre,
      lema: data.lema || null,
      dominio_tenant: data.dominio_tenant || null,
      logo_url: data.logo_url || null,
      color_primario: data.color_primario || "#00B4AA",
      color_secundario: data.color_secundario || "#1E3A5F",
      color_terciario: data.color_terciario || "#FFFFFF",
      telefono_contacto: data.telefono_contacto || null,
      correo_contacto: data.correo_contacto || null,
    });
    
    revalidatePath("/configuracion/organizaciones");
    return { success: true };
  } catch (error: any) {
    console.error("Error creando organizaci贸n:", error);
    return { success: false, error: error.message || "Error al crear la organizaci贸n" };
  }
}
export async function deleteOrganizacionAction(id: string) {
  try {
    await db.delete(organizaciones).where(eq(organizaciones.id, id));
    revalidatePath("/configuracion/organizaciones");
    return { success: true };
  } catch (error: any) {
    console.error("Error eliminando organizaci髇:", error);
    return { success: false, error: "No se pudo eliminar la organizaci髇." };
  }
}
