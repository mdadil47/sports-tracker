import { getEventsByDay, getUpcomingLeagueEvents } from "@/lib/sportsApi";
import { CRICKET_LEAGUES } from "@/lib/leagues";
import DateNav from "@/components/DateNav";

function MatchRow({ event }: { event: any }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
      <span className="text-[var(--foreground)] text-sm sm:text-base">
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

export default async function CricketPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const selectedDate = params.date || new Date().toISOString().split("T")[0];
  const isToday = selectedDate === new Date().toISOString().split("T")[0];

  const leaguesData = await Promise.all(
    CRICKET_LEAGUES.map(async (league) => ({
      ...league,
      dayEvents: await getEventsByDay(selectedDate, league.id),
      upcomingEvents: isToday ? await getUpcomingLeagueEvents(league.id) : [],
    }))
  );

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-[var(--foreground)]">🏏 Cricket</h1>

      <DateNav currentDate={selectedDate} />

      <div className="space-y-10">
        {leaguesData.map((league) => (
          <div key={league.id}>
            <h2 className="text-lg font-semibold mb-3 text-[var(--foreground)]">{league.name}</h2>

            <div className="space-y-2 mb-4">
              {league.dayEvents.length > 0 ? (
                league.dayEvents.map((event: any) => (
                  <MatchRow key={event.idEvent} event={event} />
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">No matches on this date.</p>
              )}
            </div>

            {isToday && (
              <>
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
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}