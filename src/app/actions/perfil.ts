"use server";

import { db } from "@/lib/db";
import { usuarios } from "@/lib/schema";
import { eq } from "drizzle-orm";

interface ActualizarPerfilInput {
  usuario_id: string;
  nombre_completo: string;
  celular?: string;
  fecha_nacimiento?: string;
  es_servidor: boolean;
  sede_id?: string;
}

/**
 * Actualiza los datos del perfil de un usuario.
 * Si marca "Soy Servidor" y selecciona sede, se actualiza sede_id.
 */
export async function actualizarPerfilAction(datos: ActualizarPerfilInput) {
  try {
    if (!datos.usuario_id) {
      return { ok: false, error: "Usuario no identificado." };
    }

    if (!datos.nombre_completo || datos.nombre_completo.trim().length < 3) {
      return { ok: false, error: "El nombre debe tener al menos 3 caracteres." };
    }

    const celularLimpio = datos.celular
      ? datos.celular.replace(/[\s\-\(\)]/g, "")
      : null;

    await db
      .update(usuarios)
      .set({
        nombre_completo: datos.nombre_completo.trim(),
        celular: celularLimpio,
        fecha_nacimiento: datos.fecha_nacimiento || null,
        es_servidor: datos.es_servidor,
        sede_id: datos.es_servidor && datos.sede_id ? datos.sede_id : null,
      })
      .where(eq(usuarios.id, datos.usuario_id));

    return { ok: true };
  } catch (error: any) {
    console.error("Error actualizando perfil:", error);

    if (error.code === "23505" && error.detail?.includes("celular")) {
      return { ok: false, error: "Este número de celular ya está registrado por otro usuario." };
    }

    return { ok: false, error: "Error al guardar. Por favor intenta de nuevo." };
  }
}
