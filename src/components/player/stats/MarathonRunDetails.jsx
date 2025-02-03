import { useState, useEffect } from "react";
import { FaTrophy } from "react-icons/fa";
import StatsVisualizationMarathon from "./StatsVisualizationMarathon";

const MarathonRunDetails = ({ run }) => {
  // ✅ Initialize state with run, but sync when run changes
  const [selectedRun, setSelectedRun] = useState(run);

  // ✅ Whenever `run` changes, update `selectedRun`
  useEffect(() => {
    console.log("🔄 New Marathon Run Selected:", run);
    setSelectedRun(run);
  }, [run]);

  return (
    <div className="flex flex-col">
      {/* Run Overview */}
      <div className="p-6 border border-[var(--color-primary)] rounded-lg shadow-lg bg-[var(--color-dark)]">
        {/* World Record Badge */}
        <div className="flex items-center gap-2 mb-2 text-[var(--color-text-muted)] text-sm">
          <FaTrophy className={`text-base ${selectedRun.worldRecord ? "text-green-400" : "text-red-500"}`} />
          <span className="font-medium">
            World Record Run:{" "}
            <span className={selectedRun.worldRecord ? "text-green-400" : "text-red-500"}>
              {selectedRun.worldRecord ? "Yes" : "No"}
            </span>
          </span>
        </div>

        {/* Run Name */}
        <h3 className="text-2xl font-bold text-[var(--color-primary)]">{selectedRun.name}</h3>

        {/* Run Type & Start Date */}
        <div className="mt-1 flex items-center gap-2">
          <span className="px-2 py-1 text-xs font-semibold bg-[var(--color-secondary)] text-[var(--color-dark)] rounded-lg">
            {selectedRun.type}
          </span>
          <span className="px-2 py-1 text-xs font-semibold bg-[var(--color-secondary)] text-[var(--color-dark)] rounded-lg">
            Start Date: {selectedRun.startDate}
          </span>
        </div>

        {/* Description */}
        <p className="text-[var(--color-text-muted)] mt-2">{selectedRun.description}</p>

        {/* Run Badges */}
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedRun.badges.map((badge, index) => (
            <span key={index} className="px-3 py-1 bg-[var(--color-primary)] text-[var(--color-dark)] rounded-lg text-sm">
              {badge}
            </span>
          ))}
        </div>

        {/* Distance PB */}
        <div className="mt-4 p-3 border border-[var(--color-primary)] rounded-lg text-[var(--color-text-light)] text-sm">
          <strong>Distance PB:</strong> {selectedRun.distancePB.game}, Split: {selectedRun.distancePB.split}
        </div>

        {/* Current Run Status */}
        <div className={`mt-4 px-4 py-2 text-lg font-bold rounded-lg border ${selectedRun.status === "Alive" ? "border-green-500 text-green-400" : "border-red-500 text-red-500"}`}>
          Current Run Status: {selectedRun.status === "Alive" ? "🟢 Alive" : "🔴 Dead"}
        </div>

        {/* Past Runs Dropdown */}
        <div className="mt-6">
          <label className="text-[var(--color-text-muted)] block mb-2">View Past Runs:</label>
          <select
            className="px-3 py-2 bg-[var(--color-dark)] border border-[var(--color-primary)] text-[var(--color-text-light)] rounded-lg"
            onChange={(e) => {
              const pastRun = run.pastRuns.find(r => r.runId === Number(e.target.value));
              if (pastRun) {
                setSelectedRun({
                  ...run,
                  completedSplits: pastRun.completedSplits || {},  
                  failedSplit: { game: pastRun.failedGame, split: pastRun.failedSplit }, 
                  runId: pastRun.runId,
                  currentOrder: pastRun.order || run.currentOrder, // Update game order
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
                  Run {pastRun.runId} - Died in {pastRun.failedGame} at {pastRun.failedSplit}
                </option>
              ))
            ) : (
              <option disabled>No past runs available</option>
            )}
          </select>
        </div>

        {/* Stats Visualization */}
        <StatsVisualizationMarathon pastRuns={selectedRun.pastRuns || []} currentRun={selectedRun} />
      </div>

      {/* Splits Section */}
      <div className="mt-6 p-6 border border-[var(--color-primary)] rounded-lg shadow-lg bg-[var(--color-dark)]">
        {/* Run Attempts Display */}
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-bold text-[var(--color-primary)]">Splits</h3>
          <span className="text-[var(--color-text-muted)]">
            Run Attempts: #{selectedRun.pastRuns?.length ? selectedRun.pastRuns.length + 1 : 1}
          </span>
        </div>

        {/* Render Splits Per Game in 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {selectedRun.currentOrder.map((game) => (
            <div key={game} className="p-4 border border-[var(--color-primary)] rounded-lg shadow-lg bg-[var(--color-dark)]">
              <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2">{game}</h3>
              <ul className="space-y-1">
                {selectedRun.games.find((g) => g.name === game)?.splits.map((split, index) => {
                  let statusClass = "text-gray-500"; 
                  let icon = ""; 

                  const completedSplits = selectedRun.completedSplits?.[game] || 0;
                  
                  if (index < completedSplits) {
                    statusClass = "text-green-400"; // Completed
                    icon = "✔️";
                  }

                  // Failed split turns red when switching runs
                  if (
                    selectedRun.failedSplit?.split === split &&
                    selectedRun.failedSplit?.game === game
                  ) {
                    statusClass = "text-red-500"; // Failed
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarathonRunDetails;
