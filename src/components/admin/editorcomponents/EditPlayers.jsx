import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import MpInfo from "../managecomponents/MpInfo";
import MpCompleted from "../managecomponents/MpCompleted";
import MpSocials from "../managecomponents/MpSocials";
import MpSchedule from "../managecomponents/MpSchedule";
import { FaCheck } from "react-icons/fa";

const EditPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true); // ✅ Initially disabled

  // Form State
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [description, setDescription] = useState("");
  const [twitch, setTwitch] = useState("");
  const [youtube, setYoutube] = useState("");
  const [bluesky, setBluesky] = useState("");
  const [completedRuns, setCompletedRuns] = useState(0);
  const [completedMarathons, setCompletedMarathons] = useState(0);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const response = await fetch("http://localhost:5001/admin/players", {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      const data = await response.json();
      setPlayers(data);
    };
    fetchPlayers();
  }, []);

  const handleSelectPlayer = (playerName) => {
    console.log("🔹 Selected Player:", playerName);

    if (!playerName) {
      setIsDisabled(true); // ✅ Disable fields if no player is selected
      clearForm();
      return;
    }

    const player = players.find((p) => p.name === playerName);
    if (player) {
      console.log("✅ Player Found, Enabling Fields.");
      setSelectedPlayer(player);
      setIsDisabled(false); // ✅ Enable fields after selection

      // Set Form Data
      setName(player.name);
      setAvatar(player.avatar);
      setDescription(player.description);
      setTwitch(player.socials?.twitch || "");
      setYoutube(player.socials?.youtube || "");
      setBluesky(player.socials?.bluesky || "");
      setCompletedRuns(player.completedRuns);
      setCompletedMarathons(player.completedMarathons);
      setSchedule(player.schedule || []);
    }
  };

  const clearForm = () => {
    console.log("🔹 Clearing Form & Disabling Inputs.");
    setSelectedPlayer(null);
    setIsDisabled(true); // ✅ Ensure everything is disabled
    setName("");
    setAvatar("");
    setDescription("");
    setTwitch("");
    setYoutube("");
    setBluesky("");
    setCompletedRuns(0);
    setCompletedMarathons(0);
    setSchedule([]);
  };

  const [isUpdating, setIsUpdating] = useState(false);

const handleUpdatePlayer = async () => {
    if (!selectedPlayer) {
      toast.error("Select a player to update.");
      return;
    }

    setIsUpdating(true); // ✅ Start loading animation

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
        console.log("✅ Player Updated Successfully!");
        toast.success(`✅ ${selectedPlayer.name} updated successfully!`);
      } else {
        toast.error("❌ Failed to update player.");
      }
    } catch (error) {
      toast.error("❌ Error updating player.");
    }

    setTimeout(() => setIsUpdating(false), 1000); // ✅ Reset after 1 second
};



  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-center text-purple-400">Edit Players</h2>

      {/* Select Player */}
      <Select onValueChange={handleSelectPlayer}>
        <SelectTrigger className="w-full bg-gray-800 text-white border border-gray-700 cursor-pointer">
          <SelectValue placeholder="Select a player to edit" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 text-white">
          {players.map((player) => (
            <SelectItem key={player.name} value={player.name}>
              {player.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Modular Components - Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MpInfo {...{ name, setName, avatar, setAvatar, description, setDescription, isDisabled }} />
        <MpCompleted {...{ completedRuns, setCompletedRuns, completedMarathons, setCompletedMarathons, isDisabled }} />
      </div>

      <MpSocials {...{ twitch, setTwitch, youtube, setYoutube, bluesky, setBluesky, isDisabled }} />
      <MpSchedule {...{ schedule, setSchedule, isDisabled }} />

      {/* Buttons */}
      <div className="flex justify-center gap-3 mt-6">
      <Button 
  onClick={handleUpdatePlayer} 
  className={`bg-green-500 hover:bg-green-400 text-white flex items-center gap-2`}
  disabled={isDisabled || isUpdating} // ✅ Disable during update
>
  {isUpdating ? <FaCheck className="text-white" /> : "Update Player"}
</Button>
      </div>
    </div>
  );
};

export default EditPlayers;