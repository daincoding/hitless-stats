import { FaTwitch, FaYoutube, FaLink } from "react-icons/fa";
import { GiBroadsword } from "react-icons/gi";

const PlayerInfo = ({ player }) => {
  return (
    <div className="flex flex-col items-start">
      {/* Name */}
      <h1 className="text-4xl font-bold text-[var(--color-primary)]">{player.name}</h1>

      {/* Short Description */}
      <p className="mt-2 text-[var(--color-text-muted)]">{player.description}</p>

      {/* Socials */}
      <div className="flex flex-col mt-6 space-y-4">
      {player.socials.twitch && (
          <a href={player.socials.twitch} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition">
            <FaTwitch size={20} /> Twitch
          </a>
        )}
        {player.socials.youtube && (
          <a href={player.socials.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition">
            <FaYoutube size={20} /> YouTube
          </a>
        )}
        {player.socials.bluesky && (
          <a href={player.socials.bluesky} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition">
            <FaLink size={20} /> Bluesky
          </a>
        )}
        {player.socials.teamHitless && (
          <a href={player.socials.teamHitless} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition">
            <GiBroadsword size={22} /> Team Hitless
          </a>
        )}
      </div>
    </div>
  );
};

export default PlayerInfo;
