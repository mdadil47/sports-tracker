"use client";

import { useState } from "react";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { Skeleton } from "@/components/Skeleton";

interface Team {
  idTeam: string;
  strTeam: string;
  strBadge: string;
  strLeague: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const res = await fetch(`/api/teams/search?name=${encodeURIComponent(query)}`);
    const data = await res.json();
    setTeams(data);
    setLoading(false);
  }

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight text-center">Find a Team</h1>
      <p className="text-[var(--muted)] mb-6 text-sm text-center">Search any football or cricket team to follow.</p>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-8">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Arsenal, Mumbai Indians"
            className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] rounded-full pl-10 pr-4 py-2.5 placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--gradient-end)]"
          />
        </div>
        <button
          type="submit"
          className="gradient-bg text-white px-6 py-2.5 rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          Search
        </button>
      </form>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 border border-[var(--border)] bg-[var(--surface)] rounded-2xl p-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      )}

      <ul className="space-y-3">
        {teams.map((team) => (
          <li
            key={team.idTeam}
            className="card-hover flex items-center gap-3 border border-[var(--border)] bg-[var(--surface)] rounded-2xl p-4"
          >
            <Link href={`/team/${team.idTeam}`} className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0">
                <img src={team.strBadge} alt={team.strTeam} className="w-8 h-8 object-contain" />
              </div>
              <div>
                <p className="font-semibold hover:underline">{team.strTeam}</p>
                <p className="text-sm text-[var(--muted)]">{team.strLeague}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}