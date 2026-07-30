import { searchTeams } from "@/lib/sportsApi";

export default async function TestPage() {
  const teams = await searchTeams("Arsenal");

  return (
    <pre className="p-8 text-sm">
      {JSON.stringify(teams, null, 2)}
    </pre>
  );
}