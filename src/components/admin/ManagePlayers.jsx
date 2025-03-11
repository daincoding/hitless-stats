import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const ManagePlayers = () => {
    const [players, setPlayers] = useState([]);
    const [newPlayer, setNewPlayer] = useState({
        name: "",
        avatar: "",
        description: "",
        socials: { twitch: "", youtube: "", bluesky: "" },
        completedRuns: 0,
        completedMarathons: 0,
        schedule: {
            Monday: "No Stream",
            Tuesday: "05:30 PM",
            Wednesday: "05:30 PM",
            Thursday: "05:30 PM",
            Friday: "05:30 PM",
            Saturday: "Spontaneous",
            Sunday: "Spontaneous",
        },
    });

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            const response = await fetch("http://localhost:5001/players");
            const data = await response.json();
            setPlayers(data);
        } catch (error) {
            toast.error("Failed to fetch players.");
        }
    };

    const handleCreatePlayer = async () => {
        try {
            const response = await fetch("http://localhost:5001/admin/players", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPlayer),
            });
            if (response.ok) {
                toast.success("Player added!");
                setNewPlayer({
                    name: "",
                    avatar: "",
                    description: "",
                    socials: { twitch: "", youtube: "", bluesky: "" },
                    completedRuns: 0,
                    completedMarathons: 0,
                    schedule: {
                        Monday: "No Stream",
                        Tuesday: "05:30 PM",
                        Wednesday: "05:30 PM",
                        Thursday: "05:30 PM",
                        Friday: "05:30 PM",
                        Saturday: "Spontaneous",
                        Sunday: "Spontaneous",
                    },
                });
                fetchPlayers();
            } else {
                toast.error("Failed to add player.");
            }
        } catch (error) {
            toast.error("Error creating player.");
        }
    };

    const handleDeletePlayer = async (id) => {
        try {
            await fetch(`http://localhost:5001/admin/players/${id}`, { method: "DELETE" });
            toast.success("Player deleted!");
            fetchPlayers();
        } catch (error) {
            toast.error("Error deleting player.");
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gray-900 text-white">
            <h1 className="text-3xl font-bold text-center mb-6">Manage Players</h1>

            {/* Add New Player */}
            <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                <h2 className="text-lg font-bold mb-2">Add New Player</h2>
                <Input
                    type="text"
                    placeholder="Player Name"
                    value={newPlayer.name}
                    onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                    className="mb-2 text-white bg-gray-700 border-gray-600"
                />
                <Input
                    type="text"
                    placeholder="Avatar URL"
                    value={newPlayer.avatar}
                    onChange={(e) => setNewPlayer({ ...newPlayer, avatar: e.target.value })}
                    className="mb-2 text-white bg-gray-700 border-gray-600"
                />
                <Textarea
                    placeholder="Description"
                    value={newPlayer.description}
                    onChange={(e) => setNewPlayer({ ...newPlayer, description: e.target.value })}
                    className="mb-2 text-white bg-gray-700 border-gray-600"
                />
                <h3 className="text-lg font-bold mt-4">Socials</h3>
                <Input
                    type="text"
                    placeholder="Twitch URL"
                    value={newPlayer.socials.twitch}
                    onChange={(e) => setNewPlayer({ ...newPlayer, socials: { ...newPlayer.socials, twitch: e.target.value } })}
                    className="mb-2 text-white bg-gray-700 border-gray-600"
                />
                <Input
                    type="text"
                    placeholder="YouTube URL"
                    value={newPlayer.socials.youtube}
                    onChange={(e) => setNewPlayer({ ...newPlayer, socials: { ...newPlayer.socials, youtube: e.target.value } })}
                    className="mb-2 text-white bg-gray-700 border-gray-600"
                />
                <Input
                    type="text"
                    placeholder="Bluesky URL"
                    value={newPlayer.socials.bluesky}
                    onChange={(e) => setNewPlayer({ ...newPlayer, socials: { ...newPlayer.socials, bluesky: e.target.value } })}
                    className="mb-2 text-white bg-gray-700 border-gray-600"
                />

                <h3 className="text-lg font-bold mt-4">Completed Runs</h3>
                <Input
                    type="number"
                    placeholder="Completed Runs"
                    value={newPlayer.completedRuns}
                    onChange={(e) => setNewPlayer({ ...newPlayer, completedRuns: Number(e.target.value) })}
                    className="mb-2 text-white bg-gray-700 border-gray-600"
                />
                <Input
                    type="number"
                    placeholder="Completed Marathons"
                    value={newPlayer.completedMarathons}
                    onChange={(e) => setNewPlayer({ ...newPlayer, completedMarathons: Number(e.target.value) })}
                    className="mb-4 text-white bg-gray-700 border-gray-600"
                />

                <Button onClick={handleCreatePlayer} className="w-full bg-blue-500">Add Player</Button>
            </div>

            {/* Players List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {players.map((player) => (
                    <Card key={player.id} className="bg-gray-800">
                        <CardHeader>
                            <CardTitle className="text-white">{player.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <img src={player.avatar} alt={player.name} className="w-full h-32 object-cover rounded-lg mb-2" />
                            <p className="text-gray-400 text-sm">{player.description}</p>
                            <div className="mt-2 flex flex-col gap-2">
                                <Button onClick={() => handleDeletePlayer(player.id)} className="w-full bg-red-500">Delete</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ManagePlayers;