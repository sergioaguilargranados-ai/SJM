/**
 * Plantilla HTML para emails de SJM
 * Usa tablas para compatibilidad con todos los clientes de correo
 * Colores institucionales: #00B4AA (primario), #1E3A5F (secundario)
 */

interface PlantillaEmailParams {
  titulo: string;
  nombreDestinatario: string;
  contenidoHTML: string;
  pieDePagina?: string;
}

export function plantillaBienvenidaSJM(nombre: string): { asunto: string; html: string } {
  const asunto = "¡Bienvenido/a a Servidores de Jesús por María! 🕊️";
  const html = buildEmailHTML({
    titulo: "Bienvenido a SJM",
    nombreDestinatario: nombre,
    contenidoHTML: `
      <p style="margin: 0 0 16px; color: #374151; font-size: 15px; line-height: 1.8;">
        Tu cuenta ha sido creada exitosamente en la <strong>Plataforma SJM</strong>.
      </p>
      <p style="margin: 0 0 16px; color: #374151; font-size: 15px; line-height: 1.8;">
        Ahora podrás:
      </p>
      <ul style="margin: 0 0 16px; padding-left: 20px; color: #374151; font-size: 14px; line-height: 2;">
        <li>📋 Inscribirte a retiros y eventos</li>
        <li>🛍️ Realizar compras en nuestra tienda</li>
        <li>💝 Hacer donativos para la misión</li>
        <li>📄 Consultar tu historial y recibos</li>
        <li>🔔 Recibir avisos de nuevos retiros</li>
      </ul>
      <p style="margin: 0 0 24px; color: #374151; font-size: 15px; line-height: 1.8;">
        Te invitamos a completar tu perfil para que podamos servirte mejor.
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding: 8px 0;">
            <a href="https://serjema.com/dashboard" 
               style="display: inline-block; background: linear-gradient(135deg, #00B4AA 0%, #1E3A5F 100%);
                      color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none;
                      padding: 14px 36px; border-radius: 12px;
                      letter-spacing: 0.05em; text-transform: uppercase;">
              Ir a Mi Dashboard &rarr;
            </a>
          </td>
        </tr>
      </table>
    `,
  });

  return { asunto, html };
}

export function buildEmailHTML({ titulo, nombreDestinatario, contenidoHTML, pieDePagina }: PlantillaEmailParams): string {
  const primario = '#00B4AA';
  const secundario = '#1E3A5F';
  const fondoGris = '#f8fafc';
  const cardBg = '#ffffff';
  const textoDark = '#1f2937';
  const textoMuted = '#6b7280';
  const bordeColor = '#e2e8f0';

  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${titulo} - SJM</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${fondoGris}; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${fondoGris};">
        <tr>
            <td align="center" style="padding: 30px 15px;">
                
                <!-- Card principal -->
                <table role="presentation" cellpadding="0" cellspacing="0" width="600" 
                       style="max-width: 600px; width: 100%; background-color: ${cardBg}; 
                              border-radius: 16px; overflow: hidden; 
                              box-shadow: 0 4px 24px rgba(0,0,0,0.06); 
                              border: 1px solid ${bordeColor};">
                    
                    <!-- Header con gradiente SJM -->
                    <tr>
                        <td style="background: linear-gradient(135deg, ${primario} 0%, ${secundario} 100%); padding: 0;">
                            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="padding: 28px 32px;" valign="middle">
                                        <img src="https://serjema.com/logo-sjm-oficial.png" alt="SJM" width="48" height="48" 
                                             style="border-radius: 10px; border: 2px solid rgba(255,255,255,0.3);" />
                                    </td>
                                    <td style="padding: 28px 32px; text-align: right;" valign="middle">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 800; letter-spacing: 0.02em;">${titulo}</h1>
                                        <p style="margin: 4px 0 0; color: rgba(255,255,255,0.7); font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">Servidores de Jesús por María</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Saludo + Contenido -->
                    <tr>
                        <td style="padding: 28px 32px 24px;">
                            <p style="margin: 0 0 16px; color: ${textoDark}; font-size: 16px;">
                                Hola <strong>${nombreDestinatario || 'participante'}</strong>,
                            </p>
                            <div style="color: ${textoMuted}; font-size: 14px; line-height: 1.7;">
                                ${contenidoHTML}
                            </div>
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 32px;">
                            <hr style="border: none; border-top: 1px solid ${bordeColor};" />
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 32px;">
                            <p style="margin: 0; color: ${textoMuted}; font-size: 12px; line-height: 1.6;">
                                <strong style="color: ${textoDark};">Servidores de Jesús por María</strong><br />
                                ${pieDePagina || 'sisepuede@serjema.com • serjema.com'}<br />
                            </p>
                            <p style="margin: 8px 0 0; color: #9ca3af; font-size: 11px;">
                                Este correo fue generado automáticamente. No respondas a este mensaje.<br />
                                © ${new Date().getFullYear()} SJM Nacional — Para Gloria de Dios
                            </p>
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>
</body>
</html>`;
}
