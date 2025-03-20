import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BackgroundWrapper from "../layout/BackgroundWrapper";
import PlayerHero from "./PlayerHero";
import CurrentRuns from "./stats/CurrentRuns";
import PastNoHitRuns from "./PastNoHitRuns";
import Guides from "./Guides";
import Footer from "../landing/Footer";
import { motion } from "framer-motion";

// Animation Presets for Fade-in Effect
const aniContainerOpacity = (delay) => ({
  hidden: { opacity: 0 }, // Start fully transparent
  visible: {
    opacity: 1, // Fade in to full opacity
    transition: { duration: 0.55, delay: delay }, // Custom delay for smooth effect
  },
});

// React Component for Player Profile Page
const PlayerProfile = () => {
  const { playerName } = useParams(); // Extract player name from URL params
  const [player, setPlayer] = useState(null); // Stores fetched player data
  const [loading, setLoading] = useState(true); // Handles loading state
  const [error, setError] = useState(null); // Stores any fetch errors

  useEffect(() => { // useEffect always plays once
    window.scrollTo(0, 0); // Ensures page starts at the top when loaded

    // Function to fetch player data dynamically from the backend API
    const fetchPlayer = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/players/${playerName}`); // API call to fetch player data
        if (!response.ok) {
          throw new Error("Player not found"); // Handle 404 errors
        }
        const data = await response.json(); // Convert response to JSON
        setPlayer(data); // Store player data in state

        // Debugging logs for checking fetched data
        console.log("✅ Fetched Player Data:", data);
        console.log("✅ Current Runs:", data?.currentRuns || "No runs available");

      } catch (err) {
        setError(err.message); // Store error message in state
      } finally {
        setLoading(false); // Stop loading animation when fetch completes
      }
    };

    fetchPlayer(); // Call the fetch function when the component mounts
  }, [playerName]); // Re-run fetch when `playerName` changes

  // Display loading screen while data is being fetched
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

  // Display error message if player data couldn't be fetched
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
        <PlayerHero player={player} />   {/* Passing player Info to the Component from the fetched Data */}
      </motion.div> 

      {/* Current Runs Section */}
      <motion.div whileInView={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 0.25, delay: 0.25 }} id="current-runs-section" className="mt-16">
        {/* If player has current runs, show them; otherwise, show a message */}
        {player?.currentRuns?.length > 0 ? ( // everything optional in case of not working
          <CurrentRuns currentRuns={player.currentRuns} /> 
        ) : (
          <p className="text-center text-lg text-gray-400">No active runs at the moment.</p>
        )}
      </motion.div>

      {/* Past Runs Section */}
      <motion.div whileInView={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 0.25, delay: 0.25 }} id="past-runs-section" className="mt-16">
        {/* If player has past No-Hit runs, show them; otherwise, show a message */}
        {player?.pastNoHitRuns?.length > 0 ? (
          <PastNoHitRuns pastRuns={player.pastNoHitRuns} />
        ) : (
          <p className="text-center text-lg text-gray-400">No past No-Hit runs recorded.</p>
        )}
      </motion.div>

      {/* Guides Section */}
      <motion.div whileInView={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 0.25, delay: 0.25 }} id="guides-section" className="mt-16 mb-20">
        {/* If player has guides, show them; otherwise, show a message */}
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
