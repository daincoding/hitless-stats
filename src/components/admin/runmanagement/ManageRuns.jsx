import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import SingleGameRunsList from "./SingleGameRunList";
import MarathonRunsList from "./MarathonRunsList";


const ManageRuns = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [runType, setRunType] = useState(""); // "Single Game" or "Marathon"

  // ✅ Fetch Players on Load
  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch("http://localhost:5001/admin/players", {
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

  // ✅ Handle Selecting a Player
  const handleSelectPlayer = (playerName) => {
    setSelectedPlayer(playerName);
    setRunType(""); // Reset run type when switching players
  };

  console.log("🟢 Selected Player:", selectedPlayer);
  console.log("🟣 Run Type:", runType);

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-center text-purple-400">Manage Runs</h2>

      {/* Select Player Dropdown */}
      <label>Select Player:</label>

      <p className="text-gray-400 text-xs mt-1 mb-3">
            🔹 After deleting a Run please reload the Admin Pannel by clicking on it on top before adding a new Run! 
          </p>
      <Select onValueChange={handleSelectPlayer}>
        <SelectTrigger className="w-full bg-gray-800 text-white border border-gray-700 cursor-pointer">
          <SelectValue placeholder="Select a player" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 text-white">
          {players.map((player) => (
            <SelectItem key={player.name} value={player.name}>
              {player.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Show run type selection only if a player is selected */}
      {selectedPlayer && (
        <>
        <div className="flex justify-center gap-4">
          <Button onClick={() => setRunType("Single Game")} className="bg-blue-500 hover:bg-blue-400 text-white">
            Single Game Runs
          </Button>
          <Button onClick={() => setRunType("Marathon")} className="bg-green-500 hover:bg-green-400 text-white">
            Marathon Runs
          </Button>
        </div>
        <p className="text-gray-400 text-xs mt-1 mb-3">
        🔹 Please select a type - you can switch between those but cant use the buttons to reload the section!
      </p>
      </>
      )}

      {/* Show the selected run type */}
      {runType === "Single Game" && <SingleGameRunsList player={selectedPlayer} />}
      {runType === "Marathon" && <MarathonRunsList player={selectedPlayer} />}
    </div>
  );
};

export default ManageRuns;
