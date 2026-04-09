"use server";

import { db } from "@/lib/db";
import { usuarios, tokens_recuperacion } from "@/lib/schema";
import { eq, and, gt } from "drizzle-orm";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { enviarEmail } from "@/lib/emailService";
import { buildEmailHTML } from "@/lib/emailTemplate";
import { enviarWhatsApp, mensajeRecuperacionWhatsApp } from "@/lib/whatsappService";

const DOMINIO = process.env.NEXTAUTH_URL || "https://serjema.com";

/**
 * Solicita la recuperación de contraseña.
 * Genera un token único, lo guarda en la DB y envía un email con el enlace.
 */
export async function solicitarRecuperacionAction(identificador: string) {
  try {
    if (!identificador || identificador.trim().length < 3) {
      return { ok: false, error: "Ingresa tu correo electrónico o número de celular." };
    }

    const valor = identificador.trim().toLowerCase();

    // Buscar usuario por correo o celular
    let usuario;
    let busquedaPorCelular = false;
    if (valor.includes("@")) {
      [usuario] = await db
        .select({ id: usuarios.id, correo: usuarios.correo, celular: usuarios.celular, nombre_completo: usuarios.nombre_completo, google_id: usuarios.google_id })
        .from(usuarios)
        .where(eq(usuarios.correo, valor));
    } else {
      busquedaPorCelular = true;
      const celularLimpio = valor.replace(/[\s\-\(\)]/g, "");
      [usuario] = await db
        .select({ id: usuarios.id, correo: usuarios.correo, celular: usuarios.celular, nombre_completo: usuarios.nombre_completo, google_id: usuarios.google_id })
        .from(usuarios)
        .where(eq(usuarios.celular, celularLimpio));
    }

    // Si no existe, devolvemos OK de todas formas (seguridad: no revelar si existe)
    if (!usuario) {
      return { ok: true };
    }

    // Si solo tiene Google y no tiene contraseña, dar mensaje especial
    if (usuario.google_id && !valor.includes("@")) {
      return { ok: true };
    }

    // Generar token único
    const token = randomUUID();
    const expiraEn = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // Guardar token en DB
    await db.insert(tokens_recuperacion).values({
      usuario_id: usuario.id,
      token,
      expira_en: expiraEn,
    });

    // Enviar email con enlace de recuperación
    const enlace = `${DOMINIO}/recuperar/${token}`;
    const html = buildEmailHTML({
      titulo: "Recuperar Contraseña",
      nombreDestinatario: usuario.nombre_completo,
      contenidoHTML: `
        <p style="margin: 0 0 16px; color: #374151; font-size: 15px; line-height: 1.8;">
          Recibimos una solicitud para restablecer tu contraseña en la <strong>Plataforma SJM</strong>.
        </p>
        <p style="margin: 0 0 24px; color: #374151; font-size: 15px; line-height: 1.8;">
          Haz clic en el siguiente botón para crear una nueva contraseña:
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center" style="padding: 8px 0;">
              <a href="${enlace}" 
                 style="display: inline-block; background: linear-gradient(135deg, #00B4AA 0%, #1E3A5F 100%);
                        color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none;
                        padding: 14px 36px; border-radius: 12px;
                        letter-spacing: 0.05em; text-transform: uppercase;">
                Restablecer Contraseña
              </a>
            </td>
          </tr>
        </table>
        <p style="margin: 24px 0 0; color: #9ca3af; font-size: 12px; line-height: 1.6;">
          Este enlace expira en <strong>1 hora</strong>. Si no solicitaste este cambio, puedes ignorar este correo.<br />
          <span style="font-size: 11px; color: #d1d5db;">Enlace: ${enlace}</span>
        </p>
      `,
    });

    // Enviar enlace por email
    enviarEmail({
      para: usuario.correo,
      asunto: "Recuperar Contraseña — SJM",
      html,
    }).catch((err) => console.error("Error enviando email de recuperación:", err));

    // Si buscaron por celular, también enviar por WhatsApp
    if (busquedaPorCelular && usuario.celular) {
      enviarWhatsApp(
        usuario.celular,
        mensajeRecuperacionWhatsApp(usuario.nombre_completo, enlace)
      ).catch((err) => console.error("Error enviando WhatsApp de recuperación:", err));
    }

    return { ok: true };
  } catch (error: any) {
    console.error("Error en solicitarRecuperacionAction:", error);
    return { ok: false, error: "Error inesperado. Por favor intenta de nuevo." };
  }
}

/**
 * Valida un token de recuperación.
 * Retorna si el token es válido y no ha expirado.
 */
export async function validarTokenAction(token: string) {
  try {
    const [registro] = await db
      .select({
        id: tokens_recuperacion.id,
        usuario_id: tokens_recuperacion.usuario_id,
        expira_en: tokens_recuperacion.expira_en,
        usado: tokens_recuperacion.usado,
      })
      .from(tokens_recuperacion)
      .where(eq(tokens_recuperacion.token, token));

    if (!registro) return { valido: false, error: "Enlace inválido o expirado." };
    if (registro.usado) return { valido: false, error: "Este enlace ya fue utilizado." };
    if (new Date() > new Date(registro.expira_en)) return { valido: false, error: "El enlace ha expirado. Solicita uno nuevo." };

    return { valido: true };
  } catch (error) {
    return { valido: false, error: "Error al validar el enlace." };
  }
}

/**
 * Restablece la contraseña usando un token válido.
 */
export async function restablecerContrasenaAction(token: string, nuevaContrasena: string) {
  try {
    // Validar contraseña
    if (!nuevaContrasena || nuevaContrasena.length < 8) {
      return { ok: false, error: "La contraseña debe tener al menos 8 caracteres." };
    }
    if (!/[A-Z]/.test(nuevaContrasena)) {
      return { ok: false, error: "La contraseña debe incluir al menos una letra mayúscula." };
    }
    if (!/[0-9]/.test(nuevaContrasena)) {
      return { ok: false, error: "La contraseña debe incluir al menos un número." };
    }

    // Buscar token
    const [registro] = await db
      .select()
      .from(tokens_recuperacion)
      .where(eq(tokens_recuperacion.token, token));

    if (!registro) return { ok: false, error: "Enlace inválido." };
    if (registro.usado) return { ok: false, error: "Este enlace ya fue utilizado." };
    if (new Date() > new Date(registro.expira_en)) return { ok: false, error: "El enlace ha expirado." };

    // Hash de la nueva contraseña
    const hash = await bcrypt.hash(nuevaContrasena, 12);

    // Actualizar contraseña del usuario
    await db
      .update(usuarios)
      .set({ contrasena_hash: hash })
      .where(eq(usuarios.id, registro.usuario_id));

    // Marcar token como usado
    await db
      .update(tokens_recuperacion)
      .set({ usado: true })
      .where(eq(tokens_recuperacion.id, registro.id));

    return { ok: true };
  } catch (error: any) {
    console.error("Error en restablecerContrasenaAction:", error);
    return { ok: false, error: "Error inesperado. Por favor intenta de nuevo." };
  }
}
