import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";

const AdminSuccessfulRuns = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [runs, setRuns] = useState([]);
  const [newRun, setNewRun] = useState({ name: "", youtube: "", type: "Single Game", game: "", games: [], badges: [] });
  const [gameInput, setGameInput] = useState("");

  // ✅ Fetch players on load
  useEffect(() => {
    fetchPlayers();
  }, []);

  // ✅ Fetch successful runs when player is selected
  useEffect(() => {
    if (selectedPlayer) fetchSuccessfulRuns(selectedPlayer);
  }, [selectedPlayer]);

  /** ✅ Fetch all players */
  const fetchPlayers = async () => {
    try {
      const response = await fetch("http://localhost:8081/admin/players", {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      if (!response.ok) throw new Error("Failed to fetch players");
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error("❌ Error fetching players:", error);
      toast.error("Failed to load players.");
    }
  };

  /** ✅ Fetch successful runs for selected player */
  const fetchSuccessfulRuns = async (player) => {
    try {
      const response = await fetch(`http://localhost:8081/admin/runs/successful/${player}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      if (!response.ok) throw new Error("Failed to fetch successful runs");
      const data = await response.json();
      setRuns(data);
    } catch (error) {
      console.error("❌ Error fetching successful runs:", error);
      toast.error("Failed to load successful runs.");
    }
  };

  /** ✅ Handle new run input changes */
  const handleInputChange = (e) => {
    setNewRun({ ...newRun, [e.target.name]: e.target.value });
  };

  /** ✅ Handle adding a new successful run */
  const handleAddRun = async () => {
    if (!newRun.name || !newRun.youtube || !selectedPlayer) {
      toast.error("❌ Please fill all fields before adding a run.");
      return;
    }

    // ✅ Ensure `playerId` is retrieved correctly
    const selectedPlayerObj = players.find(p => p.name === selectedPlayer);
    if (!selectedPlayerObj) {
      toast.error("❌ Selected player not found.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/admin/runs/successful/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({
          ...newRun,
          playerId: selectedPlayerObj.id // ✅ Now sending actual playerId
        }),
      });

      if (!response.ok) throw new Error("Failed to add successful run");

      toast.success("✅ Successful run added!");
      fetchSuccessfulRuns(selectedPlayer);
      setNewRun({ name: "", youtube: "", type: "Single Game", game: "", games: [], badges: [] });
    } catch (error) {
      console.error("❌ Error adding successful run:", error);
      toast.error("Failed to add successful run.");
    }
  };

  /** ✅ Handle deleting a run */
  const handleDeleteRun = async (runId) => {
    if (!confirm("Are you sure you want to delete this run?")) return;

    try {
      const response = await fetch(`http://localhost:8081/admin/runs/successful/${runId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });

      if (!response.ok) throw new Error("Failed to delete successful run");

      toast.success("✅ Successful run deleted!");
      fetchSuccessfulRuns(selectedPlayer);
    } catch (error) {
      console.error("❌ Error deleting successful run:", error);
      toast.error("Failed to delete successful run.");
    }
  };

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen w-full"> {/* ✅ Ensures full-page background */}
      <h3 className="text-2xl font-semibold text-green-400 mb-6">Manage Successful Runs</h3>

      {/* ✅ Player Selection */}
      <div className="mb-6">
        <label className="block text-md text-gray-300 mb-2">Select Player:</label>
        <Select onValueChange={(value) => setSelectedPlayer(value)}>
          <SelectTrigger className="w-full bg-gray-800 text-white border border-gray-600">
            {selectedPlayer ? `Player: ${selectedPlayer}` : "Select Player"}
          </SelectTrigger>
          <SelectContent>
            {players.map((player) => (
              <SelectItem key={player.id} value={player.name}>{player.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ✅ Add New Run Form */}
      {selectedPlayer && (
        <div className="mb-8 p-6 bg-gray-800 rounded-lg shadow-lg">
          <h4 className="text-lg font-semibold text-yellow-400 mb-4">Add New Successful Run</h4>

          <Input
            name="name"
            placeholder="Run Name *"
            value={newRun.name}
            onChange={handleInputChange}
            className="mb-3"
            required
          />

          <Input
            name="youtube"
            placeholder="YouTube Link *"
            value={newRun.youtube}
            onChange={handleInputChange}
            className="mb-3"
            required
          />

          <Select onValueChange={(value) => setNewRun({ ...newRun, type: value })}>
            <SelectTrigger className="w-full bg-gray-800 text-white border border-gray-600">
              {newRun.type || "Select Run Type *"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Single Game">Single Game</SelectItem>
              <SelectItem value="Marathon">Marathon</SelectItem>
            </SelectContent>
          </Select>

          {newRun.type === "Single Game" ? (
            <Input
              name="game"
              placeholder="Game Name *"
              value={newRun.game}
              onChange={handleInputChange}
              className="mt-3"
              required
            />
          ) : (
            <div className="mt-3">
              <Input
                name="games"
                placeholder="Add a game and press enter"
                value={gameInput}
                onChange={(e) => setGameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && gameInput.trim()) {
                    setNewRun({ ...newRun, games: [...newRun.games, gameInput.trim()] });
                    setGameInput(""); // ✅ Clears input after adding
                    e.preventDefault();
                  }
                }}
              />

              {/* ✅ Game List (as small horizontal chips) */}
              <div className="flex flex-wrap gap-2 mt-3">
                {newRun.games.map((game, index) => (
                  <div key={index} className="bg-gray-700 px-3 py-1 rounded-lg flex items-center gap-2 shadow-md">
                    <span className="text-sm font-semibold text-white">{game}</span>
                    <button
                      onClick={() => setNewRun({ ...newRun, games: newRun.games.filter((_, i) => i !== index) })}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Input
            name="badges"
            placeholder="Badges (comma-separated) *"
            value={newRun.badges}
            onChange={(e) => setNewRun({ ...newRun, badges: e.target.value.split(",") })}
            className="mt-3"
            required
          />

          <Button
            onClick={handleAddRun}
            className="mt-4 bg-blue-500 hover:bg-blue-400 w-full"
            disabled={!newRun.name || !newRun.youtube || (newRun.type === "Single Game" && !newRun.game) || (newRun.type === "Marathon" && newRun.games.length === 0)}
          >
            Add Run
          </Button>
        </div>
      )}

      {/* ✅ List of Runs (Compact Vertical Cards) */}
      {runs.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-6">
          {runs.map((run) => (
            <div
              key={run.id}
              className="bg-gray-800 p-3 rounded-lg shadow-md flex flex-col items-center"
            >
              {/* 🔹 Bigger Thumbnail (Stacked on top) */}
              <img
                src={run.thumbnail}
                alt={run.name}
                className="w-full h-40 rounded-lg object-cover shadow-sm"
              />

              {/* 🔹 Title & Game Info (Under Thumbnail) */}
              <div className="text-center mt-2 w-full">
                <h4 className="text-md font-bold text-white">{run.name}</h4>
                <p className="text-gray-400 text-xs">
                  {run.type === "Single Game" ? run.game : run.games?.join(", ")}
                </p>
              </div>

              {/* 🔹 Delete Button (At the Bottom) */}
              <Button
                onClick={() => handleDeleteRun(run.id)}
                className="bg-red-500 hover:bg-red-400 text-white w-full mt-3"
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      ) : selectedPlayer && <p className="text-gray-400 mt-4">No successful runs found.</p>}
    </div>
  );
};

export default AdminSuccessfulRuns;