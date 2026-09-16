"use client";

type Tab = "record" | "stats";

export function BottomNav({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (tab: Tab) => void;
}) {
  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "record", label: "記帳", icon: "🧾" },
    { key: "stats", label: "統計", icon: "📊" },
  ];

  return (
    <nav className="flex gap-1 bg-surface p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-2 text-xs font-medium transition-colors ${
            active === tab.key
              ? "bg-primary/10 text-primary"
              : "text-muted"
          }`}
        >
          <span className="text-lg">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
