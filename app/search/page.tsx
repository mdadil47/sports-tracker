"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/Toast";
import { Skeleton } from "@/components/Skeleton";

interface Team {
  idTeam: string;
  strTeam: string;
  strTeamBadge: string;
  strLeague: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const { showToast } = useToast();

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const res = await fetch(`/api/teams/search?name=${encodeURIComponent(query)}`);
    const data = await res.json();
    setTeams(data);
    setLoading(false);
  }

  async function handleSave(team: Team) {
    const res = await fetch("/api/saved-teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teamId: team.idTeam,
        teamName: team.strTeam,
        teamLeague: team.strLeague,
        teamBadge: team.strTeamBadge,
      }),
    });

    if (res.ok) {
      setSavedIds((prev) => [...prev, team.idTeam]);
      showToast(`${team.strTeam} saved!`, "success");
    } else if (res.status === 401) {
      showToast("Please sign in first to save teams.", "error");
    } else {
      const data = await res.json();
      showToast(data.error || "Failed to save team", "error");
    }
  }

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-[var(--foreground)]">Find a Team</h1>
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Arsenal, Lakers, Mumbai Indians"
          className="flex-1 border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] rounded px-3 py-2 placeholder:text-[var(--muted)]"
        />
        <button
          type="submit"
          className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      {loading && (
  <div className="space-y-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center gap-3 border border-[var(--border)] bg-[var(--surface)] rounded p-3">
        <Skeleton className="w-10 h-10 rounded-full" />
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
            className="flex flex-col sm:flex-row sm:items-center gap-3 border border-[var(--border)] bg-[var(--surface)] rounded p-3"
          >
            <Link href={`/team/${team.idTeam}`} className="flex items-center gap-3 flex-1">
              <img src={team.strTeamBadge} alt={team.strTeam} className="w-10 h-10" />
              <div>
                <p className="font-semibold text-[var(--foreground)] hover:underline">{team.strTeam}</p>
                <p className="text-sm text-[var(--muted)]">{team.strLeague}</p>
              </div>
            </Link>
            <button
              onClick={() => handleSave(team)}
              disabled={savedIds.includes(team.idTeam)}
              className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-3 py-1 rounded text-sm disabled:bg-gray-600 self-start sm:self-auto"
            >
              {savedIds.includes(team.idTeam) ? "Saved" : "Save"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}