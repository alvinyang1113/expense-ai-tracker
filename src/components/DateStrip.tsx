"use client";

import { useEffect, useRef } from "react";
import { daysInMonth, toDateKey, weekdayLabel } from "@/lib/date";

export function DateStrip({
  monthKey,
  selectedDate,
  onSelect,
}: {
  monthKey: string;
  selectedDate: string;
  onSelect: (date: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);
  const todayKey = toDateKey(new Date());

  useEffect(() => {
    selectedRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [monthKey, selectedDate]);

  return (
    <div
      ref={containerRef}
      className="flex gap-2 overflow-x-auto scroll-smooth px-4 pb-1 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: "none" }}
    >
      {daysInMonth(monthKey).map((date) => {
        const key = toDateKey(date);
        const isSelected = key === selectedDate;
        const isToday = key === todayKey;

        return (
          <button
            key={key}
            ref={isSelected ? selectedRef : undefined}
            onClick={() => onSelect(key)}
            className={`flex shrink-0 snap-center flex-col items-center gap-1 rounded-2xl px-3 py-2 transition-all active:scale-95 ${
              isSelected
                ? "bg-primary text-primary-foreground hero-shadow"
                : "bg-surface text-muted card-shadow"
            }`}
          >
            <span className="text-[11px]">{weekdayLabel(date)}</span>
            <span className="text-sm font-semibold">{date.getDate()}</span>
            <span
              className={`h-1 w-1 rounded-full ${
                isToday
                  ? isSelected
                    ? "bg-primary-foreground/70"
                    : "bg-primary"
                  : "bg-transparent"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
