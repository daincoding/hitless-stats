import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LandingHero from "./components/landing/LandingHero"; 
import PlayerProfile from "./components/player/PlayerProfile"; 
import Navbar from "./components/landing/Navbar"; 
import PlayerNavbar from "./components/player/PlayerNavbar"; 
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import ManagePlayers from "./components/admin/ManagePlayers";
import ProtectedRoute from "./components/admin/ProtectedRoute";

const App = () => {
  const location = useLocation(); 
  const isLandingPage = location.pathname === "/";

  return (
    <>
      {/* Conditionally Render Navbar */}
      {isLandingPage ? <Navbar /> : <PlayerNavbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingHero />} />
        <Route path="/:playerName" element={<PlayerProfile />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/manage-players" element={<ManagePlayers />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;