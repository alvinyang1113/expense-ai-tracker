"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FEATURES = [
  { icon: "🤖", label: "AI 自動分析花費" },
  { icon: "👪", label: "家人共同記帳" },
  { icon: "📊", label: "月度年度統計" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "登入失敗");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生未知錯誤");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-strong px-6 pb-16 pt-[calc(3rem+env(safe-area-inset-top))] text-primary-foreground">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

        <div className="relative flex flex-col items-center gap-3 text-center">
          <span className="hero-shadow flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-3xl backdrop-blur">
            🧾
          </span>
          <h1 className="text-2xl font-bold tracking-tight">
            Alvin的AI家庭記帳本
          </h1>
          <p className="text-sm text-primary-foreground/80">
            用一句話記帳，AI 幫你自動分析
          </p>
        </div>

        <div className="relative mt-6 grid grid-cols-3 gap-2">
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="flex flex-col items-center gap-1 rounded-2xl bg-white/10 px-2 py-3 text-center backdrop-blur"
            >
              <span className="text-lg">{f.icon}</span>
              <span className="text-[11px] leading-tight text-primary-foreground/90">
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative -mt-10 flex-1 px-6 pb-10">
        <div className="card-shadow flex flex-col gap-5 rounded-3xl bg-surface p-7">
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-lg font-semibold text-foreground">歡迎回來</h2>
            <p className="text-sm text-muted">登入以繼續</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl bg-surface-muted px-4 py-3 text-sm text-foreground outline-none ring-1 ring-transparent transition-shadow focus:ring-primary/50"
            />
            <input
              type="password"
              required
              placeholder="密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl bg-surface-muted px-4 py-3 text-sm text-foreground outline-none ring-1 ring-transparent transition-shadow focus:ring-primary/50"
            />

            {error && (
              <p className="rounded-xl bg-danger/10 p-3 text-sm font-medium text-danger">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="hero-shadow mt-2 rounded-full bg-gradient-to-br from-primary to-primary-strong py-3 font-medium text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "登入中..." : "登入"}
            </button>
          </form>

          <p className="text-center text-sm text-muted">
            還沒有帳號？{" "}
            <Link href="/register" className="font-semibold text-primary">
              註冊
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
