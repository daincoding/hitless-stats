import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";

const ManageEditors = () => {
  const [editors, setEditors] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedEditor, setSelectedEditor] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [permittedPlayers, setPermittedPlayers] = useState([]);

  // ✅ Fetch Editors and Players on Load
  useEffect(() => {
    fetchEditors();
    fetchPlayers();
  }, []);

  const fetchEditors = async () => {
    try {
      const response = await fetch("http://localhost:5001/admin/list-editors", {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch editors");
      }
  
      const data = await response.json();
      console.log("🔍 Editors Fetched:", data); // ✅ Debugging Log
      setEditors(data);
    } catch (error) {
      console.error("❌ Error fetching editors:", error);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await fetch("http://localhost:5001/admin/players", {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  // ✅ Select an Editor
  const handleSelectEditor = (editorUsername) => {
    if (editorUsername === "new") {
      clearForm();
      return;
    }
    const editor = editors.find((e) => e.username === editorUsername);
    if (editor) {
      setSelectedEditor(editor);
      setUsername(editor.username);
      setPermittedPlayers(editor.permittedPlayers || []);
      setPassword(""); // Reset password input (not displayed for security reasons)
    }
  };

  // ✅ Handle Creating a New Editor
  const handleCreateEditor = async () => {
    if (!username.trim() || !password.trim()) {
      toast.error("Username and password are required.");
      return;
    }

    const newEditorData = { username, password, permittedPlayers };

    try {
      const response = await fetch("http://localhost:5001/admin/create-editor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(newEditorData),
      });

      if (response.ok) {
        toast.success("Editor created successfully!");
        fetchEditors();
        clearForm();
      } else {
        toast.error("Failed to create editor.");
      }
    } catch (error) {
      toast.error("Error creating editor.");
    }
  };

  // ✅ Handle Updating Editor Permissions
  const handleUpdateEditor = async () => {
    if (!selectedEditor) {
        toast.error("Select an editor to update.");
        return;
    }

    const updatedData = { 
        permittedPlayers 
    };

    // ✅ Include password only if a new one is entered
    if (password.trim()) {
        updatedData.password = password;
    }

    try {
        const response = await fetch(`http://localhost:5001/admin/update-editor/${selectedEditor.username}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
            body: JSON.stringify(updatedData),
        });

        if (response.ok) {
            toast.success("Editor updated successfully!");
            fetchEditors(); // ✅ Refresh editor list
        } else {
            toast.error("Failed to update editor.");
        }
    } catch (error) {
        toast.error("Error updating editor.");
    }
};

  // ✅ Handle Deleting an Editor
  const handleDeleteEditor = async () => {
    if (!selectedEditor) {
      toast.error("Select an editor to delete.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedEditor.username}?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/admin/delete-editor/${selectedEditor.username}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });

      if (response.ok) {
        toast.success("Editor deleted successfully!");
        fetchEditors();
        clearForm();
      } else {
        toast.error("Failed to delete editor.");
      }
    } catch (error) {
      toast.error("Error deleting editor.");
    }
  };

  // ✅ Assign or Remove Players
  const togglePlayerPermission = (playerName) => {
    setPermittedPlayers((prev) =>
      prev.includes(playerName) ? prev.filter((p) => p !== playerName) : [...prev, playerName]
    );
  };

  // ✅ Reset Form
  const clearForm = () => {
    setSelectedEditor(null);
    setUsername("");
    setPassword("");
    setPermittedPlayers([]);
  };

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-center text-purple-400">Manage Editors</h2>

      {/* Select Editor Dropdown */}
      <Select onValueChange={handleSelectEditor}>
        <SelectTrigger className="w-full bg-gray-800 text-white border border-gray-700 cursor-pointer">
          <SelectValue placeholder="Select an editor or create new" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 text-white">
          <SelectItem value="new">➕ Create New Editor</SelectItem>
          {editors.map((editor) => (
            <SelectItem key={editor.username} value={editor.username}>
              {editor.username}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Editor Info Fields */}
      <Input placeholder="Enter Username" value={username} onChange={(e) => setUsername(e.target.value)} disabled={!!selectedEditor} />
      <Input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />

      {/* Assign Players Section */}
      <h3 className="text-lg font-bold text-purple-400">Assign Players</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {players.map((player) => (
          <Button
            key={player.name}
            onClick={() => togglePlayerPermission(player.name)}
            className={permittedPlayers.includes(player.name) ? "bg-green-500" : "bg-gray-700"}
          >
            {player.name}
          </Button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
        <Button onClick={handleCreateEditor} className="bg-blue-500 hover:bg-blue-400 text-white" disabled={selectedEditor}>
          Create Editor
        </Button>
        <Button onClick={handleUpdateEditor} className="bg-green-500 hover:bg-green-400 text-white" disabled={!selectedEditor}>
          Update Editor
        </Button>
        <Button onClick={handleDeleteEditor} className="bg-red-600 hover:bg-red-500 text-white" disabled={!selectedEditor}>
          Delete Editor
        </Button>
      </div>
    </div>
  );
};

export default ManageEditors;