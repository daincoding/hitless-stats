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
          <strong>Distance PB:</strong>{" "}  {/* Checks if distancePB exists: If not → "Current Run" is displayed in green. Otherwise → Shows the furthest reached split in the format "Split Name (X/Y)".*/}
          {selectedRun.distancePB === "-" ? ( 
            <span className="text-green-400">Current Run</span>
          ) : (
            `${selectedRun.distancePB.split} (${selectedRun.distancePB.reachedSplits}/${selectedRun.distancePB.totalSplits})`
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
            className="px-3 py-2 bg-[var(--color-dark)] border border-[var(--color-primary)] text-[var(--color-text-light)] rounded-lg"
            onChange={(e) => {
              const pastRun = run.pastRuns.find(r => r.runId === Number(e.target.value)); // The dropdown onChange event passes the selected value (e.target.value), which corresponds to a runId.
              if (pastRun) { // run.pastRuns → This is an array of past runs. .find(r => r.runId === Number(e.target.value)) .find() searches for a past run where: The runId of the object (r.runId) matches the selected dropdown value.
                // Since e.target.value is a string, we use Number() to convert it to an integer. Finds run.pastRuns.find(r => r.runId === 2), retrieving the past run with runId: 2
                setSelectedRun({ // setSelectedRun({...run, ...}) → This updates the state of selectedRun while keeping the original run properties.
                  ...run, // The ...run (Spread Operator) Copies all properties of the current run into a new object.
                  completedSplits: pastRun.completedSplits || 0, 
                  failedSplit: pastRun.failedSplit || "",
                  runId: pastRun.runId, // Sets the new runId, allowing the UI to track the specific past run.
                });
              } else {
                setSelectedRun(run); // If no matching past run is found, we reset selectedRun back to the original run.
              }
            }}
          >
            <option value={run.id}>Current Run</option>
            {run.pastRuns?.length > 0 ? ( // run.pastRuns?.length > 0 → Ensures there are past runs available before mapping through them. ?. (Optional Chaining) → Prevents crashes if pastRuns is undefined or null.
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
            console.log("🔍 Checking Split:", split);
            console.log("🚨 Failed Split from API:", selectedRun.failedSplit);


            let statusClass = "text-gray-500"; // uses as Styling element 
            let icon = "";

            if (index < selectedRun.completedSplits) {
              statusClass = "text-green-400";
              icon = "✔️";
            }
            const failedSplit = selectedRun.failedSplit?.split || null;

            if (split.trim().toLowerCase() === failedSplit?.trim().toLowerCase()) { // selectedRun.failedSplit?.split || null → If failedSplit exists, get its split value. Otherwise, set it to null.
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
