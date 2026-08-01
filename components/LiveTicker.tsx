import { prisma } from "@/lib/prisma";
import { getTeamEventsToday } from "@/lib/sportsApi";
import { Radio } from "lucide-react";

export default async function LiveTicker({ userId }: { userId: string }) {
  const savedTeams = await prisma.savedTeam.findMany({ where: { userId } });

  const todayEvents = (
    await Promise.all(
      savedTeams.map(async (team) => {
        const events = await getTeamEventsToday(team.teamId);
        return events.map((e: any) => ({ ...e, savedTeamName: team.teamName }));
      })
    )
  ).flat();

  if (todayEvents.length === 0) return null;

  return (
    <div className="gradient-bg text-white text-sm overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-1.5 whitespace-nowrap animate-marquee">
        <Radio className="w-3.5 h-3.5 shrink-0" />
        {todayEvents.map((event, i) => (
          <span key={event.idEvent} className="flex items-center gap-2">
            {i > 0 && <span className="opacity-50">•</span>}
            <span className="font-medium">
              {event.strHomeTeam}
              {event.intHomeScore !== null ? ` ${event.intHomeScore}` : ""}
              {" - "}
              {event.intAwayScore !== null ? `${event.intAwayScore} ` : ""}
              {event.strAwayTeam}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}