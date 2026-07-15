/**
 * Motivational quote shown on every garden open, and emailed to her
 * via FormSubmit (works from a static site — no server, no API key).
 * NOTE: the very first email FormSubmit sends is an activation request;
 * the inbox owner must click "Activate" once before quotes start arriving.
 */

const EMAIL = "banhihalder863@gmail.com";
const SIGN_OFF = "— রংধনু";

export const MOTIVATION_QUOTES: string[] = [
  "আজকের ছোট্ট একটি পদক্ষেপও আগামীকালের বড় পথের শুরু।",
  "তুমি যতটা ভাবো, তার চেয়ে অনেক বেশি শক্তি তোমার ভেতরে আছে।",
  "ধীরে চলো, কিন্তু থেমো না—ফুল ফুটতেও সময় লাগে।",
  "কঠিন দিনগুলোই একদিন সবচেয়ে সুন্দর গল্প হয়ে ওঠে।",
  "নিজের প্রতি একটু দয়া রেখো; তুমি যথেষ্ট চেষ্টা করছ।",
  "আকাশ মেঘলা হলেও সূর্য কোথাও হারায় না।",
  "প্রতিটি নতুন সকাল মানে নতুন করে শুরু করার আরেকটি সুযোগ।",
  "যে স্বপ্ন তোমাকে ঘুমাতে দেয় না, সেটির পেছনে লেগে থাকো।",
  "ক্লান্ত লাগলে বিশ্রাম নাও, কিন্তু হাল ছেড়ো না।",
  "তোমার হাসিটাই কারও দিনের সবচেয়ে উজ্জ্বল আলো হতে পারে।",
  "ভুল মানে ব্যর্থতা নয়—ভুল মানে তুমি চেষ্টা করেছ।",
  "নদী পাথর কেটে পথ বানায় শক্তিতে নয়, লেগে থাকায়।",
  "আজ যা কঠিন মনে হচ্ছে, কাল তা তোমার শক্তির গল্প হবে।",
  "নিজেকে অন্যের সাথে তুলনা কোরো না; চাঁদ আর সূর্য আলাদা সময়ে আলো দেয়।",
];

export function pickQuote(): string {
  const i = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
  return MOTIVATION_QUOTES[i]!;
}

export function getSignOff(): string {
  return SIGN_OFF;
}

export async function sendMotivationEmail(quote: string): Promise<boolean> {
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: "আজকের কথা — প্রেয়সীপাড় 🌸",
        _template: "box",
        _captcha: "false",
        message: `${quote}\n\n${SIGN_OFF}`,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
