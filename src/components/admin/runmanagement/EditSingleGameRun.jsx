import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const EditSingleGameRun = ({ runId, onClose }) => {
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

      toast.success("✅ Run updated successfully!");
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
      <h3 className="text-xl font-semibold text-purple-400 mb-2">Edit Run</h3>
      <p className="text-red-400 text-xs mt-1 mb-3">
      ❗ IMPORTANT: MAKE SURE TO NOT USE THE SAME GAME NAMES OR SPLIT NAMES - each field needs to be unique!
      </p>
      {errorMessage && <p className="text-red-500 text-sm mb-4">❌ {errorMessage}</p>}
      <Input name="name" value={runData.name} onChange={handleChange} placeholder="Run Name" className="mb-4" required />
      <Textarea name="description" value={runData.description} onChange={handleChange} placeholder="Description" maxLength={400} className="mb-4" required />
      <Input name="badges" value={runData.badges.join(", ")} onChange={handleBadgeChange} placeholder="Badges (comma-separated)" className="mb-4" required />
      <div className={`flex items-center gap-2 mb-4 p-2 rounded-lg ${runData.worldRecord ? 'bg-green-500' : 'bg-red-500'}`}>
        <span>World Record:</span>
        <Switch checked={runData.worldRecord} onCheckedChange={(val) => setRunData({ ...runData, worldRecord: val })} />
      </div>
      <h4 className="text-lg font-semibold text-white mb-2">Splits</h4>
      {runData.splits.map((split, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <Input value={split} onChange={(e) => handleSplitChange(index, e.target.value)} className="w-full" required />
        </div>
      ))}
      <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-400 text-white w-full">Save Changes</Button>
      <Button onClick={onClose} className="mt-2 bg-gray-700 hover:bg-gray-600 text-white w-full">Cancel</Button>
    </div>
  );
};

export default EditSingleGameRun;