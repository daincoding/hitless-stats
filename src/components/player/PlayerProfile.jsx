import { useParams } from "react-router-dom";
import { players } from "../../data/players";
import BackgroundWrapper from "../layout/BackgroundWrapper";
import PlayerHero from "./PlayerHero";
import CurrentRuns from "./stats/CurrentRuns";
import PastNoHitRuns from "./PastNoHitRuns";
import Guides from "./Guides";
import Footer from "../landing/Footer";
import { useEffect } from "react";

const PlayerProfile = () => {
  const { playerName } = useParams(); // Get player name from URL
  const player = players[playerName]; // Fetch the corresponding player data

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [playerName]);

  if (!player) {
    return (
      <BackgroundWrapper>
        <div className="min-h-screen flex flex-col items-center justify-center text-[var(--color-text-light)]">
          <h1 className="text-4xl font-bold text-[var(--color-accent)]">Player Not Found</h1>
        </div>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      {/* Hero Section */}
      <div id="hero-section">
        <PlayerHero player={player} />
      </div>

      {/* Current Runs Section */}
      <div id="current-runs-section" className="mt-16">
        <CurrentRuns currentRuns={player.currentRuns} />
      </div>

      {/* Past Runs Section */}
      <div id="past-runs-section" className="mt-16">
        <PastNoHitRuns pastRuns={player.pastNoHitRuns} />
      </div>

      {/* Guides Section */}
      <div id="guides-section" className="mt-16 mb-20">
        <Guides guides={player.guides} />
      </div>

      {/* Footer Section */}
      <Footer />
    </BackgroundWrapper>
  );
};

export default PlayerProfile;
