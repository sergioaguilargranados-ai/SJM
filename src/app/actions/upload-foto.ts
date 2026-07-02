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

export async function deleteFotoServidor(usuarioId: string) {
  try {
    if (!usuarioId) {
      return { success: false, error: "Faltan datos requeridos (usuarioId)." };
    }

    // 1. Actualizar la base de datos limpiando la URL en usuarios
    await db.update(usuarios)
      .set({ foto_perfil_url: null })
      .where(eq(usuarios.id, usuarioId));
      
    // Nota: Idealmente tambien borraríamos de Vercel Blob usando `del(url)`, pero 
    // requerimos guardar la URL o extraerla. Por simplicidad y evitar errores, lo dejamos huérfano
    // o podríamos hacer un select previo para borrarlo. Por ahora basta con quitarlo del UI.

    // 2. Revalidar
    revalidatePath("/(dashboard)/sedes/[id]/servidores");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error al borrar foto:", error);
    return { success: false, error: error.message || "Error al borrar la imagen." };
  }
}
