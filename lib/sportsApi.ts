const API_KEY = process.env.SPORTS_API_KEY || "3";
const BASE_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;

async function safeFetch(url: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Sports API error: ${res.status} for ${url}`);
      return null;
    }
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      console.error(`Sports API returned non-JSON for ${url}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`Sports API fetch failed for ${url}:`, err);
    return null;
  }
}

export async function searchTeams(name: string) {
  const data = await safeFetch(`${BASE_URL}/searchteams.php?t=${encodeURIComponent(name)}`);
  return data?.teams ?? [];
}

export async function getUpcomingEvents(teamId: string) {
  const data = await safeFetch(`${BASE_URL}/eventsnext.php?id=${teamId}`);
  return data?.events ?? [];
}

export async function getEventsByDay(date: string, leagueId: string) {
  const data = await safeFetch(`${BASE_URL}/eventsday.php?d=${date}&l=${leagueId}`);
  return data?.events ?? [];
}

export async function getUpcomingLeagueEvents(leagueId: string) {
  const data = await safeFetch(`${BASE_URL}/eventsnextleague.php?id=${leagueId}`);
  return data?.events ?? [];
}