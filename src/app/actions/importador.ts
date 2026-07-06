"use server";

import * as XLSX from "xlsx";
import { db } from "@/lib/db";
import { usuarios, servidores, eventos, sedes, casas_retiro, tipos_eventos, estados_republica } from "@/lib/schema";
import { eq, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function importarServidoresAction(base64Data: string, organizacionId: string, sedeId: string) {
  try {
    const buffer = Buffer.from(base64Data, 'base64');
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    let procesados = 0;
    let errores = 0;
    let erroresDetalles: string[] = [];

    const parseDateExcel = (val: any) => {
        if (!val) return null;
        try {
            if (typeof val === "number") {
                const date = new Date((val - (25567 + 2)) * 86400 * 1000);
                if (!isNaN(date.getTime())) return date.toISOString().split('T')[0];
                return null;
            }
            const str = String(val).trim();
            const parts = str.split(/[/-]/);
            if (parts.length === 3) {
                if (parts[2].length === 4) {
                   const date = new Date(Number(parts[2]), Number(parts[1])-1, Number(parts[0]));
                   if (!isNaN(date.getTime())) return date.toISOString().split('T')[0];
                } else if (parts[0].length === 4) {
                   const date = new Date(Number(parts[0]), Number(parts[1])-1, Number(parts[2]));
                   if (!isNaN(date.getTime())) return date.toISOString().split('T')[0];
                }
            }
            const date = new Date(str);
            if (!isNaN(date.getTime())) return date.toISOString().split('T')[0];
        } catch (e) {}
        return null;
    };

    const parseEstatus = (val: any) => {
        if (val === undefined || val === null) return true; // Default a activo si no viene la columna
        const s = String(val).trim().toUpperCase();
        if (s === 'BAJA' || s === 'INACTIVO' || s === 'NO' || s === '0' || s === 'FALSE' || s === '') return false;
        return true;
    };

    let indexFila = 1;
    for (const filaRaw of rawData) {
      const fila = filaRaw as any;
      indexFila++; 
      try {
        let rawEmail = fila.Correo || fila.email || fila.Email || "";
        const email = String(rawEmail).replace(/\s+/g, '').toLowerCase();
        const nombre = fila.Nombre || fila.nombre_completo || fila.nombre;
        
        if (!email || !nombre) {
          errores++;
          erroresDetalles.push(`Fila ${indexFila}: Falta nombre o correo.`);
          continue;
        }

        const fechaNacimientoParsed = parseDateExcel(fila.FechaNacimiento);

        const [existe] = await db.select().from(usuarios).where(eq(usuarios.correo, email));
        
        let userId;
        if (!existe) {
          const celularRaw = String(fila.Celular || fila.Telefono || "").trim().replace(/\s+/g, '');
          let nuevo;
          try {
            [nuevo] = await db.insert(usuarios).values({
              organizacion_id: organizacionId,
              sede_id: sedeId,
              nombre_completo: String(nombre).trim(),
              correo: email,
              celular: celularRaw === "" ? null : celularRaw,
              fecha_nacimiento: fechaNacimientoParsed
            }).returning();
          } catch(insertErr: any) {
            const errMsg = (insertErr.message + " " + (insertErr.cause?.message || "") + " " + (insertErr.detail || "") + " " + (insertErr.cause?.detail || "")).toLowerCase();
            if (errMsg.includes('celular') && (errMsg.includes('unique') || errMsg.includes('23505') || errMsg.includes('duplicate'))) {
               [nuevo] = await db.insert(usuarios).values({
                 organizacion_id: organizacionId,
                 sede_id: sedeId,
                 nombre_completo: String(nombre).trim(),
                 correo: email,
                 celular: null,
                 fecha_nacimiento: fechaNacimientoParsed
               }).returning();
            } else {
               throw insertErr; 
            }
          }
          userId = nuevo.id;
        } else {
          userId = existe.id;
        }

        let estadoId = null;
        if (fila.Estado) {
          const [estadoEncontrado] = await db.select().from(estados_republica).where(ilike(estados_republica.nombre, String(fila.Estado).trim()));
          if (estadoEncontrado) estadoId = estadoEncontrado.id;
        }

        let ministerioId = null;
        if (fila.Ministerio) {
          const [minEncontrado] = await db.select().from(ministerios).where(ilike(ministerios.nombre, String(fila.Ministerio).trim()));
          if (minEncontrado) ministerioId = minEncontrado.id;
        }

        let cargoId = null;
        if (fila.Cargo) {
          const [cargoEncontrado] = await db.select().from(cargos).where(ilike(cargos.nombre, String(fila.Cargo).trim()));
          if (cargoEncontrado) cargoId = cargoEncontrado.id;
        }

        const fechaIngresoParsed = parseDateExcel(fila.FechaIngreso);

        const [yaEsServidor] = await db.select().from(servidores).where(eq(servidores.usuario_id, userId));
        
        if (!yaEsServidor) {
          await db.insert(servidores).values({
            organizacion_id: organizacionId,
            usuario_id: userId,
            sede_id: sedeId,
            ministerio_id: ministerioId,
            cargo_id: cargoId,
            estado_civil: fila.EstadoCivil || "",
            sexo: fila.Sexo || "",
            fecha_nacimiento: fechaNacimientoParsed,
            fecha_ingreso: fechaIngresoParsed,
            avance_servidor: fila.AvanceServidor || fila.Avance || "NUEVO",
            nombre_gafete: fila.Gafete ? String(fila.Gafete).trim() : null,
            estado_id: estadoId,
            domicilio_calle: fila.DomicilioCalle || null,
            domicilio_colonia: fila.Colonia || null,
            domicilio_cp: fila.CodigoPostal ? String(fila.CodigoPostal).trim() : null,
            telefono_casa_trabajo: fila.TelefonoCasaTrabajo ? String(fila.TelefonoCasaTrabajo).trim() : null,
            facebook_url: fila.Facebook || null,
            instagram_url: fila.Instagram || null,
            tiktok_url: fila.TikTok || null,
            youtube_url: fila.YouTube || null,
            telefono_emergencia: fila.TelsEmergencia ? String(fila.TelsEmergencia).trim() : null,
            contacto_emergencia: fila.ContactoEmergencia || null,
            retiros_tomados_detalle: fila['RetirosTomados (Detalle)'] || fila.RetirosTomados || null,
            retiros_externos_detalle: fila['RetirosOtrasComunidades (Detalle)'] || fila.RetirosOtrasComunidades || null,
            servicios_sjm: fila.ServiciosSJM || null,
            observaciones: fila.Observaciones || null,
            estatus: parseEstatus(fila.Estatus)
          });
        }
        procesados++;
      } catch (e: any) {
        console.error("Error procesando fila:", e);
        errores++;
        let errorMsg = e.message;
        if (e.cause?.message) {
           errorMsg = e.cause.message;
        } else if (e.code === '23505') { 
           errorMsg = `El dato ya existe en otro registro (posible celular o correo duplicado). Detalle: ${e.detail || ''}`;
        }
        erroresDetalles.push(`Fila ${indexFila}: ${errorMsg}`);
      }
    }

    return { success: true, procesados, errores, detalles: erroresDetalles };
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
