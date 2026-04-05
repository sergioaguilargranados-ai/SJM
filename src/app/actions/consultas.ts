"use server";

import { db } from "@/lib/db";
import { solicitudes_inscripcion, servidores, usuarios, sedes } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";

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
