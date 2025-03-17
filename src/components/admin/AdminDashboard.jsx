import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [adminRole, setAdminRole] = useState(null);
    const [adminName, setAdminName] = useState(""); // ✅ Store admin name

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const response = await fetch("http://localhost:8081/admin/me", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
                });
                const data = await response.json();

                if (data.error) {
                    console.log("❌ Token Invalid or Expired. Logging out.");
                    handleLogout();
                } else {
                    setAdminRole(data.role);
                    setAdminName(data.username);
                }
            } catch (error) {
                console.error("❌ Failed to fetch admin data:", error);
                handleLogout();
            }
        };

        fetchAdminData();
    }, []);

    const handleLogout = () => {
        console.log("🚨 Forcing Logout...");
        localStorage.removeItem("adminToken");
        sessionStorage.clear(); // ✅ Ensure session data is cleared
        window.location.href = "/admin/login"; // ✅ Hard redirect to reset state
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4 py-10">
            {/* ✅ Personalized Greeting */}
            <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
                Hello, <span className="text-purple-400">{adminName}</span> 👋
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[95%] sm:max-w-4xl">
                {adminRole === "superadmin" && (
                    <Card className="bg-gray-800 border border-gray-700 p-4">
                        <CardHeader>
                            <CardTitle className="text-white text-lg text-center">Manage Players</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Button onClick={() => navigate("/admin/manage-players")} className="mt-8 bg-blue-600 hover:bg-blue-500">Go to Players</Button>
                        </CardContent>
                    </Card>
                )}
                {adminRole === "superadmin" && (
                    <Card className="bg-gray-800 border border-gray-700 p-4">
                        <CardHeader>
                            <CardTitle className="text-white text-lg text-center">Manage Editors</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Button onClick={() => navigate("/admin/manage-editors")} className="mt-8 bg-blue-600 hover:bg-blue-500">Go to Players</Button>
                        </CardContent>
                    </Card>
                )}

                {adminRole === "editor" && (
                    <Card className="bg-gray-800 border border-gray-700 p-4">
                        <CardHeader>
                            <CardTitle className="text-white text-lg text-center">Edit Players</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Button onClick={() => navigate("/admin/edit-players")} className="mt-8 bg-blue-600 hover:bg-blue-500">Go to Edit Players</Button>
                        </CardContent>
                    </Card>
                )}

                <Card className="bg-gray-800 border border-gray-700 p-4">
                    <CardHeader>
                        <CardTitle className="text-white text-lg text-center">Change Password</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button onClick={() => navigate("/admin/change-password")} className="mt-8 bg-red-600 hover:bg-red-500">Change Password</Button>
                    </CardContent>
                </Card>


                <Card className="bg-gray-800 border border-gray-700 p-4">
                    <CardHeader>
                        <CardTitle className="text-white text-lg text-center">Manage Runs</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button onClick={() => navigate("/admin/manage-runs")} className="mt-8 bg-blue-600 hover:bg-blue-500">
                            Go to Manage Runs
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border border-gray-700 p-4">
                    <CardHeader>
                        <CardTitle className="text-white text-lg text-center">Manage Run Videos</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button onClick={() => navigate("/admin/successful-runs")} className="mt-8 bg-blue-600 hover:bg-blue-500">
                            Go to Successful Runs
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border border-gray-700 p-4">
                    <CardHeader>
                        <CardTitle className="text-white text-lg text-center">Manage Other Videos</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button onClick={() => navigate("/admin/guides")} className="mt-8 bg-blue-600 hover:bg-blue-500">
                            Go to Other Videos
                        </Button>
                    </CardContent>
                </Card>

            </div>

            <Button onClick={handleLogout} className="mt-8 bg-red-600 hover:bg-red-500">Logout</Button>
        </div>
    );
};

export default AdminDashboard;