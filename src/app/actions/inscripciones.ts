"use server";

import { db } from "@/lib/db";
import { solicitudes_inscripcion, usuarios, servidores, eventos } from "@/lib/schema";
import { eq } from "drizzle-orm";

// Formato genérico para parsear todo lo que venga del cliente
export async function registrarSolicitudAction(datos: any) {
  try {
    // 1. Insertar el registro usando Drizzle ORM
    const nuevaInscripcion = await db.insert(solicitudes_inscripcion).values({
      evento_id: datos.eventoId,
      // Se asume que el evento existe. En producción cruzar contra eventos.
      nombre_asistente: datos.nombre_asistente,
      edad: Number(datos.edad),
      sexo: datos.sexo,
      estado_civil: datos.estado_civil,
      telefono_celular: datos.telefono_celular,
      correo: datos.correo,
      parroquia_procedencia: datos.parroquia_procedencia,
      es_primera_vez: datos.es_primera_vez,
      medicinas_requeridas: datos.medicinas_requeridas || null,
      
      // Datos de cónyuge
      esposo_a_nombre: datos.esposo_a_nombre || null,
      fecha_boda: datos.fecha_boda || null,
      
      // Campos Especiales para Diplomados u Otros Eventos
      pais_ciudad: datos.pais_ciudad || null,
      ministerio_actual: datos.ministerio_actual || null,
      compromiso_pago_99usd: datos.compromiso_pago_99usd === true,
      
      // Control por defecto
      estatus_solicitud: "PENDIENTE_PAGO",
    }).returning(); // Nos devuelve el registro insertado

    return { success: true, id: nuevaInscripcion[0].id };
  } catch (error: any) {
    console.error("Error al registrar solicitud:", error);
    return { success: false, error: "Hubo un problema de base de datos. Intenta nuevamente." };
  }
}

export async function crearServidorAction(datos: any) {
  try {
    const { 
      nombre_completo, correo, celular, sede_id, ministerio_id, cargo_id, 
      estado_civil, fecha_nacimiento, sexo, fecha_ingreso, avance_servidor, 
      retiros_tomados, observaciones, organizacion_id 
    } = datos;

    // Transacción para asegurar que se crea el usuario y el servidor
    const result = await db.transaction(async (tx) => {
      // 1. Crear Usuario base (si no existe por correo)
      // Nota: En prod usar un 'upsert' o validar existencia. Para este flujo rápido insertamos.
      const [nuevoUsuario] = await tx.insert(usuarios).values({
        organizacion_id,
        nombre_completo,
        correo,
        celular,
        rol_id: null, // Se asignaría rol de SERVIDOR por defecto
      }).returning();

      // 2. Crear Relación en Tabla Servidores
      const [nuevoServidor] = await tx.insert(servidores).values({
        usuario_id: nuevoUsuario.id,
        sede_id,
        ministerio_id,
        cargo_id,
        estado_civil,
        fecha_nacimiento: fecha_nacimiento || null,
        sexo,
        fecha_ingreso: fecha_ingreso || null,
        avance_servidor,
        retiros_tomados: Number(retiros_tomados) || 0,
        observaciones,
        estatus: true,
      }).returning();

      return nuevoServidor;
    });

    return { success: true, id: result.id };
  } catch (error: any) {
    console.error("Error al crear servidor:", error);
    return { success: false, error: error.message || "Error al crear registro de servidor" };
  }
}

export async function crearEventoAction(datos: any) {
  try {
    const { 
       sede_id, tipo_evento_id, casa_retiro_id, fecha_inicio, fecha_fin, 
       costo_publico, cupo_maximo, recomendaciones 
    } = datos;

    const [nuevoEvento] = await db.insert(eventos).values({
      sede_id,
      tipo_evento_id,
      casa_retiro_id,
      fecha_inicio: new Date(fecha_inicio),
      fecha_fin: new Date(fecha_fin),
      costo_publico: String(costo_publico),
      cupo_maximo: Number(cupo_maximo),
      recomendaciones,
      estatus: 'PLANEACION'
    }).returning();

    return { success: true, id: nuevoEvento.id };
  } catch (error: any) {
    console.error("Error al crear evento:", error);
    return { success: false, error: error.message || "Error al crear evento" };
  }
}

export async function actualizarServidorAction(id: string, datos: any) {
  try {
    const { 
       nombre_completo, celular, ministerio_id, cargo_id, 
       estado_civil, avance_servidor, estatus 
    } = datos;

    // 1. Obtener registro actual para sacar el usuario_id
    const [servActual] = await db.select().from(servidores).where(eq(servidores.id, id));
    if (!servActual) throw new Error("Servidor no encontrado");

    await db.transaction(async (tx) => {
      // 2. Actualizar Usuario (Nombre y Celular)
      await tx.update(usuarios)
        .set({ nombre_completo, celular })
        .where(eq(usuarios.id, servActual.usuario_id));

      // 3. Actualizar Relación Servidor
      await tx.update(servidores)
        .set({ 
           ministerio_id: ministerio_id || null, 
           cargo_id: cargo_id || null,
           estado_civil,
           avance_servidor,
           estatus: estatus === true
        })
        .where(eq(servidores.id, id));
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error al actualizar servidor:", error);
    return { success: false, error: error.message || "Error al actualizar registro" };
  }
}
