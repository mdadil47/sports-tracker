import { getEventsByDay, getUpcomingLeagueEvents } from "@/lib/sportsApi";
import { CRICKET_LEAGUES } from "@/lib/leagues";

function MatchRow({ event }: { event: any }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded p-4 flex items-center justify-between">
      <span className="text-[var(--foreground)]">
        {event.strHomeTeam} vs {event.strAwayTeam}
      </span>
      <span className="text-[var(--muted)] text-sm">
        {event.intHomeScore !== null
          ? `${event.intHomeScore} - ${event.intAwayScore}`
          : `${event.dateEvent} ${event.strTime ?? ""}`}
      </span>
    </div>
  );
}

export default async function CricketPage() {
  const today = new Date().toISOString().split("T")[0];

  const leaguesData = await Promise.all(
    CRICKET_LEAGUES.map(async (league) => ({
      ...league,
      todayEvents: await getEventsByDay(today, league.id),
      upcomingEvents: await getUpcomingLeagueEvents(league.id),
    }))
  );

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-[var(--foreground)]">🏏 Cricket</h1>

      <div className="space-y-10">
        {leaguesData.map((league) => (
          <div key={league.id}>
            <h2 className="text-lg font-semibold mb-3 text-[var(--foreground)]">{league.name}</h2>

            {league.todayEvents.length > 0 && (
              <>
                <p className="text-sm text-[var(--accent)] mb-2">Today</p>
                <div className="space-y-2 mb-4">
                  {league.todayEvents.map((event: any) => (
                    <MatchRow key={event.idEvent} event={event} />
                  ))}
                </div>
              </>
            )}

            <p className="text-sm text-[var(--muted)] mb-2">Upcoming Fixtures</p>
            <div className="space-y-2">
              {league.upcomingEvents.length > 0 ? (
                league.upcomingEvents
                  .slice(0, 5)
                  .map((event: any) => <MatchRow key={event.idEvent} event={event} />)
              ) : (
                <p className="text-sm text-[var(--muted)]">No upcoming fixtures found.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}