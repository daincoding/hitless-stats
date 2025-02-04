import { Routes, Route, useLocation } from "react-router-dom";
import LandingHero from "./components/landing/LandingHero"; 
import PlayerProfile from "./components/player/PlayerProfile"; 
import Navbar from "./components/landing/Navbar"; // Navbar for the landing page
import PlayerNavbar from "./components/player/PlayerNavbar"; // Navbar for player profile pages

const App = () => {
  const location = useLocation(); // Get the current URL route

  // Determine if the user is currently on the Landing Page ("/")
  // This will be used to conditionally render the correct Navbar
  const isLandingPage = location.pathname === "/";

  return (
    <>
      {/* If on Landing Page, show the standard Navbar, otherwise show PlayerNavbar */}
      {isLandingPage ? <Navbar /> : <PlayerNavbar />}

      <Routes>
        <Route path="/" element={<LandingHero />} />
        {/* The ":playerName" acts as a URL parameter to load different players dynamically */}
        <Route path="/:playerName" element={<PlayerProfile />} />
      </Routes>
    </>
  );
};

export default App;
