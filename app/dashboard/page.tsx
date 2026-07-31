import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getUpcomingEvents } from "@/lib/sportsApi";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const savedTeams = await prisma.savedTeam.findMany({
    where: { userId: (session.user as { id: string }).id },
    orderBy: { createdAt: "desc" },
  });

  // Fetch upcoming events for each saved team in parallel
  const teamsWithEvents = await Promise.all(
    savedTeams.map(async (team) => ({
      ...team,
      upcomingEvents: await getUpcomingEvents(team.teamId),
    }))
  );

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Teams</h1>

      {teamsWithEvents.length === 0 && (
        <p className="text-gray-500">
          No saved teams yet. Go to Search to add some.
        </p>
      )}

      <div className="space-y-6">
        {teamsWithEvents.map((team) => (
          <div key={team.id} className="border rounded p-4">
            <div className="flex items-center gap-3 mb-3">
              <img src={team.teamBadge ?? ""} alt={team.teamName} className="w-10 h-10" />
              <div>
                <p className="font-semibold">{team.teamName}</p>
                <p className="text-sm text-gray-500">{team.teamLeague}</p>
              </div>
            </div>

            {team.upcomingEvents.length === 0 ? (
              <p className="text-sm text-gray-400">No upcoming matches found.</p>
            ) : (
              <ul className="text-sm space-y-1">
                {team.upcomingEvents.slice(0, 3).map((event: any) => (
                  <li key={event.idEvent}>
                    {event.strHomeTeam} vs {event.strAwayTeam} —{" "}
                    {event.dateEvent} {event.strTime}
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