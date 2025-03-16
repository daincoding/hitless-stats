import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const AddNewMarathonRun = ({ player, run, onClose }) => {
  const [gameOrder, setGameOrder] = useState(run.currentOrder || []);
  const [completedSplits, setCompletedSplits] = useState({});
  const [failedSplit, setFailedSplit] = useState(null);
  const [isDistancePB, setIsDistancePB] = useState(false);
  const [distancePB, setDistancePB] = useState(null);
  const [isSelectingGames, setIsSelectingGames] = useState(true);
  const [runAttempt, setRunAttempt] = useState((run.pastRuns?.length || 0) + 1); // ✅ Show Run Attempt
  const [isSaved, setIsSaved] = useState(false);

  /** ✅ Step 1: Handle Game Order Selection */
  const handleConfirmOrder = (tempOrder) => {
    if (new Set(tempOrder).size !== tempOrder.length || tempOrder.includes("")) {
      toast.error("❌ Please select all games before proceeding.");
      return;
    }
    setGameOrder(tempOrder);
    setIsSelectingGames(false);
  };

 /** ✅ Step 2: Handle Splits Completion (Mark all previous as well) */
const handleCompleteSplit = (game, index) => {
  const updatedSplits = { ...completedSplits };

  // ✅ Ensure all previous games are fully completed
  for (let i = 0; i <= gameOrder.indexOf(game); i++) {
    const gameName = gameOrder[i];
    const splits = run.games.find(g => g.name === gameName).splits;
    
    // ✅ If current game is clicked, mark only up to the selected index
    // ✅ Otherwise, ensure all previous games are fully completed
    updatedSplits[gameName] = i < gameOrder.indexOf(game) ? splits : splits.slice(0, index + 1);
  }

  setCompletedSplits(updatedSplits);
};

  /** ✅ Step 3: Handle Fail Split (Toggle to Remove) */
const handleFailSplit = (game, index) => {
  // ✅ If the same failed split is clicked again, remove the mark
  if (failedSplit?.game === game && failedSplit.split === run.games.find(g => g.name === game).splits[index]) {
    setFailedSplit(null);
  } else {
    setFailedSplit({ game, split: run.games.find(g => g.name === game).splits[index] });
  }
};

/** ✅ Step 4: Handle Distance PB */
const handleDistancePB = () => {
  if (isDistancePB) {
    setIsDistancePB(false);
    setDistancePB(null);
  } else {
    let lastCompletedGame = null;
    let lastCompletedSplit = null;

    for (let game of gameOrder) {
      if (completedSplits[game]?.length > 0) {
        lastCompletedGame = game;
        lastCompletedSplit = completedSplits[game][completedSplits[game].length - 1];
      }
    }

    if (lastCompletedGame && lastCompletedSplit) {
      setIsDistancePB(true);
      setDistancePB({ game: lastCompletedGame, split: lastCompletedSplit });
    } else {
      toast.error("❌ You need at least one completed split to set Distance PB.");
    }
  }
};

/** ✅ Step 5: Save Run Progress */
const handleSave = async () => {
  try {
      const completedData = {};
      gameOrder.forEach(game => {
          completedData[game] = completedSplits[game]?.length || 0;
      });

      // ✅ Create requestData without `distancePB` if `isDistancePB` is false
      const requestData = {
          currentOrder: gameOrder,
          completedSplits: completedData,
          failedSplit: failedSplit ? { game: failedSplit.game, split: failedSplit.split } : null,
          ...(isDistancePB && { distancePB }) // ✅ Only add `distancePB` if true
      };

      console.log("🚀 Sending this to backend (SAVE RUN ONLY):", requestData);

      const response = await fetch(`http://localhost:5001/admin/runs/marathon/add-run/${player}/${run.id}`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify(requestData),
      });

      if (!response.ok) {
          const errorData = await response.json();
          console.error("❌ Backend Error:", errorData);
          throw new Error(errorData.error || "Failed to save run");
      }

      setIsSaved(true); // ✅ Mark as saved
      toast.success("✅ Run progress saved!");
  } catch (error) {
      console.error("❌ Error saving run:", error);
      toast.error("Failed to save run.");
  }
};

