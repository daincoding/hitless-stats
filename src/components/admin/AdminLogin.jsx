import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8081/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("🔹 New Token Received:", data.token);

        // ✅ Ensure old data is cleared before storing new session
        localStorage.clear();
        sessionStorage.clear();
        localStorage.setItem("adminToken", data.token);

        toast.success("Login successful! Redirecting...");
        navigate("/admin/dashboard");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("An error occurred while logging in.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-gray-900">
      <Toaster position="top-right" />

      <Card className="p-6 w-full max-w-md text-center bg-gray-800 border border-gray-700 shadow-lg mt-16 mx-4">
        <h2 className="text-2xl font-bold text-white mb-6">Admin Login</h2>

        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 w-full text-white placeholder-gray-400 bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-gray-500 shadow-sm"
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full text-white placeholder-gray-400 bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-gray-500 shadow-sm"
        />

        <Button
          onClick={handleLogin}
          className="w-full p-3 bg-blue-600 hover:bg-blue-500 text-white border border-blue-500 rounded-md shadow-md transition-all duration-200"
        >
          Login
        </Button>
      </Card>
    </div>
  );
};

export default AdminLogin;