import { useState } from "react";
import RunSelector from "./RunSelector";
import RunDetails from "./RunDetails";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CurrentRuns = ({ currentRuns }) => {
  const [selectedRun, setSelectedRun] = useState(currentRuns[0]); // Default to first run
  const [activeIndex, setActiveIndex] = useState(0); // For mobile navigation

  const nextRun = () => {
    const newIndex = (activeIndex + 1) % currentRuns.length;
    setActiveIndex(newIndex);
    setSelectedRun(currentRuns[newIndex]);
  };

  const prevRun = () => {
    const newIndex = (activeIndex - 1 + currentRuns.length) % currentRuns.length;
    setActiveIndex(newIndex);
    setSelectedRun(currentRuns[newIndex]);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6 text-center">
        CURRENT RUNS!
      </h2>

      {/* Desktop View: Normal Selector */}
      <div className="hidden sm:block">
        <RunSelector runs={currentRuns} setSelectedRun={setSelectedRun} selectedRun={selectedRun} />
      </div>

      {/* Mobile View: Carousel Navigation */}
      <div className="sm:hidden flex items-center justify-center relative w-full">
        {/* Left Button */}
        <button 
          onClick={prevRun} 
          className="absolute left-0 bg-[var(--color-primary)] text-[var(--color-dark)] p-2 rounded-full"
        >
          <FaChevronLeft size={18} />
        </button>

        {/* Active Run Display */}
        <div className="p-4 border border-[var(--color-primary)] rounded-lg bg-[var(--color-dark)] text-center w-64 text-white font-semibold text-lg">
          {selectedRun.name}
        </div>

        {/* Right Button */}
        <button 
          onClick={nextRun} 
          className="absolute right-0 bg-[var(--color-primary)] text-[var(--color-dark)] p-2 rounded-full"
        >
          <FaChevronRight size={18} />
        </button>
      </div>

      {/* Run Details */}
      <div className="my-5">
      <RunDetails run={selectedRun} />
      </div>
    </div>
  );
};

export default CurrentRuns;