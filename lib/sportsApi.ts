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
export async function getStandings(leagueId: string, season: string) {
  const data = await safeFetch(`${BASE_URL}/lookuptable.php?l=${leagueId}&s=${season}`);
  return data?.table ?? [];
}
export async function getTeamById(teamId: string) {
  const data = await safeFetch(`${BASE_URL}/lookupteam.php?id=${teamId}`);
  return data?.teams?.[0] ?? null;
}

export async function getLastEvents(teamId: string) {
  const data = await safeFetch(`${BASE_URL}/eventslast.php?id=${teamId}`);
  return data?.results ?? [];
}
export async function getTeamEventsToday(teamId: string) {
  const today = new Date().toISOString().split("T")[0];
  const upcoming = await getUpcomingEvents(teamId);
  const last = await getLastEvents(teamId);
  const all = [...upcoming, ...last];
  return all.filter((event: any) => event.dateEvent === today);
}
export async function getEventById(eventId: string) {
  const data = await safeFetch(`${BASE_URL}/lookupevent.php?id=${eventId}`);
  return data?.events?.[0] ?? null;
}

export async function getLineup(eventId: string) {
  const data = await safeFetch(`${BASE_URL}/lookuplineup.php?id=${eventId}`);
  return data?.lineup ?? [];
}
export async function getCombinedUpcomingEvents(teamIds: string[]) {
  const allEvents = await Promise.all(teamIds.map((id) => getUpcomingEvents(id)));
  const flattened = allEvents.flat();

  // Dedupe: a match between two tracked teams (e.g. India vs Australia) appears in both team's lists
  const seen = new Set<string>();
  const unique = flattened.filter((event: any) => {
    if (seen.has(event.idEvent)) return false;
    seen.add(event.idEvent);
    return true;
  });

  // Sort chronologically
  return unique.sort((a: any, b: any) => a.strTimestamp?.localeCompare(b.strTimestamp));
}
export async function getTeamRoster(teamId: string) {
  const data = await safeFetch(`${BASE_URL}/lookup_all_players.php?id=${teamId}`);
  return data?.player ?? [];
}
export async function getPlayerById(playerId: string) {
  const data = await safeFetch(`${BASE_URL}/lookupplayer.php?id=${playerId}`);
  return data?.players?.[0] ?? null;
}
export async function getPastLeagueEvents(leagueId: string) {
  const data = await safeFetch(`${BASE_URL}/eventspastleague.php?id=${leagueId}`);
  return data?.events ?? [];
}
export async function getEventStats(eventId: string) {
  const data = await safeFetch(`${BASE_URL}/lookupeventstats.php?id=${eventId}`);
  return data?.eventstats ?? [];
}