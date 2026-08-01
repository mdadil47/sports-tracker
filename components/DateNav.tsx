"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

function shiftDate(dateStr: string, days: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export default function DateNav({ currentDate }: { currentDate: string }) {
  const router = useRouter();
  const pathname = usePathname();

  function goTo(date: string) {
    router.push(`${pathname}?date=${date}`);
  }

  return (
    <div className="flex items-center gap-3 mb-6">
      <button
        onClick={() => goTo(shiftDate(currentDate, -1))}
        className="border border-[var(--border)] text-[var(--foreground)] rounded px-3 py-1 hover:bg-[var(--surface-hover)]"
      >
        ← Prev
      </button>

      <input
        type="date"
        value={currentDate}
        onChange={(e) => goTo(e.target.value)}
        className="border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] rounded px-3 py-1"
      />

      <button
        onClick={() => goTo(shiftDate(currentDate, 1))}
        className="border border-[var(--border)] text-[var(--foreground)] rounded px-3 py-1 hover:bg-[var(--surface-hover)]"
      >
        Next →
      </button>

      <button
        onClick={() => goTo(new Date().toISOString().split("T")[0])}
        className="text-sm text-[var(--accent)] hover:underline"
      >
        Today
      </button>
    </div>
  );
}