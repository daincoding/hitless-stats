import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const CreateMarathonRun = ({ player, onClose }) => {
  const [runData, setRunData] = useState({
    name: "",
    description: "",
    badges: [],
    worldRecord: false,
    games: [{ name: "", splits: ["", "", ""] }], // Start with one game, minimum 3 splits
  });
  const [errorMessage, setErrorMessage] = useState("");

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
      games: [...runData.games, { name: "", splits: ["", "", ""] }],
    });
  };

  const handleRemoveGame = (index) => {
    if (runData.games.length > 1) {
      const updatedGames = runData.games.filter((_, i) => i !== index);
      setRunData({ ...runData, games: updatedGames });
    } else {
      setErrorMessage("At least one game is required");
    }
  };

  const handleSplitChange = (gameIndex, splitIndex, value) => {
    const updatedGames = [...runData.games];
    updatedGames[gameIndex].splits[splitIndex] = value;
    setRunData({ ...runData, games: updatedGames });
  };

  const handleAddSplit = (gameIndex) => {
    const updatedGames = [...runData.games];
    if (updatedGames[gameIndex].splits.length < 50) {
      updatedGames[gameIndex].splits.push("");
      setRunData({ ...runData, games: updatedGames });
    } else {
      setErrorMessage("Maximum 50 splits per game allowed");
    }
  };

  const handleRemoveSplit = (gameIndex, splitIndex) => {
    const updatedGames = [...runData.games];
    if (updatedGames[gameIndex].splits.length > 3) {
      updatedGames[gameIndex].splits.splice(splitIndex, 1);
      setRunData({ ...runData, games: updatedGames });
    } else {
      setErrorMessage("At least 3 splits per game are required");
    }
  };

  const handleSave = async () => {
    if (!runData.name.trim() || !runData.description.trim() || runData.games.some(game => !game.name.trim() || game.splits.some(split => !split.trim()))) {
      setErrorMessage("All fields except 'World Record' must be filled.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/admin/runs/create/marathon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ ...runData, player, type: "Marathon" }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create run");
      }
      
      toast.success("✅ Marathon Run created successfully!");
      setRunData({
        name: "",
        description: "",
        badges: [],
        worldRecord: false,
        games: [{ name: "", splits: ["", "", ""] }],
      });
      setErrorMessage("");
      onClose();
    } catch (error) {
      console.error("❌ Error creating Marathon run:", error);
      setErrorMessage(error.message || "Failed to create Marathon run.");
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg w-full">
      <h3 className="text-xl font-semibold text-green-400 mb-2">Create New Marathon Run</h3>
      {errorMessage && <p className="text-red-500 text-sm mb-4">❌ {errorMessage}</p>}
      <Input name="name" value={runData.name} onChange={handleChange} placeholder="Run Name" className="mb-4" required />
      <Textarea name="description" value={runData.description} onChange={handleChange} placeholder="Description" maxLength={400} className="mb-4" required />
      <Input name="badges" onChange={handleBadgeChange} placeholder="Badges (comma-separated)" className="mb-4" required />
      <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-gray-800">
        <span>World Record:</span>
        <Switch checked={runData.worldRecord} onCheckedChange={(val) => setRunData({ ...runData, worldRecord: val })} />
      </div>
      <h4 className="text-lg font-semibold text-white mb-2">Games & Splits</h4>
      {runData.games.map((game, gameIndex) => (
        <div key={gameIndex} className="mb-6 p-4 bg-gray-800 rounded-lg">
          <div className="flex gap-2 mb-2">
            <Input value={game.name} onChange={(e) => handleGameChange(gameIndex, "name", e.target.value)} placeholder="Game Name" required className="w-full" />
            <Button onClick={() => handleRemoveGame(gameIndex)} className="bg-red-500 hover:bg-red-400 text-white">✖</Button>
          </div>
          {game.splits.map((split, splitIndex) => (
            <div key={splitIndex} className="flex gap-2 mb-2">
              <Input value={split} onChange={(e) => handleSplitChange(gameIndex, splitIndex, e.target.value)} className="w-full" required />
              <Button onClick={() => handleRemoveSplit(gameIndex, splitIndex)} className="bg-red-500 hover:bg-red-400 text-white">✖</Button>
            </div>
          ))}
          <Button onClick={() => handleAddSplit(gameIndex)} className="bg-yellow-500 hover:bg-yellow-400 text-white w-full">Add Split</Button>
        </div>
      ))}
      <Button onClick={handleAddGame} className="mb-4 bg-blue-500 hover:bg-blue-400 text-white w-full">Add Game</Button>
      <Button onClick={handleSave} className="bg-green-500 hover:bg-green-400 text-white w-full">Save Run</Button>
      <Button onClick={onClose} className="mt-2 bg-gray-700 hover:bg-gray-600 text-white w-full">Cancel</Button>
    </div>
  );
};

export default CreateMarathonRun;
