import Link from "next/link";
import { Search, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-73px)] flex flex-col items-center justify-center px-4 sm:px-8 text-center">
      <div className="max-w-2xl">
        <div className="inline-block mb-4 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--muted)]">
          Live scores · Standings · Saved teams
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold mb-4 tracking-tight">
          Never miss a <span className="gradient-text">match</span>
        </h1>

        <p className="text-[var(--muted)] mb-10 text-base sm:text-lg max-w-lg mx-auto">
          Follow football and cricket teams, track live standings, and get personalized match updates in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-16">
          <Link
            href="/search"
            className="gradient-bg text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Find a Team
          </Link>
          <Link
            href="/football"
            className="border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] px-6 py-3 rounded-full font-medium hover:bg-[var(--surface-hover)] transition-colors flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            View Live Scores
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <Link
            href="/football"
            className="card-hover bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 text-left"
          >
            <p className="text-2xl mb-1">⚽</p>
            <p className="font-semibold">Football</p>
            <p className="text-sm text-[var(--muted)]">EPL, La Liga & more</p>
          </Link>
          <Link
            href="/cricket"
            className="card-hover bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 text-left"
          >
            <p className="text-2xl mb-1">🏏</p>
            <p className="font-semibold">Cricket</p>
            <p className="text-sm text-[var(--muted)]">IPL, Big Bash & more</p>
          </Link>
        </div>
      </div>
    </div>
  );
}