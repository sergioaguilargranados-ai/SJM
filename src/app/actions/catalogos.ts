"use server";

import { db } from "@/lib/db";
import { 
  sedes, organizaciones, ministerios, cargos, tipos_eventos, casas_retiro, 
  clasificaciones_gasto, estados_republica, equipo_evento, gastos_evento, 
  documentos_institucionales, evaluaciones_evento, solicitudes_inscripcion,
  eventos, servidores, usuarios
} from "@/lib/schema";
import { desc, eq } from "drizzle-orm";

// ========================================================================
// CATÁLOGOS - CRUDs completos
// ========================================================================

// --- SEDES ---
export async function getSedesCompleto() {
  try {
    const resultados = await db
      .select({
        id: sedes.id,
        nombre: sedes.nombre,
        organizacion_id: sedes.organizacion_id,
        organizacion: organizaciones.nombre,
        creado_en: sedes.creado_en,
      })
      .from(sedes)
      .leftJoin(organizaciones, eq(sedes.organizacion_id, organizaciones.id))
      .orderBy(sedes.nombre);
    return { success: true, data: resultados };
  } catch (error) {
    console.error("Error al consultar sedes:", error);
    return { success: false, data: [] };
  }
}

export async function crearSedeAction(datos: { nombre: string; organizacion_id: string }) {
  try {
    const [nueva] = await db.insert(sedes).values(datos).returning();
    return { success: true, id: nueva.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- MINISTERIOS ---
export async function getMinisteriosCompleto() {
  try {
    const resultados = await db
      .select({
        id: ministerios.id,
        nombre: ministerios.nombre,
        descripcion: ministerios.descripcion,
        organizacion_id: ministerios.organizacion_id,
        organizacion: organizaciones.nombre,
      })
      .from(ministerios)
      .leftJoin(organizaciones, eq(ministerios.organizacion_id, organizaciones.id))
      .orderBy(ministerios.nombre);
    return { success: true, data: resultados };
  } catch (error) {
    return { success: false, data: [] };
  }
}

export async function crearMinisterioAction(datos: { nombre: string; descripcion?: string; organizacion_id: string }) {
  try {
    const [nuevo] = await db.insert(ministerios).values(datos).returning();
    return { success: true, id: nuevo.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function eliminarMinisterioAction(id: string) {
  try {
    await db.delete(ministerios).where(eq(ministerios.id, id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- CARGOS ---
export async function getCargosCompleto() {
  try {
    const resultados = await db.select().from(cargos).orderBy(cargos.nombre);
    return { success: true, data: resultados };
  } catch (error) {
    return { success: false, data: [] };
  }
}

export async function crearCargoAction(datos: { nombre: string }) {
  try {
    const [nuevo] = await db.insert(cargos).values(datos).returning();
    return { success: true, id: nuevo.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function eliminarCargoAction(id: string) {
  try {
    await db.delete(cargos).where(eq(cargos.id, id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- TIPOS DE EVENTOS ---
export async function getTiposEventosCompleto() {
  try {
    const resultados = await db
      .select({
        id: tipos_eventos.id,
        nombre: tipos_eventos.nombre,
        es_matrimonial: tipos_eventos.es_matrimonial,
        organizacion_id: tipos_eventos.organizacion_id,
        organizacion: organizaciones.nombre,
      })
      .from(tipos_eventos)
      .leftJoin(organizaciones, eq(tipos_eventos.organizacion_id, organizaciones.id))
      .orderBy(tipos_eventos.nombre);
    return { success: true, data: resultados };
  } catch (error) {
    return { success: false, data: [] };
  }
}

export async function crearTipoEventoAction(datos: { nombre: string; organizacion_id: string; es_matrimonial: boolean }) {
  try {
    const [nuevo] = await db.insert(tipos_eventos).values(datos).returning();
    return { success: true, id: nuevo.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function eliminarTipoEventoAction(id: string) {
  try {
    await db.delete(tipos_eventos).where(eq(tipos_eventos.id, id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- CASAS DE RETIRO ---
export async function getCasasRetiroCompleto() {
  try {
    const resultados = await db
      .select({
        id: casas_retiro.id,
        nombre: casas_retiro.nombre,
        domicilio: casas_retiro.domicilio,
        codigo_postal: casas_retiro.codigo_postal,
        encargado: casas_retiro.encargado,
        telefonos: casas_retiro.telefonos,
        costo_persona: casas_retiro.costo_persona,
        capacidad: casas_retiro.capacidad,
        minimo_personas: casas_retiro.minimo_personas,
        estatus: casas_retiro.estatus,
      })
      .from(casas_retiro)
      .orderBy(casas_retiro.nombre);
    return { success: true, data: resultados };
  } catch (error) {
    return { success: false, data: [] };
  }
}

export async function crearCasaRetiroAction(datos: any) {
  try {
    const [nueva] = await db.insert(casas_retiro).values({
      nombre: datos.nombre,
      domicilio: datos.domicilio || null,
      codigo_postal: datos.codigo_postal || null,
      encargado: datos.encargado || null,
      telefonos: datos.telefonos || null,
      costo_persona: datos.costo_persona ? String(datos.costo_persona) : null,
      capacidad: datos.capacidad ? Number(datos.capacidad) : null,
      minimo_personas: datos.minimo_personas ? Number(datos.minimo_personas) : null,
      estatus: true,
    }).returning();
    return { success: true, id: nueva.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- CLASIFICACIONES DE GASTO ---
export async function getClasificacionesGastoCompleto() {
  try {
    const resultados = await db.select().from(clasificaciones_gasto).orderBy(clasificaciones_gasto.nombre);
    return { success: true, data: resultados };
  } catch (error) {
    return { success: false, data: [] };
  }
}

export async function crearClasificacionGastoAction(datos: { nombre: string }) {
  try {
    const [nueva] = await db.insert(clasificaciones_gasto).values(datos).returning();
    return { success: true, id: nueva.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function eliminarClasificacionGastoAction(id: string) {
  try {
    await db.delete(clasificaciones_gasto).where(eq(clasificaciones_gasto.id, id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- ESTADOS DE LA REPÚBLICA ---
export async function getEstadosRepublica() {
  try {
    const resultados = await db.select().from(estados_republica).orderBy(estados_republica.nombre);
    return { success: true, data: resultados };
  } catch (error) {
    return { success: false, data: [] };
  }
}

export async function crearEstadoAction(datos: { nombre: string }) {
  try {
    const [nuevo] = await db.insert(estados_republica).values(datos).returning();
    return { success: true, id: nuevo.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ========================================================================
// MOVIMIENTOS - Consultas con relaciones
// ========================================================================

// --- INSCRIPCIONES COMPLETAS (con nombre del evento) ---
export async function getInscripcionesCompleto() {
  try {
    const resultados = await db
      .select({
        id: solicitudes_inscripcion.id,
        nombre_asistente: solicitudes_inscripcion.nombre_asistente,
        correo: solicitudes_inscripcion.correo,
        telefono_celular: solicitudes_inscripcion.telefono_celular,
        sexo: solicitudes_inscripcion.sexo,
        estado_civil: solicitudes_inscripcion.estado_civil,
        es_primera_vez: solicitudes_inscripcion.es_primera_vez,
        estatus_solicitud: solicitudes_inscripcion.estatus_solicitud,
        pago_deposito: solicitudes_inscripcion.pago_deposito,
        pago_efectivo: solicitudes_inscripcion.pago_efectivo,
        monto_beca: solicitudes_inscripcion.monto_beca,
        pais_ciudad: solicitudes_inscripcion.pais_ciudad,
        ministerio_actual: solicitudes_inscripcion.ministerio_actual,
        creado_en: solicitudes_inscripcion.creado_en,
        evento_tipo: tipos_eventos.nombre,
      })
      .from(solicitudes_inscripcion)
      .leftJoin(eventos, eq(solicitudes_inscripcion.evento_id, eventos.id))
      .leftJoin(tipos_eventos, eq(eventos.tipo_evento_id, tipos_eventos.id))
      .orderBy(desc(solicitudes_inscripcion.creado_en));
    return { success: true, data: resultados };
  } catch (error) {
    console.error("Error al consultar inscripciones completas:", error);
    return { success: false, data: [] };
  }
}

// --- EQUIPO POR EVENTO ---
export async function getEquipoEventos() {
  try {
    const resultados = await db
      .select({
        id: equipo_evento.id,
        evento_id: equipo_evento.evento_id,
        asignaciones: equipo_evento.asignaciones,
        aportacion_economica: equipo_evento.aportacion_economica,
        estatus: equipo_evento.estatus,
        servidor_nombre: usuarios.nombre_completo,
        cargo: cargos.nombre,
        evento_tipo: tipos_eventos.nombre,
      })
      .from(equipo_evento)
      .leftJoin(servidores, eq(equipo_evento.servidor_id, servidores.id))
      .leftJoin(usuarios, eq(servidores.usuario_id, usuarios.id))
      .leftJoin(cargos, eq(equipo_evento.cargo_evento_id, cargos.id))
      .leftJoin(eventos, eq(equipo_evento.evento_id, eventos.id))
      .leftJoin(tipos_eventos, eq(eventos.tipo_evento_id, tipos_eventos.id))
      .orderBy(desc(equipo_evento.id));
    return { success: true, data: resultados };
  } catch (error) {
    console.error("Error al consultar equipo de eventos:", error);
    return { success: false, data: [] };
  }
}

// --- GASTOS POR EVENTO (FINANZAS) ---
export async function getGastosEventos() {
  try {
    const resultados = await db
      .select({
        id: gastos_evento.id,
        monto: gastos_evento.monto,
        descripcion: gastos_evento.descripcion,
        fecha_gasto: gastos_evento.fecha_gasto,
        clasificacion: clasificaciones_gasto.nombre,
        evento_tipo: tipos_eventos.nombre,
        registrado_por_nombre: usuarios.nombre_completo,
      })
      .from(gastos_evento)
      .leftJoin(clasificaciones_gasto, eq(gastos_evento.clasificacion_id, clasificaciones_gasto.id))
      .leftJoin(eventos, eq(gastos_evento.evento_id, eventos.id))
      .leftJoin(tipos_eventos, eq(eventos.tipo_evento_id, tipos_eventos.id))
      .leftJoin(usuarios, eq(gastos_evento.registrado_por, usuarios.id))
      .orderBy(desc(gastos_evento.fecha_gasto));
    return { success: true, data: resultados };
  } catch (error) {
    console.error("Error al consultar gastos:", error);
    return { success: false, data: [] };
  }
}

export async function crearGastoEventoAction(datos: any) {
  try {
    const [nuevo] = await db.insert(gastos_evento).values({
      evento_id: datos.evento_id,
      clasificacion_id: datos.clasificacion_id,
      monto: String(datos.monto),
      descripcion: datos.descripcion || null,
      fecha_gasto: datos.fecha_gasto || null,
      registrado_por: datos.registrado_por || null,
    }).returning();
    return { success: true, id: nuevo.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- DOCUMENTOS INSTITUCIONALES ---
export async function getDocumentosInstitucionales() {
  try {
    const resultados = await db
      .select({
        id: documentos_institucionales.id,
        nombre: documentos_institucionales.nombre,
        descripcion: documentos_institucionales.descripcion,
        url_archivo: documentos_institucionales.url_archivo,
        nivel_acceso_rol: documentos_institucionales.nivel_acceso_rol,
        fecha_subida: documentos_institucionales.fecha_subida,
        organizacion: organizaciones.nombre,
      })
      .from(documentos_institucionales)
      .leftJoin(organizaciones, eq(documentos_institucionales.organizacion_id, organizaciones.id))
      .orderBy(desc(documentos_institucionales.fecha_subida));
    return { success: true, data: resultados };
  } catch (error) {
    console.error("Error al consultar documentos:", error);
    return { success: false, data: [] };
  }
}

export async function crearDocumentoAction(datos: any) {
  try {
    const [nuevo] = await db.insert(documentos_institucionales).values({
      organizacion_id: datos.organizacion_id,
      nombre: datos.nombre,
      descripcion: datos.descripcion || null,
      url_archivo: datos.url_archivo,
      nivel_acceso_rol: datos.nivel_acceso_rol || null,
    }).returning();
    return { success: true, id: nuevo.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- EVALUACIONES ---
export async function getEvaluacionesEventos() {
  try {
    const resultados = await db
      .select({
        id: evaluaciones_evento.id,
        cumplio_expectativas: evaluaciones_evento.cumplio_expectativas,
        calificacion_instalaciones: evaluaciones_evento.calificacion_instalaciones,
        calificacion_alimentos: evaluaciones_evento.calificacion_alimentos,
        calificacion_organizacion: evaluaciones_evento.calificacion_organizacion,
        te_confesaste: evaluaciones_evento.te_confesaste,
        tema_mas_gusto: evaluaciones_evento.tema_mas_gusto,
        comentarios_sugerencias: evaluaciones_evento.comentarios_sugerencias,
        gustas_integrarte: evaluaciones_evento.gustas_integrarte,
        oficio_profesion: evaluaciones_evento.oficio_profesion,
        evento_tipo: tipos_eventos.nombre,
        asistente: solicitudes_inscripcion.nombre_asistente,
      })
      .from(evaluaciones_evento)
      .leftJoin(eventos, eq(evaluaciones_evento.evento_id, eventos.id))
      .leftJoin(tipos_eventos, eq(eventos.tipo_evento_id, tipos_eventos.id))
      .leftJoin(solicitudes_inscripcion, eq(evaluaciones_evento.solicitud_id, solicitudes_inscripcion.id))
      .orderBy(desc(evaluaciones_evento.id));
    return { success: true, data: resultados };
  } catch (error) {
    console.error("Error al consultar evaluaciones:", error);
    return { success: false, data: [] };
  }
}

// ========================================================================
// ACTUALIZACIONES (UPDATE) - Para edición en catálogos
// ========================================================================

export async function actualizarSedeAction(id: string, datos: Record<string, any>) {
  try {
    await db.update(sedes).set({ nombre: datos.nombre }).where(eq(sedes.id, id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function eliminarSedeAction(id: string) {
  try {
    await db.delete(sedes).where(eq(sedes.id, id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function actualizarMinisterioAction(id: string, datos: Record<string, any>) {
  try {
    await db.update(ministerios).set({ nombre: datos.nombre, descripcion: datos.descripcion || null }).where(eq(ministerios.id, id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function actualizarCargoAction(id: string, datos: Record<string, any>) {
  try {
    await db.update(cargos).set({ nombre: datos.nombre }).where(eq(cargos.id, id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function actualizarTipoEventoAction(id: string, datos: Record<string, any>) {
  try {
    await db.update(tipos_eventos).set({ nombre: datos.nombre, es_matrimonial: datos.es_matrimonial ?? false }).where(eq(tipos_eventos.id, id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function actualizarCasaRetiroAction(id: string, datos: Record<string, any>) {
  try {
    await db.update(casas_retiro).set({
      nombre: datos.nombre,
      domicilio: datos.domicilio || null,
      encargado: datos.encargado || null,
      telefonos: datos.telefonos || null,
      costo_persona: datos.costo_persona ? String(datos.costo_persona) : null,
      capacidad: datos.capacidad ? Number(datos.capacidad) : null,
    }).where(eq(casas_retiro.id, id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function eliminarCasaRetiroAction(id: string) {
  try {
    await db.delete(casas_retiro).where(eq(casas_retiro.id, id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function actualizarClasificacionGastoAction(id: string, datos: Record<string, any>) {
  try {
    await db.update(clasificaciones_gasto).set({ nombre: datos.nombre }).where(eq(clasificaciones_gasto.id, id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function actualizarEstadoAction(id: string, datos: Record<string, any>) {
  try {
    await db.update(estados_republica).set({ nombre: datos.nombre }).where(eq(estados_republica.id, id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function eliminarEstadoAction(id: string) {
  try {
    await db.delete(estados_republica).where(eq(estados_republica.id, id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ========================================================================
// GESTIÓN DE ESTATUS DE INSCRIPCIONES
// ========================================================================

export async function actualizarEstatusInscripcion(id: string, nuevoEstatus: string) {
  try {
    await db.update(solicitudes_inscripcion).set({ estatus_solicitud: nuevoEstatus }).where(eq(solicitudes_inscripcion.id, id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ========================================================================
// DASHBOARD - KPIs REALES
// ========================================================================

import { count, sum, sql } from "drizzle-orm";

export async function getDashboardStats() {
  try {
    // Total servidores activos
    const [servidoresCount] = await db
      .select({ total: count() })
      .from(servidores)
      .where(eq(servidores.estatus, true));

    // Total eventos
    const [eventosCount] = await db
      .select({ total: count() })
      .from(eventos);

    // Total inscripciones
    const [inscripcionesCount] = await db
      .select({ total: count() })
      .from(solicitudes_inscripcion);

    // Total ingresos reales (pago_deposito + pago_efectivo) 
    const [ingresos] = await db
      .select({
        total_deposito: sql<string>`COALESCE(SUM(CAST(${solicitudes_inscripcion.pago_deposito} AS NUMERIC)), 0)`,
        total_efectivo: sql<string>`COALESCE(SUM(CAST(${solicitudes_inscripcion.pago_efectivo} AS NUMERIC)), 0)`,
      })
      .from(solicitudes_inscripcion);

    // Total egresos
    const [egresos] = await db
      .select({
        total: sql<string>`COALESCE(SUM(CAST(${gastos_evento.monto} AS NUMERIC)), 0)`,
      })
      .from(gastos_evento);

    const totalIngresos = Number(ingresos?.total_deposito || 0) + Number(ingresos?.total_efectivo || 0);
    const totalEgresos = Number(egresos?.total || 0);

    return {
      success: true,
      data: {
        servidores_activos: servidoresCount?.total || 0,
        total_eventos: eventosCount?.total || 0,
        total_inscripciones: inscripcionesCount?.total || 0,
        total_ingresos: totalIngresos,
        total_egresos: totalEgresos,
        balance: totalIngresos - totalEgresos,
      },
    };
  } catch (error) {
    console.error("Error al obtener stats del dashboard:", error);
    return {
      success: false,
      data: {
        servidores_activos: 0,
        total_eventos: 0,
        total_inscripciones: 0,
        total_ingresos: 0,
        total_egresos: 0,
        balance: 0,
      },
    };
  }
}

