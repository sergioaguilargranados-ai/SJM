"use server";

import * as XLSX from "xlsx";
import { db } from "@/lib/db";
import { usuarios, servidores } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function importarServidoresAction(base64Data: string, organizacionId: string, sedeId: string) {
  try {
    // 1. Decodificar el Excel
    const buffer = Buffer.from(base64Data, 'base64');
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    let procesados = 0;
    let errores = 0;

    // 2. Procesar cada fila en una transacción (o por lotes para velocidad)
    for (const filaRaw of rawData) {
      const fila = filaRaw as any;
      try {
        const email = fila.Correo || fila.email || fila.Email;
        const nombre = fila.Nombre || fila.nombre_completo || fila.nombre;
        
        if (!email || !nombre) continue;

        await db.transaction(async (tx) => {
          // Revisar si ya existe
          const [existe] = await tx.select().from(usuarios).where(eq(usuarios.correo, email.toLowerCase()));
          
          let userId;
          if (!existe) {
            const [nuevo] = await tx.insert(usuarios).values({
              organizacion_id: organizacionId,
              sede_id: sedeId,
              nombre_completo: nombre,
              correo: email.toLowerCase(),
              celular: String(fila.Celular || fila.Telefono || "")
            }).returning();
            userId = nuevo.id;
          } else {
            userId = existe.id;
          }

          // Insertar en tabla Servidores (si no existe ya el vínculo)
          const [yaEsServidor] = await tx.select().from(servidores).where(eq(servidores.usuario_id, userId));
          
          if (!yaEsServidor) {
            await tx.insert(servidores).values({
              usuario_id: userId,
              sede_id: sedeId,
              estado_civil: fila.EstadoCivil || "",
              sexo: fila.Sexo || "",
              fecha_ingreso: fila.FechaIngreso ? new Date(fila.FechaIngreso).toISOString().split('T')[0] : null,
              avance_servidor: fila.Avance || "NUEVO",
              estatus: true
            });
          }
        });
        procesados++;
      } catch (e) {
        console.error("Error procesando fila:", e);
        errores++;
      }
    }

    return { success: true, procesados, errores };
  } catch (error: any) {
    console.error("Error en importación masiva:", error);
    return { success: false, error: error.message };
  }
}
