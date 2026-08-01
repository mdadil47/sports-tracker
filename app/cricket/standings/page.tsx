import { getStandings } from "@/lib/sportsApi";
import { CRICKET_LEAGUES } from "@/lib/leagues";

export default async function CricketStandingsPage() {
  const leaguesData = await Promise.all(
    CRICKET_LEAGUES.map(async (league) => ({
      ...league,
      table: await getStandings(league.id, league.season),
    }))
  );

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-[var(--foreground)]">
        🏏 Standings
      </h1>

      <div className="space-y-10">
        {leaguesData.map((league) => (
          <div key={league.id}>
            <h2 className="text-lg font-semibold mb-3 text-[var(--foreground)]">{league.name}</h2>

            {league.table.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">Standings not available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[var(--muted)] border-b border-[var(--border)]">
                      <th className="py-2 pr-2">#</th>
                      <th className="py-2 pr-2">Team</th>
                      <th className="py-2 pr-2 text-center">P</th>
                      <th className="py-2 pr-2 text-center">W</th>
                      <th className="py-2 pr-2 text-center">L</th>
                      <th className="py-2 text-center">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {league.table.map((row: any) => (
                      <tr key={row.idTeam} className="border-b border-[var(--border)]">
                        <td className="py-2 pr-2 text-[var(--foreground)]">{row.intRank}</td>
                        <td className="py-2 pr-2 text-[var(--foreground)] flex items-center gap-2">
                          <img src={row.strBadge} alt="" className="w-5 h-5" />
                          {row.strTeam}
                        </td>
                        <td className="py-2 pr-2 text-center text-[var(--muted)]">{row.intPlayed}</td>
                        <td className="py-2 pr-2 text-center text-[var(--muted)]">{row.intWin}</td>
                        <td className="py-2 pr-2 text-center text-[var(--muted)]">{row.intLoss}</td>
                        <td className="py-2 text-center text-[var(--foreground)] font-semibold">
                          {row.intPoints}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}