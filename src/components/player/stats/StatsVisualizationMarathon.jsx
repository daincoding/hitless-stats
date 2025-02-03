import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const StatsVisualizationMarathon = ({ pastRuns }) => {
  if (!pastRuns || pastRuns.length < 5) {
    return <p className="text-[var(--color-text-muted)] mt-5">Not enough data yet!</p>;
  }

  // 1️⃣ Calculate Death Distribution
  const splitCounts = pastRuns.reduce((acc, run) => {
    acc[run.failedSplit] = (acc[run.failedSplit] || 0) + 1;
    return acc;
  }, {});

  const splitLabels = Object.keys(splitCounts);
  const splitData = Object.values(splitCounts);

  const deathPieData = {
    labels: splitLabels,
    datasets: [
      {
        label: "% of Deaths",
        data: splitData,
        backgroundColor: ["#FF3B81", "#35C7F4", "#8E46FF", "#FFA500", "#22C55E"],
      },
    ],
  };

  // 2️⃣ Calculate "Successful Games in a Run"
  const successfulGameCounts = { "Dark Souls I": 0, "Dark Souls II": 0, "Dark Souls III": 0 };

  pastRuns.forEach((run) => {
    run.order.forEach((game) => {
      if (run.completedSplits[game] >= 16) {
        successfulGameCounts[game] += 1;
      }
    });
  });

  const successfulGameLabels = Object.keys(successfulGameCounts);
  const successfulGameData = Object.values(successfulGameCounts);

  const successPieData = {
    labels: successfulGameLabels,
    datasets: [
      {
        label: "Successful Game Completions",
        data: successfulGameData,
        backgroundColor: ["#22C55E", "#35C7F4", "#8E46FF"],
      },
    ],
  };

  // 3️⃣ Calculate "Most Common Failed Game"
  const failedGameCounts = { "Dark Souls I": 0, "Dark Souls II": 0, "Dark Souls III": 0 };

  pastRuns.forEach((run) => {
    failedGameCounts[run.failedGame] = (failedGameCounts[run.failedGame] || 0) + 1;
  });

  const failedGameLabels = Object.keys(failedGameCounts);
  const failedGameData = Object.values(failedGameCounts);

  const failedGamePieData = {
    labels: failedGameLabels,
    datasets: [
      {
        label: "Most Common Failed Game",
        data: failedGameData,
        backgroundColor: ["#FF3B81", "#FFA500", "#8E46FF"],
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
