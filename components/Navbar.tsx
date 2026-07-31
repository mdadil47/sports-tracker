import { auth, signIn, signOut } from "@/auth";
import Link from "next/link";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="border-b border-[var(--border)] bg-[var(--surface)] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-bold text-lg text-[var(--foreground)]">
          🏆 Sports Tracker
        </Link>
        <Link href="/football" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
          Football
        </Link>
        <Link href="/cricket" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
          Cricket
        </Link>
        <Link href="/search" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
          Search
        </Link>
        {session?.user && (
          <Link href="/dashboard" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
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
              <span className="text-sm text-[var(--muted)]">{session.user.name}</span>
              <button
                type="submit"
                className="text-sm border border-[var(--border)] rounded px-3 py-1 text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
              >
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
            <button
              type="submit"
              className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm rounded px-4 py-2"
            >
              Sign in with Google
            </button>
          </form>
        )}
      </div>
    </nav>
  );
}