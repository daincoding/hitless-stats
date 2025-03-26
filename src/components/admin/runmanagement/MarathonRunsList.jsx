import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import EditMarathonRun from "./EditMarathonRun";
import CreateMarathonRun from "./CreateMarathonRun";
import AddNewMarathonRun from "./AddNewMarathonRun";
import MarathonPastRuns from "./MarathonPastRuns"; // ✅ Component for Past Runs

const MarathonRunsList = ({ player }) => {
  const [runs, setRuns] = useState([]);
  const [editingRun, setEditingRun] = useState(null);
  const [creatingNewRun, setCreatingNewRun] = useState(false);
  const [addingNewRun, setAddingNewRun] = useState(null);
  const [viewingPastRuns, setViewingPastRuns] = useState(null);

  useEffect(() => {
    if (player) {
      fetchRuns();
    }
  }, [player]);

  const fetchRuns = async () => {
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/admin/runs/marathon/${player}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      if (!response.ok) throw new Error("Failed to fetch marathon runs");
      const data = await response.json();
      setRuns(data);
    } catch (error) {
      console.error("❌ Error fetching marathon runs:", error);
      toast.error("Failed to load marathon runs.");
    }
  };

  const handleEdit = (runId) => {
    setEditingRun(runId);
  };

  const handleDelete = async (runId) => {
    if (!confirm("Are you sure you want to delete this Marathon run?")) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/admin/runs/${runId}`, { // ✅ Removed /marathon
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      if (!response.ok) throw new Error("Failed to delete Marathon run");

      toast.success("Marathon run deleted successfully");

      window.location.reload(); // 🔥 Force full page reload after deletion
    } catch (error) {
      console.error("❌ Error deleting Marathon run:", error);
      toast.error("Failed to delete Marathon run.");
    }
};

  const handleAddNewRun = (run) => {
    setAddingNewRun(run);
  };

  const handleViewPastRuns = (run) => {
    setViewingPastRuns(run.id);
  };

  return (
    <div className="p-4 text-white bg-gray-900 rounded-lg w-full">
      <h3 className="text-xl font-semibold text-green-400 mb-4">Marathon Runs</h3>

      {addingNewRun ? (
        <AddNewMarathonRun player={player} run={addingNewRun} onClose={() => { 
          setAddingNewRun(null); 
          fetchRuns(); // ✅ Ensure the UI updates
        }} />
      ) : viewingPastRuns ? (
        <MarathonPastRuns player={player} runId={viewingPastRuns} fetchRuns={fetchRuns} onClose={() => setViewingPastRuns(null)} />
      ) : editingRun ? (
        <EditMarathonRun runId={editingRun} onClose={() => setEditingRun(null)} />
      ) : creatingNewRun ? (
        <CreateMarathonRun player={player} onClose={() => { 
          setCreatingNewRun(false); 
          fetchRuns(); 
        }} />
      ) : (
        <>
          {runs.length === 0 ? (
            <p className="text-gray-400">No Marathon runs found.</p>
          ) : (
            <ul className="space-y-4">
              {runs.map((run) => (
                <li key={run.id} className="p-4 bg-gray-800 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-2">
                  <div className="w-full sm:w-auto">
                    <h4 className="text-white text-center sm:text-left">{run.name}</h4>
                    <p className="text-gray-400 text-sm text-center sm:text-left">
  Games: {run.games?.map(game => game.name).join(", ") || "No games listed"}
</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 w-full sm:w-auto">
                    <Button onClick={() => handleAddNewRun(run)} className="bg-yellow-500 hover:bg-yellow-400 text-white w-full">
                      Add New Run
                    </Button>
                    <Button onClick={() => handleEdit(run.id)} className="bg-blue-500 hover:bg-blue-400 text-white w-full">
                      Edit
                    </Button>
                    <Button onClick={() => handleViewPastRuns(run)} className="bg-purple-500 hover:bg-purple-400 text-white w-full">
                      Past Runs
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
              Create New Marathon Run
            </Button>
          </div>
          <p className="text-red-400 text-xs mt-3 mb-3">
      ❗ IMPORTANT: PLEASE DELETE A RUN AFTER FINISHING IT - Use the Successfull Runs section and upload your Video there when you are done. Make sure to save the statistics from the Homepage if you want to! Data will be lost after deleting!
      </p>
        </>
      )}
    </div>
  );
};

export default MarathonRunsList;