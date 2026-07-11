"use server";

import { db } from "@/lib/db";
import { solicitudes_inscripcion, usuarios, servidores, eventos, tipos_eventos, equipo_evento, evaluaciones_evento, sedes, ministerios } from "@/lib/schema";
import { eq, desc, sql, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { validarAccesoPlan } from "@/lib/permisos";

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

    // 1. Crear Usuario base (si no existe por correo)
    const [nuevoUsuario] = await db.insert(usuarios).values({
      organizacion_id,
      nombre_completo,
      correo,
      celular,
      rol_id: null,
    }).returning();

    // 2. Crear Relación en Tabla Servidores
    const [nuevoServidor] = await db.insert(servidores).values({
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

    const result = nuevoServidor;

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
    revalidatePath("/");
    return { success: true, id: nuevoEvento.id };
  } catch (error: any) {
    console.error("Error al crear evento:", error);
    return { success: false, error: error.message || "Error al crear evento" };
  }
}

export async function actualizarServidorAction(id: string, datos: any) {
  try {
    const { 
       nombre_completo, correo, celular, sede_id, ministerio_id, cargo_id, 
       estado_civil, fecha_nacimiento, sexo, fecha_ingreso, fecha_baja, avance_servidor, 
       retiros_tomados, observaciones, estatus,
       domicilio_calle, domicilio_colonia, domicilio_cp, estado_id,
       telefono_casa_trabajo, contacto_emergencia, tels_emergencia,
       facebook_url, instagram_url, tiktok_url, youtube_url,
       retiros_tomados_detalle, retiros_externos_detalle, servicios_sjm,
       nombre_gafete, foto_url
    } = datos;

    // 1. Obtener registro actual para sacar el usuario_id
    const [servActual] = await db.select().from(servidores).where(eq(servidores.id, id));
    if (!servActual) throw new Error("Servidor no encontrado");

    // 2. Actualizar Usuario (Nombre y Celular)
    await db.update(usuarios)
      .set({ 
        nombre_completo, 
        celular,
        ...(correo ? { correo } : {}), // Opcional, por si queremos dejar cambiar correo
        ...(fecha_nacimiento ? { fecha_nacimiento: fecha_nacimiento } : {})
      })
      .where(eq(usuarios.id, servActual.usuario_id));

    // 3. Actualizar Relación Servidor
    await db.update(servidores)
      .set({ 
         sede_id: sede_id || servActual.sede_id,
         ministerio_id: ministerio_id || null, 
         cargo_id: cargo_id || null,
         estado_civil: estado_civil || null,
         fecha_nacimiento: fecha_nacimiento || null,
         sexo: sexo || null,
         fecha_ingreso: fecha_ingreso || null,
         fecha_baja: fecha_baja || null,
         avance_servidor: avance_servidor || null,
         retiros_tomados: Number(retiros_tomados) || 0,
         observaciones: observaciones || null,
         estatus: estatus === true || estatus === "true",
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
      })
      .where(eq(servidores.id, id));

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
    const { fecha_inicio, fecha_fin, costo_publico, cupo_maximo, recomendaciones, contrasena_inscripcion, nombre_evento, descripcion, fecha_inicio_promocion, politica_cancelacion, es_evento_servidores, estatus } = datos;
    
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
        ...(estatus ? { estatus } : {})
      })
      .where(eq(eventos.id, id));
    revalidatePath("/retiros-eventos", "page");
    revalidatePath("/");
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

export async function buscarServidorPorNombreAction(nombre: string, evento_id?: string) {
  try {
    const term = `%${nombre.trim().toLowerCase()}%`;
    const result = await db.execute(sql`
      SELECT s.id as servidor_id, u.id as usuario_id, u.nombre_completo, u.correo, u.celular, u.foto_perfil_url, 
              s.sexo, s.fecha_nacimiento, s.sede_id, s.ministerio_id, s.cargo_id, s.avance_servidor, 
              s.estado_civil, s.fecha_ingreso, s.fecha_baja, s.retiros_tomados, s.observaciones, s.foto_url,
              s.domicilio_calle, s.domicilio_colonia, s.domicilio_cp, s.estado_id,
              s.contacto_emergencia, s.tels_emergencia, s.telefono_casa_trabajo,
              s.facebook_url, s.instagram_url, s.tiktok_url, s.youtube_url,
              s.retiros_tomados_detalle, s.retiros_externos_detalle, s.servicios_sjm, s.estatus,
              COALESCE(si.nombre_gafete, s.nombre_gafete) AS nombre_gafete
              ${evento_id ? sql`, si.fecha_hora_llegada, si.lugar_llegada, si.medio_transporte_llegada, si.fecha_hora_salida, si.lugar_salida, si.medio_transporte_salida, si.pase_abordar_url, si.participa_salida_paseo, si.num_cuarto, si.equipo, si.comparte_cuarto_con, si.dificultad_escaleras` : sql``}
       FROM servidores s
       INNER JOIN usuarios u ON s.usuario_id = u.id
       ${evento_id ? sql`LEFT JOIN solicitudes_inscripcion si ON si.usuario_id = u.id AND si.evento_id = ${evento_id}` : sql``}
       WHERE LOWER(u.nombre_completo) LIKE ${term}
       LIMIT 10
    `);
    return { success: true, data: result.rows };
  } catch (error: any) {
    console.error("Error en buscarServidorPorNombreAction:", error);
    return { success: false, error: error.message };
  }
}

export async function buscarServidorPorInscripcionIdAction(inscripcion_id: string) {
  try {
    const result = await db.execute(sql`
      SELECT s.id as servidor_id, u.id as usuario_id, u.nombre_completo, u.correo, u.celular, u.foto_perfil_url, 
              s.sexo, s.fecha_nacimiento, s.sede_id, s.ministerio_id, s.cargo_id, s.avance_servidor, 
              s.estado_civil, s.fecha_ingreso, s.fecha_baja, s.retiros_tomados, s.observaciones, s.foto_url,
              s.domicilio_calle, s.domicilio_colonia, s.domicilio_cp, s.estado_id,
              s.contacto_emergencia, s.tels_emergencia, s.telefono_casa_trabajo,
              s.facebook_url, s.instagram_url, s.tiktok_url, s.youtube_url,
              s.retiros_tomados_detalle, s.retiros_externos_detalle, s.servicios_sjm, s.estatus,
              COALESCE(si.nombre_gafete, s.nombre_gafete) AS nombre_gafete
              , si.fecha_hora_llegada, si.lugar_llegada, si.medio_transporte_llegada, si.fecha_hora_salida, si.lugar_salida, si.medio_transporte_salida, si.pase_abordar_url, si.participa_salida_paseo, si.num_cuarto, si.equipo, si.comparte_cuarto_con, si.dificultad_escaleras
       FROM solicitudes_inscripcion si
       INNER JOIN usuarios u ON si.usuario_id = u.id
       LEFT JOIN servidores s ON s.usuario_id = u.id
       WHERE si.id = ${inscripcion_id}
       LIMIT 1
    `);
    if (result.rows.length > 0) {
      return { success: true, data: result.rows[0] };
    }
    return { success: false, message: "No encontrado" };
  } catch (error: any) {
    console.error("Error en buscarServidorPorInscripcionIdAction:", error);
    return { success: false, error: error.message };
  }
}

export async function registrarRenaseAction(datos: any) {
  try {
    // Aquí recibimos todos los datos combinados: los del perfil del servidor y los del itinerario
    // Actualizamos al servidor y creamos la solicitud en una transacción
      let usuarioId = datos.usuario_id;
      let servidorId = datos.servidor_id;

      // 1. Obtener el rol "Servidor"
      const resRol = await db.execute(sql`SELECT id FROM roles_sistema WHERE nombre = 'Servidor' AND organizacion_id = '6fb191cc-a477-4632-9cb1-c30c33a9f9bd' LIMIT 1`);
      const rolServidorId = (resRol.rows[0] as any)?.id || null;

      // 2. Crear o Actualizar usuario
      if (!usuarioId) {
         let existingUser;
         const conditions = [];
         if (datos.correo?.trim()) conditions.push(eq(usuarios.correo, datos.correo.trim().toLowerCase()));
         if (datos.celular) conditions.push(eq(usuarios.celular, datos.celular));
         
         if (conditions.length > 0) {
            existingUser = await db.query.usuarios.findFirst({
               where: or(...conditions)
            });
         }
         
         if (existingUser) {
            usuarioId = existingUser.id;
         }
      }

      if (usuarioId) {
         await db.execute(sql`
           UPDATE usuarios SET 
            nombre_completo = ${datos.nombre_completo}, 
            celular = ${datos.celular}, 
            correo = ${datos.correo?.trim() ? datos.correo : null}, 
            fecha_nacimiento = ${datos.fecha_nacimiento?.trim() ? datos.fecha_nacimiento : null}::date,
            rol_id = COALESCE(rol_id, ${rolServidorId}::uuid),
            es_servidor = true
           WHERE id = ${usuarioId}
         `);
      } else {
         const [nuevoUsu] = await db.insert(usuarios).values({
           organizacion_id: "6fb191cc-a477-4632-9cb1-c30c33a9f9bd",
           nombre_completo: datos.nombre_completo,
           celular: datos.celular,
           correo: datos.correo?.trim() ? datos.correo : null,
           fecha_nacimiento: datos.fecha_nacimiento?.trim() ? datos.fecha_nacimiento : null,
           es_servidor: true,
           rol_id: rolServidorId as string | null
         }).returning({ id: usuarios.id });
         usuarioId = nuevoUsu.id;
      }
      
      // 3. Crear o Actualizar servidor
      if (!servidorId && usuarioId) {
         const existingServidor = await db.query.servidores.findFirst({
            where: eq(servidores.usuario_id, usuarioId)
         });
         if (existingServidor) {
            servidorId = existingServidor.id;
         }
      }
      
      // 4. Crear o Actualizar servidor
      if (servidorId) {
         await db.execute(sql`
           UPDATE servidores SET 
              sede_id = COALESCE(${datos.sede_id?.trim() ? datos.sede_id : null}::uuid, sede_id), 
              ministerio_id = ${datos.ministerio_id || null}, 
              cargo_id = ${datos.cargo_id || null},
              estado_civil = ${datos.estado_civil || null},
              sexo = ${datos.sexo?.trim() ? datos.sexo : null},
              fecha_nacimiento = ${datos.fecha_nacimiento?.trim() ? datos.fecha_nacimiento : null}::date,
              fecha_ingreso = ${datos.fecha_ingreso?.trim() ? datos.fecha_ingreso : null}::date,
              fecha_baja = ${datos.fecha_baja?.trim() ? datos.fecha_baja : null}::date,
              avance_servidor = ${datos.avance_servidor || null},
              retiros_tomados = ${datos.retiros_tomados ? Number(datos.retiros_tomados) : 0},
              observaciones = ${datos.observaciones || null},
              domicilio_calle = ${datos.domicilio_calle || null},
              domicilio_colonia = ${datos.domicilio_colonia || null},
              domicilio_cp = ${datos.domicilio_cp || null},
              contacto_emergencia = ${datos.contacto_emergencia || null},
              tels_emergencia = ${datos.tels_emergencia || null},
              telefono_casa_trabajo = ${datos.telefono_casa_trabajo || null},
              facebook_url = ${datos.facebook_url || null},
              instagram_url = ${datos.instagram_url || null},
              tiktok_url = ${datos.tiktok_url || null},
              youtube_url = ${datos.youtube_url || null},
              retiros_tomados_detalle = ${datos.retiros_tomados_detalle || null},
              retiros_externos_detalle = ${datos.retiros_externos_detalle || null},
              servicios_sjm = ${datos.servicios_sjm || null},
              estatus = ${datos.estatus === "false" || datos.estatus === false ? false : true},
              nombre_gafete = ${datos.nombre_gafete || null},
              foto_url = ${datos.foto_url || null}
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
        fecha_nacimiento: datos.fecha_nacimiento?.trim() ? datos.fecha_nacimiento : null,
        fecha_ingreso: datos.fecha_ingreso?.trim() ? datos.fecha_ingreso : null,
        fecha_baja: datos.fecha_baja?.trim() ? datos.fecha_baja : null,
        avance_servidor: datos.avance_servidor || null,
        retiros_tomados: datos.retiros_tomados ? Number(datos.retiros_tomados) : 0,
        observaciones: datos.observaciones || null,
        domicilio_calle: datos.domicilio_calle || null,
        domicilio_colonia: datos.domicilio_colonia || null,
        domicilio_cp: datos.domicilio_cp || null,
        contacto_emergencia: datos.contacto_emergencia || null,
        tels_emergencia: datos.tels_emergencia || null,
        telefono_casa_trabajo: datos.telefono_casa_trabajo || null,
        facebook_url: datos.facebook_url || null,
        instagram_url: datos.instagram_url || null,
        tiktok_url: datos.tiktok_url || null,
        youtube_url: datos.youtube_url || null,
        retiros_tomados_detalle: datos.retiros_tomados_detalle || null,
        retiros_externos_detalle: datos.retiros_externos_detalle || null,
        servicios_sjm: datos.servicios_sjm || null,
        estatus: datos.estatus === "false" || datos.estatus === false ? false : true,
        nombre_gafete: datos.nombre_gafete || null,
        foto_url: datos.foto_url || null
      }).returning({ id: servidores.id });
      servidorId = nuevoServ.id;
   }
      
      // 3. Crear o Actualizar inscripción
      const existingInsc = await db.query.solicitudes_inscripcion.findFirst({
        where: (si, { eq, and }) => and(
          eq(si.evento_id, datos.evento_id),
          eq(si.usuario_id, usuarioId)
        )
      });
      
      // Obtener nombres de sede y ministerio
      let sedeNombre = null;
      if (datos.sede_id) {
        const resSede = await db.query.sedes.findFirst({ where: (s, { eq }) => eq(s.id, datos.sede_id) });
        sedeNombre = resSede?.nombre;
      }
      let minNombre = null;
      if (datos.ministerio_id) {
        const resMin = await db.query.ministerios.findFirst({ where: (m, { eq }) => eq(m.id, datos.ministerio_id) });
        minNombre = resMin?.nombre;
      }
      
      // Calcular edad
      let edadNum = null;
      if (datos.fecha_nacimiento?.trim()) {
        const birthDate = new Date(datos.fecha_nacimiento);
        const today = new Date();
        edadNum = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          edadNum--;
        }
      }

      const inscData = {
        evento_id: datos.evento_id,
        usuario_id: usuarioId,
        nombre_asistente: datos.nombre_completo,
        nombre_gafete: datos.nombre_gafete || null,
        telefono_celular: datos.celular || null,
        correo: datos.correo || null,
        fecha_nacimiento: datos.fecha_nacimiento?.trim() ? datos.fecha_nacimiento : null,
        
        // Datos extraídos para la tabla de asistentes
        edad: edadNum,
        sexo: datos.sexo || null,
        estado_civil: datos.estado_civil || null,
        pais_ciudad: sedeNombre,
        ministerio_actual: minNombre,
        
        // Itinerario y Logística
        fecha_hora_llegada: datos.fecha_hora_llegada ? new Date(datos.fecha_hora_llegada) : null,
        lugar_llegada: datos.lugar_llegada || null,
        medio_transporte_llegada: datos.medio_transporte_llegada || null,
        fecha_hora_salida: datos.fecha_hora_salida ? new Date(datos.fecha_hora_salida) : null,
        lugar_salida: datos.lugar_salida || null,
        medio_transporte_salida: datos.medio_transporte_salida || null,
        pase_abordar_url: datos.pase_abordar_url || null,
        participa_salida_paseo: datos.participa_salida_paseo === true,
        
        // Cuarto y Equipo
        num_cuarto: datos.num_cuarto || null,
        equipo: datos.equipo || null,
        comparte_cuarto_con: datos.comparte_cuarto_con || null,
        dificultad_escaleras: datos.dificultad_escaleras === true,
      };

      if (existingInsc) {
        await db.update(solicitudes_inscripcion)
          .set(inscData)
          .where(eq(solicitudes_inscripcion.id, existingInsc.id));
      } else {
        await db.insert(solicitudes_inscripcion).values({
          ...inscData,
          estatus_solicitud: "PENDIENTE_PAGO"
        });
      }

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

export async function validarYCrearEvaluacionAction(datos: any) {
  try {
    const { evento_id, identificador, evaluacion } = datos;
    
    // Buscar si existe en solicitudes_inscripcion
    let solicitud = await db.query.solicitudes_inscripcion.findFirst({
      where: (sol, { eq, and, or }) => and(
        eq(sol.evento_id, evento_id),
        or(
          eq(sol.correo, identificador),
          eq(sol.telefono_celular, identificador)
        )
      )
    });

    if (!solicitud) {
      return { success: false, error: "No se encontró registro con ese correo/celular para este evento." };
    }

    // Verificar si ya evaluó
    const existe = await db.query.evaluaciones_evento.findFirst({
      where: (ev, { eq, and }) => and(
        eq(ev.evento_id, evento_id),
        eq(ev.solicitud_id, solicitud.id)
      )
    });

    if (existe) {
      return { success: false, error: "Ya has enviado una evaluación para este evento." };
    }

    await db.insert(evaluaciones_evento).values({
      evento_id,
      solicitud_id: solicitud.id,
      cumplio_expectativas: evaluacion.cumplio_expectativas === 'si',
      calificacion_instalaciones: Number(evaluacion.calificacion_instalaciones),
      calificacion_alimentos: Number(evaluacion.calificacion_alimentos),
      calificacion_organizacion: Number(evaluacion.calificacion_organizacion),
      te_confesaste: evaluacion.te_confesaste === 'si',
      tema_mas_gusto: evaluacion.tema_mas_gusto,
      oracion_mas_gusto: evaluacion.oracion_mas_gusto,
      comentarios_sugerencias: evaluacion.comentarios_sugerencias,
      gustas_integrarte: evaluacion.gustas_integrarte === 'si',
      gustas_apoyar_economicamente: evaluacion.gustas_apoyar_economicamente === 'si',
      oficio_profesion: evaluacion.oficio_profesion,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error guardando evaluación:", error);
    return { success: false, error: error.message || "Error guardando evaluación" };
  }
}

export async function eliminarServidorAction(id: string) {
  try {
    const { orgId, session } = await validarAccesoPlan("servidores");
    // Extra validación: Sólo administradores
    if (!session?.user?.rol_nombre?.toLowerCase().includes("admin")) {
       return { success: false, error: "Permisos insuficientes. Sólo administradores pueden eliminar servidores." };
    }
    
    // Buscar si existe
    const [server] = await db.select().from(servidores).where(eq(servidores.id, id));
    if (!server) {
      return { success: false, error: "Servidor no encontrado" };
    }
    
    // Eliminar servidor
    await db.delete(servidores).where(eq(servidores.id, id));
    
    // Opcional: También podríamos eliminar el usuario asociado (server.usuario_id) si no tiene más roles, 
    // pero por seguridad sólo eliminamos su perfil de servidor.
    
    return { success: true };
  } catch (error: any) {
    console.error("Error al eliminar servidor:", error);
    return { success: false, error: error.message || "No se pudo eliminar el servidor." };
  }
}

export async function eliminarInscripcionAction(id: string) {
  try {
    const { getUsuarioSesion } = await import("@/lib/sesion");
    const session = await getUsuarioSesion();
    
    if (!session.rol_nombre?.toLowerCase().includes("admin")) {
       return { success: false, error: "Permisos insuficientes. Sólo administradores pueden eliminar inscripciones." };
    }
    
    await db.delete(solicitudes_inscripcion).where(eq(solicitudes_inscripcion.id, id));
    revalidatePath("/eventos/[eventoId]", "page");
    return { success: true };
  } catch (error: any) {
    console.error("Error al eliminar inscripcion:", error);
    return { success: false, error: error.message || "No se puede eliminar la inscripción." };
  }
}
