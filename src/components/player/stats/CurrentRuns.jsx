import { useState } from "react";
import RunSelector from "./RunSelector";
import RunDetails from "./RunDetails";

const CurrentRuns = ({ currentRuns }) => {
  const [selectedRun, setSelectedRun] = useState(currentRuns[0]); // Default to first run

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">
        CURRENT RUNS!
      </h2>

      {/* Run Selector */}
      <RunSelector runs={currentRuns} setSelectedRun={setSelectedRun} selectedRun={selectedRun} />

      {/* Run Details */}
      <RunDetails run={selectedRun} />
    </div>
  );
};

export default CurrentRuns;
