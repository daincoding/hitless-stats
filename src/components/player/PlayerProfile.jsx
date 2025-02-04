import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BackgroundWrapper from "../layout/BackgroundWrapper";
import PlayerHero from "./PlayerHero";
import CurrentRuns from "./stats/CurrentRuns";
import PastNoHitRuns from "./PastNoHitRuns";
import Guides from "./Guides";
import Footer from "../landing/Footer";
import { motion } from "framer-motion";

// Animation Presets
const aniContainerOpacity = (delay) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.55, delay: delay },
  },
});

const PlayerProfile = () => {
  const { playerName } = useParams(); // Get player name from URL
  const [player, setPlayer] = useState(null); // Store player data
  const [loading, setLoading] = useState(true); // Handle loading state
  const [error, setError] = useState(null); // Handle errors

  useEffect(() => {
    window.scrollTo(0, 0); // Ensure page starts at the top

    // Fetch player data dynamically
    const fetchPlayer = async () => {
      try {
        const response = await fetch(`http://localhost:5001/players/${playerName}`);
        if (!response.ok) {
          throw new Error("Player not found");
        }
        const data = await response.json();
        setPlayer(data);

        console.log("✅ Fetched Player Data:", data);
        console.log("✅ Current Runs:", data?.currentRuns || "No runs available");

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [playerName]);

  if (loading) {
    return (
      <BackgroundWrapper>
        <motion.div
          variants={aniContainerOpacity(0.25)}
          initial="hidden"
          animate="visible"
          className="min-h-screen flex flex-col items-center justify-center text-[var(--color-text-light)]"
        >
          <h1 className="text-4xl font-bold text-[var(--color-accent)]">Loading...</h1>
        </motion.div>
      </BackgroundWrapper>
    );
  }

  if (error) {
    return (
      <BackgroundWrapper>
        <motion.div
          variants={aniContainerOpacity(0.25)}
          initial="hidden"
          animate="visible"
          className="min-h-screen flex flex-col items-center justify-center text-[var(--color-text-light)]"
        >
          <h1 className="text-4xl font-bold text-[var(--color-accent)]">{error}</h1>
        </motion.div>
      </BackgroundWrapper>
    );
  }

  // Prevent crashes if `player` is null or missing properties
  if (!player) {
    return (
      <BackgroundWrapper>
        <motion.div
          variants={aniContainerOpacity(0.25)}
          initial="hidden"
          animate="visible"
          className="min-h-screen flex flex-col items-center justify-center text-[var(--color-text-light)]"
        >
          <h1 className="text-4xl font-bold text-[var(--color-accent)]">Player Not Found</h1>
        </motion.div>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      {/* Hero Section */}
      <motion.div whileInView={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 0.25, delay: 0.25 }} id="hero-section">
        <PlayerHero player={player} />
      </motion.div>

      {/* Current Runs Section */}
      <motion.div whileInView={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 0.25, delay: 0.25 }} id="current-runs-section" className="mt-16">
        {player?.currentRuns?.length > 0 ? (
          <CurrentRuns currentRuns={player.currentRuns} />
        ) : (
          <p className="text-center text-lg text-gray-400">No active runs at the moment.</p>
        )}
      </motion.div>

      {/* Past Runs Section */}
      <motion.div whileInView={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 0.25, delay: 0.25 }} id="past-runs-section" className="mt-16">
        {player?.pastNoHitRuns?.length > 0 ? (
          <PastNoHitRuns pastRuns={player.pastNoHitRuns} />
        ) : (
          <p className="text-center text-lg text-gray-400">No past No-Hit runs recorded.</p>
        )}
      </motion.div>

      {/* Guides Section */}
      <motion.div whileInView={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 0.25, delay: 0.25 }} id="guides-section" className="mt-16 mb-20">
        {player?.guides?.length > 0 ? (
          <Guides guides={player.guides} />
        ) : (
          <p className="text-center text-lg text-gray-400">No guides available yet.</p>
        )}
      </motion.div>

      {/* Footer Section */}
      <Footer />
    </BackgroundWrapper>
  );
};

export default PlayerProfile;
