import { useParams } from "react-router-dom";

const PlayerProfile = () => {
  const { playerName } = useParams(); // Get player name from URL

  return (
    <div className="flex items-center justify-center h-screen text-[var(--color-text-light)] bg-[var(--color-dark)]">
      <h1 className="text-4xl">Welcome to {playerName}'s Profile</h1>
    </div>
  );
};

export default PlayerProfile;
