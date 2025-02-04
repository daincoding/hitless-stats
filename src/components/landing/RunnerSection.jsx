import { useEffect, useState } from "react";
import RunnerCard from "./RunnerCard";
import { motion } from "framer-motion";

const RunnerSection = () => {
  const [runners, setRunners] = useState([]); // Store fetched runners - Initially an empty array! 
  const [loading, setLoading] = useState(true); // Loading state - Checks if Data is loading, starts as true
  const [error, setError] = useState(null); // Error state - Stores if Errors happen

  useEffect(() => {
    const fetchRunners = async () => {
      try {
        const response = await fetch("http://localhost:5001/players"); // API request
        if (!response.ok) {
          throw new Error("Failed to fetch runners"); // Error handling
        }
        const data = await response.json(); // Convert response to JSON
        setRunners(data); // Store fetched runners in state
        console.log("✅ Fetched Runners:", data); // Debugging
      } catch (err) {
        setError(err.message); // Store error message
      } finally {
        setLoading(false); // Stop loading after request completes
      }
    };
  
    fetchRunners();
  }, []); // Runs only once on component mount - [] dependency array to prevent unnecessary requests 

  if (loading) { // Prevents rendering the grid until data is ready.
    return (
      <div className="w-full max-w-7xl mx-auto px-6 mt-15 text-center text-[var(--color-primary)]">
        <h2 className="text-3xl font-bold mb-8">Loading Runners...</h2>
      </div>
    );
  }

  if (error) { // Shows an error message in red if fetching fails. Ensures the UI does not break when an error occurs.
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
          {runners.map((player) => ( // For each PLAYER in the array it creates a RunnerCard Component here
            <RunnerCard key={player.id} player={player} /> // using the player.id as a key here to make it unique 
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default RunnerSection;
