import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            toast.error("All fields are required.");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            toast.error("New passwords do not match.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8081/admin/change-password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
                body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Password changed successfully! Please log in again.");

                // ✅ Clear token & force logout
                localStorage.removeItem("adminToken");
                sessionStorage.clear();
                setTimeout(() => {
                    window.location.href = "/admin/login"; // Redirect to login
                }, 1500);
            } else {
                toast.error(data.error || "Failed to change password.");
            }
        } catch (error) {
            toast.error("Error changing password.");
        }
    };

    return (
        <div className="p-6 text-white bg-gray-900 min-h-screen flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-center text-purple-400">Change Password</h2>

            <Input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
                type="password"
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
            />

            <Button onClick={handleChangePassword} className="bg-blue-500 hover:bg-blue-400 text-white">
                Update Password
            </Button>
        </div>
    );
};

export default ChangePassword;