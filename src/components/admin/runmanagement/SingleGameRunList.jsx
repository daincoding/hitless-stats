import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import EditSingleGameRun from "./EditSingleGameRun";
import CreateSingleGameRun from "./CreateSingleGameRun";
import AddNewRun from "./AddNewRun"; // ✅ Import new component

const SingleGameRunsList = ({ player }) => {
  const [runs, setRuns] = useState([]);
  const [editingRun, setEditingRun] = useState(null);
  const [creatingNewRun, setCreatingNewRun] = useState(false);
  const [addingNewRun, setAddingNewRun] = useState(null); // ✅ Track which run is being added

  useEffect(() => {
    if (player) {
      fetchRuns();
    }
  }, [player]);

  const fetchRuns = async () => {
    try {
      const response = await fetch(`http://localhost:5001/admin/runs/single/${player}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      if (!response.ok) throw new Error("Failed to fetch runs");
      const data = await response.json();
      setRuns(data);
    } catch (error) {
      console.error("❌ Error fetching runs:", error);
      toast.error("Failed to load runs.");
    }
  };

  const handleEdit = (runId) => {
    setEditingRun(runId);
  };

  const handleDelete = async (runId) => {
    if (!confirm("Are you sure you want to delete this run?")) return;
    try {
      const response = await fetch(`http://localhost:5001/admin/runs/${runId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      if (!response.ok) throw new Error("Failed to delete run");
      toast.success("Run deleted successfully");
      fetchRuns(); // Refresh list
    } catch (error) {
      console.error("❌ Error deleting run:", error);
      toast.error("Failed to delete run.");
    }
  };

  const handleAddNewRun = (run) => {
    console.log("📢 Selected run for new attempt:", run); // ✅ Debugging
    setAddingNewRun(run); // ✅ Send full run object
  };

  return (
    <div className="p-4 text-white bg-gray-900 rounded-lg w-full">
      <h3 className="text-xl font-semibold text-purple-400 mb-4">Single Game Runs</h3>

      {/* ✅ Show AddNewRun component when active */}
      {addingNewRun ? (
        <AddNewRun player={player} run={addingNewRun} onClose={() => { setAddingNewRun(null); fetchRuns(); }} />
      ) : editingRun ? (
        <EditSingleGameRun runId={editingRun} onClose={() => setEditingRun(null)} />
      ) : creatingNewRun ? (
        <CreateSingleGameRun player={player} onClose={() => { setCreatingNewRun(false); fetchRuns(); }} />
      ) : (
        <>
          {runs.length === 0 ? (
            <p className="text-gray-400">No runs found.</p>
          ) : (
            <ul className="space-y-4">
              {runs.map((run) => (
                <li key={run.id} className="p-4 bg-gray-800 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-2">
                  <span className="text-white text-center sm:text-left w-full sm:w-auto">{run.name}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full sm:w-auto">
                    <Button onClick={() => handleAddNewRun(run)} className="bg-yellow-500 hover:bg-yellow-400 text-white w-full">
                      Add New Run
                    </Button>
                    <Button onClick={() => handleEdit(run.id)} className="bg-blue-500 hover:bg-blue-400 text-white w-full">
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(run.id)} className="bg-red-500 hover:bg-red-400 text-white w-full">
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex justify-center">
            <Button onClick={() => setCreatingNewRun(true)} className="bg-green-500 hover:bg-green-400 text-white w-full">
              Create New Run
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default SingleGameRunsList;