import { useNavigate } from "react-router-dom";
import { FaTwitch, FaYoutube, FaLink } from "react-icons/fa";
import { GiBroadsword } from "react-icons/gi"; 

const RunnerCard = ({ player }) => {
  const navigate = useNavigate(); // React Router Hook for navigating programmatically

  // Function to handle card clicks (navigates to the player's profile)
  const handleCardClick = (e) => {
    // Prevent navigation if the user clicks on a social media button
    if (!e.target.closest(".social-button")) { // if e returns null it means this happend outside of the social media buttons - E is just the general Event in this case onClick
      navigate(`/${player.name}`); // Navigate to the player's profile page if the social button reqeust IS NULL 
    }
  };

  return (
    <div
      onClick={handleCardClick} // Call handleCardClick when the card is clicked
      className="group block bg-[var(--color-dark)] border border-[var(--color-primary)] rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105 hover:shadow-xl cursor-pointer"
    >
      {/* Avatar Section */}
      <img
        src={player.avatar} // Load the player's avatar
        alt={`${player.name} Avatar`} // Provide alt text for accessibility
        className="w-full h-40 object-cover" // Make the image responsive and cover the area
      />

      {/* Player Info Section */}
      <div className="p-6 text-center text-[var(--color-text-light)]">
        {/* Player Name */}
        <h2 className="text-xl font-bold text-[var(--color-primary)]">
          {player.name}
        </h2>

        {/* Display number of completed runs */}
        <p className="text-sm text-[var(--color-text-muted)] mt-3">
          Completed Runs: {player.completedRuns}
        </p>

        {/* Display number of completed marathons */}
        <p className="text-sm text-[var(--color-text-muted)] mb-4">
          Completed Marathons: {player.completedMarathons}
        </p>
      </div>

      {/* Social Media Links */}
      <div className="flex justify-center gap-6 p-4 border-t border-[var(--color-primary)]">
        
        {/* Twitch Link - Only renders if the player has a Twitch profile */}
        {player.socials?.twitch && ( // the ? makes it optional so it just doesnt appear if not there
          <a
            href={player.socials.twitch} // Link to Twitch profile
            target="_blank" // Open in new tab
            rel="noopener noreferrer" // Security best practice
            className="social-button text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
            onClick={(e) => e.stopPropagation()} // Prevent navigation when clicking this link
          >
            <FaTwitch size={22} /> {/* Twitch Icon */}
          </a>
        )}

        {/* YouTube Link - Only renders if the player has a YouTube profile */}
        {player.socials?.youtube && (
          <a
            href={player.socials.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="social-button text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
            onClick={(e) => e.stopPropagation()} 
          >
            <FaYoutube size={22} /> {/* YouTube Icon */}
          </a>
        )}

        {/* Bluesky Link - Only renders if the player has a Bluesky profile */}
        {player.socials?.bluesky && (
          <a
            href={player.socials.bluesky}
            target="_blank"
            rel="noopener noreferrer"
            className="social-button text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
            onClick={(e) => e.stopPropagation()} 
          >
            <FaLink size={22} /> {/* Generic link icon for Bluesky */}
          </a>
        )}

        {/* Team Hitless Link - Only renders if the player has a Team Hitless profile */}
        {player.socials?.teamHitless && (
          <a
            href={player.socials.teamHitless}
            target="_blank"
            rel="noopener noreferrer"
            className="social-button text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
            onClick={(e) => e.stopPropagation()} 
          >
            <GiBroadsword size={24} /> {/* Broadsword icon representing Team Hitless */}
          </a>
        )}
      </div>
    </div>
  );
};

export default RunnerCard;

