"use client";

import { useState } from "react";
import Link from "next/link";
import { googleSignIn, googleSignOut } from "@/app/actions";

const links = [
  { href: "/football", label: "Football" },
  { href: "/cricket", label: "Cricket" },
  { href: "/search", label: "Search" },
];

export default function NavbarClient({ userName }: { userName: string | null }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b border-[var(--border)] bg-[var(--surface)] px-6 py-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-[var(--foreground)]">
          🏆 Sports Tracker
        </Link>

        {/* Desktop links — hidden on small screens */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              {link.label}
            </Link>
          ))}
          {userName && (
            <Link href="/dashboard" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
              Dashboard
            </Link>
          )}
        </div>

        <div className="hidden md:block">
          {userName ? (
            <form action={googleSignOut}>
              <div className="flex items-center gap-3">
                <span className="text-sm text-[var(--muted)]">{userName}</span>
                <button
                  type="submit"
                  className="text-sm border border-[var(--border)] rounded px-3 py-1 text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
                >
                  Sign out
                </button>
              </div>
            </form>
          ) : (
            <form action={googleSignIn}>
              <button
                type="submit"
                className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm rounded px-4 py-2"
              >
                Sign in with Google
              </button>
            </form>
          )}
        </div>

        {/* Hamburger button — only shows on small screens */}
        <button
          className="md:hidden text-[var(--foreground)] text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              {link.label}
            </Link>
          ))}
          {userName && (
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              Dashboard
            </Link>
          )}
          <div className="pt-2 border-t border-[var(--border)]">
            {userName ? (
              <form action={googleSignOut}>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--muted)]">{userName}</span>
                  <button
                    type="submit"
                    className="text-sm border border-[var(--border)] rounded px-3 py-1 text-[var(--foreground)]"
                  >
                    Sign out
                  </button>
                </div>
              </form>
            ) : (
              <form action={googleSignIn}>
                <button
                  type="submit"
                  className="bg-[var(--accent)] text-white text-sm rounded px-4 py-2 w-full"
                >
                  Sign in with Google
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}