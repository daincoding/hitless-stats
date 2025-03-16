import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const MarathonPastRuns = ({ player, runId, onClose, fetchRuns }) => {
  const [pastRuns, setPastRuns] = useState([]);

  useEffect(() => {
    fetchPastRuns();
  }, [runId]);

  const fetchPastRuns = async () => {
    if (!player || !runId) {
        console.error("❌ Missing player or run ID", { player, runId });
        toast.error("Invalid request: Missing player or run ID.");
        return;
    }

    const url = `http://localhost:5001/admin/runs/past/${player}/${runId}`;
    console.log("📡 Fetching Past Runs from:", url);

    try {
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        });

        if (!response.ok) {
            console.error("❌ Server returned an error:", response.status, response.statusText);
            throw new Error("Failed to fetch past runs");
        }

        const data = await response.json();
        console.log("✅ Fetched past runs:", data);
        setPastRuns(data);

        await fetchRuns();
    } catch (error) {
        console.error("❌ Error fetching past runs:", error);
        toast.error("Failed to load past runs.");
    }
  };

  const navigate = useNavigate();
  
  const handleDeletePastRun = async (pastRunId) => {
    if (!confirm("Are you sure you want to delete this past run?")) return;

    try {
        const response = await fetch(`http://localhost:5001/admin/runs/delete-past/${player}/${runId}/${pastRunId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        });

        if (!response.ok) throw new Error("Failed to delete past run");

        toast.success("✅ Past run deleted successfully!");
        navigate("/admin/dashboard");
    } catch (error) {
        console.error("❌ Error deleting past run:", error);
        toast.error("Failed to delete past run.");
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg w-full">
      <h3 className="text-xl font-semibold text-purple-400 mb-4">Marathon Past Runs</h3>

      {pastRuns.length > 0 ? (
        <ul className="space-y-2">
          {pastRuns.map((pastRun, index) => (
            <li key={index} className="flex flex-col bg-gray-800 p-3 rounded-lg">
              
              {/* ✅ Run Number and Failure Info */}
              <span className="text-white text-sm font-semibold">
                Run #{index + 1}: Failed at {pastRun.failedGame ? `${pastRun.failedGame}, Split: ${pastRun.failedSplit || "Unknown"}` : "N/A"}
              </span>

              {/* ✅ Game Order - Displayed Below */}
              <span className="text-gray-400 text-xs mt-1">
                Games Order: {pastRun.order ? pastRun.order.join(" → ") : "N/A"}
              </span>

              {/* ✅ Completed Splits - Smaller Below */}
              <span className="text-gray-500 text-xs mt-1">
                {pastRun.completedSplits 
                  ? Object.entries(pastRun.completedSplits)
                      .map(([game, splits]) => `${game}: ${splits} Splits`)
                      .join(", ")
                  : "N/A"}
              </span>

              <Button onClick={() => handleDeletePastRun(index)} className="bg-red-500 hover:bg-red-400 text-white mt-2 w-fit">
                Delete
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No past marathon runs found.</p>
      )}

      <Button onClick={onClose} className="mt-4 bg-gray-700 hover:bg-gray-600 text-white w-full">
        Back
      </Button>
    </div>
  );
};

export default MarathonPastRuns;