/** ✅ Step 6: End Run (Move to Past Runs) */
const handleEndRun = async () => {
  if (!isSaved || !failedSplit) {
      toast.error("❌ You must save first and select a failed split before ending the run.");
      return;
  }

  try {
      const pastRunData = {
          runId: (run.pastRuns?.length || 0) + 1,
          order: gameOrder,
          completedSplits: completedSplits,
          failedSplit: failedSplit,
          distancePB: isDistancePB ? distancePB : null,
      };

      console.log("🚀 Moving Run to Past Runs:", pastRunData);

      const response = await fetch(`http://localhost:5001/admin/runs/marathon/end-run/${player}/${run.id}`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({ pastRun: pastRunData }),
      });

      if (!response.ok) throw new Error("Failed to end run");

      toast.success("🏆 Run moved to past runs!");
      onClose();
  } catch (error) {
      console.error("❌ Error ending run:", error);
      toast.error("Failed to end run.");
  }
};

/** ✅ Step 1 View: Game Order Selection */
if (isSelectingGames) {
  return (
    <div className="p-4">
      <h4 className="text-lg font-semibold mb-4">Select Game Order:</h4>

      <div className="flex flex-wrap gap-4 justify-center">
        {run.games.map((game) => {
          const selectedIndex = gameOrder.indexOf(game.name) + 1; // ✅ Get order index

          return (
            <div
              key={game.name}
              className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all text-center w-40 h-24 flex items-center justify-center shadow-md
                ${
                  selectedIndex
                    ? "bg-blue-500 text-white border-blue-400 scale-105 shadow-lg"
                    : "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700"
                }
              `}
              onClick={() => {
                const tempOrder = [...gameOrder];

                if (selectedIndex) {
                  // 🔥 Remove game from order if clicked again
                  tempOrder.splice(selectedIndex - 1, 1);
                } else if (tempOrder.length < run.games.length) {
                  // 🔥 Add game in next available slot
                  tempOrder.push(game.name);
                }

                setGameOrder(tempOrder);
              }}
            >
              <span className="text-lg font-semibold">{game.name}</span>

              {selectedIndex > 0 && (
                <span className="absolute bottom-2 right-2 bg-black text-white px-3 py-1 text-sm rounded-lg shadow">
                  #{selectedIndex}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <Button 
        onClick={() => handleConfirmOrder([...gameOrder])} 
        className="mt-6 bg-green-500 hover:bg-green-400 text-white w-full text-lg font-semibold shadow-md"
        disabled={gameOrder.length !== run.games.length} // ✅ Prevent confirming if not all selected
      >
        Confirm Order
      </Button>
    </div>
  );
}

  /** ✅ Step 2-5 View: Splits & Save */
/** ✅ Step 2-5 View: Splits & Save */
return (
  <div className="p-4">
    <h3 className="text-lg font-bold text-green-400 mb-2">Marathon Run Progress</h3>
    <h4 className="text-md font-semibold text-yellow-400 mb-4">Run Attempt: #{runAttempt}</h4>

    {gameOrder.map((game) => {
      const gameData = run.games.find(g => g.name === game);
      return (
        <div key={game} className="mb-4 p-3 border border-gray-700 rounded-lg bg-gray-800">
          <h4 className="text-lg font-semibold text-blue-400 mb-2">{game}</h4>
          <ul className="mt-2 space-y-2">
            {gameData.splits.map((split, index) => {
              const isCompleted = completedSplits[game]?.includes(split);
              const isFailed = failedSplit?.game === game && failedSplit.split === split;

              return (
                <li key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 border-b border-gray-600 text-gray-300">
                  
                  <span className="text-lg font-semibold">{index + 1}. {split}</span> {/* ✅ Add numbering */}
                  
                  <div className="flex gap-4 mt-2 sm:mt-0"> {/* ✅ Stack on small screens */}
                    <label className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-md">
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={() => handleCompleteSplit(game, index)}
                      />
                      <span className="text-green-400">✅ Completed</span>
                    </label>

                    <label className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-md">
                      <Checkbox
                        checked={isFailed}
                        onCheckedChange={() => handleFailSplit(game, index)}
                      />
                      <span className="text-red-400">❌ Failed</span>
                    </label>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        );
      })}

      <div className="mt-4 flex items-center gap-2">
        <Switch checked={isDistancePB} onCheckedChange={handleDistancePB} />
        <span>Is Distance PB?</span>
      </div>

      <Button onClick={handleSave} className="mt-4 bg-yellow-500 hover:bg-yellow-400 text-white w-full">
    Save Run Progress
</Button>

<Button 
    onClick={handleEndRun} 
    disabled={!isSaved || !failedSplit} 
    className={`mt-2 w-full ${isSaved && failedSplit ? "bg-red-500 hover:bg-red-400" : "bg-gray-500 cursor-not-allowed"}`}
>
    End Run (Move to Past Runs)
</Button>
    </div>
  );
};

export default AddNewMarathonRun;