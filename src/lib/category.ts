const CATEGORY_ICONS: Record<string, string> = {
  餐飲: "🍔",
  交通: "🚗",
  娛樂: "🎮",
  購物: "🛍️",
  薪資: "💰",
  醫療: "🏥",
  居家: "🏠",
  教育: "📚",
  旅遊: "✈️",
  通訊: "📱",
  訂閱: "📺",
  其他: "📦",
};

export function categoryIcon(category: string): string {
  return CATEGORY_ICONS[category] ?? "📦";
}

const PALETTE = [
  "#0a0a0a",
  "#262626",
  "#404040",
  "#525252",
  "#666666",
  "#7a7a7a",
  "#8f8f8f",
  "#a3a3a3",
];

export function categoryColor(category: string): string {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}
