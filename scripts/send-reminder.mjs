/**
 * Sends a গুলবাহার garden reminder via Resend.
 * Requires env: RESEND_API_KEY
 * Optional: REMINDER_TO, REMINDER_FROM, REMINDER_FIRST=1
 */
import { buildEmail } from "./reminder-quotes.mjs";

const API_KEY = process.env.RESEND_API_KEY?.trim();
const TO = (process.env.REMINDER_TO || "arnob.bnk@gmail.com").trim();
const FROM = (
  process.env.REMINDER_FROM || "গুলবাহার <onboarding@resend.dev>"
).trim();
const forceFirst = process.env.REMINDER_FIRST === "1";

if (!API_KEY) {
  console.error(
    "Missing RESEND_API_KEY. Create a free key at https://resend.com and set it as a GitHub Actions secret.",
  );
  process.exit(1);
}

const { subject, text, html, pick } = buildEmail({ forceFirst });

const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from: FROM,
    to: [TO],
    subject,
    text,
    html,
  }),
});

const body = await res.json().catch(() => ({}));
if (!res.ok) {
  console.error("Resend error:", res.status, body);
  process.exit(1);
}

console.log(
  `Sent reminder to ${TO} · id=${body.id ?? "?"} · line="${pick.line}"`,
);
