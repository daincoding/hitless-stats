import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";

Chart.register(ArcElement, Tooltip, Legend);

const StatsVisualizationMarathon = ({ pastRuns, currentRun }) => {
  // Keep track of selectedRun inside state
  const [selectedRun, setSelectedRun] = useState(currentRun);

  //Ensure selectedRun updates when a new Marathon run is selected
  useEffect(() => {
    setSelectedRun(currentRun);
  }, [currentRun]);

  if (!selectedRun || !selectedRun.games) return null;

  if (!pastRuns || pastRuns.length < 5 || !selectedRun || !selectedRun.games) {
    return <p className="text-[var(--color-text-muted)] mt-5">Not enough data yet!</p>;
  }
  const gameNames = selectedRun.games.map((game) => game.name);

  // Calculate Death Distribution
  const splitCounts = pastRuns.reduce((acc, run) => {
    if (typeof run.failedSplit === "object" && run.failedSplit.split) {
      acc[run.failedSplit.split] = (acc[run.failedSplit.split] || 0) + 1;
    } else if (typeof run.failedSplit === "string") {
      acc[run.failedSplit] = (acc[run.failedSplit] || 0) + 1;
    }
    return acc;
  }, {});

  const deathPieData = {
    labels: Object.keys(splitCounts),
    datasets: [
      {
        label: "% of Deaths",
        data: Object.values(splitCounts),
        backgroundColor: ["#FF3B81", "#35C7F4", "#8E46FF", "#FFA500", "#22C55E"],
      },
    ],
  };

  // Calculate "Successful Games in a Run"
  const successfulGameCounts = gameNames.reduce((acc, game) => {
    acc[game] = 0;
    return acc;
  }, {});

  pastRuns.forEach((run) => {
    run.order.forEach((game) => {
      if (run.completedSplits[game] >= 10) {
        successfulGameCounts[game] += 1;
      }
    });
  });

  const successPieData = {
    labels: Object.keys(successfulGameCounts),
    datasets: [
      {
        label: "Successful Game Completions",
        data: Object.values(successfulGameCounts),
        backgroundColor: ["#22C55E", "#35C7F4", "#8E46FF", "#FF3B81", "#FFA500"],
      },
    ],
  };

  // Calculate "Most Common Failed Game"
  const failedGameCounts = gameNames.reduce((acc, game) => {
    acc[game] = 0;
    return acc;
  }, {});

  pastRuns.forEach((run) => {
    if (run.failedGame) {
      failedGameCounts[run.failedGame] = (failedGameCounts[run.failedGame] || 0) + 1;
    }
  });

  const failedGamePieData = {
    labels: Object.keys(failedGameCounts),
    datasets: [
      {
        label: "Most Common Failed Game",
        data: Object.values(failedGameCounts),
        backgroundColor: ["#FF3B81", "#FFA500", "#8E46FF", "#22C55E", "#35C7F4"],
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {/* Pie Chart - Death % */}
      <div className="flex flex-col items-center">
        <h4 className="text-lg font-bold text-[var(--color-primary)] mb-2">Death Distribution</h4>
        <div className="w-[200px] h-[200px]">
          <Pie data={deathPieData} />
        </div>
      </div>

      {/* Pie Chart - Most Common Failed Game */}
      <div className="flex flex-col items-center">
        <h4 className="text-lg font-bold text-[var(--color-primary)] mb-2">Most Common Failed Game</h4>
        <div className="w-[200px] h-[200px]">
          <Pie data={failedGamePieData} />
        </div>
      </div>

      {/* Pie Chart - Successful Games */}
      <div className="flex flex-col items-center">
        <h4 className="text-lg font-bold text-[var(--color-primary)] mb-2">Successful Games in a Run</h4>
        <div className="w-[200px] h-[200px]">
          <Pie data={successPieData} />
        </div>
      </div>
    </div>
  );
};

export default StatsVisualizationMarathon;
