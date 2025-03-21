import { useState, useEffect } from "react";
import PlayerInfo from "./PlayerInfo";
import PlayerStream from "./PlayerStream";
import PlayerSchedule from "./PlayerSchedule";
import { FaAngleDown } from "react-icons/fa";
import { motion } from "framer-motion";

const PlayerHero = ({ player }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // ✅ Update width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isLargeScreen = windowWidth > 1280;

  return (
    <div
      className={`flex flex-col items-center justify-center text-[var(--color-text-light)] px-6 ${
        isLargeScreen ? "min-h-screen pt-[6rem]" : "pt-[5rem] pb-10"
      }`}
    >
      {/* ✅ Twitch Stream & Arrow Only on Large Screens */}
      {isLargeScreen && (
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
      )}

      {/* ✅ Player Info & Schedule */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="w-full">
          <PlayerInfo player={player} />
        </div>
        <div className="w-full">
          <PlayerSchedule schedule={player.schedule} />
        </div>
      </div>
    </div>
  );
};

export default PlayerHero;