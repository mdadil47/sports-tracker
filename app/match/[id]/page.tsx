import { getEventById, getLineup } from "@/lib/sportsApi";
import { notFound } from "next/navigation";
import { MapPin, Calendar } from "lucide-react";

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

  const lineup = await getLineup(id);
  const homeLineup = lineup.filter((p: any) => p.strHome === "Yes" && p.strSubstitute === "No");
  const awayLineup = lineup.filter((p: any) => p.strHome === "No" && p.strSubstitute === "No");

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

      {/* Lineups */}
      {lineup.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-3">{event.strHomeTeam}</h2>
            <div className="space-y-2">
              {homeLineup.map((player: any) => (
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

          <div>
            <h2 className="text-lg font-semibold mb-3">{event.strAwayTeam}</h2>
            <div className="space-y-2">
              {awayLineup.map((player: any) => (
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
        </div>
      ) : (
        <p className="text-center text-sm text-[var(--muted)]">
          Lineups not yet available for this match.
        </p>
      )}
    </div>
  );
}