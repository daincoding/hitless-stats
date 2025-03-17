import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const EditMarathonRun = ({ runId, onClose }) => {
  const [runData, setRunData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchRunDetails();
  }, []);

  const fetchRunDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5001/admin/runs/${runId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      if (!response.ok) throw new Error("Failed to fetch run details");
      const data = await response.json();
      setRunData(data);
    } catch (error) {
      console.error("❌ Error fetching run details:", error);
      setErrorMessage("Failed to load run details.");
    }
  };

  const handleChange = (e) => {
    setRunData({ ...runData, [e.target.name]: e.target.value });
  };

  const handleBadgeChange = (e) => {
    setRunData({ ...runData, badges: e.target.value.split(",").map(b => b.trim()) });
  };

  const handleGameChange = (index, field, value) => {
    const updatedGames = [...runData.games];
    updatedGames[index][field] = value;
    setRunData({ ...runData, games: updatedGames });
  };

  const handleAddGame = () => {
    setRunData({
      ...runData,
      games: [...runData.games, { name: "", splits: [""] }],
    });
  };

  const handleRemoveGame = (index) => {
    if (runData.games.length > 1) {
      const updatedGames = runData.games.filter((_, i) => i !== index);
      setRunData({ ...runData, games: updatedGames });
    } else {
      setErrorMessage("At least one game is required.");
    }
  };

  const handleSplitChange = (gameIndex, splitIndex, value) => {
    const updatedGames = [...runData.games];
    updatedGames[gameIndex].splits[splitIndex] = value;
    setRunData({ ...runData, games: updatedGames });
  };

  const handleAddSplit = (gameIndex) => {
    const updatedGames = [...runData.games];
    updatedGames[gameIndex].splits.push("");
    setRunData({ ...runData, games: updatedGames });
  };

  const handleRemoveSplit = (gameIndex, splitIndex) => {
    const updatedGames = [...runData.games];
    if (updatedGames[gameIndex].splits.length > 1) {
      updatedGames[gameIndex].splits.splice(splitIndex, 1);
      setRunData({ ...runData, games: updatedGames });
    } else {
      setErrorMessage("Each game must have at least one split.");
    }
  };

  const handleSave = async () => {
    if (!runData.name.trim() || !runData.description.trim() || runData.games.some(game => !game.name.trim() || game.splits.some(split => !split.trim()))) {
      setErrorMessage("All fields must be filled.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/admin/runs/${runId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(runData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save changes");
      }

      toast.success("✅ Marathon Run updated successfully!");
      setErrorMessage("");
      onClose();
    } catch (error) {
      console.error("❌ Error saving run:", error);
      setErrorMessage(error.message || "Failed to save run.");
    }
  };

  if (!runData) return <p className="text-gray-400">Loading...</p>;

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg w-full">
      <h3 className="text-xl font-semibold text-purple-400 mb-2">Edit Marathon Run</h3>
      <p className="text-red-400 text-xs mt-1 mb-3">
      ❗ IMPORTANT: MAKE SURE TO NOT USE THE SAME GAME NAMES OR SPLIT NAMES - each field needs to be unique!
      </p>
      {errorMessage && <p className="text-red-500 text-sm mb-4">❌ {errorMessage}</p>}
      <Input name="name" value={runData.name} onChange={handleChange} placeholder="Run Name" className="mb-4" required />
      <Textarea name="description" value={runData.description} onChange={handleChange} placeholder="Description" maxLength={400} className="mb-4" required />
      <Input name="badges" value={runData.badges.join(", ")} onChange={handleBadgeChange} placeholder="Badges (comma-separated)" className="mb-4" required />

      <h4 className="text-lg font-semibold text-white mb-2">Games & Splits</h4>
      {runData.games.map((game, gameIndex) => (
        <div key={gameIndex} className="p-4 bg-gray-800 rounded-lg mb-4">
          <div className="flex justify-between items-center">
            <Input
              value={game.name}
              onChange={(e) => handleGameChange(gameIndex, "name", e.target.value)}
              placeholder="Game Name"
              className="mb-2"
              required
            />
            <Button onClick={() => handleRemoveGame(gameIndex)} className="bg-red-500 hover:bg-red-400 text-white">✖ Remove Game</Button>
          </div>
          <h5 className="text-sm font-semibold text-white mb-2">Splits</h5>
          {game.splits.map((split, splitIndex) => (
            <div key={splitIndex} className="flex gap-2 mb-2">
              <Input
                value={split}
                onChange={(e) => handleSplitChange(gameIndex, splitIndex, e.target.value)}
                className="w-full"
                required
              />
              <Button onClick={() => handleRemoveSplit(gameIndex, splitIndex)} className="bg-red-500 hover:bg-red-400 text-white">✖</Button>
            </div>
          ))}
          <Button onClick={() => handleAddSplit(gameIndex)} className="bg-yellow-500 hover:bg-yellow-400 text-white w-full">Add Split</Button>
        </div>
      ))}
      <Button onClick={handleAddGame} className="bg-green-500 hover:bg-green-400 text-white w-full">Add Game</Button>
      <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-400 text-white w-full mt-4">Save Changes</Button>
      <Button onClick={onClose} className="mt-2 bg-gray-700 hover:bg-gray-600 text-white w-full">Cancel</Button>
    </div>
  );
};

export default EditMarathonRun;