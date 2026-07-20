import nodemailer from "nodemailer";

let transporter;

function isMailEnabled() {
  return Boolean(process.env.SMTP_HOST && process.env.MAIL_TO);
}

function optionalAddress(value) {
  const address = value?.trim();
  return address || undefined;
}

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS
            }
          : undefined
    });
  }

  return transporter;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (first) => first.toUpperCase());
}

function buildEmail(type, payload, record) {
  const rows = Object.entries(payload)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(
      ([key, value]) => `
        <tr>
          <th align="left" style="padding:8px 12px;border-bottom:1px solid #dde7e1;color:#33423c;">${escapeHtml(
            formatLabel(key)
          )}</th>
          <td style="padding:8px 12px;border-bottom:1px solid #dde7e1;color:#12201c;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join("");

  const text = Object.entries(payload)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([key, value]) => `${formatLabel(key)}: ${value}`)
    .join("\n");

  return {
    subject: `BlinkRide ${type} submission`,
    text: `New BlinkRide ${type} submission\n\nRecord ID: ${record?._id || "pending"}\n\n${text}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:680px;color:#12201c;">
        <h1 style="font-size:22px;margin:0 0 12px;">New BlinkRide ${escapeHtml(type)} submission</h1>
        <p style="margin:0 0 18px;color:#607069;">Record ID: ${escapeHtml(record?._id || "pending")}</p>
        <table cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;border:1px solid #dde7e1;">
          ${rows}
        </table>
      </div>`
  };
}

export async function sendLeadEmail(type, payload, record) {
  if (!isMailEnabled()) {
    return {
      enabled: false,
      sent: false,
      message: "Email skipped. Configure SMTP_HOST and MAIL_TO to enable Nodemailer."
    };
  }

  const message = buildEmail(type, payload, record);
  const info = await getTransporter().sendMail({
    from:
      optionalAddress(process.env.MAIL_FROM) ||
      optionalAddress(process.env.SMTP_USER) ||
      "BlinkRide <no-reply@blinkride.local>",
    to: optionalAddress(process.env.MAIL_TO),
    cc: optionalAddress(process.env.MAIL_CC),
    bcc: optionalAddress(process.env.MAIL_BCC),
    replyTo: optionalAddress(payload.email),
    subject: message.subject,
    text: message.text,
    html: message.html
  });

  return {
    enabled: true,
    sent: true,
    messageId: info.messageId
  };
}
