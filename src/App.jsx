import { Routes, Route, useLocation } from "react-router-dom";
import LandingHero from "./components/landing/LandingHero";
import PlayerProfile from "./components/player/PlayerProfile";
import Navbar from "./components/landing/Navbar";
import PlayerNavbar from "./components/player/PlayerNavbar";

const App = () => {
  const location = useLocation(); // Get current route

  // Check if the user is on the Landing Page ("/")
  const isLandingPage = location.pathname === "/";

  return (
    <>
      {/* Show correct Navbar depending on the page */}
      {isLandingPage ? <Navbar /> : <PlayerNavbar />}

      <Routes>
        <Route path="/" element={<LandingHero />} />
        <Route path="/:playerName" element={<PlayerProfile />} />
      </Routes>
    </>
  );
};

export default App;
