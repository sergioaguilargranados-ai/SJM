"use server";

import { db } from "@/lib/db";
import { solicitudes_inscripcion, servidores, usuarios, sedes, casas_retiro, tipos_eventos, eventos, ministerios, cargos } from "@/lib/schema";
import { desc, eq, count, sum } from "drizzle-orm";

export async function getInscripciones() {
  try {
    const resultados = await db.select().from(solicitudes_inscripcion).orderBy(desc(solicitudes_inscripcion.creado_en));
    return { success: true, data: resultados };
  } catch (error) {
    console.error("Error al consultar inscripciones:", error);
    return { success: false, data: [], error: "No se pudieron cargar las inscripciones" };
  }
}

export async function getServidores() {
  try {
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
      .orderBy(desc(servidores.id));
      
    return { success: true, data: resultados };
  } catch (error) {
    console.error("Error al consultar servidores:", error);
    return { success: false, data: [], error: "No se pudieron cargar los servidores" };
  }
}

export async function getSedes() {
  try {
    const resultados = await db.select().from(sedes).orderBy(sedes.nombre);
    return { success: true, data: resultados };
  } catch (error) {
    console.error("Error al consultar sedes:", error);
    return { success: false, data: [], error: "No se pudieron cargar las sedes" };
  }
}

export async function getCasasRetiro() {
  try {
    const resultados = await db.select().from(casas_retiro).where(eq(casas_retiro.estatus, true)).orderBy(casas_retiro.nombre);
    return { success: true, data: resultados };
  } catch (error) {
    console.error("Error al consultar casas de retiro:", error);
    return { success: false, data: [], error: "No se pudieron cargar las casas de retiro" };
  }
}

export async function getTiposEventos() {
  try {
    const resultados = await db.select().from(tipos_eventos).orderBy(tipos_eventos.nombre);
    
    // TEMPORAL: Autoregistrar tipo Diplomado si no existe (FORZADO)
    if (!resultados.some(t => t.nombre.includes("Diplomados"))) {
       const [primerSede] = await db.select().from(sedes).limit(1);
       if (primerSede) {
          await db.insert(tipos_eventos).values({
            nombre: "Diplomados y Talleres on-line",
            organizacion_id: primerSede.organizacion_id,
            es_matrimonial: false
          });
       }
    }

    return { success: true, data: resultados };
  } catch (error) {
    console.error("Error al consultar tipos de eventos:", error);
    return { success: false, data: [], error: "No se pudieron cargar los tipos de eventos" };
  }
}

export async function getEventosRecientes() {
  try {
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
      .orderBy(desc(eventos.fecha_inicio));
    return { success: true, data: resultados };
  } catch (error) {
    console.error("Error al consultar eventos:", error);
    return { success: false, data: [], error: "No se pudieron cargar los eventos" };
  }
}

export async function getDashboardStats() {
  try {
     const [totalServidores] = await db.select({ val: count() }).from(servidores);
     const [totalEventos] = await db.select({ val: count() }).from(eventos);
     const [totalInscritos] = await db.select({ val: count() }).from(solicitudes_inscripcion);
     
     // Ingresos proyectados (Sumatoria de costos de eventos planeados/activos)
     // Nota: En prod esto debería ser sum(pagos_realizados), por ahora sumamos costos de eventos
     // const [totalIngresos] = await db.select({ val: sum(eventos.costo_publico) }).from(eventos);

     return {
        success: true,
        data: {
           servidores: totalServidores.val,
           eventos: totalEventos.val,
           inscritos: totalInscritos.val,
           ingresos: 45900 // Mock por ahora ya que costo_publico es string/decimal y sum() requiere casteo
        }
     };
  } catch (error) {
     console.error("Error al obtener stats:", error);
     return { success: false, data: { servidores: 0, eventos: 0, inscritos: 0, ingresos: 0 } };
  }
}

export async function getMinisterios() {
  try {
    const resultados = await db.select().from(ministerios).orderBy(ministerios.nombre);
    return { success: true, data: resultados };
  } catch (error) {
    return { success: false, data: [] };
  }
}

export async function getCargos() {
  try {
    const resultados = await db.select().from(cargos).orderBy(cargos.nombre);
    return { success: true, data: resultados };
  } catch (error) {
    return { success: false, data: [] };
  }
}

export async function getServidorById(id: string) {
  try {
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
      .where(eq(servidores.id, id))
      .limit(1);
      
    return { success: true, data: resultado };
  } catch (error) {
    return { success: false, data: null };
  }
}

export async function getEventoById(id: string) {
  try {
    const [resultado] = await db.select().from(eventos).where(eq(eventos.id, id)).limit(1);
    return { success: true, data: resultado };
  } catch (error) {
    return { success: false, data: null };
  }
}

export async function getInscripcionesByEvento(eventoId: string) {
  try {
    const resultados = await db
      .select()
      .from(solicitudes_inscripcion)
      .where(eq(solicitudes_inscripcion.evento_id, eventoId))
      .orderBy(desc(solicitudes_inscripcion.creado_en));
    return { success: true, data: resultados };
  } catch (error) {
    console.error("Error al consultar inscritos por evento:", error);
    return { success: false, data: [] };
  }
}
