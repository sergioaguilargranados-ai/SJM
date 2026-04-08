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
    console.error("Error actualizando organización:", error);
    return { success: false, error: "No se pudo guardar la configuración" };
  }
}
