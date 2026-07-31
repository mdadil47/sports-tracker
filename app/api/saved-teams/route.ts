import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET: list the logged-in user's saved teams
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const savedTeams = await prisma.savedTeam.findMany({
    where: { userId: (session.user as { id: string }).id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(savedTeams);
}

// POST: save a new team
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { teamId, teamName, teamLeague, teamBadge } = await request.json();

  if (!teamId || !teamName) {
    return NextResponse.json({ error: "teamId and teamName are required" }, { status: 400 });
  }

  try {
    const saved = await prisma.savedTeam.create({
      data: {
        userId: (session.user as { id: string }).id,
        teamId,
        teamName,
        teamLeague,
        teamBadge,
      },
    });
    return NextResponse.json(saved, { status: 201 });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Team already saved" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to save team" }, { status: 500 });
  }
}