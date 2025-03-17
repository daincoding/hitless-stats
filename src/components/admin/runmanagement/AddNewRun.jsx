import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const AddNewRun = ({ player, run, onClose }) => {
    useEffect(() => {
        console.log("📢 Received run:", run);
    
        if (!run || !run.splits) return;
    
        if (run.completedSplits > 0) {
          setCompletedSplits(run.splits.slice(0, run.completedSplits));
        }
    }, [run]);

  const [completedSplits, setCompletedSplits] = useState([]);
  const [failedSplit, setFailedSplit] = useState(null);
  const [isDistancePB, setIsDistancePB] = useState(false);
  const [distancePB, setDistancePB] = useState(null);
  const [runAttempt, setRunAttempt] = useState((run.pastRuns?.length || 0) + 1);
  const [status, setStatus] = useState("Alive");
  const [isSaved, setIsSaved] = useState(false);

  const handleClear = () => {
    setCompletedSplits([]);
    setFailedSplit(null);
    setIsDistancePB(false);
    setDistancePB(null);
    setStatus("Alive");
    setIsSaved(false);
  };

  const handleCompleteSplit = (index) => {
    const updatedCompletedSplits = run.splits.slice(0, index + 1);
    setCompletedSplits(updatedCompletedSplits);
  };

  const handleUncheckCompletedSplit = (index) => {
    const updatedCompletedSplits = run.splits.slice(0, index);
    setCompletedSplits(updatedCompletedSplits);
  };

  const handleFailSplit = (index) => {
    setFailedSplit(run.splits[index]);
    setStatus("Dead");
  };

  const handleDistancePB = () => {
    if (isDistancePB) {
      setIsDistancePB(false);
      setDistancePB(null);
    } else {
      if (completedSplits.length > 0) {
        const lastCompletedSplit = completedSplits[completedSplits.length - 1];

        setIsDistancePB(true);
        setDistancePB({
          split: lastCompletedSplit,
          totalSplits: run.splits.length,
          reachedSplits: completedSplits.length,
        });
      } else {
        toast.error("❌ You need at least one completed split to set Distance PB.");
      }
    }
  };

  const handleSave = async () => {
    try {
      const completedSplitsCount = completedSplits.length;
      const failedSplitFormatted = failedSplit ? { split: failedSplit } : null;
      const distancePBFormatted = isDistancePB && distancePB
        ? {
            split: distancePB.split,
            totalSplits: distancePB.totalSplits,
            reachedSplits: distancePB.reachedSplits,
          }
        : null;

      console.log("🚀 Sending to backend:", {
        completedSplits: completedSplitsCount,
        failedSplit: failedSplitFormatted,
        status: failedSplit ? "Dead" : "Alive",
        distancePB: distancePBFormatted,
      });

      const response = await fetch(`http://localhost:5001/admin/runs/update/${player}/${run.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({
          completedSplits: completedSplitsCount,
          failedSplit: failedSplitFormatted,
          status: failedSplit ? "Dead" : "Alive",
          distancePB: distancePBFormatted,
        }),
      });

      if (!response.ok) throw new Error("Failed to save run");

      setIsSaved(true);
      toast.success("✅ Run progress saved!");
    } catch (error) {
      console.error("❌ Error saving run:", error);
      toast.error("Failed to save run.");
    }
  };

  const handleEndRun = async () => {
    if (!player || !run?.id) {
      console.error("❌ Error: Player or Run ID is missing.");
      toast.error("No active run to end.");
      return;
    }

    try {
      // ✅ Send only `completedSplits` & `failedSplit`, let backend handle `runId`
      const pastRunData = {
        runId: (run.pastRuns?.length || 0) + 1,  // ✅ Ensure pastRuns exists before using .length
        completedSplits: completedSplits.length,
        failedSplit: failedSplit ? failedSplit : "Unknown",
    };

      console.log("🚀 Ending Run - Moving to pastRuns:", pastRunData);

      const response = await fetch(`http://localhost:5001/admin/runs/end/${player}/${run.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ pastRun: pastRunData }),
      });

      if (!response.ok) throw new Error("Failed to end run");

      toast.success("🏆 Run moved to past runs!");

      // ✅ Instead of starting a new run inside the same view, we **go back to the main menu**  
      onClose();  // 🚀 This triggers a refresh to properly update the run attempt number

    } catch (error) {
      console.error("❌ Error ending run:", error);
      toast.error("Failed to end run.");
    }
};

  return (
    <div className="p-4 md:p-6 bg-gray-900 text-white rounded-lg w-full">
      <h3 className="text-xl font-semibold text-purple-400 mb-4">Manage Current Run</h3>

      <Button onClick={handleClear} className="mb-4 bg-gray-600 hover:bg-gray-500 text-white w-full">
        Clear
      </Button>

      <h4 className="text-lg font-semibold mb-2">Run Attempt: #{runAttempt}</h4>

      <p className="text-gray-400 text-xs mt-1 mb-3">
        HOW TO: 
      </p>
      <p className="text-gray-400 text-xs mt-1 mb-3">
        🔹 Marking Completed also autocompletes all Splits above!
      </p>
      <p className="text-gray-400 text-xs mt-1 mb-3">
        🔹 Failed Split Marks the end of a run!
      </p>
      <p className="text-gray-400 text-xs mt-1 mb-3">
        🔹 When you click on "Save Run Progress" it updates the Live View on the Homepage. Keep in mind: It doesnt save till the next time you come in here. Just create it a new and update it that way.
      </p>
      <p className="text-gray-400 text-xs mt-1 mb-3">
        🔹 If you want to End a run and move it to PastRuns, you need to Save Run Progress AND have a Failed Split activated. ALWAYS click on Save Run Progress if you want to display something on the Website.
      </p>
      <p className="text-gray-400 text-xs mt-1 mb-3">
        🔹 DistancePB is a toggle that you can activate if its the current DistancePB it will update. If you ignore it nothing changes. 
      </p>

      <div className="mt-4">
        {run.splits?.length > 0 ? (
          <ul className="space-y-2">
            {run.splits.map((split, index) => (
              <li key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-800 p-2 rounded-lg">
                <span className="text-white">{index + 1}. {split}</span>
                <div className="flex flex-col sm:flex-row sm:gap-4">
                  <label className="flex items-center gap-2">
                    <Checkbox
                      checked={completedSplits.includes(split)}
                      onCheckedChange={() => {
                        if (completedSplits.includes(split)) {
                          handleUncheckCompletedSplit(index);
                        } else {
                          handleCompleteSplit(index);
                        }
                      }}
                      className="bg-blue-500"
                    />
                    <span className="text-white">Completed</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <Checkbox
                      checked={failedSplit === split}
                      onCheckedChange={() => {
                        if (failedSplit === split) {
                          setFailedSplit(null);
                          setStatus("Alive");
                        } else {
                          handleFailSplit(index);
                        }
                      }}
                      className="bg-red-500"
                    />
                    <span className="text-white">Failed</span>
                  </label>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No splits available.</p>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Checkbox checked={isDistancePB} onCheckedChange={handleDistancePB} />
        <span>Is Distance PB?</span>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <Button onClick={handleSave} className="bg-yellow-500 hover:bg-yellow-400 text-white w-full">
          Save
        </Button>
        <Button 
          onClick={handleEndRun} 
          disabled={!isSaved || !failedSplit} 
          className={`text-white w-full ${isSaved && failedSplit ? "bg-red-500 hover:bg-red-400" : "bg-gray-700 cursor-not-allowed"}`}>
          End Run
        </Button>
      </div>

      <Button onClick={onClose} className="mt-2 bg-gray-700 hover:bg-gray-600 text-white w-full">
        Cancel
      </Button>
    </div>
  );
};

export default AddNewRun;