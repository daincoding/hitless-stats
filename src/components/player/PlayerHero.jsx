import PlayerInfo from "./PlayerInfo";
import PlayerStream from "./PlayerStream";
import PlayerSchedule from "./PlayerSchedule";
import { FaAngleDown } from "react-icons/fa";
import { motion } from "framer-motion";

const PlayerHero = ({ player }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-[var(--color-text-light)] px-6 pt-[5rem] md:pt-[6rem]">
      
      {/* ✅ Twitch Stream - Always on top (Full Width) */}
      <div className="w-full max-w-7xl flex flex-col items-center justify-center">
        <PlayerStream twitchUrl={player.socials.twitch} />

        {/* Animated Scroll Arrow */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="mt-6 md:mt-10 text-[var(--color-text-muted)]"
        >
          <FaAngleDown size={32} />
        </motion.div>
      </div>

      {/* ✅ Player Info & Schedule Side-by-Side on Large Screens */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* ℹ️ Player Info on the Left */}
        <div className="w-full">
          <PlayerInfo player={player} />
        </div>

        {/* 📅 Schedule on the Right */}
        <div className="w-full">
          <PlayerSchedule schedule={player.schedule} />
        </div>
      </div>

    </div>
  );
};

export default PlayerHero;