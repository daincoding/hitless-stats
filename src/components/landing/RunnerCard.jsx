import { Link } from "react-router-dom";
import { FaTwitch, FaYoutube, FaLink } from "react-icons/fa";
import { GiBroadsword } from "react-icons/gi"; // Sword Icon for Team Hitless

const RunnerCard = ({ player }) => {
  return (
    <Link to={`/${player.name}`} className="group block">
      <div className="bg-[var(--color-dark)] border border-[var(--color-primary)] rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105 hover:shadow-xl">
        {/* Avatar */}
        <img
          src={player.avatar}
          alt={`${player.name} Avatar`}
          className="w-full h-40 object-cover"
        />

        {/* Player Info */}
        <div className="p-6 text-center text-[var(--color-text-light)]">
          <h2 className="text-xl font-bold text-[var(--color-primary)]">{player.name}</h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-3">
            Completed Runs: {player.completedRuns}
          </p>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            Completed Marathons: {player.completedMarathons}
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 p-4 border-t border-[var(--color-primary)]">
          <a href={player.twitch} target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">
            <FaTwitch size={22} />
          </a>
          <a href={player.youtube} target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">
            <FaYoutube size={22} />
          </a>
          <a href={player.bluesky} target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">
            <FaLink size={22} />
          </a>
          <a href={player.teamHitless} target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">
            <GiBroadsword size={24} />
          </a>
        </div>
      </div>
    </Link>
  );
};

export default RunnerCard;
