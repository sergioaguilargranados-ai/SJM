import { put } from "@vercel/blob";

/**
 * Función para subir archivos a Vercel Blob
 * Reemplaza la antigua implementación de AWS S3 / Cloudflare R2
 * 
 * @param buffer Archivo a subir
 * @param nombreArchivo Nombre del archivo
 * @param contentType Tipo de contenido (ej. image/png)
 */
export async function subirArchivoR2(buffer: Buffer, nombreArchivo: string, contentType: string) {
  try {
    const blob = await put(nombreArchivo, buffer, {
      access: 'public',
      contentType: contentType,
      addRandomSuffix: false // Cambiar a true si se desean nombres únicos aleatorios automáticos
    });
    
    // Devolvemos el mismo formato esperado por la aplicación para no romper nada
    return { success: true, url: blob.url };
  } catch (error) {
    console.error("Error en Vercel Blob:", error);
    return { success: false, error: "Error al subir archivo a Vercel Blob" };
  }
}

