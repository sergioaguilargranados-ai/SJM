/**
 * Servicio de WhatsApp para SJM — Usa Twilio
 * Basado en el patrón de AS Operadora (MessagingService.ts)
 * Adaptado para Next.js con inicialización lazy (igual que Resend).
 * 
 * Por ahora solo envío unidireccional (bienvenida, recuperación).
 * El Centro de Comunicación completo (bidireccional + webhooks) se
 * implementará en una fase posterior.
 */

import Twilio from "twilio";

// Inicialización lazy del cliente Twilio (evita crash en build)
let _twilioClient: ReturnType<typeof Twilio> | null = null;
function getTwilioClient() {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) return null;
  if (!_twilioClient) {
    _twilioClient = Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }
  return _twilioClient;
}

const WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_NUMBER || "+14155238886"; // Sandbox default

interface WhatsAppResult {
  ok: boolean;
  sid?: string;
  error?: string;
}

/**
 * Envía un mensaje de WhatsApp vía Twilio.
 * El número debe incluir código de país (ej: +5215512345678)
 */
export async function enviarWhatsApp(
  para: string,
  mensaje: string
): Promise<WhatsAppResult> {
  try {
    const client = getTwilioClient();
    if (!client) {
      console.warn("⚠️ Twilio no configurado. WhatsApp no enviado.");
      return { ok: false, error: "Servicio de WhatsApp no configurado." };
    }

    // Limpiar y formatear número
    let numero = para.replace(/[\s\-\(\)]/g, "");
    if (!numero.startsWith("+")) {
      // Asumir México si no tiene código de país
      numero = numero.startsWith("52") ? `+${numero}` : `+52${numero}`;
    }

    const message = await client.messages.create({
      body: mensaje,
      from: `whatsapp:${WHATSAPP_FROM}`,
      to: `whatsapp:${numero}`,
    });

    console.log(`✅ WhatsApp enviado: ${message.sid} → ${numero}`);
    return { ok: true, sid: message.sid };
  } catch (err: any) {
    console.error("❌ Error enviando WhatsApp:", err.message);
    return { ok: false, error: err.message || "Error al enviar WhatsApp." };
  }
}

// ─── Mensajes predefinidos para SJM ────────────────────────────

/**
 * Mensaje de bienvenida por WhatsApp
 */
export function mensajeBienvenidaWhatsApp(nombre: string): string {
  return `🕊️ *¡Bienvenido/a a Servidores de Jesús por María!*

Hola ${nombre}, tu cuenta ha sido creada exitosamente en la Plataforma SJM.

Ahora puedes:
📋 Inscribirte a retiros y eventos
🛍️ Realizar compras en nuestra tienda
💝 Hacer donativos
📄 Consultar tu historial

Visita 👉 serjema.com/dashboard para comenzar.

_Para Gloria de Dios_ ✝️
— SJM Nacional`;
}

/**
 * Mensaje de recuperación de contraseña por WhatsApp
 */
export function mensajeRecuperacionWhatsApp(nombre: string, enlace: string): string {
  return `🔐 *Recuperar Contraseña — SJM*

Hola ${nombre}, recibimos tu solicitud para restablecer tu contraseña.

Haz clic en el siguiente enlace:
👉 ${enlace}

⏰ Este enlace expira en *1 hora*.

Si no solicitaste este cambio, ignora este mensaje.

— SJM Nacional | serjema.com`;
}
