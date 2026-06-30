"use server";

import { db } from "@/lib/db";
import { solicitudes_inscripcion, usuarios, servidores, eventos, tipos_eventos } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

// Formato genérico para parsear todo lo que venga del cliente
export async function registrarSolicitudAction(datos: any) {
  try {
    // 0. Soporte para Link Legacy "1" (Diplomado ya publicado)
    let finalEventoId = datos.eventoId;
    if (finalEventoId === "1") {
       const [ultimoEvento] = await db.select()
          .from(eventos)
          .innerJoin(tipos_eventos, eq(eventos.tipo_evento_id, tipos_eventos.id))
          .where(eq(tipos_eventos.nombre, "Diplomados y Talleres on-line"))
          .orderBy(desc(eventos.fecha_inicio))
          .limit(1);
       
       if (ultimoEvento) {
          finalEventoId = ultimoEvento.eventos.id;
       } else {
          return { success: false, error: "No hay diplomados activos registrados para el ID #1" };
       }
    } else {
       // Validar Formato UUID (Solo si no es '1')
       const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
       if (!finalEventoId) {
          return { success: false, error: "ID de Evento faltante." };
       }
       // Si no es un ID especial y es muy corto, probablemente sea un error, pero dejamos pasar si es UUID o ID especial
    }

    // 1. Insertar el registro usando Drizzle ORM
    const inscData = {
      evento_id: finalEventoId,
      nombre_asistente: datos.nombre_asistente,
      nombre_gafete: datos.nombre_gafete || null,
      fecha_nacimiento: datos.fecha_nacimiento || null,
      edad: datos.edad ? Number(datos.edad) : null,
      sexo: datos.sexo || null,
      estado_civil: datos.estado_civil || null,
      
      // Contacto y Ubicación
      telefono_celular: datos.telefono_celular || null,
      telefono_alternativo: datos.telefono_alternativo || null,
      correo: datos.correo || null,
      direccion_completa: datos.direccion_completa || null,
      pais_ciudad: datos.pais_ciudad || null,
      contacto_emergencia_nombre: datos.contacto_emergencia_nombre || null,
      contacto_emergencia_telefono: datos.contacto_emergencia_telefono || null,
      parentezco_emergencia: datos.parentezco_emergencia || null,

      // Perfil Espiritual y Salud
      parroquia_procedencia: datos.parroquia_procedencia || null,
      ultimo_sacramento: datos.ultimo_sacramento || null,
      expectativas: datos.expectativas || null,
      dificultad_escaleras: datos.dificultad_caminar === true,
      enfermedades_alergias: datos.enfermedades_alergias || null,
      
      // Datos de cónyuge y familia
      esposo_a_nombre: datos.esposo_a_nombre || null,
      fecha_boda: datos.fecha_boda || null,
      cantidad_hijos: datos.cantidad_hijos ? Number(datos.cantidad_hijos) : 0,
      nombre_edades_hijos: datos.datos_hijos || null,
      acepta_responsiva: datos.acepta_responsiva === true,
      
      // Campos Especiales para Diplomados

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
      contrasena_inscripcion: datos.contrasena_inscripcion || null,
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

export async function eliminarEventoAction(id: string) {
  try {
    const { getUsuarioSesion } = await import("@/lib/sesion");
    const session = await getUsuarioSesion();
    
    // Sólo Admin del sistema o Rol Admin
    if (!session.rol_nombre?.toLowerCase().includes("admin")) {
       return { success: false, error: "Permisos insuficientes. Sólo administradores pueden eliminar eventos." };
    }
    
    await db.delete(eventos).where(eq(eventos.id, id));
    return { success: true };
  } catch (error: any) {
    console.error("Error al eliminar evento:", error);
    return { success: false, error: error.message || "No se puede eliminar porque tiene inscripciones o gastos vinculados." };
  }
}

export async function actualizarEventoAction(id: string, datos: any) {
  try {
    const { fecha_inicio, fecha_fin, costo_publico, cupo_maximo, recomendaciones, contrasena_inscripcion } = datos;
    
    await db.update(eventos)
      .set({
        fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : null,
        fecha_fin: fecha_fin ? new Date(fecha_fin) : null,
        costo_publico: costo_publico ? String(costo_publico) : null,
        cupo_maximo: cupo_maximo ? Number(cupo_maximo) : null,
        recomendaciones,
        contrasena_inscripcion: contrasena_inscripcion || null,
      })
      .where(eq(eventos.id, id));
      
    return { success: true };
  } catch (error: any) {
    console.error("Error al actualizar evento:", error);
    return { success: false, error: error.message || "Error al actualizar evento" };
  }
}
