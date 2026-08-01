"use client";

import { useState } from "react";
import Link from "next/link";
import { Trophy, Menu, X } from "lucide-react";
import { googleSignIn, googleSignOut } from "@/app/actions";

const links = [
  { href: "/football", label: "Football" },
  { href: "/cricket", label: "Cricket" },
  { href: "/search", label: "Search" },
];

export default function NavbarClient({ userName }: { userName: string | null }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Trophy className="w-5 h-5 text-[var(--gradient-end)]" />
          <span className="gradient-text">Sports Tracker</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {userName && (
            <Link href="/dashboard" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
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
                  className="text-sm border border-[var(--border)] rounded-full px-4 py-1.5 text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors"
                >
                  Sign out
                </button>
              </div>
            </form>
          ) : (
            <form action={googleSignIn}>
              <button
                type="submit"
                className="gradient-bg text-white text-sm rounded-full px-5 py-2 font-medium hover:opacity-90 transition-opacity"
              >
                Sign in with Google
              </button>
            </form>
          )}
        </div>

        <button
          className="md:hidden text-[var(--foreground)]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

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
                  <button type="submit" className="text-sm border border-[var(--border)] rounded-full px-4 py-1.5 text-[var(--foreground)]">
                    Sign out
                  </button>
                </div>
              </form>
            ) : (
              <form action={googleSignIn}>
                <button type="submit" className="gradient-bg text-white text-sm rounded-full px-5 py-2 w-full font-medium">
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