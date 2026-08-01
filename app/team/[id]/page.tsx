import { getTeamById, getLastEvents, getUpcomingEvents, getTeamRoster } from "@/lib/sportsApi";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, TrendingUp, Calendar } from "lucide-react";

function classifyPlayer(position: string, sport: string): string | null {
  const p = position.toLowerCase();
  if (p.includes("coach") || p.includes("manager") || p.includes("physio") || p.includes("staff")) return null;

  if (sport === "Cricket") {
    if (p.includes("wicket")) return "Wicket-Keepers";
    if (p.includes("all-rounder")) return "All-Rounders";
    if (p.includes("bowler")) return "Bowlers";
    if (p.includes("batsman") || p.includes("batter")) return "Batsmen";
    return "Other";
  }

  if (p.includes("keeper")) return "Goalkeepers";
  if (p.includes("back") || p.includes("defender")) return "Defenders";
  if (p.includes("forward") || p.includes("striker")) return "Forwards";
  if (p.includes("midfield") || p.includes("wing")) return "Midfielders";
  return "Other";
}

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const team = await getTeamById(id);
  if (!team) {
    notFound();
  }

  const [lastEvents, upcomingEvents, roster] = await Promise.all([
    getLastEvents(id),
    getUpcomingEvents(id),
    getTeamRoster(id),
  ]);

  const groupOrder =
    team.strSport === "Cricket"
      ? ["Batsmen", "Bowlers", "All-Rounders", "Wicket-Keepers", "Other"]
      : ["Goalkeepers", "Defenders", "Midfielders", "Forwards", "Other"];

  const grouped: Record<string, any[]> = {};
  roster.forEach((player: any) => {
    const group = classifyPlayer(player.strPosition || "", team.strSport);
    if (!group) return;
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(player);
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="h-32 sm:h-40 gradient-bg relative flex items-end p-4 sm:p-8"
        style={{
          backgroundImage: team.strFanart1 ? `url(${team.strFanart1})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/40 to-transparent" />
        <div className="relative flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-[var(--surface)] border-4 border-[var(--background)] flex items-center justify-center overflow-hidden shrink-0">
            <img src={team.strBadge} alt={team.strTeam} className="w-14 h-14 object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white drop-shadow">{team.strTeam}</h1>
            <p className="text-white/80 text-sm">{team.strLeague}</p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-8">
        {team.strStadium && (
          <p className="text-sm text-[var(--muted)] mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {team.strStadium}
          </p>
        )}

        {team.strDescriptionEN && (
          <p className="text-sm text-[var(--foreground)] mb-8 leading-relaxed">
            {team.strDescriptionEN.slice(0, 400)}
            {team.strDescriptionEN.length > 400 ? "..." : ""}
          </p>
        )}

        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[var(--gradient-end)]" />
              Recent Results
            </h2>
            <div className="space-y-2">
              {lastEvents.length > 0 ? (
                lastEvents.slice(0, 5).map((event: any) => (
                  <Link
                    key={event.idEvent}
                    href={`/match/${event.idEvent}`}
                    className="card-hover bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 text-sm block hover:bg-[var(--surface-hover)] transition-colors"
                  >
                    <p>
                      {event.strHomeTeam} <span className="gradient-text font-semibold">{event.intHomeScore} - {event.intAwayScore}</span> {event.strAwayTeam}
                    </p>
                    <p className="text-[var(--muted)] text-xs mt-1">{event.dateEvent}</p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">No recent results found.</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--gradient-end)]" />
              Upcoming Matches
            </h2>
            <div className="space-y-2">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.slice(0, 5).map((event: any) => (
                  <Link
                    key={event.idEvent}
                    href={`/match/${event.idEvent}`}
                    className="card-hover bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 text-sm block hover:bg-[var(--surface-hover)] transition-colors"
                  >
                    <p>{event.strHomeTeam} vs {event.strAwayTeam}</p>
                    <p className="text-[var(--muted)] text-xs mt-1">
                      {event.dateEvent} {event.strTime}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">No upcoming matches found.</p>
              )}
            </div>
          </div>
        </div>

        {roster.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-4">Squad</h2>
            <div className="space-y-6">
              {groupOrder
                .filter((group) => grouped[group]?.length > 0)
                .map((group) => (
                  <div key={group}>
                    <p className="text-sm text-[var(--muted)] mb-2 uppercase tracking-wide">{group}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {grouped[group].map((player: any) => (
                        <Link
                          key={player.idPlayer}
                          href={`/player/${player.idPlayer}`}
                          className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-2 hover:bg-[var(--surface-hover)] transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-[var(--surface-hover)] overflow-hidden shrink-0">
                            {player.strCutout && (
                              <img src={player.strCutout} alt={player.strPlayer} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <p className="text-xs font-medium truncate">{player.strPlayer}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}