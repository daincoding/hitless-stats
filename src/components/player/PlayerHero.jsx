import PlayerInfo from "./PlayerInfo";
import PlayerStream from "./PlayerStream";
import PlayerSchedule from "./PlayerSchedule";
import { FaAngleDown } from "react-icons/fa";
import { motion } from "framer-motion";

const PlayerHero = ({ player }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-[var(--color-text-light)] px-6 pt-[5rem] md:pt-[6rem]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
        {/* Left Column: Player Info + Schedule */}
        <div className="flex flex-col gap-8">
          <PlayerInfo player={player} />
          <PlayerSchedule schedule={player.schedule} />
        </div>

        {/* Right Column: Twitch Stream (Centered) */}
        <div className="col-span-2 flex flex-col items-center justify-center">
          <PlayerStream twitchUrl={player.socials.twitch} />

          {/* Animated Scroll Arrow */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="mt-10 text-[var(--color-text-muted)]"
          >
            <FaAngleDown size={32} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PlayerHero;




