import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LandingHero from "./components/landing/LandingHero"; 
import PlayerProfile from "./components/player/PlayerProfile"; 
import Navbar from "./components/landing/Navbar"; 
import PlayerNavbar from "./components/player/PlayerNavbar"; 
import AdminNavbar from "./components/admin/AdminNavbar"; 
import AdminLoginNavbar from "./components/admin/AdminLoginNavbar"; 
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import ManagePlayers from "./components/admin/ManagePlayers";
import EditPlayers from "./components/admin/editorcomponents/EditPlayers"; // ✅ NEW FOR EDITORS
import ManageRuns from "./components/admin/runmanagement/ManageRuns"; // ✅ NEW FOR SUPERADMINS
import ProtectedRoute from "./components/admin/ProtectedRoute";
import ManageEditors from "./components/admin/ManageEditors";
import ChangePassword from "./components/admin/ChangePassword";
import AdminSuccessfulRuns from "./components/admin/runmanagement/AdminSuccessfulRuns";
import GuidesAndOther from "./components/admin/runmanagement/GuidesAndOther";

const App = () => {
  const location = useLocation(); 
  const isLandingPage = location.pathname === "/";
  const isAdminLoginPage = location.pathname === "/admin/login";
  const isAdminPage = location.pathname.startsWith("/admin") && !isAdminLoginPage;
  const isPlayerProfile = location.pathname.startsWith("/") && location.pathname !== "/" && !isAdminPage;

  return (
    <>
      {/* ✅ Show the correct Navbar */}
      {isAdminLoginPage ? <AdminLoginNavbar /> : isLandingPage ? <Navbar /> : isAdminPage ? <AdminNavbar /> : <PlayerNavbar />}

      <Routes>
        {/* ✅ Public Routes */}
        <Route path="/" element={<LandingHero />} />
        <Route path="/:playerName" element={<PlayerProfile />} />

        {/* ✅ Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ✅ Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/change-password" element={<ChangePassword />} />
          
          {/* ✅ Superadmin Routes */}
          <Route path="/admin/manage-players" element={<ManagePlayers />} />
          <Route path="/admin/manage-editors" element={<ManageEditors />} />
          <Route path="/admin/manage-runs" element={<ManageRuns />} />
          <Route path="/admin/successful-runs" element={<AdminSuccessfulRuns />} />
          <Route path="/admin/guides" element={<GuidesAndOther />} />
          
          {/* ✅ Editor Routes */}
          <Route path="/admin/edit-players" element={<EditPlayers />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;