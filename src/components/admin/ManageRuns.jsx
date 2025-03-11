import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const ManageRuns = () => {
    const [runs, setRuns] = useState([]);
    const [newRun, setNewRun] = useState({ name: "", type: "Single Game", description: "" });

    useEffect(() => {
        fetchRuns();
    }, []);

    const fetchRuns = async () => {
        try {
            const response = await fetch("http://localhost:5001/players");
            const data = await response.json();
            setRuns(data.flatMap(player => player.currentRuns));
        } catch (error) {
            toast.error("Failed to fetch runs.");
        }
    };

    const handleCreateRun = async () => {
        try {
            const response = await fetch("http://localhost:5001/admin/runs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newRun),
            });
            if (response.ok) {
                toast.success("Run added!");
                setNewRun({ name: "", type: "Single Game", description: "" });
                fetchRuns();
            } else {
                toast.error("Failed to add run.");
            }
        } catch (error) {
            toast.error("Error creating run.");
        }
    };

    const handleDeleteRun = async (id) => {
        try {
            await fetch(`http://localhost:5001/admin/runs/${id}`, { method: "DELETE" });
            toast.success("Run deleted!");
            fetchRuns();
        } catch (error) {
            toast.error("Error deleting run.");
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gray-900 text-white">
            <h1 className="text-3xl font-bold text-center mb-6">Manage Runs</h1>

            {/* Add New Run */}
            <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                <h2 className="text-lg font-bold mb-2">Add New Run</h2>
                <Input
                    type="text"
                    placeholder="Run Name"
                    value={newRun.name}
                    onChange={(e) => setNewRun({ ...newRun, name: e.target.value })}
                    className="mb-2 text-white bg-gray-700 border-gray-600"
                />
                <Input
                    type="text"
                    placeholder="Description"
                    value={newRun.description}
                    onChange={(e) => setNewRun({ ...newRun, description: e.target.value })}
                    className="mb-2 text-white bg-gray-700 border-gray-600"
                />
                <Button onClick={handleCreateRun} className="w-full bg-blue-500">Add Run</Button>
            </div>

            {/* Runs List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {runs.map((run) => (
                    <Card key={run.id} className="bg-gray-800">
                        <CardHeader>
                            <CardTitle className="text-white">{run.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-400">{run.description}</p>
                            <Button onClick={() => handleDeleteRun(run.id)} className="w-full bg-red-500">Delete</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ManageRuns;