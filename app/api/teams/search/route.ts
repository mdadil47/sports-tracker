import { NextResponse } from "next/server";
import { searchTeams } from "@/lib/sportsApi";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ error: "Missing name parameter" }, { status: 400 });
  }

  const teams = await searchTeams(name);
  return NextResponse.json(teams);
}