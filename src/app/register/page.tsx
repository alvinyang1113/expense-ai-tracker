"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, inviteCode }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "註冊失敗");
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
      <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-strong px-6 pb-14 pt-[calc(2.5rem+env(safe-area-inset-top))] text-primary-foreground">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

        <div className="relative flex flex-col items-center gap-2 text-center">
          <span className="hero-shadow flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl backdrop-blur">
            🧾
          </span>
          <h1 className="text-xl font-bold tracking-tight">加入家庭記帳本</h1>
          <p className="text-sm text-primary-foreground/80">
            一起用 AI 記錄，全家花費一目瞭然
          </p>
        </div>
      </div>

      <div className="relative -mt-8 flex-1 px-6 pb-10">
        <div className="card-shadow flex flex-col gap-5 rounded-3xl bg-surface p-7">
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-lg font-semibold text-foreground">建立帳號</h2>
            <p className="text-sm text-muted">開始記錄你的花費</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              required
              placeholder="姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl bg-surface-muted px-4 py-3 text-sm text-foreground outline-none ring-1 ring-transparent transition-shadow focus:ring-primary/50"
            />
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
              minLength={6}
              placeholder="密碼（至少 6 個字元）"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl bg-surface-muted px-4 py-3 text-sm text-foreground outline-none ring-1 ring-transparent transition-shadow focus:ring-primary/50"
            />
            <input
              required
              placeholder="驗證碼"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
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
              {loading ? "註冊中..." : "註冊"}
            </button>
          </form>

          <p className="text-center text-sm text-muted">
            已經有帳號？{" "}
            <Link href="/login" className="font-semibold text-primary">
              登入
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
