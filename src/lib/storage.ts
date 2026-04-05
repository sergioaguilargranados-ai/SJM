import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Configuración SDK de AWS compatible con Cloudflare R2
const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function subirArchivoR2(buffer: Buffer, nombreArchivo: string, contentType: string) {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: nombreArchivo,
      Body: buffer,
      ContentType: contentType,
    });

    await s3.send(command);
    
    // Obtenemos la URL de acceso público (o privada firmada)
    // Nota: Por ahora retorno la URL base si el bucket es público, o una firmada
    const publicUrl = `${process.env.R2_PUBLIC_DOMAIN}/${nombreArchivo}`;
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("Error en Cloudflare R2:", error);
    return { success: false, error: "Error al subir archivo a R2" };
  }
}

export { s3 };
