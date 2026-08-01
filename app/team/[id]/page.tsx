import { getTeamById, getLastEvents, getUpcomingEvents } from "@/lib/sportsApi";
import { notFound } from "next/navigation";
import { MapPin, TrendingUp, Calendar } from "lucide-react";

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

  const [lastEvents, upcomingEvents] = await Promise.all([
    getLastEvents(id),
    getUpcomingEvents(id),
  ]);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Banner header */}
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
                  <div
                    key={event.idEvent}
                    className="card-hover bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 text-sm"
                  >
                    <p>
                      {event.strHomeTeam} <span className="gradient-text font-semibold">{event.intHomeScore} - {event.intAwayScore}</span> {event.strAwayTeam}
                    </p>
                    <p className="text-[var(--muted)] text-xs mt-1">{event.dateEvent}</p>
                  </div>
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
                  <div
                    key={event.idEvent}
                    className="card-hover bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 text-sm"
                  >
                    <p>{event.strHomeTeam} vs {event.strAwayTeam}</p>
                    <p className="text-[var(--muted)] text-xs mt-1">
                      {event.dateEvent} {event.strTime}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">No upcoming matches found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}