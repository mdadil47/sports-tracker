import { getEventById, getLineup, getEventStats } from "@/lib/sportsApi";
import { notFound } from "next/navigation";
import { MapPin, Calendar } from "lucide-react";

function classifyPosition(pos: string): "GK" | "DEF" | "MID" | "FWD" {
  const p = pos.toLowerCase();
  if (p.includes("keeper")) return "GK";
  if (p.includes("back") || p.includes("defender") || p.includes("centre-back") || p.includes("center-back")) return "DEF";
  if (p.includes("forward") || p.includes("striker")) return "FWD";
  return "MID";
}

function StatBar({ label, home, away }: { label: string; home: number; away: number }) {
  const total = home + away || 1;
  const homePct = (home / total) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-semibold">{home}</span>
        <span className="text-[var(--muted)] text-xs">{label}</span>
        <span className="font-semibold">{away}</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-[var(--surface-hover)]">
        <div className="gradient-bg" style={{ width: `${homePct}%` }} />
        <div className="bg-[var(--border)]" style={{ width: `${100 - homePct}%` }} />
      </div>
    </div>
  );
}

function FormationPitch({ players, teamName }: { players: any[]; teamName: string }) {
  const rows: Record<string, any[]> = { GK: [], DEF: [], MID: [], FWD: [] };
  players.forEach((p) => {
    rows[classifyPosition(p.strPosition || "")].push(p);
  });

  return (
    <div>
      <div className="text-center mb-3">
        <h2 className="text-lg font-semibold">{teamName}</h2>
        <p className="text-xs text-[var(--muted)]">Featured Players</p>
      </div>
      <div
        className="relative rounded-2xl p-4 sm:p-6 flex flex-col justify-between gap-4"
        style={{
          background: "linear-gradient(180deg, #1a4d2e 0%, #0f3320 100%)",
          minHeight: "420px",
        }}
      >
        <div className="absolute inset-4 border border-white/20 rounded pointer-events-none" />
        <div className="absolute top-1/2 left-4 right-4 border-t border-white/20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 border border-white/20 rounded-full pointer-events-none" />

        {(["FWD", "MID", "DEF", "GK"] as const).map((row) => (
          <div key={row} className="relative flex justify-around items-start gap-1 z-10">
            {rows[row].map((player) => (
              <div key={player.idLineup} className="flex flex-col items-center w-14 sm:w-20">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[var(--surface)] border-2 border-white/30 overflow-hidden shrink-0">
                  {player.strCutout && (
                    <img src={player.strCutout} alt={player.strPlayer} className="w-full h-full object-cover" />
                  )}
                </div>
                <p className="text-white text-[10px] sm:text-xs font-medium text-center mt-1 leading-tight drop-shadow">
                  {player.strPlayer}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function SimpleSquadList({ players, teamName }: { players: any[]; teamName: string }) {
  return (
    <div>
      <div className="mb-3">
        <h2 className="text-lg font-semibold">{teamName}</h2>
        <p className="text-xs text-[var(--muted)]">Featured Players</p>
      </div>
      <div className="space-y-2">
        {players.map((player) => (
          <div key={player.idLineup} className="flex items-center gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-2">
            <div className="w-9 h-9 rounded-full bg-[var(--surface-hover)] overflow-hidden shrink-0">
              {player.strCutout && <img src={player.strCutout} alt={player.strPlayer} className="w-full h-full object-cover" />}
            </div>
            <div>
              <p className="text-sm font-medium">{player.strPlayer}</p>
              <p className="text-xs text-[var(--muted)]">{player.strPosition}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await getEventById(id);
  if (!event) {
    notFound();
  }

  const [lineup, stats] = await Promise.all([getLineup(id), getEventStats(id)]);
  const homeLineup = lineup.filter((p: any) => p.strHome === "Yes" && p.strSubstitute === "No");
  const awayLineup = lineup.filter((p: any) => p.strHome === "No" && p.strSubstitute === "No");
  const isFootball = event.strSport === "Soccer";

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      {/* Score header */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 mb-8 text-center">
        <p className="text-xs text-[var(--muted)] mb-4 uppercase tracking-wide">{event.strLeague}</p>
        <div className="flex items-center justify-center gap-4 sm:gap-8 mb-2">
          <div className="flex-1 text-right">
            <img src={event.strHomeTeamBadge} alt={event.strHomeTeam} className="w-12 h-12 object-contain inline-block mb-2" />
            <p className="font-semibold text-sm sm:text-base">{event.strHomeTeam}</p>
          </div>
          <div className="gradient-text text-2xl sm:text-3xl font-bold px-2">
            {event.intHomeScore !== null ? `${event.intHomeScore} - ${event.intAwayScore}` : "vs"}
          </div>
          <div className="flex-1 text-left">
            <img src={event.strAwayTeamBadge} alt={event.strAwayTeam} className="w-12 h-12 object-contain inline-block mb-2" />
            <p className="font-semibold text-sm sm:text-base">{event.strAwayTeam}</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 text-sm text-[var(--muted)] mt-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {event.dateEvent} {event.strTime}
          </span>
          {event.strVenue && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {event.strVenue}
            </span>
          )}
        </div>
      </div>

      {/* Match Stats */}
      {stats.length > 0 && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-center">Match Stats</h2>
          {stats.map((stat: any) => (
            <StatBar key={stat.idStatistic} label={stat.strStat} home={Number(stat.intHome)} away={Number(stat.intAway)} />
          ))}
        </div>
      )}

      {/* Lineups */}
      {lineup.length > 0 ? (
        isFootball ? (
          <div className="grid sm:grid-cols-2 gap-6">
            <FormationPitch players={homeLineup} teamName={event.strHomeTeam} />
            <FormationPitch players={awayLineup} teamName={event.strAwayTeam} />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-8">
            <SimpleSquadList players={homeLineup} teamName={event.strHomeTeam} />
            <SimpleSquadList players={awayLineup} teamName={event.strAwayTeam} />
          </div>
        )
      ) : (
        <p className="text-center text-sm text-[var(--muted)]">
          Lineups not yet available for this match.
        </p>
      )}
    </div>
  );
}