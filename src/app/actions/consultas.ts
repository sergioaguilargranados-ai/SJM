"use server";

import { db } from "@/lib/db";
import { solicitudes_inscripcion } from "@/lib/schema";
import { desc } from "drizzle-orm";

export async function getInscripciones() {
  try {
    // En el futuro podemos filtrar por organizacion_id y evento_id
    const resultados = await db.select().from(solicitudes_inscripcion).orderBy(desc(solicitudes_inscripcion.creado_en));
    return { success: true, data: resultados };
  } catch (error) {
    console.error("Error al consultar inscripciones:", error);
    return { success: false, data: [], error: "No se pudieron cargar las inscripciones" };
  }
}
