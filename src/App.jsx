import { Routes, Route } from "react-router-dom";
import LandingHero from "./components/landing/LandingHero";
import PlayerProfile from "./components/player/PlayerProfile";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingHero />} />
      <Route path="/:playerName" element={<PlayerProfile />} />
    </Routes>
  );
};

export default App;

