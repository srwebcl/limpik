
export const prerender = false; // This is an API route, so it must not be prerendered

import { Resend } from 'resend';

export const POST = async ({ request }) => {
    const body = await request.json();
    const { name, email, phone, company, service, message } = body;

    const resend = new Resend(process.env.RESEND_API_KEY);

    if (!process.env.RESEND_API_KEY) {
        return new Response(
            JSON.stringify({
                message: 'Missing RESEND_API_KEY',
            }),
            { status: 500 }
        );
    }

    // HTML content for the notification email (to the client)
    const notificationHtml = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e3a8a;">Nuevo Contacto desde Limpik.cl</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Teléfono:</strong> ${phone}</p>
      <p><strong>Empresa:</strong> ${company}</p>
      <p><strong>Servicio:</strong> ${service}</p>
      <p><strong>Mensaje:</strong></p>
      <blockquote style="background: #f9f9f9; padding: 15px; border-left: 4px solid #1e3a8a;">
        ${message}
      </blockquote>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888;">Este correo fue enviado desde el formulario de contacto de Limpik.</p>
    </div>
  `;

    // HTML content for the simplified auto-reply email (to the user)
    const autoReplyHtml = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://limpik.cl/images/logo.png" alt="Limpik Logo" style="max-width: 150px; height: auto;" />
      </div>
      <h2 style="color: #1e3a8a; text-align: center;">¡Hemos recibido su mensaje!</h2>
      <p>Hola <strong>${name}</strong>,</p>
      <p>Gracias por contactar a <strong>Limpik</strong>. Hemos recibido su solicitud correctamente y nuestro equipo comercial la revisará a la brevedad.</p>
      <p>Nos pondremos en contacto con usted dentro de las próximas 24 horas hábiles para atender sus requerimientos de limpieza profesional.</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold; color: #1e3a8a;">Resumen de su solicitud:</p>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Servicio:</strong> ${service}</li>
          <li><strong>Empresa:</strong> ${company}</li>
        </ul>
      </div>
      <p>Si tiene alguna urgencia, puede escribirnos directamente a nuestro WhatsApp.</p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://limpik.cl" style="background-color: #ea580c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Visitar Sitio Web</a>
      </div>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
      <p style="font-size: 12px; color: #888; text-align: center;">© ${new Date().getFullYear()} Limpik. Todos los derechos reservados.</p>
    </div>
  `;

    try {
        // 1. Send notification to the client (Limpik)
        const { error: errorAdmin } = await resend.emails.send({
            from: 'Limpik Web <noreply@limpik.cl>', // Updated to use a generic sender
            to: ['clientes@limpik.cl'],
            subject: `Nuevo Contacto: ${company} - ${name}`,
            html: notificationHtml,
            replyTo: email,
        });

        if (errorAdmin) {
            console.error('Error sending admin email:', errorAdmin);
            return new Response(JSON.stringify({ message: 'Error sending email', error: errorAdmin }), { status: 500 });
        }

        // 2. Send auto-reply to the user
        // We don't block the response on this failure, but we log it.
        const { error: errorUser } = await resend.emails.send({
            from: 'Limpik Contacto <noreply@limpik.cl>',
            to: [email],
            subject: 'Hemos recibido su mensaje - Limpik',
            html: autoReplyHtml,
        });

        if (errorUser) {
            console.error('Error sending user auto-reply:', errorUser);
        }

        return new Response(
            JSON.stringify({
                message: 'Email sent successfully',
            }),
            { status: 200 }
        );
    } catch (e) {
        console.error(e);
        return new Response(
            JSON.stringify({
                message: e.message,
            }),
            { status: 500 }
        );
    }
};
