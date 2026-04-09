"use server";

import { db } from "@/lib/db";
import { usuarios, roles_sistema } from "@/lib/schema";
import { eq, and, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { enviarEmail } from "@/lib/emailService";
import { plantillaBienvenidaSJM } from "@/lib/emailTemplate";

const ORG_NACIONAL_ID = "6fb191cc-a477-4632-9cb1-c30c33a9f9bd";

interface RegistroInput {
  nombre_completo: string;
  correo?: string;
  celular?: string;
  contrasena: string;
  fecha_nacimiento?: string;
}

interface RegistroResult {
  ok: boolean;
  error?: string;
}

/**
 * Registra un nuevo usuario con correo o celular + contraseña.
 * Asigna automáticamente el rol "General".
 */
export async function registrarUsuarioAction(
  datos: RegistroInput
): Promise<RegistroResult> {
  try {
    // 1. Validaciones básicas
    if (!datos.nombre_completo || datos.nombre_completo.trim().length < 3) {
      return { ok: false, error: "El nombre completo debe tener al menos 3 caracteres." };
    }

    if (!datos.correo && !datos.celular) {
      return { ok: false, error: "Debes proporcionar un correo electrónico o un número de celular." };
    }

    if (!datos.contrasena || datos.contrasena.length < 8) {
      return { ok: false, error: "La contraseña debe tener al menos 8 caracteres." };
    }

    // Validación de contraseña: al menos 1 mayúscula y 1 número
    if (!/[A-Z]/.test(datos.contrasena)) {
      return { ok: false, error: "La contraseña debe incluir al menos una letra mayúscula." };
    }
    if (!/[0-9]/.test(datos.contrasena)) {
      return { ok: false, error: "La contraseña debe incluir al menos un número." };
    }

    // 2. Verificar que no exista un usuario con el mismo correo o celular
    if (datos.correo) {
      const [existente] = await db
        .select({ id: usuarios.id })
        .from(usuarios)
        .where(eq(usuarios.correo, datos.correo.toLowerCase().trim()));

      if (existente) {
        return { ok: false, error: "Ya existe una cuenta con este correo electrónico. ¿Deseas iniciar sesión?" };
      }
    }

    if (datos.celular) {
      const celularLimpio = datos.celular.replace(/[\s\-\(\)]/g, "");
      const [existente] = await db
        .select({ id: usuarios.id })
        .from(usuarios)
        .where(eq(usuarios.celular, celularLimpio));

      if (existente) {
        return { ok: false, error: "Ya existe una cuenta con este número de celular. ¿Deseas iniciar sesión?" };
      }
    }

    // 3. Obtener o crear el rol General
    let [rolGeneral] = await db
      .select({ id: roles_sistema.id })
      .from(roles_sistema)
      .where(
        and(
          eq(roles_sistema.organizacion_id, ORG_NACIONAL_ID),
          eq(roles_sistema.nombre, "General")
        )
      );

    if (!rolGeneral) {
      [rolGeneral] = await db
        .insert(roles_sistema)
        .values({
          organizacion_id: ORG_NACIONAL_ID,
          nombre: "General",
          es_admin_sistema: false,
        })
        .returning({ id: roles_sistema.id });
    }

    // 4. Hashear la contraseña
    const contrasenaHash = await bcrypt.hash(datos.contrasena, 12);

    // 5. Crear el usuario
    const celularLimpio = datos.celular
      ? datos.celular.replace(/[\s\-\(\)]/g, "")
      : null;

    // Si el registro es por celular y no tiene correo, generar un correo placeholder
    const correoFinal = datos.correo
      ? datos.correo.toLowerCase().trim()
      : `cel_${celularLimpio}@serjema.com`;

    await db.insert(usuarios).values({
      organizacion_id: ORG_NACIONAL_ID,
      correo: correoFinal,
      celular: celularLimpio,
      nombre_completo: datos.nombre_completo.trim(),
      contrasena_hash: contrasenaHash,
      fecha_nacimiento: datos.fecha_nacimiento || null,
      rol_id: rolGeneral.id,
    });

    // 6. Enviar email de bienvenida (no bloqueante)
    if (datos.correo) {
      const { asunto, html } = plantillaBienvenidaSJM(datos.nombre_completo.trim());
      enviarEmail({ para: correoFinal, asunto, html }).catch((err) =>
        console.error("Error enviando email de bienvenida:", err)
      );
    }

    return { ok: true };
  } catch (error: any) {
    console.error("Error en registrarUsuarioAction:", error);

    // Manejar errores de unicidad
    if (error.code === "23505") {
      if (error.detail?.includes("correo")) {
        return { ok: false, error: "Ya existe una cuenta con este correo electrónico." };
      }
      if (error.detail?.includes("celular")) {
        return { ok: false, error: "Ya existe una cuenta con este número de celular." };
      }
    }

    return { ok: false, error: "Ocurrió un error inesperado. Por favor intenta de nuevo." };
  }
}
