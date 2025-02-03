import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const StatsVisualization = ({ pastRuns }) => {
  if (!pastRuns || pastRuns.length < 5) {
    return <p className="text-[var(--color-text-muted)] mt-5">Not enough data yet!</p>;
  }

  const splitCounts = pastRuns.reduce((acc, run) => {
    acc[run.failedSplit] = (acc[run.failedSplit] || 0) + 1;
    return acc;
  }, {});

  const splitLabels = Object.keys(splitCounts);
  const splitData = Object.values(splitCounts);

  const pieData = {
    labels: splitLabels,
    datasets: [
      {
        label: "% of Deaths",
        data: splitData,
        backgroundColor: ["#FF3B81", "#35C7F4", "#8E46FF", "#FFA500", "#22C55E"],
      },
    ],
  };

  return (
    <div className="mt-6">
      {/* Pie Chart - Death % */}
      <div className="flex flex-col items-center">
        <h4 className="text-lg font-bold text-[var(--color-primary)] mb-2">Death Distribution</h4>
        <div className="w-[450px] h-[450px]"> 
          <Pie 
            data={pieData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: "bottom",
                  labels: {
                    font: {
                      size: 12 
                    },
                    boxWidth: 12, 
                    padding: 8 
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatsVisualization;
