"use server";

import { db } from "@/lib/db";
import { solicitudes_inscripcion, servidores, usuarios, sedes, casas_retiro, tipos_eventos, eventos, ministerios, cargos } from "@/lib/schema";
import { desc, eq, count, sum, and } from "drizzle-orm";
import { validarAccesoPlan } from "@/lib/permisos";


export async function getInscripciones() {
  try {
    const { orgId } = await validarAccesoPlan("inscripciones");
    const resultados = await db
      .select()
      .from(solicitudes_inscripcion)
      .where(eq(solicitudes_inscripcion.organizacion_id, orgId))
      .orderBy(desc(solicitudes_inscripcion.creado_en));
    return { success: true, data: resultados };
  } catch (error) {
    console.error("Error al consultar inscripciones:", error);
    return { success: false, data: [], error: "No se pudieron cargar las inscripciones" };
  }
}


export async function getServidores() {
  try {
    const { orgId } = await validarAccesoPlan("servidores");
    const resultados = await db
      .select({
         id: servidores.id,
         estatus: servidores.estatus,
         nombre_completo: usuarios.nombre_completo,
         correo: usuarios.correo,
         celular: usuarios.celular,
         fecha_ingreso: servidores.fecha_ingreso,
         sede: sedes.nombre
      })
      .from(servidores)
      .leftJoin(usuarios, eq(servidores.usuario_id, usuarios.id))
      .leftJoin(sedes, eq(servidores.sede_id, sedes.id))
      .where(eq(servidores.organizacion_id, orgId))
      .orderBy(desc(servidores.id));
      
    return { success: true, data: resultados };
  } catch (error) {
    console.error("Error al consultar servidores:", error);
    return { success: false, data: [], error: "No se pudieron cargar los servidores" };
  }
}


export async function getSedes() {
  try {
    const { orgId } = await validarAccesoPlan("sedes");
    const resultados = await db
      .select()
      .from(sedes)
      .where(eq(sedes.organizacion_id, orgId))
      .orderBy(sedes.nombre);
    return { success: true, data: resultados };
  } catch (error) {
    console.error("Error al consultar sedes:", error);
    return { success: false, data: [], error: "No se pudieron cargar las sedes" };
  }
}


export async function getCasasRetiro() {
  try {
    const { orgId } = await validarAccesoPlan("eventos");
    const resultados = await db
      .select()
      .from(casas_retiro)
      .where(and(eq(casas_retiro.organizacion_id, orgId), eq(casas_retiro.estatus, true)))
      .orderBy(casas_retiro.nombre);
    return { success: true, data: resultados };
  } catch (error) {
    console.error("Error al consultar casas de retiro:", error);
    return { success: false, data: [], error: "No se pudieron cargar las casas de retiro" };
  }
}


export async function getTiposEventos() {
  try {
    const { orgId } = await validarAccesoPlan("tipos-eventos");
    const resultados = await db
      .select()
      .from(tipos_eventos)
      .where(eq(tipos_eventos.organizacion_id, orgId))
      .orderBy(tipos_eventos.nombre);
    
    // TEMPORAL: Autoregistrar tipo Diplomado si no existe para esta organización
    if (!resultados.some(t => t.nombre.includes("Diplomados"))) {
      await db.insert(tipos_eventos).values({
        nombre: "Diplomados y Talleres on-line",
        organizacion_id: orgId,
        es_matrimonial: false
      });
      // Recargar para devolver la lista actualizada
      return { success: true, data: await db.select().from(tipos_eventos).where(eq(tipos_eventos.organizacion_id, orgId)).orderBy(tipos_eventos.nombre) };
    }

    return { success: true, data: resultados };
  } catch (error) {
    console.error("Error al consultar tipos de eventos:", error);
    return { success: false, data: [], error: "No se pudieron cargar los tipos de eventos" };
  }
}


export async function getEventosRecientes() {
  try {
    const { orgId } = await validarAccesoPlan("eventos");
    const resultados = await db
      .select({
         id: eventos.id,
         tipo: tipos_eventos.nombre,
         casa: casas_retiro.nombre,
         fecha_inicio: eventos.fecha_inicio,
         estatus: eventos.estatus,
         costo: eventos.costo_publico
      })
      .from(eventos)
      .leftJoin(tipos_eventos, eq(eventos.tipo_evento_id, tipos_eventos.id))
      .leftJoin(casas_retiro, eq(eventos.casa_retiro_id, casas_retiro.id))
      .where(eq(eventos.organizacion_id, orgId))
      .orderBy(desc(eventos.fecha_inicio));
    return { success: true, data: resultados };
  } catch (error) {
    console.error("Error al consultar eventos:", error);
    return { success: false, data: [], error: "No se pudieron cargar los eventos" };
  }
}


