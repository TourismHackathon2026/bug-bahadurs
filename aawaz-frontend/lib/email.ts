import nodemailer from "nodemailer"
import { addEmailJob, isEmailQueueEnabled } from "@/lib/email-queue"

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: Number(process.env.SMTP_PORT) || 1025,
  secure: false,
  auth: process.env.SMTP_USER
    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    : undefined,
  ignoreTLS: !process.env.SMTP_USER,
})

const APP_NAME = "Awaaz"
const EMAIL_LOGO_URL = process.env.EMAIL_LOGO_URL?.trim()
const APP_ORIGIN =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  process.env.APP_URL?.replace(/\/$/, "") ||
  "http://localhost:3000"

const EMAIL_BRAND_URL = APP_ORIGIN

function buildAbsoluteUrl(path: string): string {
  if (!APP_ORIGIN) return path
  return path.startsWith("/") ? `${EMAIL_BRAND_URL}${path}` : `${EMAIL_BRAND_URL}/${path}`
}

export function getAppOrigin(): string {
  return APP_ORIGIN
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function textToHtml(value: string): string {
  return value
    .split(/\n{2,}/)
    .map((block) => `<p style="margin:0 0 16px;">${escapeHtml(block).replace(/\n/g, "<br>")}</p>`)
    .join("")
}

function renderEmailHtml(subject: string, text: string, bodyHtml?: string, complaintLink?: string): string {
  const previewText = escapeHtml(text.split("\n").find((line) => line.trim().length > 0) || subject)
  const safeBody = bodyHtml || textToHtml(text)
  const brandLinkStart = EMAIL_BRAND_URL ? `<a href="${escapeHtml(EMAIL_BRAND_URL)}" style="text-decoration:none;">` : ""
  const brandLinkEnd = EMAIL_BRAND_URL ? "</a>" : ""
  const safeComplaintLink = complaintLink ? buildAbsoluteUrl(complaintLink) : ""
  const logoMarkup = EMAIL_LOGO_URL
    ? `<img src="${escapeHtml(EMAIL_LOGO_URL)}" alt="${APP_NAME} logo" width="40" height="40" style="display:block;border:0;outline:none;text-decoration:none;border-radius:12px;object-fit:cover;">`
    : `<div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg, #0f766e 0%, #14b8a6 55%, #fb7185 100%);color:#ffffff;font:700 18px/40px Arial, sans-serif;text-align:center;letter-spacing:-0.04em;">A</div>`

  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f5f3ee;font-family:Arial, Helvetica, sans-serif;color:#15313a;">
    <span style="display:none !important;visibility:hidden;mso-hide:all;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${previewText}</span>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:linear-gradient(180deg, #f8f6f1 0%, #eef5f4 100%);padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;width:100%;">
            <tr>
              <td style="padding:0 0 16px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td align="center" style="padding:0 0 12px;">
                      ${brandLinkStart}
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;">
                        <tr>
                          <td style="padding:0 12px 0 0;">${logoMarkup}</td>
                          <td style="vertical-align:middle;text-align:left;">
                            <div style="font-size:12px;line-height:1.2;letter-spacing:0.22em;text-transform:uppercase;color:#5a6f77;margin-bottom:4px;">Civic updates</div>
                            <div style="font-size:24px;line-height:1.1;font-weight:700;color:#102c35;">${APP_NAME}</div>
                          </td>
                        </tr>
                      </table>
                      ${brandLinkEnd}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background:#ffffff;border:1px solid #d9e2df;border-radius:24px;overflow:hidden;box-shadow:0 18px 40px rgba(16, 44, 53, 0.08);">
                <div style="height:8px;background:linear-gradient(90deg, #0f766e 0%, #14b8a6 45%, #fb7185 100%);"></div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="padding:40px 40px 12px;">
                      <div style="display:inline-block;padding:7px 12px;border-radius:999px;background:#edf9f7;color:#0f766e;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Official notification</div>
                      <h1 style="margin:18px 0 0;font-size:28px;line-height:1.15;color:#102c35;font-weight:700;">${escapeHtml(subject)}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 40px 8px;">
                      <div style="font-size:16px;line-height:1.7;color:#29434c;">
                        ${safeComplaintLink ? `<div style="margin:0 0 18px;padding:16px;border:1px solid #d9e2df;border-radius:18px;background:#f8faf9;">` : ""}
                        ${safeComplaintLink ? `<div style="font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#5a6f77;margin-bottom:8px;">Complaint reference</div>` : ""}
                        ${safeComplaintLink ? `<a href="${escapeHtml(safeComplaintLink)}" style="display:inline-block;font-size:15px;font-weight:700;color:#0f766e;text-decoration:none;word-break:break-all;">${escapeHtml(safeComplaintLink.replace(/^.*\//, ""))}</a>` : ""}
                       
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 40px 40px;">
                      <div style="border-top:1px solid #e6ece9;padding-top:20px;font-size:13px;line-height:1.6;color:#667984;">
                        This message was sent automatically by ${APP_NAME}. Please do not reply to this email.
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 6px 0;text-align:center;font-size:12px;line-height:1.6;color:#70848d;">
                Keeping residents and visitors informed with timely updates.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

async function sendEmailImmediate({
  to,
  subject,
  text,
  html,
  complaintLink,
}: {
  to: string
  subject: string
  text: string
  html?: string
  complaintLink?: string
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
      html: renderEmailHtml(subject, text, html, complaintLink),
    })
  } catch (err) {
    console.error("[Email] Failed to send email", err)
  }
}

export async function sendEmail({
  to,
  subject,
  text,
  html,
  complaintLink,
}: {
  to: string
  subject: string
  text: string
  html?: string
  complaintLink?: string
}): Promise<void> {
  if (isEmailQueueEnabled()) {
    try {
      await addEmailJob({ to, subject, text, html, complaintLink })
      return
    } catch (err) {
      console.error("[Email] Failed to enqueue email job, falling back to direct send", err)
    }
  }

  await sendEmailImmediate({ to, subject, text, html, complaintLink })
}

export { sendEmailImmediate }
