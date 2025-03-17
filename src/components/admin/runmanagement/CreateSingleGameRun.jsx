import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const CreateSingleGameRun = ({ player, onClose }) => {
  const [runData, setRunData] = useState({
    name: "",
    description: "",
    badges: [],
    worldRecord: false,
    splits: ["", "", ""], // Start with three splits (minimum required)
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setRunData({ ...runData, [e.target.name]: e.target.value });
  };

  const handleBadgeChange = (e) => {
    setRunData({ ...runData, badges: e.target.value.split(",").map(b => b.trim()) });
  };

  const handleAddSplit = () => {
    if (runData.splits.length < 50) {
      setRunData({ ...runData, splits: [...runData.splits, ""] });
    } else {
      setErrorMessage("Maximum 50 splits allowed");
    }
  };

  const handleRemoveSplit = (index) => {
    if (runData.splits.length > 3) { // Ensure at least 3 splits remain
      const updatedSplits = runData.splits.filter((_, i) => i !== index);
      setRunData({ ...runData, splits: updatedSplits });
    } else {
      setErrorMessage("At least 3 splits are required");
    }
  };

  const handleSplitChange = (index, value) => {
    const updatedSplits = [...runData.splits];
    updatedSplits[index] = value;
    setRunData({ ...runData, splits: updatedSplits });
  };

  const handleSave = async () => {
    if (!runData.name.trim() || !runData.description.trim() || runData.splits.some(split => !split.trim())) {
      setErrorMessage("All fields except 'World Record' must be filled.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/admin/runs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ ...runData, player, type: "Single Game" }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create run");
      }
      
      toast.success("✅ Run created successfully!");
      setRunData({
        name: "",
        description: "",
        badges: [],
        worldRecord: false,
        splits: ["", "", ""],
      });
      setErrorMessage("");
      onClose();
    } catch (error) {
      console.error("❌ Error creating run:", error);
      setErrorMessage(error.message || "Failed to create run.");
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg w-full">
      <h3 className="text-xl font-semibold text-purple-400 mb-2">Create New Run</h3>
      <p className="text-red-400 text-xs mt-1 mb-3">
      ❗ IMPORTANT: MAKE SURE TO NOT USE THE SAME SPLIT NAMES - each field needs to be unique!
      </p>
      {errorMessage && <p className="text-red-500 text-sm mb-4">❌ {errorMessage}</p>}
      <Input name="name" value={runData.name} onChange={handleChange} placeholder="Run Name" className="mb-4" required />
      <Textarea name="description" value={runData.description} onChange={handleChange} placeholder="Description" maxLength={400} className="mb-4" required />
      <Input name="badges" onChange={handleBadgeChange} placeholder="Badges (comma-separated)" className="mb-4" required />
      <div className={`flex items-center gap-2 mb-4 p-2 rounded-lg ${runData.worldRecord ? 'bg-green-500' : 'bg-red-500'}`}> 
        <span>World Record:</span>
        <Switch checked={runData.worldRecord} onCheckedChange={(val) => setRunData({ ...runData, worldRecord: val })} />
      </div>
      <h4 className="text-lg font-semibold text-white mb-2">Splits</h4>
      {runData.splits.map((split, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <Input value={split} onChange={(e) => handleSplitChange(index, e.target.value)} className="w-full" required />
          <Button onClick={() => handleRemoveSplit(index)} className="bg-red-500 hover:bg-red-400 text-white">✖</Button>
        </div>
      ))}
      <Button onClick={handleAddSplit} className="mb-4 bg-yellow-500 hover:bg-yellow-400 text-white w-full">Add Split</Button>
      <Button onClick={handleSave} className="bg-green-500 hover:bg-green-400 text-white w-full">Save Run</Button>
      <Button onClick={onClose} className="mt-2 bg-gray-700 hover:bg-gray-600 text-white w-full">Cancel</Button>
    </div>
  );
};

export default CreateSingleGameRun;
