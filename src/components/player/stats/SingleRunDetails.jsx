import { useState, useEffect } from "react";
import { FaTrophy } from "react-icons/fa";
import StatsVisualization from "./StatsVisualizationSingle";

const SingleRunDetails = ({ run }) => { // getting Data from Parent 
  const [selectedRun, setSelectedRun] = useState(run); // Stores Data in the useState - changes when we show a pastRun otherwise its the current Run 

  const formatDate = (isoString) => { // ISO convertion for the Date to show Month Day and Year
    const options = {year: "numeric", month: "long", day: "numeric"};
    return new Date(isoString).toLocaleDateString("en-US", options);
  }


  // Switching between Runs
  useEffect(() => { // Runs whenever the run prop changes
    setSelectedRun(run); // ensures selectedRun updates when we switch between runs.
  }, [run]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column: Run Overview */}
      <div className="p-6 border border-[var(--color-primary)] rounded-lg shadow-lg bg-[var(--color-dark)]">
        {/* World Record Badge */}
        <div className="flex items-center gap-2 mb-2 text-[var(--color-text-muted)] text-sm">
          <FaTrophy className={`text-base ${selectedRun.worldRecord ? "text-green-400" : "text-red-500"}`} />
          <span className="font-medium">
            World Record Run:{" "}
            <span className={selectedRun.worldRecord ? "text-green-400" : "text-red-500"}>
              {selectedRun.worldRecord ? "Yes" : "No"} {/* TrueFalse Boolean */}
            </span>
          </span>
        </div>

        <h3 className="text-2xl font-bold text-[var(--color-primary)]">{selectedRun.name}</h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="px-2 py-1 text-xs font-semibold bg-[var(--color-secondary)] text-[var(--color-dark)] rounded-lg">
            {selectedRun.type}
          </span>
          <span className="px-2 py-1 text-xs font-semibold bg-[var(--color-secondary)] text-[var(--color-dark)] rounded-lg">
            Start Date: {formatDate(selectedRun.startDate)} {/* use the formatDate function */}
          </span>
        </div>
        <p className="text-[var(--color-text-muted)] mt-2">{selectedRun.description}</p>

        {/* Badges */}
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedRun.badges.map((badge, index) => (
            <span key={index} className="px-3 py-1 bg-[var(--color-primary)] text-[var(--color-dark)] rounded-lg text-sm">
              {badge}
            </span>
          ))}
        </div>

        {/* Distance PB */}
        <div className="mt-4 p-3 border border-[var(--color-primary)] rounded-lg text-[var(--color-text-light)] text-sm">
  <strong>Distance PB:</strong>{" "}
  {selectedRun.distancePB && selectedRun.distancePB.split ? ( 
    `${selectedRun.distancePB.split} (${selectedRun.distancePB.reachedSplits}/${selectedRun.distancePB.totalSplits})`
  ) : (
    <span className="text-green-400">Current Run</span>
  )}
</div>

        {/* Current Run Status */}
        <div className={`mt-4 flex items-center gap-2 px-4 py-2 text-lg font-bold rounded-lg border ${selectedRun.status === "Alive" ? "border-green-500 text-green-400" : "border-red-500 text-red-500"}`}>
          <span>Current Run Status:</span> {selectedRun.status === "Alive" ? "🟢 Alive" : "🔴 Dead"}
        </div>

        {/* Past Runs Dropdown // This function runs when the user selects a past run from the dropdown.*/}
        <div className="mt-6">
  <label className="text-[var(--color-text-muted)] block mb-2">View Past Runs:</label>
  <select
    className="px-3 py-2 bg-[var(--color-dark)] border border-[var(--color-primary)] text-[var(--color-text-light)] rounded-lg 
               w-full sm:w-[250px] text-sm overflow-hidden truncate"
    onChange={(e) => {
      const pastRun = run.pastRuns.find(r => r.runId === Number(e.target.value));
      if (pastRun) {
        setSelectedRun({
          ...run,
          completedSplits: pastRun.completedSplits || 0, 
          failedSplit: pastRun.failedSplit || "",
          runId: pastRun.runId,
        });
      } else {
        setSelectedRun(run);
      }
    }}
  >
    <option value={run.id}>Current Run</option>
    {run.pastRuns?.length > 0 ? (
      run.pastRuns.map((pastRun) => (
        <option key={pastRun.runId} value={pastRun.runId}>
          Run {pastRun.runId} - Died at {pastRun.failedSplit}
        </option>
      ))
    ) : (
      <option disabled>No past runs available</option>
    )}
  </select>
</div>

        {/* Stats Visualisation */}
        <StatsVisualization pastRuns={selectedRun.pastRuns || []} />
      </div>

      {/* Right Column: Split Tracker */}
      <div className="p-6 border border-[var(--color-primary)] rounded-lg shadow-lg bg-[var(--color-dark)]">
        {/* Run Attempt Display */}
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-bold text-[var(--color-primary)]">Splits</h3>
          <span className="text-[var(--color-text-muted)]"> {/* selectedRun.pastRuns?.length → Tries to get the count of past runs. - If past runs exist (> 0) → It takes pastRuns.length and adds +1 for the current run. */}
            Run Attempts: #{selectedRun.pastRuns?.length ? selectedRun.pastRuns.length + 1 : 1} 
          </span> 
        </div>

        <ul className="space-y-1">
  {selectedRun.splits.map((split, index) => {
    let statusClass = "text-gray-500"; // Default styling
    let icon = "";

    // Check if the split was completed successfully
    if (index < selectedRun.completedSplits) {
      statusClass = "text-green-400";
      icon = "✔️";
    }

    // Determine if we are in the current run
    const isCurrentRun = selectedRun.runId === run.runId; 

    // Get failed split safely
    const currentFailedSplit = String(run.failedSplit?.split || run.failedSplit || "").trim().toLowerCase();
    const pastFailedSplit = String(selectedRun.failedSplit || "").trim().toLowerCase();

    // Ensure we highlight the correct failed split
    const failedSplitToCheck = isCurrentRun ? currentFailedSplit : pastFailedSplit;

    if (split.trim().toLowerCase() === failedSplitToCheck) {
      statusClass = "text-red-500"; 
      icon = "❌";
    }
            return (
              <li key={index} className={`flex justify-between px-3 py-1 border-b border-[var(--color-primary)] ${statusClass}`}>
                <span>{split}</span>
                <span>{icon}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SingleRunDetails;
