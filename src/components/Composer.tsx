"use client";

import { useState } from "react";

export function Composer({
  onSubmit,
}: {
  onSubmit: (text: string) => Promise<void>;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || loading) return;

    setLoading(true);
    try {
      await onSubmit(text);
      setText("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 bg-surface/90 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="輸入花費，例如：午餐吃麵 120元"
        className="flex-1 rounded-full bg-surface-muted px-4 py-2.5 text-sm text-foreground outline-none ring-1 ring-transparent transition-shadow focus:ring-primary/50"
      />
      <button
        type="submit"
        disabled={loading || !text.trim()}
        className="hero-shadow flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-90 disabled:opacity-40 disabled:active:scale-100"
      >
        {loading ? "…" : "↑"}
      </button>
    </form>
  );
}
