export function toDateKey(date: Date): string {
  return date.toLocaleDateString("sv-SE"); // YYYY-MM-DD, local time
}

export function toMonthKey(date: Date): string {
  return toDateKey(date).slice(0, 7); // YYYY-MM
}

export function daysInMonth(monthKey: string): Date[] {
  const [year, month] = monthKey.split("-").map(Number);
  const count = new Date(year, month, 0).getDate();
  return Array.from({ length: count }, (_, i) => new Date(year, month - 1, i + 1));
}

export function addMonths(monthKey: string, delta: number): string {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  return toMonthKey(date);
}

const WEEKDAY_LABELS = ["日", "一", "二", "三", "四", "五", "六"];

export function weekdayLabel(date: Date): string {
  return WEEKDAY_LABELS[date.getDay()];
}

export function formatMonthTitle(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  return `${year} 年 ${month} 月`;
}

export function addYears(year: string, delta: number): string {
  return String(Number(year) + delta);
}

export function monthShortLabel(monthKey: string): string {
  const [, month] = monthKey.split("-").map(Number);
  return String(month);
}
