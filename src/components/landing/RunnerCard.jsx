import { useNavigate } from "react-router-dom";
import { FaTwitch, FaYoutube, FaLink } from "react-icons/fa";
import { GiBroadsword } from "react-icons/gi"; 

const RunnerCard = ({ player }) => {
  const navigate = useNavigate(); // Hook for manual navigation

  // Handle navigation to player profile when clicking outside social buttons
  const handleCardClick = (e) => {
    if (!e.target.closest(".social-button")) {
      navigate(`/${player.name}`); 
    }
  };

  return (
    <div
      onClick={handleCardClick} 
      className="group block bg-[var(--color-dark)] border border-[var(--color-primary)] rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105 hover:shadow-xl cursor-pointer"
    >
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
        {player.socials?.twitch && (
          <a
            href={player.socials.twitch}
            target="_blank"
            rel="noopener noreferrer"
            className="social-button text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
            onClick={(e) => e.stopPropagation()} 
          >
            <FaTwitch size={22} />
          </a>
        )}
        {player.socials?.youtube && (
          <a
            href={player.socials.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="social-button text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
            onClick={(e) => e.stopPropagation()}
          >
            <FaYoutube size={22} />
          </a>
        )}
        {player.socials?.bluesky && (
          <a
            href={player.socials.bluesky}
            target="_blank"
            rel="noopener noreferrer"
            className="social-button text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
            onClick={(e) => e.stopPropagation()} 
          >
            <FaLink size={22} />
          </a>
        )}
        {player.socials?.teamHitless && (
          <a
            href={player.socials.teamHitless}
            target="_blank"
            rel="noopener noreferrer"
            className="social-button text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
            onClick={(e) => e.stopPropagation()}
          >
            <GiBroadsword size={24} />
          </a>
        )}
      </div>
    </div>
  );
};

export default RunnerCard;
