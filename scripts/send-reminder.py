#!/usr/bin/env python3
"""
Send গুলবাহার garden reminders over free Gmail SMTP.

Required GitHub secrets:
  GMAIL_USER  — e.g. arnob.bnk@gmail.com
  GMAIL_APP_PASSWORD — Google App Password (not your normal password)

Optional:
  REMINDER_TO — defaults to GMAIL_USER
  REMINDER_FIRST=1 — force the first "Are you still playing?" email
"""

from __future__ import annotations

import os
import smtplib
import ssl
import sys
from datetime import datetime, timezone
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from html import escape

GAME_URL = "https://bonrakinab.github.io/if-you-knew-me/"

REMINDER_QUOTES = [
    {
        "line": "Are you still playing the game?",
        "quote": "The garden remembers every quiet step you take.",
    },
    {
        "line": "The meadow is waiting for you.",
        "quote": "চেষ্টা করলে সবই সম্ভব — even the softest return.",
    },
    {
        "line": "Come walk among the sakura again.",
        "quote": "Faith coins shine brightest when you return after rest.",
    },
    {
        "line": "A letter is still glowing in the garden.",
        "quote": "যেথায় ভালোবাসা আছে, সেখানেই পথ খুলে যায়।",
    },
    {
        "line": "Before you start today — breathe, then enter.",
        "quote": "অসম্ভবও একদিন পথ হয়ে ওঠে।",
    },
    {
        "line": "The bees are buzzing. The shelter trees miss you.",
        "quote": "Stand under a poem-tree; the world softens around you.",
    },
    {
        "line": "Ready for another quiet wander?",
        "quote": "Love is a garden you visit, not a race you finish.",
    },
    {
        "line": "Your constellation still has room for stars.",
        "quote": "One flower, one faith coin — that is enough for today.",
    },
]


def pick_reminder(force_first: bool) -> dict[str, str]:
    if force_first:
        return REMINDER_QUOTES[0]
    day = int(datetime.now(timezone.utc).timestamp() // 86400)
    return REMINDER_QUOTES[day % len(REMINDER_QUOTES)]


def build_email(force_first: bool) -> tuple[str, str, str, dict[str, str]]:
    pick = pick_reminder(force_first)
    subject = (
        "Are you still playing the game? — গুলবাহার"
        if force_first
        else f"{pick['line']} — গুলবাহার"
    )
    text = "\n".join(
        [
            pick["line"],
            "",
            pick["quote"],
            "",
            "Before you start the game, hold this line for a moment.",
            "Then open the garden when you are ready:",
            GAME_URL,
            "",
            "— গুলবাহার",
        ]
    )
    html = f"""<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f1ea;font-family:Georgia,'Times New Roman',serif;color:#1c2430;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f1ea;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:520px;background:#fffdf8;border:1px solid rgba(28,36,48,0.12);padding:28px 24px;">
            <tr>
              <td>
                <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#5f7f6c;">গুলবাহার</p>
                <h1 style="margin:0 0 16px;font-size:22px;font-weight:500;line-height:1.35;">{escape(pick["line"])}</h1>
                <p style="margin:0 0 20px;font-size:17px;line-height:1.55;font-style:italic;color:#3a4554;">“{escape(pick["quote"])}”</p>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.5;color:#4a5563;">
                  Before you start the game, keep this quote close — then wander the garden when you are ready.
                </p>
                <p style="margin:0 0 28px;">
                  <a href="{GAME_URL}" style="display:inline-block;background:#5f7f6c;color:#fffdf8;text-decoration:none;padding:12px 18px;font-size:14px;letter-spacing:0.03em;">
                    Open the garden
                  </a>
                </p>
                <p style="margin:0;font-size:12px;color:#8a93a0;">Sent every few days from your গুলবাহার reminder (Gmail SMTP).</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>"""
    return subject, text, html, pick


def main() -> int:
    user = (os.environ.get("GMAIL_USER") or "").strip()
    password = (os.environ.get("GMAIL_APP_PASSWORD") or "").strip().replace(" ", "")
    to_addr = (os.environ.get("REMINDER_TO") or user or "arnob.bnk@gmail.com").strip()
    force_first = os.environ.get("REMINDER_FIRST") == "1"

    if not user or not password:
        print(
            "Missing GMAIL_USER or GMAIL_APP_PASSWORD.\n"
            "1) Turn on 2-Step Verification for your Google account\n"
            "2) Create an App Password: https://myaccount.google.com/apppasswords\n"
            "3) Add repo secrets GMAIL_USER and GMAIL_APP_PASSWORD",
            file=sys.stderr,
        )
        return 1

    subject, text, html, pick = build_email(force_first)
    from_header = f"গুলবাহার <{user}>"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = from_header
    msg["To"] = to_addr
    msg.attach(MIMEText(text, "plain", "utf-8"))
    msg.attach(MIMEText(html, "html", "utf-8"))

    context = ssl.create_default_context()
    with smtplib.SMTP("smtp.gmail.com", 587, timeout=60) as server:
        server.starttls(context=context)
        server.login(user, password)
        server.sendmail(user, [to_addr], msg.as_string())

    print(f'Sent reminder to {to_addr} · line="{pick["line"]}"')
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
