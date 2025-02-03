import { useParams } from "react-router-dom";
import { players } from "../../data/players";
import BackgroundWrapper from "../layout/BackgroundWrapper";
import PlayerHero from "./PlayerHero";
import CurrentRuns from "./stats/CurrentRuns";

const PlayerProfile = () => {
  const { playerName } = useParams(); // Get player name from URL
  const player = players[playerName]; // Fetch the corresponding player data

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
      <PlayerHero player={player} />
      
      {/* Current Runs Section */}
      <div className="mt-16">
        <CurrentRuns currentRuns={player.currentRuns} />
      </div>
      
      {/* Future: Add Completed Runs and Stats Below This */}
    </BackgroundWrapper>
  );
};

export default PlayerProfile;
