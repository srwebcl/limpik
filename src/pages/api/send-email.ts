export const prerender = false; // This is an API route, so it must not be prerendered

import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { business, PRIVACY_POLICY_VERSION, SITE_URL } from '../../data/business';

type FormType = 'contact' | 'recruitment' | 'complaint';

const MAX_FIELD = 5000;
const MAX_ATTACHMENT_BYTES = 3 * 1024 * 1024;
const ALLOWED_CV_EXT = /\.(pdf|doc|docx)$/i;

// Todo texto del usuario se escapa antes de insertarlo en el HTML del correo
function esc(value: unknown): string {
  return String(value ?? '')
    .slice(0, MAX_FIELD)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function clean(value: unknown, max = 300): string {
  return String(value ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function json(body: object, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function row(label: string, value: unknown, fallback = 'No especificado') {
  const v = String(value ?? '').trim();
  return `<p><strong>${label}:</strong> ${v ? esc(v) : fallback}</p>`;
}

function consentBlock(lines: string[]) {
  return `
    <div style="background:#f1f5f9;padding:12px 15px;margin-top:20px;font-size:12px;color:#475569;">
      <strong>Registro de consentimiento (Ley 21.719)</strong><br />
      ${lines.join('<br />')}
    </div>`;
}

function folio() {
  const d = new Date();
  const ymd = d.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase().padStart(6, '0').slice(0, 6);
  return `DEN-${ymd}-${rand}`;
}

const wrap = (inner: string) =>
  `<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">${inner}</div>`;

export const POST: APIRoute = async ({ request }) => {
  if (!process.env.RESEND_API_KEY) {
    return json({ message: 'Missing RESEND_API_KEY' }, 500);
  }

  let body: Record<string, any>;
  try {
    body = await request.json();
  } catch {
    return json({ message: 'Solicitud inválida' }, 400);
  }

  // Honeypot anti-spam: campo oculto que una persona nunca completa
  if (body.website) {
    return json({ message: 'Email sent successfully' }, 200);
  }

  const type: FormType =
    body.type === 'recruitment' || body.type === 'complaint' ? body.type : 'contact';
  const receivedAt = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });

  const consent = body.consent ?? {};
  if (!consent.privacy) {
    return json({ message: 'Debe aceptar la Política de Privacidad' }, 400);
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  let toEmail: string[];
  let subject: string;
  let notificationHtml: string;
  let replyTo: string | undefined;
  let attachments: { content: string; filename: string }[] = [];
  let autoReply: { to: string; subject: string; html: string } | null = null;
  let responseExtra: Record<string, string> = {};

  const consentLines = [
    `Fecha: ${receivedAt}`,
    `Política de Privacidad aceptada: versión ${esc(consent.policyVersion || PRIVACY_POLICY_VERSION)}`,
  ];

  if (type === 'complaint') {
    const anonymous = !!body.anonymous;
    const email = anonymous ? '' : clean(body.email, 200);
    const description = String(body.description ?? '').trim();
    if (!clean(body.incidentType) || !clean(body.incidentDate) || !description) {
      return json({ message: 'Faltan campos obligatorios' }, 400);
    }
    if (!anonymous && (!clean(body.fullName) || !isEmail(email))) {
      return json({ message: 'Faltan datos de identificación' }, 400);
    }

    const id = folio();
    responseExtra = { folio: id };
    toEmail = [business.complaintsEmail];
    // El asunto no incluye nombres: suele verse en notificaciones y bandejas compartidas
    subject = `[CONFIDENCIAL] Denuncia Ley Karin ${id} - ${clean(body.incidentType, 60)}`;
    replyTo = email || undefined;
    notificationHtml = wrap(`
      <h2 style="color:#b91c1c;">Nueva denuncia – Canal Ley Karin</h2>
      <p><strong>Folio:</strong> ${id}<br /><strong>Recibida:</strong> ${esc(receivedAt)}</p>
      <p style="background:#fef2f2;padding:10px 15px;border-left:4px solid #b91c1c;font-size:13px;">
        Información confidencial. Acceso restringido a las personas a cargo de la investigación (Ley N° 21.643).
      </p>
      <h3 style="color:#1e3a8a;">Denunciante</h3>
      ${anonymous
        ? '<p><strong>Denuncia anónima.</strong></p>'
        : row('Nombre', body.fullName) + row('RUT', body.rut) + row('Email', email) + row('Teléfono', body.phone) + row('Relación con la empresa', body.relation)}
      <h3 style="color:#1e3a8a;">Incidente</h3>
      ${row('Tipo', body.incidentType)}
      ${row('Fecha aproximada', body.incidentDate)}
      <p><strong>Descripción de los hechos:</strong></p>
      <p style="white-space:pre-wrap;">${esc(description)}</p>
      ${consentBlock([...consentLines, 'El denunciante declaró haber leído la información sobre tratamiento de datos del Canal de Denuncias.'])}
    `);
    if (email) {
      autoReply = {
        to: email,
        subject: `Hemos recibido su denuncia (folio ${id}) - Limpik`,
        html: wrap(`
          <h2 style="color:#1e3a8a;">Denuncia recibida</h2>
          <p>Hemos recibido su denuncia con el folio <strong>${id}</strong>.</p>
          <p>La persona encargada se pondrá en contacto con usted dentro de los plazos que establece la Ley N° 21.643. La información se trata de forma confidencial.</p>
          <p style="font-size:12px;color:#888;">Sus datos se tratan según nuestra <a href="${SITE_URL}/politica-de-privacidad">Política de Privacidad</a>.</p>
        `),
      };
    }
  } else {
    const name = clean(body.name, 150);
    const email = clean(body.email, 200);
    const phone = clean(body.phone, 40);
    if (!name || !isEmail(email) || !phone) {
      return json({ message: 'Faltan campos obligatorios' }, 400);
    }
    replyTo = email;

    if (type === 'recruitment') {
      toEmail = [business.recruitmentEmail];
      subject = `Nueva Postulación: ${name}`;
      const futureConsent = !!consent.futureProcesses;

      const files = Array.isArray(body.attachments) ? body.attachments.slice(0, 1) : [];
      for (const f of files) {
        const filename = clean(f?.filename, 150);
        const content = String(f?.content ?? '');
        const bytes = Math.floor((content.length * 3) / 4);
        if (!ALLOWED_CV_EXT.test(filename) || bytes > MAX_ATTACHMENT_BYTES) {
          return json({ message: 'Archivo no permitido (PDF, DOC o DOCX de hasta 3MB)' }, 400);
        }
        attachments.push({ content, filename });
      }

      notificationHtml = wrap(`
        <h2 style="color:#1e3a8a;">Nueva Postulación desde Limpik.cl</h2>
        ${row('Nombre', name)}${row('Email', email)}${row('Teléfono', phone)}
        <p><strong>Experiencia:</strong></p>
        <p style="white-space:pre-wrap;">${esc(body.message) || 'Sin mensaje.'}</p>
        <p><strong>CV adjunto:</strong> ${attachments.length ? 'Sí' : 'No'}</p>
        ${consentBlock([
          ...consentLines,
          futureConsent
            ? 'Autoriza conservar sus datos para futuros procesos: SÍ (conservar hasta 24 meses).'
            : 'Autoriza conservar sus datos para futuros procesos: NO (eliminar a los 6 meses).',
        ])}
      `);
    } else {
      toEmail = [business.email];
      subject = `Nuevo Contacto: ${clean(body.company, 120)} - ${name}`;
      notificationHtml = wrap(`
        <h2 style="color:#1e3a8a;">Nuevo Contacto desde Limpik.cl</h2>
        ${row('Nombre', name)}${row('Email', email)}${row('Teléfono', phone)}
        ${row('Empresa', body.company)}${row('Dirección', body.address, 'No especificada')}${row('Servicio', body.service)}
        <div style="background:#f9f9f9;padding:15px;border-left:4px solid #1e3a8a;margin-top:15px;">
          <h3 style="margin-top:0;color:#1e3a8a;font-size:16px;">Detalles del Requerimiento</h3>
          ${row('Dotación requerida', body.staff, 'No especificada')}
          ${row('Horario de trabajo', body.schedule)}
          ${row('Frecuencia del servicio', body.frequency, 'No especificada')}
          ${row('Cantidad de M2', body.area, 'No especificada')}
          <p><strong>Mensaje Adicional:</strong></p>
          <p style="white-space:pre-wrap;">${esc(body.message) || 'Sin mensaje adicional.'}</p>
        </div>
        ${consentBlock(consentLines)}
      `);
    }

    autoReply = {
      to: email,
      subject: 'Hemos recibido su mensaje - Limpik',
      html: wrap(`
        <div style="text-align:center;margin-bottom:20px;">
          <img src="${business.logo}" alt="Limpik" style="max-width:150px;height:auto;" />
        </div>
        <h2 style="color:#1e3a8a;text-align:center;">¡Hemos recibido su mensaje!</h2>
        <p>Hola <strong>${esc(name)}</strong>,</p>
        <p>Gracias por contactar a <strong>Limpik</strong>. Hemos recibido su ${type === 'recruitment' ? 'postulación' : 'solicitud'} correctamente.</p>
        <p>Nos pondremos en contacto con usted dentro de las próximas 24 horas hábiles.</p>
        <p>Si tiene alguna consulta adicional, puede escribirnos a ${business.email}.</p>
        <div style="text-align:center;margin-top:30px;">
          <a href="${SITE_URL}" style="background-color:#ea580c;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;font-weight:bold;">Visitar Sitio Web</a>
        </div>
        <hr style="border:0;border-top:1px solid #eee;margin:30px 0;" />
        <p style="font-size:12px;color:#888;text-align:center;">
          Sus datos se tratan según nuestra <a href="${SITE_URL}/politica-de-privacidad">Política de Privacidad</a>.
          Para ejercer sus derechos escriba a ${business.privacyEmail}.<br />
          © ${new Date().getFullYear()} ${business.legalName}.
        </p>
      `),
    };
  }

  try {
    const { error: errorAdmin } = await resend.emails.send({
      from: 'Limpik Web <noreply@limpik.cl>',
      to: toEmail,
      subject,
      html: notificationHtml,
      replyTo,
      attachments,
    });

    if (errorAdmin) {
      console.error('Error sending admin email:', errorAdmin.name, errorAdmin.message);
      return json({ message: 'Error sending email' }, 500);
    }

    if (autoReply) {
      const { error: errorUser } = await resend.emails.send({
        from: 'Limpik Contacto <noreply@limpik.cl>',
        to: [autoReply.to],
        subject: autoReply.subject,
        html: autoReply.html,
      });
      if (errorUser) {
        console.error('Error sending auto-reply:', errorUser.name, errorUser.message);
      }
    }

    return json({ message: 'Email sent successfully', ...responseExtra }, 200);
  } catch (e) {
    console.error('send-email failed:', e instanceof Error ? e.message : 'Unknown error');
    return json({ message: 'Error sending email' }, 500);
  }
};
