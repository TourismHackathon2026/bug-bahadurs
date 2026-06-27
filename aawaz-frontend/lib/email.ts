import nodemailer from "nodemailer"

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: Number(process.env.SMTP_PORT) || 1025,
  secure: false,
  auth: process.env.SMTP_USER
    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    : undefined,
  ignoreTLS: !process.env.SMTP_USER,
})

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string
  subject: string
  text: string
  html?: string
}): Promise<void> {
  if (!process.env.SMTP_HOST && process.env.NODE_ENV === "production") {
    console.warn("[Email] SMTP not configured. Skipping email.")
    return
  }

  try {
    await transport.sendMail({
      from: process.env.EMAIL_FROM || "noreply@awaaz.gov.np",
      to,
      subject,
      text,
      html: html || text.replace(/\n/g, "<br>"),
    })
  } catch (err) {
    console.error("[Email] Failed to send email", err)
  }
}
