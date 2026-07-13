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
    id: "tagore-5",
    poet: "রবীন্দ্রনাথ ঠাকুর",
    text: "আমরা দুজনে মিলে একটি গান গাইব—একটি নীরব সুর, কেবল হৃদয় শুনবে।",
    kind: "flower",
    position: [4.8, 0.95, 7.1],
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
    id: "nazrul-3",
    poet: "কাজী নজরুল ইসলাম",
    text: "প্রেমে যদি প্রাণ যায়, তবু প্রেম করিব আমি—এই শপথ ফুলের মতো নরম, তবু অটল।",
    kind: "sakura",
    position: [11.2, 0, -3.6],
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
    id: "jiban-3",
    poet: "জীবনানন্দ দাশ",
    text: "সব ইতিহাস মুছে গেলেও একটি মানুষের চোখের দৃষ্টি থেকে যায়—নক্ষত্রের মতো।",
    kind: "flower",
    position: [-11.4, 0.95, -5.2],
  },
  {
    id: "sukanta-1",
    poet: "সুকান্ত ভট্টাচার্য",
    text: "একটি ফুলের জন্যও যদি কেউ অপেক্ষা করে, তবে পৃথিবী একেবারে নিঃসঙ্গ নয়।",
    kind: "flower",
    position: [0.2, 0.95, 7.4],
  },
  {
    id: "sukanta-2",
    poet: "সুকান্ত ভট্টাচার্য",
    text: "যে প্রেম কেবল নিজের জন্য চায়, সে প্রেম নয়—সে ক্ষুধা। প্রেম অন্যের আলো চায়।",
    kind: "sakura",
    position: [-4.2, 0, 10.2],
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
    id: "rumi-3",
    poet: "Rumi",
    text: "The wound is the place where the Light enters you.",
    kind: "sakura",
    position: [-12.2, 0, 0.8],
  },
  {
    id: "shakespeare-1",
    poet: "Shakespeare",
    text: "Love looks not with the eyes, but with the mind.",
    kind: "flower",
    position: [-1.6, 0.95, -8.2],
  },
  {
    id: "shakespeare-2",
    poet: "Shakespeare",
    text: "Love is not love which alters when it alteration finds.",
    kind: "flower",
    position: [10.6, 0.95, 6.4],
  },
  {
    id: "hafiz-1",
    poet: "Hafiz",
    text: "I wish I could show you, when you are lonely or in darkness, the astonishing light of your own being.",
    kind: "sakura",
    position: [3.4, 0, 12.0],
  },
  {
    id: "gibran-1",
    poet: "Kahlil Gibran",
    text: "Love one another, but make not a bond of love: let it rather be a moving sea between the shores of your souls.",
    kind: "flower",
    position: [-7.8, 0.95, -9.4],
  },
];
