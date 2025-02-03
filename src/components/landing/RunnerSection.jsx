import RunnerCard from "./RunnerCard";
import { players } from "../../data/players";
import { motion } from "framer-motion";

const RunnerSection = () => {
  return (
    <div id="runners-section" className="w-full max-w-7xl mx-auto px-6 mt-15">
      {/* Left-Aligned Heading */}
      <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-8 text-blend">
        Runners
      </h2>

      {/* Responsive Grid Layout */}
      <motion.div
      whileInView={{ y: 0, opacity: 1}}
      initial={{ y: 100, opacity: 0}}
      transition={{ duration: 0.25, delay: 0.25}}
      >
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8 mb-10">
        {Object.values(players).map((player) => (
          <RunnerCard key={player.name} player={player} />
        ))}
      </div>
      </motion.div>
    </div>
  );
};

export default RunnerSection;
