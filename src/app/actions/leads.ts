"use server";

import { db } from "@/lib/db";
import { leads_crm } from "@/lib/schema";
import { enviarEmail } from "@/lib/emailService";

export async function registrarLeadAction(formData: {
  nombre: string;
  correo: string;
  telefono: string;
  tipo_lead: string;
}) {
  try {
    // 1. Guardar en base de datos
    await db.insert(leads_crm).values({
      nombre: formData.nombre,
      correo: formData.correo,
      telefono: formData.telefono,
      tipo_lead: formData.tipo_lead,
      estatus: "NUEVO",
    });

    // 2. Enviar correo de confirmación
    const htmlCorreo = `
      <div style="font-family: Arial, sans-serif; color: #1c1c1e; line-height: 1.6; max-w-xl; margin: 0 auto;">
        <h2 style="color: #000000; font-family: Georgia, serif;">Hola, ${formData.nombre}.</h2>
        
        <p>Gracias por registrarte en <strong>AS Operadora de Viajes y Eventos</strong>.</p>
        
        <p>Hemos recibido correctamente tu solicitud de registro y la información proporcionada ha sido enviada a nuestro equipo para su revisión.</p>
        
        <p>Nuestro proceso de validación puede tomar hasta 30 días naturales. Durante este periodo verificaremos la información recibida para brindarte la mejor atención y habilitar los servicios que correspondan a tu perfil.</p>
        
        <p>Una vez concluida la revisión, recibirás una notificación por correo electrónico con la resolución de tu solicitud y los pasos a seguir.</p>
        
        <p>Agradecemos tu interés en formar parte de AS Operadora de Viajes y Eventos. Estamos comprometidos en ofrecer soluciones confiables para viajeros, agencias de viajes, agencias de eventos y empresas.</p>
        
        <p>Atentamente,</p>
        <p><strong>AS Operadora de Viajes y Eventos</strong></p>
        
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="font-size: 11px; color: #64748b; text-align: center;">
          Este es un correo automático. Por favor, no respondas a este mensaje (no-reply).
        </p>
      </div>
    `;

    // Truco para enviar como no-reply si el servidor lo permite
    // Asumimos que RESEND_FROM_EMAIL ya está configurado como algo similar a no-reply@asoperadora.com en .env
    await enviarEmail({
      para: formData.correo,
      asunto: "Confirmación de Registro - AS Operadora",
      html: htmlCorreo,
    });

    return { ok: true };
  } catch (error: any) {
    console.error("Error al registrar lead:", error);
    return { ok: false, error: "Ocurrió un error al procesar tu solicitud. Por favor intenta de nuevo." };
  }
}
