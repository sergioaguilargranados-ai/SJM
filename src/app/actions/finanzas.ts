"use server";

import { db } from "@/lib/db";
import { gastos_evento, clasificaciones_gasto, solicitudes_inscripcion, eventos } from "@/lib/schema";
import { eq, and, desc, sql, sum } from "drizzle-orm";
import { validarAccesoPlan } from "@/lib/permisos";
import { revalidatePath } from "next/cache";

/**
 * Obtiene todos los gastos registrados para un evento específico.
 */
export async function getGastosByEvento(eventoId: string) {
  try {
    const { orgId } = await validarAccesoPlan("finanzas");
    
    const resultados = await db
      .select({
        id: gastos_evento.id,
        monto: gastos_evento.monto,
        descripcion: gastos_evento.descripcion,
        fecha_gasto: gastos_evento.fecha_gasto,
        url_comprobante: gastos_evento.url_comprobante,
        clasificacion: clasificaciones_gasto.nombre,
      })
      .from(gastos_evento)
      .leftJoin(clasificaciones_gasto, eq(gastos_evento.clasificacion_id, clasificaciones_gasto.id))
      .where(and(
        eq(gastos_evento.evento_id, eventoId),
        eq(gastos_evento.organizacion_id, orgId)
      ))
      .orderBy(desc(gastos_evento.fecha_gasto));

    return { success: true, data: resultados };
  } catch (error) {
    console.error("Error al obtener gastos:", error);
    return { success: false, data: [], error: "No se pudieron cargar los gastos" };
  }
}

/**
 * Obtiene las categorías de gastos disponibles.
 */
export async function getClasificacionesGasto() {
  try {
    const { orgId } = await validarAccesoPlan("finanzas");
    const resultados = await db
      .select()
      .from(clasificaciones_gasto)
      .where(eq(clasificaciones_gasto.organizacion_id, orgId))
      .orderBy(clasificaciones_gasto.nombre);
    
    // Si no hay categorías, crear las básicas por defecto
    if (resultados.length === 0) {
      const basicas = ["Alimentación", "Hospedaje", "Materiales", "Transporte", "Publicidad", "Varios"];
      await db.insert(clasificaciones_gasto).values(
        basicas.map(n => ({ nombre: n, organizacion_id: orgId }))
      );
      return { success: true, data: await db.select().from(clasificaciones_gasto).where(eq(clasificaciones_gasto.organizacion_id, orgId)) };
    }

    return { success: true, data: resultados };
  } catch (error) {
    return { success: false, data: [] };
  }
}

/**
 * Registra un nuevo gasto para un evento.
 */
export async function crearGasto(data: {
  evento_id: string;
  clasificacion_id: string;
  monto: string;
  descripcion?: string;
  fecha_gasto: string;
  url_comprobante?: string;
}) {
  try {
    const { orgId, session } = await validarAccesoPlan("finanzas");

    const [nuevoGasto] = await db
      .insert(gastos_evento)
      .values({
        ...data,
        organizacion_id: orgId,
        registrado_por: (session.user as any).usuario_id,
      })
      .returning();

    revalidatePath(`/dashboard/eventos/${data.evento_id}`);
    return { success: true, data: nuevoGasto };
  } catch (error) {
    console.error("Error al crear gasto:", error);
    return { success: false, error: "Error al registrar el gasto" };
  }
}

/**
 * Elimina un gasto.
 */
export async function eliminarGasto(id: string, eventoId: string) {
  try {
    const { orgId } = await validarAccesoPlan("finanzas");
    await db
      .delete(gastos_evento)
      .where(and(eq(gastos_evento.id, id), eq(gastos_evento.organizacion_id, orgId)));

    revalidatePath(`/dashboard/eventos/${eventoId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "No se pudo eliminar el gasto" };
  }
}

/**
 * Calcula el resumen de rentabilidad de un evento.
 * Ingresos (Inscripciones pagadas) vs Gastos.
 */
export async function getResumenFinancieroEvento(eventoId: string) {
  try {
    const { orgId } = await validarAccesoPlan("finanzas");

    // 1. Sumar ingresos de inscripciones
    const [ingresos] = await db
      .select({ total: sql<string>`sum(pago_deposito + pago_efectivo)` })
      .from(solicitudes_inscripcion)
      .where(and(
        eq(solicitudes_inscripcion.evento_id, eventoId),
        eq(solicitudes_inscripcion.organizacion_id, orgId)
      ));

    // 2. Sumar gastos
    const [gastos] = await db
      .select({ total: sum(gastos_evento.monto) })
      .from(gastos_evento)
      .where(and(
        eq(gastos_evento.evento_id, eventoId),
        eq(gastos_evento.organizacion_id, orgId)
      ));

    const totalIngresos = parseFloat(ingresos?.total || "0");
    const totalGastos = parseFloat(gastos?.total || "0");
    const balance = totalIngresos - totalGastos;
    const margen = totalIngresos > 0 ? (balance / totalIngresos) * 100 : 0;

    return {
      success: true,
      data: {
        ingresos: totalIngresos,
        gastos: totalGastos,
        balance,
        margen: margen.toFixed(2)
      }
    };
  } catch (error) {
    console.error("Error al calcular resumen financiero:", error);
    return { success: false, data: { ingresos: 0, gastos: 0, balance: 0, margen: 0 } };
  }
}
