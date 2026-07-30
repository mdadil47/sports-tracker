"use client";

import { useState } from "react";

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
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Find a Team</h1>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Arsenal, Lakers, Yankees"
          className="flex-1 border rounded px-3 py-2"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>
      </form>

      {loading && <p>Searching...</p>}

      <ul className="space-y-3">
        {teams.map((team) => (
          <li key={team.idTeam} className="flex items-center gap-3 border rounded p-3">
            <img src={team.strTeamBadge} alt={team.strTeam} className="w-10 h-10" />
            <div>
              <p className="font-semibold">{team.strTeam}</p>
              <p className="text-sm text-gray-500">{team.strLeague}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}