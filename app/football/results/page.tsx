import { getPastLeagueEvents } from "@/lib/sportsApi";
import { FOOTBALL_LEAGUES } from "@/lib/leagues";
import Link from "next/link";
import { Volleyball } from "lucide-react";

export default async function FootballResultsPage() {
  const leaguesData = await Promise.all(
    FOOTBALL_LEAGUES.map(async (league) => ({
      ...league,
      results: await getPastLeagueEvents(league.id),
    }))
  );

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2 mb-6">
        <Volleyball className="w-7 h-7 text-[var(--gradient-end)]" />
        Football Results
      </h1>

      <div className="space-y-10">
        {leaguesData.map((league) => (
          <div key={league.id}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full gradient-bg" />
              <h2 className="text-lg font-semibold">{league.name}</h2>
            </div>

            <div className="space-y-2">
              {league.results.length > 0 ? (
                league.results
                  .slice(-10)
                  .reverse()
                  .map((event: any) => (
                    <Link
                      key={event.idEvent}
                      href={`/match/${event.idEvent}`}
                      className="card-hover bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <img src={event.strHomeTeamBadge} alt="" className="w-7 h-7 object-contain shrink-0" />
                        <span className="text-sm font-medium truncate">{event.strHomeTeam}</span>
                      </div>
                      <div className="flex flex-col items-center px-2 shrink-0">
                        <span className="gradient-text font-bold text-sm">
                          {event.intHomeScore} - {event.intAwayScore}
                        </span>
                        <span className="text-[10px] text-[var(--muted)]">{event.dateEvent}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                        <span className="text-sm font-medium truncate text-right">{event.strAwayTeam}</span>
                        <img src={event.strAwayTeamBadge} alt="" className="w-7 h-7 object-contain shrink-0" />
                      </div>
                    </Link>
                  ))
              ) : (
                <p className="text-sm text-[var(--muted)]">No recent results found.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}