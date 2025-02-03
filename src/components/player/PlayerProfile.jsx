import { useParams } from "react-router-dom";
import { players } from "../../data/players";
import BackgroundWrapper from "../layout/BackgroundWrapper";
import PlayerHero from "./PlayerHero";
import CurrentRuns from "./stats/CurrentRuns";
import PastNoHitRuns from "./PastNoHitRuns";
import Guides from "./Guides";
import Footer from "../landing/Footer";
import { useEffect } from "react";
import { motion } from "framer-motion";

// Animation Presets

const aniContainerOpacity = (delay) => ({
hidden: { opacity: 0 },
visible: {
    opacity: 1,
    transition: { duration: 0.55, delay: delay},
},
});


const PlayerProfile = () => {
  const { playerName } = useParams(); // Get player name from URL
  const player = players[playerName]; // Fetch the corresponding player data

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [playerName]);

  if (!player) {
    return (
      <BackgroundWrapper>
        <motion.div 
        variants={aniContainerOpacity(0.25)}
        initial='hidden'
        animate='visible'
        className="min-h-screen flex flex-col items-center justify-center text-[var(--color-text-light)]">
          <h1 className="text-4xl font-bold text-[var(--color-accent)]">Player Not Found</h1>
        </motion.div>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      {/* Hero Section */}
      <motion.div 
      whileInView={{ opacity: 1}}
      initial={{ opacity: 0}}
      transition={{ duration: 0.25, delay: 0.25}}
      id="hero-section">
        <PlayerHero player={player} />
      </motion.div>

      {/* Current Runs Section */}
      <motion.div 
      whileInView={{ opacity: 1}}
      initial={{ opacity: 0}}
      transition={{ duration: 0.25, delay: 0.25}}
      id="current-runs-section" className="mt-16">
        <CurrentRuns currentRuns={player.currentRuns} />
      </motion.div>

      {/* Past Runs Section */}
      <motion.div 
      whileInView={{ opacity: 1}}
      initial={{ opacity: 0}}
      transition={{ duration: 0.25, delay: 0.25}}
      id="past-runs-section" className="mt-16">
        <PastNoHitRuns pastRuns={player.pastNoHitRuns} />
      </motion.div>

      {/* Guides Section */}
      <motion.div 
      whileInView={{ opacity: 1}}
      initial={{ opacity: 0}}
      transition={{ duration: 0.25, delay: 0.25}}
      id="guides-section" className="mt-16 mb-20">
        <Guides guides={player.guides} />
      </motion.div>

      {/* Footer Section */}
      <Footer />
    </BackgroundWrapper>
  );
};

export default PlayerProfile;
