const API_KEY = process.env.SPORTS_API_KEY || "3";
const BASE_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;

export async function searchTeams(name: string) {
  const res = await fetch(`${BASE_URL}/searchteams.php?t=${encodeURIComponent(name)}`);
  const data = await res.json();
  return data.teams ?? [];
}