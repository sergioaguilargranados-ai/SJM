"use server";

import { put } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";

export async function subirImagen(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No se proporcionó ningún archivo." };
    }

    // Validar tipo de archivo
    if (!file.type.startsWith("image/") && !file.type.includes("pdf")) {
      return { success: false, error: "El archivo debe ser una imagen o PDF." };
    }

    // Validar tamaño (ej. max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "El archivo no debe superar los 5MB." };
    }

    const extension = file.name.split('.').pop() || 'png';
    const filename = `uploads/${uuidv4()}.${extension}`;

    const blob = await put(filename, file, {
      access: 'public',
      contentType: file.type,
      addRandomSuffix: false
    });

    return { success: true, url: blob.url };
  } catch (error: any) {
    console.error("Error subiendo imagen a Vercel Blob:", error);
    return { success: false, error: error.message || "Error al subir la imagen" };
  }
}
