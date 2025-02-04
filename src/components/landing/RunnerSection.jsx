import { useEffect, useState } from "react";
import RunnerCard from "./RunnerCard";
import { motion } from "framer-motion";

const RunnerSection = () => {
  const [runners, setRunners] = useState([]); // Store fetched runners
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchRunners = async () => {
      try {
        const response = await fetch("http://localhost:5001/players");
        if (!response.ok) {
          throw new Error("Failed to fetch runners");
        }
        const data = await response.json();
        setRunners(data);
        console.log("✅ Fetched Runners:", data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRunners();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6 mt-15 text-center text-[var(--color-primary)]">
        <h2 className="text-3xl font-bold mb-8">Loading Runners...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6 mt-15 text-center text-red-500">
        <h2 className="text-3xl font-bold mb-8">Error: {error}</h2>
      </div>
    );
  }

  return (
    <div id="runners-section" className="w-full max-w-7xl mx-auto px-6 mt-15">
      {/* Left-Aligned Heading */}
      <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-8 text-blend">
        Runners
      </h2>

      {/* Responsive Grid Layout */}
      <motion.div whileInView={{ y: 0, opacity: 1 }} initial={{ y: 100, opacity: 0 }} transition={{ duration: 0.25, delay: 0.25 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-10">
          {runners.map((player) => (
            <RunnerCard key={player.id} player={player} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default RunnerSection;
