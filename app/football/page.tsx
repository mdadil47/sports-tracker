import { getEventsByDay } from "@/lib/sportsApi";
import { FOOTBALL_LEAGUES } from "@/lib/leagues";

export default async function FootballPage() {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const leaguesWithEvents = await Promise.all(
    FOOTBALL_LEAGUES.map(async (league) => ({
      ...league,
      events: await getEventsByDay(today, league.id),
    }))
  );

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-[var(--foreground)]">⚽ Football — Today</h1>

      {leaguesWithEvents.every((l) => l.events.length === 0) && (
        <p className="text-[var(--muted)]">No matches scheduled today across tracked leagues.</p>
      )}

      <div className="space-y-8">
        {leaguesWithEvents.map((league) =>
          league.events.length > 0 ? (
            <div key={league.id}>
              <h2 className="text-lg font-semibold mb-3 text-[var(--foreground)]">{league.name}</h2>
              <div className="space-y-2">
                {league.events.map((event: any) => (
                  <div
                    key={event.idEvent}
                    className="bg-[var(--surface)] border border-[var(--border)] rounded p-4 flex items-center justify-between"
                  >
                    <span className="text-[var(--foreground)]">
                      {event.strHomeTeam} vs {event.strAwayTeam}
                    </span>
                    <span className="text-[var(--muted)] text-sm">
                      {event.intHomeScore !== null
                        ? `${event.intHomeScore} - ${event.intAwayScore}`
                        : event.strTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}