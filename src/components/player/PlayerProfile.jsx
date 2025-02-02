import { useParams } from "react-router-dom";
import { players } from "../../data/players";
import BackgroundWrapper from "../layout/BackgroundWrapper";
import PlayerHero from "./PlayerHero";

const PlayerProfile = () => {
  const { playerName } = useParams(); // Get player name from URL
  const player = players[playerName]; // Fetch the corresponding player data

  // If player doesn't exist, show an error or redirect
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
    </BackgroundWrapper>
  );
};

export default PlayerProfile;
