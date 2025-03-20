import { useState } from "react";
import { FaHeart, FaHome, FaMap } from "react-icons/fa";
import { GiBroadsword } from "react-icons/gi";
import RoadmapModal from "./RoadmapModal"; // ✅ Import Modal

const Navbar = () => {
  const [showRoadmap, setShowRoadmap] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-16 bg-[var(--color-dark)] flex items-center justify-between px-6 border-b border-[var(--color-primary)] shadow-lg z-50">
        
        {/* ✅ Left Section: Logo */}
        <div className="flex items-center gap-2 text-[var(--color-primary)] text-xl font-bold">
          <GiBroadsword size={24} /> 
          <span>Hitless Tracker</span> 
        </div>

        {/* ✅ Middle Section: Navigation Links (Hidden on Mobile) */}
        <div className="hidden md:flex gap-8 text-[var(--color-text-light)]">
          <a href="https://teamhitless.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-primary)] transition hidden md:inline">
            Team Hitless
          </a>
          <button onClick={() => document.getElementById("runners-section")?.scrollIntoView({ behavior: "smooth" })}
            className="hover:text-[var(--color-primary)] transition hidden md:inline">
            Runners
          </button>
          <button onClick={() => setShowRoadmap(true)} className="hover:text-[var(--color-primary)] transition flex items-center gap-1">
            <FaMap />
            Roadmap
          </button>
        </div>

        {/* ✅ Right Section: "With ❤️ by dain" */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
            <span>With</span>
            <FaHeart className="text-red-500" />
            <span>by dain.</span>
          </div>
        </div>
      </nav>

      {/* ✅ Roadmap Modal (Only visible when triggered) */}
      {showRoadmap && <RoadmapModal onClose={() => setShowRoadmap(false)} />}
    </>
  );
};

export default Navbar;