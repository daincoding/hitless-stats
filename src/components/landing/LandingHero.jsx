import SearchBar from "./SearchBar";
import RunnerSection from "./RunnerSection";
import Footer from "./Footer";
import BackgroundWrapper from "../layout/BackgroundWrapper";
import { FaAngleDown } from "react-icons/fa";
import { motion } from "framer-motion";

const LandingHero = () => {
  return (
    <BackgroundWrapper>
      {/* Hero Content */}
      <div className="min-h-screen flex flex-col items-center justify-center text-[var(--color-text-light)]">
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

      {/* Footer */}
      <Footer />
    </BackgroundWrapper>
  );
};

export default LandingHero;
