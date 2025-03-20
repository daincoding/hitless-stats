import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";

const GuidesAndOther = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [guides, setGuides] = useState([]);
  const [newGuide, setNewGuide] = useState({ name: "", youtube: "", badges: [] });

  // ✅ Fetch players on load
  useEffect(() => {
    fetchPlayers();
  }, []);

  // ✅ Fetch guides when a player is selected
  useEffect(() => {
    if (selectedPlayer) fetchGuides(selectedPlayer);
  }, [selectedPlayer]);

  /** ✅ Fetch all players */
  const fetchPlayers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/admin/players`, {
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

  /** ✅ Fetch guides for selected player */
  const fetchGuides = async (player) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/admin/guides/${player}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      if (!response.ok) throw new Error("Failed to fetch guides");
      const data = await response.json();
      setGuides(data);
    } catch (error) {
      console.error("❌ Error fetching guides:", error);
      toast.error("Failed to load guides.");
    }
  };

  /** ✅ Handle input changes */
  const handleInputChange = (e) => {
    setNewGuide({ ...newGuide, [e.target.name]: e.target.value });
  };

  /** ✅ Handle adding a new guide */
  const handleAddGuide = async () => {
    if (!newGuide.name || !newGuide.youtube || !selectedPlayer) {
      toast.error("❌ Please fill all fields before adding a guide.");
      return;
    }

    const selectedPlayerObj = players.find(p => p.name === selectedPlayer);
    if (!selectedPlayerObj) {
      toast.error("❌ Selected player not found.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/admin/guides/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({
          ...newGuide,
          playerId: selectedPlayerObj.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to add guide");

      toast.success("✅ Guide added successfully!");
      fetchGuides(selectedPlayer);
      setNewGuide({ name: "", youtube: "", badges: [] });
    } catch (error) {
      console.error("❌ Error adding guide:", error);
      toast.error("Failed to add guide.");
    }
  };

  /** ✅ Handle deleting a guide */
  const handleDeleteGuide = async (guideId) => {
    if (!confirm("Are you sure you want to delete this guide?")) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/admin/guides/${guideId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });

      if (!response.ok) throw new Error("Failed to delete guide");

      toast.success("✅ Guide deleted successfully!");
      fetchGuides(selectedPlayer);
    } catch (error) {
      console.error("❌ Error deleting guide:", error);
      toast.error("Failed to delete guide.");
    }
  };

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen w-full">
      <h3 className="text-2xl font-semibold text-green-400 mb-6">Manage Guides & Other Videos</h3>

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

      {/* ✅ Add New Guide Form */}
      {selectedPlayer && (
        <div className="mb-8 p-6 bg-gray-800 rounded-lg shadow-lg">
          <h4 className="text-lg font-semibold text-yellow-400 mb-4">Add New Video</h4>

          <Input 
            name="name" 
            placeholder="Video Titel *" 
            value={newGuide.name} 
            onChange={handleInputChange} 
            className="mb-3" 
            required 
          />

          <Input 
            name="youtube" 
            placeholder="YouTube Link *" 
            value={newGuide.youtube} 
            onChange={handleInputChange} 
            className="mb-3" 
            required 
          />

          <Input 
            name="badges" 
            placeholder="Badges (comma-separated) *" 
            value={newGuide.badges} 
            onChange={(e) => setNewGuide({ ...newGuide, badges: e.target.value.split(",") })} 
            className="mb-3" 
            required 
          />

          <Button 
            onClick={handleAddGuide} 
            className="mt-4 bg-blue-500 hover:bg-blue-400 w-full"
            disabled={!newGuide.name || !newGuide.youtube}
          >
            Add Video
          </Button>
        </div>
      )}

      {/* ✅ Guides List (Compact Cards) */}
      {guides.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-6">
          {guides.map((guide) => (
            <div key={guide.id} className="bg-gray-800 p-3 rounded-lg shadow-md flex flex-col items-center">
              <img src={guide.thumbnail} alt={guide.name} className="w-full h-40 rounded-lg object-cover shadow-sm" />
              <div className="text-center mt-2 w-full">
                <h4 className="text-md font-bold text-white">{guide.name}</h4>
              </div>
              <Button onClick={() => handleDeleteGuide(guide.id)} className="bg-red-500 hover:bg-red-400 text-white w-full mt-3">
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuidesAndOther;