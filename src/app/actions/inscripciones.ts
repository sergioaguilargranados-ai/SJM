"use server";

import { db } from "@/lib/db";
import { solicitudes_inscripcion } from "@/lib/schema";

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
      
      // Control por defecto
      estatus_solicitud: "PENDIENTE_PAGO",
    }).returning(); // Nos devuelve el registro insertado

    return { success: true, id: nuevaInscripcion[0].id };
  } catch (error: any) {
    console.error("Error al registrar solicitud:", error);
    return { success: false, error: "Hubo un problema de base de datos. Intenta nuevamente." };
  }
}
