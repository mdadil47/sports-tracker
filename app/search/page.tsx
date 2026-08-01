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

interface Player {
  idPlayer: string;
  strPlayer: string;
  strCutout: string;
  strThumb: string;
  strTeam: string;
  strPosition: string;
}

export default function SearchPage() {
  const [mode, setMode] = useState<"teams" | "players">("teams");
  const [query, setQuery] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    if (mode === "teams") {
      const res = await fetch(`/api/teams/search?name=${encodeURIComponent(query)}`);
      const data = await res.json();
      setTeams(data);
    } else {
      const res = await fetch(`/api/players/search?name=${encodeURIComponent(query)}`);
      const data = await res.json();
      setPlayers(data);
    }
    setLoading(false);
  }

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight text-center">Find a Team or Player</h1>
      <p className="text-[var(--muted)] mb-6 text-sm text-center">Search football and cricket teams or players.</p>

      {/* Mode toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-full p-1 flex gap-1">
          <button
            onClick={() => setMode("teams")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              mode === "teams" ? "gradient-bg text-white" : "text-[var(--muted)]"
            }`}
          >
            Teams
          </button>
          <button
            onClick={() => setMode("players")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              mode === "players" ? "gradient-bg text-white" : "text-[var(--muted)]"
            }`}
          >
            Players
          </button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-8">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={mode === "teams" ? "e.g. Arsenal, Mumbai Indians" : "e.g. Bukayo Saka, Virat Kohli"}
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

      {mode === "teams" && (
        <ul className="space-y-3">
          {teams.map((team) => (
            <li key={team.idTeam} className="card-hover flex items-center gap-3 border border-[var(--border)] bg-[var(--surface)] rounded-2xl p-4">
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
      )}

      {mode === "players" && (
        <ul className="space-y-3">
          {players.map((player) => (
            <li key={player.idPlayer} className="card-hover flex items-center gap-3 border border-[var(--border)] bg-[var(--surface)] rounded-2xl p-4">
              <Link href={`/player/${player.idPlayer}`} className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0">
                  {(player.strCutout || player.strThumb) && (
                    <img src={player.strCutout || player.strThumb} alt={player.strPlayer} className="w-full h-full object-cover" />
                  )}
                </div>
                <div>
                  <p className="font-semibold hover:underline">{player.strPlayer}</p>
                  <p className="text-sm text-[var(--muted)]">{player.strTeam} · {player.strPosition}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}