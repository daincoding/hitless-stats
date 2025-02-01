import { Routes, Route } from "react-router-dom";
import LandingHero from "./components/landing/LandingHero";
import PlayerProfile from "./components/player/PlayerProfile";
import Navbar from "./components/landing/Navbar";

const App = () => {
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<LandingHero />} />
      <Route path="/:playerName" element={<PlayerProfile />} />
    </Routes>
  </>
  );
};

export default App;

