import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FaUser, FaRunning, FaBook, FaSignOutAlt, FaTachometerAlt, FaBars, FaTimes, FaTrophy, FaKey, FaHome } from "react-icons/fa";

const AdminNavbar = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
    };

    return (
        <nav className="w-full bg-gray-800 text-white fixed top-0 left-0 shadow-md z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
                
                {/* Logo / Title */}
                <Link to="/admin/dashboard" className="text-xl font-bold text-purple-400 flex items-center gap-2">
                    <FaTachometerAlt /> Admin Panel
                </Link>

                {/* Desktop Navigation (Hidden on mobile) */}
                <div className="hidden md:flex gap-6">
                    <Link to="/admin/manage-players" className="flex items-center gap-2 hover:text-purple-300 transition">
                        <FaUser /> Players
                    </Link>
                    <Link to="/admin/manage-runs" className="flex items-center gap-2 hover:text-purple-300 transition">
                        <FaRunning /> Runs
                    </Link>
                    <Link to="/admin/successful-runs" className="flex items-center gap-2 hover:text-purple-300 transition">
                        <FaTrophy /> Successful Runs
                    </Link>
                    <Link to="/admin/guides" className="flex items-center gap-2 hover:text-purple-300 transition">
                        <FaBook /> Guides & Other
                    </Link>
                    <Link to="/admin/change-password" className="flex items-center gap-2 hover:text-purple-300 transition">
                        <FaKey /> Change Password
                    </Link>
                </div>

                {/* Right Side: Home & Logout */}
                <div className="hidden md:flex gap-4">
                    {/* ✅ Home Button - Opens Landing Page in New Tab */}
                    <Button 
                        onClick={() => window.open("/", "_blank")} 
                        className="bg-gray-700 hover:bg-gray-600 flex items-center gap-2"
                    >
                        <FaHome /> Home
                    </Button>

                    {/* Logout Button */}
                    <Button 
                        onClick={handleLogout} 
                        variant="destructive" 
                        className="flex items-center gap-2"
                    >
                        <FaSignOutAlt /> Logout
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <button 
                    onClick={() => setMenuOpen(!menuOpen)} 
                    className="md:hidden text-2xl text-white focus:outline-none"
                >
                    {menuOpen ? <FaTimes /> : <FaBars />} {/* Open/Close Icon */}
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="md:hidden flex flex-col bg-gray-900 text-white p-4 space-y-4 border-t border-gray-700">
                    <Link to="/admin/manage-players" className="flex items-center gap-2 hover:text-purple-300 transition">
                        <FaUser /> Players
                    </Link>
                    <Link to="/admin/manage-runs" className="flex items-center gap-2 hover:text-purple-300 transition">
                        <FaRunning /> Runs
                    </Link>
                    <Link to="/admin/successful-runs" className="flex items-center gap-2 hover:text-purple-300 transition">
                        <FaTrophy /> Successful Runs
                    </Link>
                    <Link to="/admin/guides" className="flex items-center gap-2 hover:text-purple-300 transition">
                        <FaBook /> Guides & Other
                    </Link>
                    <Link to="/admin/change-password" className="flex items-center gap-2 hover:text-purple-300 transition">
                        <FaKey /> Change Password
                    </Link>
                    
                    {/* ✅ Home Button - Opens Landing Page in New Tab */}
                    <Button 
                        onClick={() => window.open("/", "_blank")} 
                        className="bg-gray-700 hover:bg-gray-600 flex items-center gap-2 w-full"
                    >
                        <FaHome /> Home
                    </Button>

                    {/* Logout Button */}
                    <Button 
                        onClick={handleLogout} 
                        variant="destructive" 
                        className="flex items-center gap-2 w-full"
                    >
                        <FaSignOutAlt /> Logout
                    </Button>
                </div>
            )}
        </nav>
    );
};

export default AdminNavbar;