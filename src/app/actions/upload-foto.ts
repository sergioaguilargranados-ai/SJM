"use server";

import { put } from "@vercel/blob";
import { db } from "@/lib/db";
import { usuarios } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function uploadFotoServidor(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const usuarioId = formData.get("usuarioId") as string;

    if (!file || !usuarioId) {
      return { success: false, error: "Faltan datos requeridos (archivo o usuarioId)." };
    }

    // 1. Subir la imagen a Vercel Blob
    const filename = `servidores/${usuarioId}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
    
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false, // Ya tenemos un sufijo único
    });

    // 2. Actualizar la base de datos con la URL devuelta por Vercel Blob
    await db.update(usuarios)
      .set({ foto_perfil_url: blob.url })
      .where(eq(usuarios.id, usuarioId));

    // 3. Revalidar para que los cambios se vean en el UI de inmediato
    revalidatePath("/(dashboard)/sedes/[id]/servidores");
    
    return { success: true, url: blob.url };
  } catch (error: any) {
    console.error("Error al subir foto:", error);
    return { success: false, error: error.message || "Error al procesar la imagen." };
  }
}
