import Link from "next/link";

export default function Home() {
  return (
    <div className="p-8 max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">Live Sports Tracker</h1>
      <p className="text-gray-600 mb-6">
        Follow your favorite teams, save them to your profile, and track upcoming matches.
      </p>
      <Link
        href="/search"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded"
      >
        Find a Team
      </Link>
    </div>
  );
}