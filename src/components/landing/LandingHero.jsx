import SearchBar from "./SearchBar";
import RunnerSection from "./RunnerSection";
import { FaAngleDown } from "react-icons/fa";
import { motion } from "framer-motion";

const LandingHero = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-dark)]">
      {/* Cyberpunk Background Layer */}
      <div className="cyberpunk-bg"></div>

      {/* Neon Blurred Glows */}
      <div className="cyberpunk-neon-glow neon-purple"></div>
      <div className="cyberpunk-neon-glow neon-blue"></div>
      <div className="cyberpunk-neon-glow neon-pink"></div>

      {/* Hero Content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center text-[var(--color-text-light)]">
        <h1 className="text-4xl font-bold text-[var(--color-primary)]">
          Find your Hitless Runner
        </h1>
        <p className="mt-2 text-[var(--color-text-muted)]">
          Look for a legend and see their current and past Runs!
        </p>

        {/* Search Bar */}
        <div className="mt-10">
          <SearchBar />
        </div>

        {/* Animated V-Shaped Arrow */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="mt-10 text-[var(--color-text-muted)]"
        >
          <FaAngleDown size={32} />
        </motion.div>
      </div>

      {/* Runners Section */}
      <RunnerSection />
    </div>
  );
};

export default LandingHero;
