"use server";

import { db } from "@/lib/db";
import { solicitudes_inscripcion, usuarios, servidores, eventos, tipos_eventos } from "@/lib/schema";
import { eq, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
      retiros_tomados, observaciones, organizacion_id, estatus,
      domicilio_calle, domicilio_colonia, domicilio_cp, estado_id,
      telefono_casa_trabajo, contacto_emergencia, tels_emergencia,
      facebook_url, instagram_url, tiktok_url, youtube_url,
      retiros_tomados_detalle, retiros_externos_detalle, servicios_sjm,
      nombre_gafete
    } = datos;

    // Transacción para asegurar que se crea el usuario y el servidor
    const result = await db.transaction(async (tx) => {
      // 1. Crear Usuario base (si no existe por correo)
      const [nuevoUsuario] = await tx.insert(usuarios).values({
        organizacion_id,
        nombre_completo,
        correo,
        celular,
        rol_id: null,
      }).returning();

      // 2. Crear Relación en Tabla Servidores
      const [nuevoServidor] = await tx.insert(servidores).values({
        usuario_id: nuevoUsuario.id,
        sede_id,
        ministerio_id: ministerio_id || null,
        cargo_id: cargo_id || null,
        estado_civil: estado_civil || null,
        fecha_nacimiento: fecha_nacimiento || null,
        sexo: sexo || null,
        fecha_ingreso: fecha_ingreso || null,
        avance_servidor: avance_servidor || null,
        retiros_tomados: Number(retiros_tomados) || 0,
        observaciones: observaciones || null,
        estatus: estatus === false ? false : true,
        domicilio_calle: domicilio_calle || null,
        domicilio_colonia: domicilio_colonia || null,
        domicilio_cp: domicilio_cp || null,
        estado_id: estado_id || null,
        contacto_emergencia: contacto_emergencia || null,
        telefono_emergencia: tels_emergencia || null,
        tels_emergencia: tels_emergencia || null,
        telefono_casa_trabajo: telefono_casa_trabajo || null,
        facebook_url: facebook_url || null,
        instagram_url: instagram_url || null,
        tiktok_url: tiktok_url || null,
        youtube_url: youtube_url || null,
        retiros_tomados_detalle: retiros_tomados_detalle || null,
        retiros_externos_detalle: retiros_externos_detalle || null,
        servicios_sjm: servicios_sjm || null,
        nombre_gafete: nombre_gafete || null,
        foto_url: datos.foto_url || null,
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
       costo_publico, cupo_maximo, recomendaciones, nombre_evento, descripcion, fecha_inicio_promocion, politica_cancelacion, es_evento_servidores
    } = datos;

    const [nuevoEvento] = await db.insert(eventos).values({
      sede_id,
      tipo_evento_id,
      casa_retiro_id,
      fecha_inicio: new Date(fecha_inicio),
      fecha_fin: new Date(fecha_fin),
      costo_publico: String(costo_publico),
      cupo_maximo: Number(cupo_maximo),
      nombre_evento,
      descripcion,
      fecha_inicio_promocion: fecha_inicio_promocion ? new Date(fecha_inicio_promocion) : null,
      recomendaciones,
      politica_cancelacion,
      contrasena_inscripcion: datos.contrasena_inscripcion || null,
      es_evento_servidores: es_evento_servidores === true,
      estatus: 'PLANEACION'
    }).returning();


    revalidatePath("/retiros-eventos", "page");
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
    revalidatePath("/retiros-eventos", "page");
    return { success: true };
  } catch (error: any) {
    console.error("Error al eliminar evento:", error);
    return { success: false, error: error.message || "No se puede eliminar porque tiene inscripciones o gastos vinculados." };
  }
}

export async function actualizarEventoAction(id: string, datos: any) {
  try {
    const { fecha_inicio, fecha_fin, costo_publico, cupo_maximo, recomendaciones, contrasena_inscripcion, nombre_evento, descripcion, fecha_inicio_promocion, politica_cancelacion, es_evento_servidores } = datos;
    
    await db.update(eventos)
      .set({
        fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : null,
        fecha_fin: fecha_fin ? new Date(fecha_fin) : null,
        costo_publico: costo_publico ? String(costo_publico) : null,
        cupo_maximo: cupo_maximo ? Number(cupo_maximo) : null,
        nombre_evento,
        descripcion,
        fecha_inicio_promocion: fecha_inicio_promocion ? new Date(fecha_inicio_promocion) : null,
        recomendaciones,
        politica_cancelacion,
        contrasena_inscripcion: contrasena_inscripcion || null,
        es_evento_servidores: es_evento_servidores === true,
      })
      .where(eq(eventos.id, id));
    revalidatePath("/retiros-eventos", "page");
    return { success: true };
  } catch (error: any) {
    console.error("Error al actualizar evento:", error);
    return { success: false, error: error.message || "Error al actualizar evento" };
  }
}

// -------------------------------------------------------------
// FUNCIONES NUEVAS: FLUJO INTELIGENTE Y RENASE
// -------------------------------------------------------------

export async function buscarAsistentePrevioAction(correoCelular: string) {
  try {
    const term = correoCelular.trim().toLowerCase();
    const result = await db.execute(sql`
      SELECT * FROM solicitudes_inscripcion 
      WHERE LOWER(correo) = ${term} OR telefono_celular = ${term} 
      ORDER BY creado_en DESC LIMIT 1
    `);
    if (result.rows.length > 0) {
      return { success: true, data: result.rows[0] };
    }
    return { success: false, message: "No encontrado" };
  } catch (error: any) {
    console.error("Error en buscarAsistentePrevioAction:", error);
    return { success: false, error: error.message };
  }
}

export async function buscarServidorPorNombreAction(nombre: string) {
  try {
    const term = `%${nombre.trim().toLowerCase()}%`;
    const result = await db.execute(sql`
      SELECT s.id as servidor_id, u.id as usuario_id, u.nombre_completo, u.correo, u.celular, s.sexo, s.fecha_nacimiento,
              s.sede_id, s.ministerio_id, s.cargo_id, s.avance_servidor, s.estado_civil, s.fecha_ingreso, s.retiros_tomados, s.observaciones, s.foto_url
       FROM servidores s
       INNER JOIN usuarios u ON s.usuario_id = u.id
       WHERE LOWER(u.nombre_completo) LIKE ${term}
       LIMIT 10
    `);
    return { success: true, data: result.rows };
  } catch (error: any) {
    console.error("Error en buscarServidorPorNombreAction:", error);
    return { success: false, error: error.message };
  }
}

export async function registrarRenaseAction(datos: any) {
  try {
    // Aquí recibimos todos los datos combinados: los del perfil del servidor y los del itinerario
    // Actualizamos al servidor y creamos la solicitud en una transacción
      let usuarioId = datos.usuario_id;
      let servidorId = datos.servidor_id;

      // 1. Crear o Actualizar usuario
      if (usuarioId) {
         await db.execute(sql`
           UPDATE usuarios SET nombre_completo = ${datos.nombre_completo}, celular = ${datos.celular}, correo = ${datos.correo?.trim() ? datos.correo : null}, fecha_nacimiento = ${datos.fecha_nacimiento?.trim() ? datos.fecha_nacimiento : null} WHERE id = ${usuarioId}
         `);
      } else {
         const [nuevoUsu] = await db.insert(usuarios).values({
           organizacion_id: "6fb191cc-a477-4632-9cb1-c30c33a9f9bd",
           nombre_completo: datos.nombre_completo,
           celular: datos.celular,
           correo: datos.correo?.trim() ? datos.correo : `${Date.now()}@temporal.com`,
           fecha_nacimiento: datos.fecha_nacimiento?.trim() ? datos.fecha_nacimiento : null,
           es_servidor: true
         }).returning({ id: usuarios.id });
         usuarioId = nuevoUsu.id;
      }
      
      // 2. Crear o Actualizar servidor
      if (servidorId) {
         await db.execute(sql`
           UPDATE servidores SET 
              sede_id = ${datos.sede_id || null}, 
              ministerio_id = ${datos.ministerio_id || null}, 
              cargo_id = ${datos.cargo_id || null},
              estado_civil = ${datos.estado_civil || null},
           sexo = ${datos.sexo?.trim() ? datos.sexo : null},
           fecha_ingreso = ${datos.fecha_ingreso?.trim() ? datos.fecha_ingreso : null},
           avance_servidor = ${datos.avance_servidor || null},
           retiros_tomados = ${datos.retiros_tomados ? Number(datos.retiros_tomados) : 0},
           observaciones = ${datos.observaciones || null}
        WHERE id = ${servidorId}
      `);
   } else {
      const [nuevoServ] = await db.insert(servidores).values({
        usuario_id: usuarioId,
        sede_id: datos.sede_id?.trim() ? datos.sede_id : "00000000-0000-0000-0000-000000000000", // Required
        ministerio_id: datos.ministerio_id?.trim() ? datos.ministerio_id : null,
        cargo_id: datos.cargo_id?.trim() ? datos.cargo_id : null,
        estado_civil: datos.estado_civil?.trim() ? datos.estado_civil : null,
        sexo: datos.sexo?.trim() ? datos.sexo : null,
        fecha_ingreso: datos.fecha_ingreso?.trim() ? datos.fecha_ingreso : null,
        avance_servidor: datos.avance_servidor || null,
           retiros_tomados: datos.retiros_tomados ? Number(datos.retiros_tomados) : 0,
           observaciones: datos.observaciones || null,
           estatus: true
         }).returning({ id: servidores.id });
         servidorId = nuevoServ.id;
      }
      
      // 3. Crear inscripción
      await db.insert(solicitudes_inscripcion).values({
        evento_id: datos.evento_id,
        usuario_id: usuarioId,
        nombre_asistente: datos.nombre_completo,
        nombre_gafete: datos.nombre_gafete || null,
        telefono_celular: datos.celular || null,
        correo: datos.correo || null,
        
        // Itinerario y Logística
        fecha_hora_llegada: datos.fecha_hora_llegada ? new Date(datos.fecha_hora_llegada) : null,
        lugar_llegada: datos.lugar_llegada || null,
        medio_transporte_llegada: datos.medio_transporte_llegada || null,
        fecha_hora_salida: datos.fecha_hora_salida ? new Date(datos.fecha_hora_salida) : null,
        lugar_salida: datos.lugar_salida || null,
        medio_transporte_salida: datos.medio_transporte_salida || null,
        pase_abordar_url: datos.pase_abordar_url || null,
        participa_salida_paseo: datos.participa_salida_paseo === true,
        
        // Set default
        estatus_solicitud: "PENDIENTE_PAGO"
      });

    return { success: true };
  } catch (error: any) {
    console.error("Error en registrarRenaseAction:", error);
    return { success: false, error: error.message || "Error al procesar inscripción RENASE" };
  }
}

export async function asignarEquipoEventoAction(datos: any) {
  try {
    // Validar si ya está asignado
    const check = await db.execute(sql`
      SELECT id FROM equipo_evento WHERE evento_id = ${datos.evento_id} AND servidor_id = ${datos.servidor_id}
    `);
    
    if (check.rows.length > 0) {
       await db.execute(sql`
         UPDATE equipo_evento 
         SET cargo_texto = ${datos.cargo_texto || null},
             asignaciones = ${datos.asignaciones || null},
             aportacion_economica = ${datos.aportacion_economica ? Number(datos.aportacion_economica) : 0},
             estatus = ${datos.estatus}
         WHERE evento_id = ${datos.evento_id} AND servidor_id = ${datos.servidor_id}
       `);
    } else {
       await db.execute(sql`
         INSERT INTO equipo_evento (evento_id, servidor_id, cargo_texto, asignaciones, aportacion_economica, estatus)
         VALUES (${datos.evento_id}, ${datos.servidor_id}, ${datos.cargo_texto || null}, ${datos.asignaciones || null}, ${datos.aportacion_economica ? Number(datos.aportacion_economica) : 0}, ${datos.estatus})
       `);
    }
    
    revalidatePath(`/eventos/${datos.evento_id}`);
    revalidatePath(`/eventos/${datos.evento_id}/equipo`);
    return { success: true };
  } catch (error: any) {
    console.error("Error al asignar equipo:", error);
    return { success: false, error: error.message };
  }
}
