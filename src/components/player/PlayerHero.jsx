import PlayerInfo from "./PlayerInfo";
import PlayerStream from "./PlayerStream";
import PlayerSchedule from "./PlayerSchedule";
import { FaAngleDown } from "react-icons/fa";
import { motion } from "framer-motion";

// PlayerHero component receives `player` data as a prop
const PlayerHero = ({ player }) => {
  return (
    // Main container - sets **full-screen height** and centers content
    <div className="min-h-screen flex flex-col items-center justify-center text-[var(--color-text-light)] px-6 pt-[5rem] md:pt-[6rem]">
      
      {/* Grid Layout: Responsive 3-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
        
        {/* Left Column: Player Info & Schedule */}
        <div className="flex flex-col gap-8">
          <PlayerInfo player={player} /> {/* Displays name, description, socials  and passes the info to the next component*/}
          <PlayerSchedule schedule={player.schedule} /> {/* Displays stream schedule */}
        </div>

        {/* Right Column (2 Columns Wide): Twitch Stream (Centered) */}
        <div className="col-span-2 flex flex-col items-center justify-center">
          <PlayerStream twitchUrl={player.socials.twitch} /> {/* Embeds Twitch stream */}

          {/* Animated Scroll Arrow - encourages scrolling down */}
          <motion.div
            animate={{ y: [0, 10, 0] }} // Moves up & down
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} // Smooth loop animation
            className="mt-10 text-[var(--color-text-muted)]"
          >
            <FaAngleDown size={32} /> {/* Down arrow icon */}
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default PlayerHero;




