import { auth, signIn, signOut } from "@/auth";
import Link from "next/link";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="border-b px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-bold text-lg">
          🏆 Sports Tracker
        </Link>
        <Link href="/search" className="text-sm text-gray-600 hover:text-black">
          Search
        </Link>
        {session?.user && (
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-black">
            Dashboard
          </Link>
        )}
      </div>

      <div>
        {session?.user ? (
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm">{session.user.name}</span>
              <button type="submit" className="text-sm border rounded px-3 py-1">
                Sign out
              </button>
            </div>
          </form>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <button type="submit" className="bg-blue-600 text-white text-sm rounded px-4 py-2">
              Sign in with Google
            </button>
          </form>
        )}
      </div>
    </nav>
  );
}