# Live Sports Tracker

A full-stack sports web app for following football and cricket — live scores, standings, results history, team squads, player profiles, and detailed match stats, all in a modern dark UI.

## Features

**Core**
- Google OAuth login (NextAuth.js + Prisma adapter, database sessions)
- Unified search for teams and players with live autocomplete suggestions

**Football & Cricket coverage**
- Live/today's matches, upcoming fixtures, and past results (EPL, La Liga, IPL, Big Bash, plus international cricket)
- Date navigation to browse any day's fixtures
- League standings/points tables
- "LIVE" status indicators on in-progress matches

**Team & Player pages**
- Team pages with banner, bio, stadium, and a full squad grouped by role (Batsmen/Bowlers/All-Rounders/Wicket-Keepers for cricket; Goalkeepers/Defenders/Midfielders/Forwards for football)
- Player profile pages with bio, age/height/weight, nationality, and social links
- Full navigation chain: Match → Team → Player, all clickable

**Match details**
- Football: visual formation-pitch lineup view
- Cricket: featured players list plus a plain-language result summary ("X won by 5 wickets")
- Match stats with home-vs-away visual comparison bars (shots, etc., where available)

**UI/UX**
- Modern dark theme with gradient accents, custom icons (lucide-react)
- Fully mobile-responsive, including a collapsible nav
- Toast notifications, loading skeletons

## Tech Stack
- **Frontend/Backend:** Next.js (App Router), TypeScript, Tailwind CSS v4
- **Auth:** NextAuth.js (Google provider) with Prisma adapter
- **Database:** PostgreSQL (Neon), Prisma 7 ORM with driver adapters
- **Sports Data:** TheSportsDB API
- **Icons:** lucide-react + @lucide/lab
- **Deployment:** Vercel

## Getting Started

1. Install dependencies:
2. Copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL` — PostgreSQL connection string
   - `AUTH_SECRET` — generate with `npx auth secret`
   - `AUTH_URL` — your app's base URL
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from Google Cloud Console
   - `SPORTS_API_KEY` — TheSportsDB API key (`3` for the free shared test tier)

3. Run database migrations:

4. Start the dev server:

## Live Demo
[sports-tracker-new.vercel.app](https://sports-tracker-new.vercel.app)

## Notable Engineering Challenges Solved
- Migrated a Prisma schema through a major version change (Prisma 7's mandatory driver adapter)
- Diagnosed and fixed a Next.js path-alias/folder-structure conflict
- Resolved a duplicate Google OAuth client mismatch that only surfaced in production
- Verified third-party API league/team IDs directly against the live API after finding incorrect secondhand documentation
- Built graceful degradation around a third-party API's free-tier limits (e.g., 5-record caps on match lineups/stats), labeling features honestly ("Featured Players") rather than presenting incomplete data as complete
- Built visual features (formation pitch, stat bars) driven by data classification logic (position-string parsing) rather than hardcoded data