export async function getDashboardStats() {
  try {
     const { orgId } = await validarAccesoPlan("dashboard");
     const [totalServidores] = await db.select({ val: count() }).from(servidores).where(eq(servidores.organizacion_id, orgId));
     const [totalEventos] = await db.select({ val: count() }).from(eventos).where(eq(eventos.organizacion_id, orgId));
     const [totalInscritos] = await db.select({ val: count() }).from(solicitudes_inscripcion).where(eq(solicitudes_inscripcion.organizacion_id, orgId));
     
     return {
        success: true,
        data: {
           servidores: totalServidores.val,
           eventos: totalEventos.val,
           inscritos: totalInscritos.val,
           ingresos: 45900 // Mock por ahora
        }
     };
  } catch (error) {
     console.error("Error al obtener stats:", error);
     return { success: false, data: { servidores: 0, eventos: 0, inscritos: 0, ingresos: 0 } };
  }
}


export async function getMinisterios() {
  try {
    const { orgId } = await validarAccesoPlan("ministerios");
    const resultados = await db
      .select()
      .from(ministerios)
      .where(eq(ministerios.organizacion_id, orgId))
      .orderBy(ministerios.nombre);
    return { success: true, data: resultados };
  } catch (error) {
    return { success: false, data: [] };
  }
}


export async function getCargos() {
  try {
    const { orgId } = await validarAccesoPlan("admin"); // Cargos son globales por ahora pero requieren auth
    const resultados = await db.select().from(cargos).orderBy(cargos.nombre);
    return { success: true, data: resultados };
  } catch (error) {
    return { success: false, data: [] };
  }
}


export async function getServidorById(id: string) {
  try {
    const { orgId } = await validarAccesoPlan("servidores");
    const [resultado] = await db
      .select({
         id: servidores.id,
         estatus: servidores.estatus,
         nombre_completo: usuarios.nombre_completo,
         correo: usuarios.correo,
         celular: usuarios.celular,
         ministerio_id: servidores.ministerio_id,
         cargo_id: servidores.cargo_id,
         estado_civil: servidores.estado_civil,
         avance_servidor: servidores.avance_servidor
      })
      .from(servidores)
      .leftJoin(usuarios, eq(servidores.usuario_id, usuarios.id))
      .where(and(eq(servidores.id, id), eq(servidores.organizacion_id, orgId)))
      .limit(1);
      
    return { success: true, data: resultado };
  } catch (error) {
    return { success: false, data: null };
  }
}


export async function getEventoById(id: string) {
  try {
    const { orgId } = await validarAccesoPlan("eventos");
    const [resultado] = await db
      .select({
        id: eventos.id,
        tipo: tipos_eventos.nombre,
        casa_retiro_id: eventos.casa_retiro_id,
        fecha_inicio: eventos.fecha_inicio,
        fecha_fin: eventos.fecha_fin,
        estatus: eventos.estatus,
        costo_publico: eventos.costo_publico,
        cupo_maximo: eventos.cupo_maximo,
        contrasena_inscripcion: eventos.contrasena_inscripcion,
        es_matrimonial: eventos.es_matrimonial
      })
      .from(eventos)
      .leftJoin(tipos_eventos, eq(eventos.tipo_evento_id, tipos_eventos.id))
      .where(and(eq(eventos.id, id), eq(eventos.organizacion_id, orgId)))
      .limit(1);
    return { success: true, data: resultado };
  } catch (error) {
    console.error("Error al obtener evento por ID:", error);
    return { success: false, data: null };
  }
}



export async function getInscripcionesByEvento(eventoId: string) {
  try {
    const { orgId } = await validarAccesoPlan("inscripciones");
    const resultados = await db
      .select()
      .from(solicitudes_inscripcion)
      .where(and(
        eq(solicitudes_inscripcion.evento_id, eventoId),
        eq(solicitudes_inscripcion.organizacion_id, orgId)
      ))
      .orderBy(desc(solicitudes_inscripcion.creado_en));
    return { success: true, data: resultados };
  } catch (error) {
    console.error("Error al consultar inscritos por evento:", error);
    return { success: false, data: [] };
  }
}

