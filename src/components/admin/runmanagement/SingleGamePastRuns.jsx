import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const SingleGamePastRuns = ({ player, runId, onClose, fetchRuns }) => {
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
    console.log("📡 Fetching Past Runs from:", url); // ✅ Debugging URL

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

        // ✅ Also refresh SingleGameRunList after deletion
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

        // ✅ Redirect to Admin Dashboard after successful deletion
        navigate("/admin/dashboard");

    } catch (error) {
        console.error("❌ Error deleting past run:", error);
        toast.error("Failed to delete past run.");
    }
};

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg w-full">
      <h3 className="text-xl font-semibold text-purple-400 mb-4">Past Runs</h3>

      {pastRuns.length > 0 ? (
        <ul className="space-y-2">
          {pastRuns.map((pastRun, index) => (
            <li key={index} className="flex justify-between items-center bg-gray-800 p-2 rounded-lg">
              <span className="text-white">Run #{index + 1}: {pastRun.completedSplits} Splits - Failed at {pastRun.failedSplit}</span>
              <Button onClick={() => handleDeletePastRun(index)} className="bg-red-500 hover:bg-red-400 text-white">
                Delete
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No past runs found.</p>
      )}

      <Button onClick={onClose} className="mt-4 bg-gray-700 hover:bg-gray-600 text-white w-full">
        Back
      </Button>
    </div>
  );
};

export default SingleGamePastRuns;