const API_KEY = process.env.SPORTS_API_KEY || "3";
const BASE_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;

export async function searchTeams(name: string) {
  const res = await fetch(`${BASE_URL}/searchteams.php?t=${encodeURIComponent(name)}`);
  const data = await res.json();
  return data.teams ?? [];
}
export async function getUpcomingEvents(teamId: string) {
  const res = await fetch(`${BASE_URL}/eventsnext.php?id=${teamId}`);
  const data = await res.json();
  return data.events ?? [];
}
export async function getEventsByDay(date: string, leagueId: string) {
  const res = await fetch(`${BASE_URL}/eventsday.php?d=${date}&l=${leagueId}`);
  const data = await res.json();
  return data.events ?? [];
}
export async function getUpcomingLeagueEvents(leagueId: string) {
  const res = await fetch(`${BASE_URL}/eventsnextleague.php?id=${leagueId}`);
  const data = await res.json();
  return data.events ?? [];
}