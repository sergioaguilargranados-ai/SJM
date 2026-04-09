/**
 * Servicio de Email para SJM — Usa Resend directamente desde el servidor
 * A diferencia de ERPCubox (que usa proxy PHP), Next.js puede llamar Resend
 * directamente desde Server Actions o API Routes.
 * 
 * NOTA: La instancia de Resend se crea de forma lazy para evitar errores
 * durante el build de Next.js cuando la API key no está disponible.
 */

import { Resend } from "resend";

// Inicialización lazy de Resend (evita crash durante build)
let _resend: Resend | null = null;
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

// Email del remitente según si el dominio está verificado o no
const REMITENTE_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const REMITENTE_NOMBRE = "Servidores de Jesús por María";

interface EnviarEmailParams {
  para: string | string[];
  asunto: string;
  html: string;
  adjuntos?: Array<{
    filename: string;
    content: string; // base64
  }>;
}

interface EmailResult {
  ok: boolean;
  id?: string;
  error?: string;
}

/**
 * Envía un email usando Resend API desde el servidor (Server Action)
 * No necesita proxy PHP porque Next.js ejecuta esto server-side.
 */
export async function enviarEmail(params: EnviarEmailParams): Promise<EmailResult> {
  try {
    const resend = getResend();
    if (!resend) {
      console.warn("⚠️ RESEND_API_KEY no configurada. Email no enviado.");
      return { ok: false, error: "Servicio de email no configurado." };
    }

    const destinatarios = Array.isArray(params.para) ? params.para : [params.para];

    const { data, error } = await resend.emails.send({
      from: `${REMITENTE_NOMBRE} <${REMITENTE_EMAIL}>`,
      to: destinatarios,
      subject: params.asunto,
      html: params.html,
      attachments: params.adjuntos,
    });

    if (error) {
      console.error("❌ Error Resend:", error);
      return { ok: false, error: error.message };
    }

    console.log(`✅ Email enviado: ${data?.id} → ${destinatarios.join(", ")}`);
    return { ok: true, id: data?.id };
  } catch (err: any) {
    console.error("❌ Error enviando email:", err);
    return { ok: false, error: err.message || "Error desconocido al enviar email." };
  }
}
