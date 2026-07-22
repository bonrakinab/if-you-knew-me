/** Motivational lines for garden reminder emails. */
export const REMINDER_QUOTES = [
  {
    line: "Are you still playing the game?",
    quote: "The garden remembers every quiet step you take.",
  },
  {
    line: "The meadow is waiting for you.",
    quote: "চেষ্টা করলে সবই সম্ভব — even the softest return.",
  },
  {
    line: "Come walk among the sakura again.",
    quote: "Faith coins shine brightest when you return after rest.",
  },
  {
    line: "A letter is still glowing in the garden.",
    quote: "যেথায় ভালোবাসা আছে, সেখানেই পথ খুলে যায়।",
  },
  {
    line: "Before you start today — breathe, then enter.",
    quote: "অসম্ভবও একদিন পথ হয়ে ওঠে।",
  },
  {
    line: "The bees are buzzing. The shelter trees miss you.",
    quote: "Stand under a poem-tree; the world softens around you.",
  },
  {
    line: "Ready for another quiet wander?",
    quote: "Love is a garden you visit, not a race you finish.",
  },
  {
    line: "Your constellation still has room for stars.",
    quote: "One flower, one faith coin — that is enough for today.",
  },
];

export const GAME_URL = "https://bonrakinab.github.io/if-you-knew-me/";

export function pickReminder(forceFirst = false) {
  if (forceFirst) return REMINDER_QUOTES[0];
  const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return REMINDER_QUOTES[day % REMINDER_QUOTES.length];
}

export function buildEmail({ forceFirst = false } = {}) {
  const pick = pickReminder(forceFirst);
  const subject = forceFirst
    ? "Are you still playing the game? — গুলবাহার"
    : `${pick.line} — গুলবাহার`;

  const text = [
    pick.line,
    "",
    pick.quote,
    "",
    "Before you start the game, hold this line for a moment.",
    "Then open the garden when you are ready:",
    GAME_URL,
    "",
    "— গুলবাহার",
  ].join("\n");

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f1ea;font-family:Georgia,'Times New Roman',serif;color:#1c2430;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f1ea;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:520px;background:#fffdf8;border:1px solid rgba(28,36,48,0.12);padding:28px 24px;">
            <tr>
              <td>
                <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#5f7f6c;">গুলবাহার</p>
                <h1 style="margin:0 0 16px;font-size:22px;font-weight:500;line-height:1.35;">${escapeHtml(pick.line)}</h1>
                <p style="margin:0 0 20px;font-size:17px;line-height:1.55;font-style:italic;color:#3a4554;">“${escapeHtml(pick.quote)}”</p>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.5;color:#4a5563;">
                  Before you start the game, keep this quote close — then wander the garden when you are ready.
                </p>
                <p style="margin:0 0 28px;">
                  <a href="${GAME_URL}" style="display:inline-block;background:#5f7f6c;color:#fffdf8;text-decoration:none;padding:12px 18px;font-size:14px;letter-spacing:0.03em;">
                    Open the garden
                  </a>
                </p>
                <p style="margin:0;font-size:12px;color:#8a93a0;">Sent every few days from your গুলবাহার reminder.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, text, html, pick };
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
