import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getUpcomingEvents } from "@/lib/sportsApi";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const savedTeams = await prisma.savedTeam.findMany({
    where: { userId: (session.user as { id: string }).id },
    orderBy: { createdAt: "desc" },
  });

  const teamsWithEvents = await Promise.all(
    savedTeams.map(async (team) => ({
      ...team,
      upcomingEvents: await getUpcomingEvents(team.teamId),
    }))
  );

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-[var(--foreground)]">Your Teams</h1>

      {teamsWithEvents.length === 0 && (
        <p className="text-[var(--muted)]">
          No saved teams yet. Go to Search to add some.
        </p>
      )}

      <div className="space-y-6">
        {teamsWithEvents.map((team) => (
          <div key={team.id} className="border border-[var(--border)] bg-[var(--surface)] rounded p-4">
            <Link href={`/team/${team.teamId}`} className="flex items-center gap-3 mb-3">
  <img src={team.teamBadge ?? ""} alt={team.teamName} className="w-10 h-10" />
  <div>
    <p className="font-semibold text-[var(--foreground)] hover:underline">{team.teamName}</p>
    <p className="text-sm text-[var(--muted)]">{team.teamLeague}</p>
  </div>
</Link>

            {team.upcomingEvents.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No upcoming matches found.</p>
            ) : (
              <ul className="text-sm space-y-1 text-[var(--foreground)]">
                {team.upcomingEvents.slice(0, 3).map((event: any) => (
                  <li key={event.idEvent} className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <span>{event.strHomeTeam} vs {event.strAwayTeam}</span>
                    <span className="text-[var(--muted)]">
                      {event.dateEvent} {event.strTime}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}