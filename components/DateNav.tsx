"use client";

import { useRouter, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

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

  const isToday = currentDate === new Date().toISOString().split("T")[0];

  return (
    <div className="flex items-center justify-center gap-2 mb-6 bg-[var(--surface)] border border-[var(--border)] rounded-full p-1.5 w-fit mx-auto">
      <button
        onClick={() => goTo(shiftDate(currentDate, -1))}
        className="p-2 rounded-full hover:bg-[var(--surface-hover)] transition-colors text-[var(--foreground)]"
        aria-label="Previous day"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <label className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface-hover)] text-sm cursor-pointer">
        <Calendar className="w-4 h-4 text-[var(--muted)]" />
        <input
          type="date"
          value={currentDate}
          onChange={(e) => goTo(e.target.value)}
          className="bg-transparent outline-none text-[var(--foreground)] [color-scheme:dark]"
        />
      </label>

      <button
        onClick={() => goTo(shiftDate(currentDate, 1))}
        className="p-2 rounded-full hover:bg-[var(--surface-hover)] transition-colors text-[var(--foreground)]"
        aria-label="Next day"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {!isToday && (
        <button
          onClick={() => goTo(new Date().toISOString().split("T")[0])}
          className="ml-1 text-xs gradient-bg text-white px-3 py-1.5 rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          Today
        </button>
      )}
    </div>
  );
}