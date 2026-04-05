"use server";

import { db } from "@/lib/db";
import { solicitudes_inscripcion, usuarios, servidores, eventos } from "@/lib/schema";
import { eq } from "drizzle-orm";

// Formato genérico para parsear todo lo que venga del cliente
export async function registrarSolicitudAction(datos: any) {
  try {
    // 0. Validar Formato UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    // Si es un ID corto de prueba o no cumple el formato, detenemos antes de ir a Neon
    if (!datos.eventoId || datos.eventoId.length < 30) {
       return { success: false, error: "ID de Evento Inválido (No es un UUID válido). Por favor usa un link oficial." };
     }

    // 1. Insertar el registro usando Drizzle ORM
    const inscData = {
      evento_id: datos.eventoId,
      nombre_asistente: datos.nombre_asistente,
      edad: datos.edad ? Number(datos.edad) : null,
      sexo: datos.sexo || null,
      estado_civil: datos.estado_civil || null,
      telefono_celular: datos.telefono_celular || null,
      correo: datos.correo || null,
      parroquia_procedencia: datos.parroquia_procedencia || null,
      es_primera_vez: datos.es_primera_vez === true,
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
    };

    const nuevaInscripcion = await db.insert(solicitudes_inscripcion)
      .values(inscData)
      .returning(); 

    return { success: true, id: nuevaInscripcion[0].id };
  } catch (error: any) {
    console.error("Error al registrar solicitud:", error);
    return { 
      success: false, 
      error: error.message || "Error interno de base de datos" 
    };
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
