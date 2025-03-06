import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend); // Registers necessary chart elements

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
    <div className="mt-6 flex flex-col items-center w-full">
      {/* Title */}
      <h4 className="text-lg font-bold text-[var(--color-primary)] mb-2">Death Distribution</h4>

      {/* Responsive Wrapper for Chart */}
      <div className="w-full max-w-[320px] sm:max-w-[450px] h-auto">
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
                    size: 10 // Smaller text for mobile
                  },
                  boxWidth: 10, // Reduce size of legend color boxes
                  padding: 5
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default StatsVisualization;