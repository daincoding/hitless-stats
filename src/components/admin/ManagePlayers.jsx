import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { FaCheck } from "react-icons/fa"; // ✅ Checkmark Icon
import MpInfo from "./managecomponents/MpInfo";
import MpCompleted from "./managecomponents/MpCompleted";
import MpSocials from "./managecomponents/MpSocials";
import MpSchedule from "./managecomponents/MpSchedule";

const ManagePlayers = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(""); // ✅ Tracks action success messages

  const defaultSchedule = [
    { day: "Monday", time: "Spontaneous", fixed: false },
    { day: "Tuesday", time: "Spontaneous", fixed: false },
    { day: "Wednesday", time: "Spontaneous", fixed: false },
    { day: "Thursday", time: "Spontaneous", fixed: false },
    { day: "Friday", time: "Spontaneous", fixed: false },
    { day: "Saturday", time: "Spontaneous", fixed: false },
    { day: "Sunday", time: "Spontaneous", fixed: false },
  ];

  // Form State
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [description, setDescription] = useState("");
  const [twitch, setTwitch] = useState("");
  const [youtube, setYoutube] = useState("");
  const [bluesky, setBluesky] = useState("");
  const [completedRuns, setCompletedRuns] = useState(0);
  const [completedMarathons, setCompletedMarathons] = useState(0);
  const [schedule, setSchedule] = useState(defaultSchedule);

  useEffect(() => {
    const fetchPlayers = async () => {
      const response = await fetch("http://localhost:5001/players");
      const data = await response.json();
      setPlayers(data);
    };
    fetchPlayers();
  }, []);

  // Reset success message when user modifies input
  useEffect(() => {
    setActionSuccess("");
  }, [name, avatar, description, twitch, youtube, bluesky, completedRuns, completedMarathons, schedule]);

  const reloadPage = () => {
    setTimeout(() => {
      window.location.reload(); // ✅ Reload page after a short delay
    }, 500);
  };

  const handleSelectPlayer = (playerName) => {
    if (!playerName || playerName === "new") {
      clearForm();
      return;
    }

    const player = players.find((p) => p.name === playerName);
    if (player) {
      setSelectedPlayer(player);
      setName(player.name);
      setAvatar(player.avatar);
      setDescription(player.description);
      setTwitch(player.socials?.twitch || "");
      setYoutube(player.socials?.youtube || "");
      setBluesky(player.socials?.bluesky || "");
      setCompletedRuns(player.completedRuns);
      setCompletedMarathons(player.completedMarathons);
      setSchedule(player.schedule || {});
    }
  };

  const clearForm = () => {
    setSelectedPlayer(null);
    setName("");
    setAvatar("");
    setDescription("");
    setTwitch("");
    setYoutube("");
    setBluesky("");
    setCompletedRuns(0);
    setCompletedMarathons(0);
    setSchedule({});
    setActionSuccess("");
  };

  const handleCreatePlayer = async () => {
    if (!name.trim()) {
      toast.error("Player name is required.");
      return;
    }

    const newPlayerData = {
      name,
      avatar,
      description,
      socials: { twitch, youtube, bluesky },
      completedRuns: parseInt(completedRuns, 10),
      completedMarathons: parseInt(completedMarathons, 10),
      schedule,
    };

    try {
      const response = await fetch("http://localhost:5001/admin/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(newPlayerData),
      });

      if (response.ok) {
        toast.success("New player created successfully!");
        setActionSuccess("Player created ✅");
        clearForm();
        reloadPage(); // ✅ Reload the page after creating
      } else {
        toast.error("Failed to create player.");
      }
    } catch (error) {
      toast.error("Error creating player.");
    }
  };

  const handleUpdatePlayer = async () => {
    if (!selectedPlayer) {
      toast.error("Select a player to update.");
      return;
    }

    const updatedData = {
      name,
      avatar,
      description,
      socials: { twitch, youtube, bluesky },
      completedRuns: parseInt(completedRuns, 10),
      completedMarathons: parseInt(completedMarathons, 10),
      schedule,
    };

    try {
      const response = await fetch(`http://localhost:5001/admin/players/${selectedPlayer.name}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        toast.success("Player updated successfully!");
        setActionSuccess("Player updated ✅");
        reloadPage(); // ✅ Reload the page after updating
      } else {
        toast.error("Failed to update player.");
      }
    } catch (error) {
      toast.error("Error updating player.");
    }
  };

  const handleDeletePlayer = async () => {
    if (!selectedPlayer) {
      toast.error("Select a player to delete.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedPlayer.name}?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/admin/players/${selectedPlayer.name}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (response.ok) {
        toast.success("Player deleted successfully!");
        setActionSuccess("Player deleted ✅");
        clearForm();
        reloadPage(); // ✅ Reload the page after deletion
      } else {
        toast.error("Failed to delete player.");
      }
    } catch (error) {
      toast.error("Error deleting player.");
    }
  };

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-center text-purple-400">Manage Players</h2>

      {/* Select Player */}
      <Select onValueChange={handleSelectPlayer}>
        <SelectTrigger className="w-full bg-gray-800 text-white border border-gray-700 cursor-pointer">
          <SelectValue placeholder="Select a player or create new" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 text-white">
          <SelectItem value="new">➕ Create New Player</SelectItem>
          {players.map((player) => (
            <SelectItem key={player.name} value={player.name}>
              {player.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Modular Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MpInfo {...{ name, setName, avatar, setAvatar, description, setDescription }} />
        <MpCompleted {...{ completedRuns, setCompletedRuns, completedMarathons, setCompletedMarathons }} />
      </div>

      <MpSocials {...{ twitch, setTwitch, youtube, setYoutube, bluesky, setBluesky }} />
      <MpSchedule {...{ schedule, setSchedule }} />

      {/* Buttons - Sticks to bottom */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
        <div className="flex items-center gap-2">
          <Button onClick={handleCreatePlayer} className="bg-blue-500 hover:bg-blue-400 text-white cursor-pointer" disabled={selectedPlayer}>
            Create Player
          </Button>
          {actionSuccess === "Player created ✅" && <span className="text-green-400 font-bold">{actionSuccess}</span>}
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleUpdatePlayer} className="bg-green-500 hover:bg-green-400 text-white cursor-pointer" disabled={!selectedPlayer}>
            Update Player
          </Button>
          {actionSuccess === "Player updated ✅" && <span className="text-green-400 font-bold">{actionSuccess}</span>}
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleDeletePlayer} className="bg-red-600 hover:bg-red-500 text-white cursor-pointer" disabled={!selectedPlayer}>
            Delete Player
          </Button>
          {actionSuccess === "Player deleted ✅" && <span className="text-green-400 font-bold">{actionSuccess}</span>}
        </div>
      </div>
    </div>
  );
};

export default ManagePlayers;