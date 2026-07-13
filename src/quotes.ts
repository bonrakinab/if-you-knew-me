export type PoetQuote = {
  id: string;
  poet: string;
  text: string;
  kind: "flower" | "sakura";
  position: [number, number, number];
};

export const poetQuotes: PoetQuote[] = [
  {
    id: "tagore-1",
    poet: "রবীন্দ্রনাথ ঠাকুর",
    text: "যেথায় থাকে সকলের অধম দীনের হতে দীন, সেইখানেতে রয়েছ দাঁড়ায়ে হে মোর অভমানী।",
    kind: "sakura",
    position: [-8.5, 0, -2.5],
  },
  {
    id: "tagore-2",
    poet: "রবীন্দ্রনাথ ঠাকুর",
    text: "আমার প্রাণের পরে চলে গেল কে গো, চলে গেল বল নাই কথা। শুধু বায়ু বহে যায়, শুধু মেঘ চলে যায় আকাশের পথে।",
    kind: "flower",
    position: [2.2, 0.95, -2.8],
  },
  {
    id: "tagore-3",
    poet: "রবীন্দ্রনাথ ঠাকুর",
    text: "তুমি যদি নাও দেখা দাও, তবু যেন তোমারই গানের সুর মনে থাকে।",
    kind: "sakura",
    position: [9.2, 0, 2.4],
  },
  {
    id: "tagore-4",
    poet: "রবীন্দ্রনাথ ঠাকুর",
    text: "এই যে আলোকের খেলা, এই যে ফুলের হাসি—এই নিয়েই জীবন ভরে উঠুক।",
    kind: "flower",
    position: [-2.4, 0.9, 5.8],
  },
  {
    id: "nazrul-1",
    poet: "কাজী নজরুল ইসলাম",
    text: "মোর প্রিয়া হবে এসো রানি, ফুলের মতো ফুটে থাকো মোর প্রাণে।",
    kind: "flower",
    position: [6.4, 0.95, 4.2],
  },
  {
    id: "nazrul-2",
    poet: "কাজী নজরুল ইসলাম",
    text: "আমি কবি, আমি প্রেমিক—আমার গানে ফুল ফোটে, আমার চোখে স্বপ্ন জাগে।",
    kind: "sakura",
    position: [-9.5, 0, 5.5],
  },
  {
    id: "jiban-1",
    poet: "জীবনানন্দ দাশ",
    text: "হাজার বছর ধরে আমি পথ হাঁটিতেছি পৃথিবীর পথে, সিংহল সমুদ্র থেকে নিশিথের অন্ধকারে।",
    kind: "sakura",
    position: [8.8, 0, -7.2],
  },
  {
    id: "jiban-2",
    poet: "জীবনানন্দ দাশ",
    text: "অন্ধকারে একা হেঁটে যেতে যেতে হঠাৎ কোনো ফুলের গন্ধ এসে থামায়—তখন মনে হয় কেউ কাছে আছে।",
    kind: "flower",
    position: [-6.8, 0.9, 1.2],
  },
  {
    id: "sukanta-1",
    poet: "সুকান্ত ভট্টাচার্য",
    text: "একটি ফুলের জন্যও যদি কেউ অপেক্ষা করে, তবে পৃথিবী একেবারে নিঃসঙ্গ নয়।",
    kind: "flower",
    position: [0.2, 0.95, 7.4],
  },
  {
    id: "rumi-1",
    poet: "রুমি",
    text: "What you seek is seeking you.",
    kind: "sakura",
    position: [0.5, 0, -10.5],
  },
  {
    id: "rumi-2",
    poet: "Rumi",
    text: "Let yourself be silently drawn by the strange pull of what you really love.",
    kind: "flower",
    position: [7.6, 0.9, -2.2],
  },
  {
    id: "shakespeare-1",
    poet: "Shakespeare",
    text: "Love looks not with the eyes, but with the mind.",
    kind: "flower",
    position: [-1.6, 0.95, -8.2],
  },
];
