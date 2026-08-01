import { getTeamById, getLastEvents, getUpcomingEvents } from "@/lib/sportsApi";
import { notFound } from "next/navigation";

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
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <img src={team.strTeamBadge} alt={team.strTeam} className="w-16 h-16" />
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">{team.strTeam}</h1>
          <p className="text-[var(--muted)] text-sm">{team.strLeague}</p>
        </div>
      </div>

      {team.strStadium && (
        <p className="text-sm text-[var(--muted)] mb-2">🏟️ {team.strStadium}</p>
      )}

      {team.strDescriptionEN && (
        <p className="text-sm text-[var(--foreground)] mb-8 leading-relaxed">
          {team.strDescriptionEN.slice(0, 400)}
          {team.strDescriptionEN.length > 400 ? "..." : ""}
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-3 text-[var(--foreground)]">Recent Results</h2>
          <div className="space-y-2">
            {lastEvents.length > 0 ? (
              lastEvents.slice(0, 5).map((event: any) => (
                <div
                  key={event.idEvent}
                  className="bg-[var(--surface)] border border-[var(--border)] rounded p-3 text-sm"
                >
                  <p className="text-[var(--foreground)]">
                    {event.strHomeTeam} {event.intHomeScore} - {event.intAwayScore} {event.strAwayTeam}
                  </p>
                  <p className="text-[var(--muted)] text-xs">{event.dateEvent}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--muted)]">No recent results found.</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3 text-[var(--foreground)]">Upcoming Matches</h2>
          <div className="space-y-2">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.slice(0, 5).map((event: any) => (
                <div
                  key={event.idEvent}
                  className="bg-[var(--surface)] border border-[var(--border)] rounded p-3 text-sm"
                >
                  <p className="text-[var(--foreground)]">
                    {event.strHomeTeam} vs {event.strAwayTeam}
                  </p>
                  <p className="text-[var(--muted)] text-xs">
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
  );
}