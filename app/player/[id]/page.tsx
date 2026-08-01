import { getPlayerById } from "@/lib/sportsApi";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Calendar, Ruler, Weight, ExternalLink } from "lucide-react";

function calculateAge(dateBorn: string): number | null {
  if (!dateBorn) return null;
  const birth = new Date(dateBorn);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

const linkClass = "p-2 rounded-full bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors";

export default async function PlayerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const player = await getPlayerById(id);
  if (!player) {
    notFound();
  }

  const age = calculateAge(player.dateBorn);
  const twitterUrl = player.strTwitter ? `https://${player.strTwitter.replace(/^https?:\/\//, "")}` : null;
  const instagramUrl = player.strInstagram ? `https://${player.strInstagram.replace(/^\[|\].*$/g, "").replace(/^https?:\/\//, "")}` : null;
  const facebookUrl = player.strFacebook ? `https://${player.strFacebook.replace(/^\[|\].*$/g, "").replace(/^https?:\/\//, "")}` : null;

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="h-40 sm:h-52 gradient-bg relative flex items-end p-4 sm:p-8"
        style={{
          backgroundImage: player.strFanart1 ? `url(${player.strFanart1})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/50 to-transparent" />
        <div className="relative flex items-end gap-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[var(--surface)] border-4 border-[var(--background)] overflow-hidden shrink-0">
            {(player.strCutout || player.strThumb) && (
              <img src={player.strCutout || player.strThumb} alt={player.strPlayer} className="w-full h-full object-cover" />
            )}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow">{player.strPlayer}</h1>
            <Link href={`/team/${player.idTeam}`} className="text-white/80 text-sm hover:underline">
              {player.strTeam}
            </Link>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-8">
        <div className="flex flex-wrap gap-3 mb-6">
          {player.strPosition && (
            <span className="text-xs bg-[var(--surface)] border border-[var(--border)] rounded-full px-3 py-1.5">{player.strPosition}</span>
          )}
          {player.strNumber && (
            <span className="text-xs bg-[var(--surface)] border border-[var(--border)] rounded-full px-3 py-1.5">#{player.strNumber}</span>
          )}
          {player.strNationality && (
            <span className="text-xs bg-[var(--surface)] border border-[var(--border)] rounded-full px-3 py-1.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {player.strNationality}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {age && (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 text-center">
              <Calendar className="w-4 h-4 mx-auto mb-1 text-[var(--gradient-end)]" />
              <p className="text-lg font-bold gradient-text">{age}</p>
              <p className="text-xs text-[var(--muted)]">Age</p>
            </div>
          )}
          {player.strHeight && (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 text-center">
              <Ruler className="w-4 h-4 mx-auto mb-1 text-[var(--gradient-end)]" />
              <p className="text-lg font-bold gradient-text">{player.strHeight}</p>
              <p className="text-xs text-[var(--muted)]">Height</p>
            </div>
          )}
          {player.strWeight && (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 text-center">
              <Weight className="w-4 h-4 mx-auto mb-1 text-[var(--gradient-end)]" />
              <p className="text-lg font-bold gradient-text">{player.strWeight}</p>
              <p className="text-xs text-[var(--muted)]">Weight</p>
            </div>
          )}
        </div>

        {player.strDescriptionEN && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Biography</h2>
            <p className="text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-line">
              {player.strDescriptionEN.slice(0, 600)}
              {player.strDescriptionEN.length > 600 ? "..." : ""}
            </p>
          </div>
        )}

       {(twitterUrl || instagramUrl || facebookUrl) && (
  <div className="flex gap-3">
    {twitterUrl && <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className={linkClass}><ExternalLink className="w-4 h-4" /></a>}
    {instagramUrl && <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={linkClass}><ExternalLink className="w-4 h-4" /></a>}
    {facebookUrl && <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className={linkClass}><ExternalLink className="w-4 h-4" /></a>}
  </div>
)}
      </div>
    </div>
  );
}