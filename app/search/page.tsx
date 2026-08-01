"use client";

import { useState, useEffect, useRef } from "react";
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function runSearch(searchQuery: string) {
    if (!searchQuery.trim()) {
      setTeams([]);
      setPlayers([]);
      return;
    }
    setLoading(true);
    if (mode === "teams") {
      const res = await fetch(`/api/teams/search?name=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setTeams(data);
    } else {
      const res = await fetch(`/api/players/search?name=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setPlayers(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setTeams([]);
      setPlayers([]);
      setShowSuggestions(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      runSearch(query);
      setShowSuggestions(true);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, mode]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowSuggestions(false);
    runSearch(query);
  }

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight text-center">Find a Team or Player</h1>
      <p className="text-[var(--muted)] mb-6 text-sm text-center">Search football and cricket teams or players.</p>

      <div className="flex justify-center mb-6">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-full p-1 flex gap-1">
          <button
            onClick={() => { setMode("teams"); setQuery(""); setShowSuggestions(false); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              mode === "teams" ? "gradient-bg text-white" : "text-[var(--muted)]"
            }`}
          >
            Teams
          </button>
          <button
            onClick={() => { setMode("players"); setQuery(""); setShowSuggestions(false); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              mode === "players" ? "gradient-bg text-white" : "text-[var(--muted)]"
            }`}
          >
            Players
          </button>
        </div>
      </div>

      <form onSubmit={handleSearchSubmit} className="relative mb-8">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.trim().length >= 2 && setShowSuggestions(true)}
              placeholder={mode === "teams" ? "e.g. Arsenal, Mumbai Indians" : "e.g. Bukayo Saka, Virat Kohli"}
              autoComplete="off"
              className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] rounded-full pl-10 pr-4 py-2.5 placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--gradient-end)]"
            />
          </div>
          <button
            type="submit"
            className="gradient-bg text-white px-6 py-2.5 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Search
          </button>
        </div>

        {showSuggestions && query.trim().length >= 2 && (
          <div className="absolute z-20 mt-2 w-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl max-h-80 overflow-y-auto">
            {loading && (
              <div className="p-4 text-sm text-[var(--muted)]">Searching...</div>
            )}
            {!loading && mode === "teams" && teams.length === 0 && (
              <div className="p-4 text-sm text-[var(--muted)]">No matches found.</div>
            )}
            {!loading && mode === "players" && players.length === 0 && (
              <div className="p-4 text-sm text-[var(--muted)]">No matches found.</div>
            )}
            {!loading && mode === "teams" && teams.slice(0, 4).map((team) => (
              <Link
                key={team.idTeam}
                href={`/team/${team.idTeam}`}
                onClick={() => setShowSuggestions(false)}
                className="flex items-center gap-3 p-3 hover:bg-[var(--surface-hover)] transition-colors border-b border-[var(--border)] last:border-b-0"
              >
                <img src={team.strBadge} alt={team.strTeam} className="w-8 h-8 object-contain shrink-0" />
                <div>
                  <p className="text-sm font-medium">{team.strTeam}</p>
                  <p className="text-xs text-[var(--muted)]">{team.strLeague}</p>
                </div>
              </Link>
            ))}
            {!loading && mode === "players" && players.slice(0, 4).map((player) => (
              <Link
                key={player.idPlayer}
                href={`/player/${player.idPlayer}`}
                onClick={() => setShowSuggestions(false)}
                className="flex items-center gap-3 p-3 hover:bg-[var(--surface-hover)] transition-colors border-b border-[var(--border)] last:border-b-0"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-[var(--surface-hover)]">
                  {(player.strCutout || player.strThumb) && (
                    <img src={player.strCutout || player.strThumb} alt={player.strPlayer} className="w-full h-full object-cover" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{player.strPlayer}</p>
                  <p className="text-xs text-[var(--muted)]">{player.strTeam} · {player.strPosition}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </form>

      {!showSuggestions && loading && (
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
    </div>
  );
}