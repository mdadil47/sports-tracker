import { getEventsByDay, getUpcomingLeagueEvents, getCombinedUpcomingEvents } from "@/lib/sportsApi";
import { CRICKET_LEAGUES, INTERNATIONAL_CRICKET_TEAMS } from "@/lib/leagues";
import DateNav from "@/components/DateNav";
import Link from "next/link";
import { BarChart3 } from "lucide-react";

function MatchRow({ event }: { event: any }) {
  const isLive = event.strStatus && !["NS", "FT", "Match Finished"].includes(event.strStatus);
  const isFinished = event.intHomeScore !== null;

  return (
    <Link
      href={`/match/${event.idEvent}`}
      className="card-hover bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 flex items-center justify-between gap-3"
    >
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <img src={event.strHomeTeamBadge} alt="" className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0" />
        <span className="text-sm sm:text-base font-medium truncate">{event.strHomeTeam}</span>
      </div>

      <div className="flex flex-col items-center px-2 shrink-0">
        {isLive && (
          <span className="flex items-center gap-1 text-xs text-red-400 font-semibold mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            LIVE
          </span>
        )}
        <span className={isFinished ? "gradient-text font-bold text-sm sm:text-base" : "text-[var(--muted)] text-xs sm:text-sm"}>
          {isFinished ? `${event.intHomeScore} - ${event.intAwayScore}` : event.strTime?.slice(0, 5) ?? "TBD"}
        </span>
        {!isFinished && (
          <span className="text-[10px] text-[var(--muted)]">{event.dateEvent}</span>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 justify-end">
        <span className="text-sm sm:text-base font-medium truncate text-right">{event.strAwayTeam}</span>
        <img src={event.strAwayTeamBadge} alt="" className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0" />
      </div>
    </Link>
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

  const internationalEvents = isToday
    ? await getCombinedUpcomingEvents(INTERNATIONAL_CRICKET_TEAMS.map((t) => t.id))
    : [];

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">🏏 Cricket</h1>
        <Link
          href="/cricket/standings"
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
        {isToday && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full gradient-bg" />
              <h2 className="text-lg font-semibold">International</h2>
            </div>
            <div className="space-y-2">
              {internationalEvents.length > 0 ? (
                internationalEvents.slice(0, 5).map((event: any) => (
                  <MatchRow key={event.idEvent} event={event} />
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">No upcoming international matches found.</p>
              )}
            </div>
          </div>
        )}

        {leaguesData.map((league) => (
          <div key={league.id}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full gradient-bg" />
              <h2 className="text-lg font-semibold">{league.name}</h2>
            </div>

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