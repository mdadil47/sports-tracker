import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getUpcomingEvents } from "@/lib/sportsApi";
import { redirect } from "next/navigation";
import Link from "next/link";
import UnsaveButton from "@/components/UnsaveButton";

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
      <h1 className="text-2xl sm:text-3xl font-bold mb-1 tracking-tight">Your Teams</h1>
      <p className="text-[var(--muted)] mb-8 text-sm">
        {teamsWithEvents.length} team{teamsWithEvents.length !== 1 ? "s" : ""} followed
      </p>

      {teamsWithEvents.length === 0 && (
        <div className="text-center py-16 border border-dashed border-[var(--border)] rounded-2xl">
          <p className="text-[var(--muted)] mb-4">No saved teams yet.</p>
          <Link href="/search" className="gradient-bg text-white px-5 py-2.5 rounded-full font-medium inline-block hover:opacity-90 transition-opacity">
            Find a Team
          </Link>
        </div>
      )}

      <div className="space-y-6">
        {teamsWithEvents.map((team) => (
          <div key={team.id} className="card-hover border border-[var(--border)] bg-[var(--surface)] rounded-2xl p-5">
            <Link href={`/team/${team.teamId}`} className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0">
      <img src={team.teamBadge ?? ""} alt={team.teamName} className="w-8 h-8 object-contain" />
    </div>
    <div>
      <p className="font-semibold hover:underline">{team.teamName}</p>
      <p className="text-sm text-[var(--muted)]">{team.teamLeague}</p>
    </div>
            </Link>

            {team.upcomingEvents.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No upcoming matches found.</p>
            ) : (
              <ul className="text-sm space-y-2">
                {team.upcomingEvents.slice(0, 3).map((event: any) => (
                  <li key={event.idEvent}>
  <Link
    href={`/match/${event.idEvent}`}
    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 bg-[var(--background)] rounded-lg px-3 py-2 hover:bg-[var(--surface-hover)] transition-colors"
  >
    <span>{event.strHomeTeam} vs {event.strAwayTeam}</span>
    <span className="text-[var(--muted)] text-xs">
      {event.dateEvent} {event.strTime}
    </span>
  </Link>
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