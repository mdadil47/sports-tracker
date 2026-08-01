import { getEventsByDay, getUpcomingLeagueEvents } from "@/lib/sportsApi";
import { FOOTBALL_LEAGUES } from "@/lib/leagues";
import DateNav from "@/components/DateNav";
import Link from "next/link";
import { BarChart3 } from "lucide-react";

function MatchRow({ event }: { event: any }) {
  return (
    <div className="card-hover bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
      <span className="text-[var(--foreground)] text-sm sm:text-base font-medium">
        {event.strHomeTeam} vs {event.strAwayTeam}
      </span>
      <span className={`text-sm ${event.intHomeScore !== null ? "gradient-text font-semibold" : "text-[var(--muted)]"}`}>
        {event.intHomeScore !== null
          ? `${event.intHomeScore} - ${event.intAwayScore}`
          : `${event.dateEvent} ${event.strTime ?? ""}`}
      </span>
    </div>
  );
}

export default async function FootballPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const selectedDate = params.date || new Date().toISOString().split("T")[0];
  const isToday = selectedDate === new Date().toISOString().split("T")[0];

  const leaguesData = await Promise.all(
    FOOTBALL_LEAGUES.map(async (league) => ({
      ...league,
      dayEvents: await getEventsByDay(selectedDate, league.id),
      upcomingEvents: isToday ? await getUpcomingLeagueEvents(league.id) : [],
    }))
  );

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">⚽ Football</h1>
        <Link
          href="/football/standings"
          className="text-sm text-[var(--gradient-end)] hover:underline flex items-center gap-1"
        >
          <BarChart3 className="w-4 h-4" />
          Standings
        </Link>
      </div>

      <div className="mt-4">
        <DateNav currentDate={selectedDate} />
      </div>

      <div className="space-y-10">
        {leaguesData.map((league) => (
          <div key={league.id}>
            <h2 className="text-lg font-semibold mb-3">{league.name}</h2>

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
                <p className="text-sm text-[var(--muted)] mb-2 uppercase tracking-wide">Upcoming Fixtures</p>
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