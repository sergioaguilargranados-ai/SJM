"use server";

import * as XLSX from "xlsx";
import { db } from "@/lib/db";
import { usuarios, servidores, eventos, sedes, casas_retiro, tipos_eventos, estados_republica } from "@/lib/schema";
import { eq, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
            const celularRaw = String(fila.Celular || fila.Telefono || "").trim();
            const [nuevo] = await tx.insert(usuarios).values({
              organizacion_id: organizacionId,
              sede_id: sedeId,
              nombre_completo: nombre,
              correo: email.toLowerCase(),
              celular: celularRaw === "" ? null : celularRaw
            }).returning();
            userId = nuevo.id;
          } else {
            userId = existe.id;
          }

          // Buscar el estado si se proporcionó
          let estadoId = null;
          if (fila.Estado) {
            const [estadoEncontrado] = await tx.select().from(estados_republica).where(ilike(estados_republica.nombre, String(fila.Estado).trim()));
            if (estadoEncontrado) {
              estadoId = estadoEncontrado.id;
            }
          }

          // Insertar en tabla Servidores (si no existe ya el vínculo)
          const [yaEsServidor] = await tx.select().from(servidores).where(eq(servidores.usuario_id, userId));
          
          if (!yaEsServidor) {
            await tx.insert(servidores).values({
              organizacion_id: organizacionId,
              usuario_id: userId,
              sede_id: sedeId,
              estado_civil: fila.EstadoCivil || "",
              sexo: fila.Sexo || "",
              fecha_ingreso: fila.FechaIngreso ? new Date(fila.FechaIngreso).toISOString().split('T')[0] : null,
              avance_servidor: fila.Avance || "NUEVO",
              nombre_gafete: fila.Gafete ? String(fila.Gafete).trim() : null,
              estado_id: estadoId,
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

export async function importarEventosAction(base64Data: string, organizacionId: string) {
  try {
    const buffer = Buffer.from(base64Data, 'base64');
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    let procesados = 0;
    let errores = 0;

    for (const filaRaw of rawData) {
      const fila = filaRaw as any;
      try {
        const nombreSede = fila['Sede Responsable'];
        const nombreCasa = fila['Casa de Retiro'];
        const nombreTipo = fila['Tipo de Retiro / Evento'];
        const nombreEvento = fila['Nombre del Evento'];
        const fechaInicio = fila['Fecha Inicio'];
        const fechaFin = fila['Fecha Fin'];
        const costo = fila['Aportación Sugerida'] || fila['Costo'] || 0;
        const cupo = fila['Cupo Máximo'] || 0;
        const descripcion = fila['Descripción'] || '';
        const recomendaciones = fila['Recomendaciones'] || '';

        if (!nombreSede || !nombreTipo || !nombreEvento) continue;

        await db.transaction(async (tx) => {
          const [sede] = await tx.select().from(sedes).where(ilike(sedes.nombre, String(nombreSede).trim()));
          if (!sede) throw new Error('Sede no encontrada: ' + nombreSede);

          const [tipo] = await tx.select().from(tipos_eventos).where(ilike(tipos_eventos.nombre, String(nombreTipo).trim()));
          if (!tipo) throw new Error('Tipo de evento no encontrado: ' + nombreTipo);

          let casaId = "";
          if (nombreCasa) {
            const [casa] = await tx.select().from(casas_retiro).where(ilike(casas_retiro.nombre, String(nombreCasa).trim()));
            if (casa) {
              casaId = casa.id;
            } else {
              throw new Error('Casa de retiro no encontrada: ' + nombreCasa);
            }
          } else {
             throw new Error('Casa de retiro es obligatoria');
          }

          const parseDate = (dStr: any) => {
            if (!dStr) return null;
            if (typeof dStr === 'number') {
               const date = new Date(Math.round((dStr - 25569) * 86400 * 1000));
               date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
               return date;
            }
            if (dStr instanceof Date) return dStr;
            const parts = String(dStr).split(/[ /:T-]/);
            if (parts.length >= 3) {
               if (parts[2].length === 4) return new Date(Number(parts[2]), Number(parts[1])-1, Number(parts[0]), Number(parts[3]||0), Number(parts[4]||0));
            }
            return new Date(dStr);
          };

          await tx.insert(eventos).values({
            organizacion_id: organizacionId,
            sede_id: sede.id,
            tipo_evento_id: tipo.id,
            casa_retiro_id: casaId,
            nombre_evento: String(nombreEvento).trim(),
            fecha_inicio: parseDate(fechaInicio),
            fecha_fin: parseDate(fechaFin),
            costo_publico: String(costo),
            cupo_maximo: Number(cupo),
            descripcion: String(descripcion),
            recomendaciones: String(recomendaciones),
            estatus: 'PLANEACION'
          });
        });
        procesados++;
      } catch (e) {
        console.error('Error en fila eventos:', e);
        errores++;
      }
    }

    revalidatePath('/retiros-eventos', 'page');
    return { success: true, procesados, errores };
  } catch (error: any) {
    console.error("Error en importación de eventos:", error);
    return { success: false, error: error.message };
  }
}
