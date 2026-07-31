import Link from "next/link";

export default function Home() {
  return (
    <div className="p-8 max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4 text-[var(--foreground)]">Live Sports Tracker</h1>
      <p className="text-[var(--muted)] mb-8">
        Follow your favorite teams, save them to your profile, and track today's matches.
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          href="/football"
          className="bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] px-6 py-3 rounded hover:bg-[var(--surface-hover)]"
        >
          ⚽ Football
        </Link>
        <Link
          href="/cricket"
          className="bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] px-6 py-3 rounded hover:bg-[var(--surface-hover)]"
        >
          🏏 Cricket
        </Link>
        <Link
          href="/search"
          className="bg-[var(--accent)] text-white px-6 py-3 rounded hover:bg-[var(--accent-hover)]"
        >
          Find a Team
        </Link>
      </div>
    </div>
  );
}