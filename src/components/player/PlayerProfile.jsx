import BackgroundWrapper from "../layout/BackgroundWrapper";

const PlayerProfile = () => {
  return (
    <BackgroundWrapper>
      <div className="min-h-screen flex flex-col items-center justify-center text-[var(--color-text-light)]">
        <h1 className="text-4xl font-bold text-[var(--color-primary)]">Player Profile</h1>
        {/* More profile details will go here */}
      </div>
    </BackgroundWrapper>
  );
};

export default PlayerProfile;
