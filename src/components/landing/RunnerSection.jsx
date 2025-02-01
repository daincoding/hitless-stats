import RunnerCard from "./RunnerCard";

const runners = [
  {
    name: "dain",
    avatar: "src/assets/avatars/waiting_dain.png", 
    completedRuns: "XX",
    completedMarathons: "XX",
    twitch: "https://twitch.tv/dain",
    youtube: "https://youtube.com/dain",
    bluesky: "https://bsky.app/dain",
    teamHitless: "https://teamhitless.com/dain",
  },
  {
    name: "dinossindgeil",
    avatar: "src/assets/avatars/dinossindgeil.png",
    completedRuns: "XX",
    completedMarathons: "XX",
    twitch: "https://twitch.tv/dinossindgeil",
    youtube: "https://youtube.com/dinossindgeil",
    bluesky: "https://bsky.app/dinossindgeil",
    teamHitless: "https://teamhitless.com/dinossindgeil",
  },
  {
    name: "JtheHelmet",
    avatar: "src/assets/avatars/HELMWITHOUTBACK.png",
    completedRuns: "XX",
    completedMarathons: "XX",
    twitch: "https://twitch.tv/jthehelmet",
    youtube: "https://youtube.com/jthehelmet",
    bluesky: "https://bsky.app/jthehelmet",
    teamHitless: "https://teamhitless.com/jthehelmet",
  },

];

const RunnerSection = () => {
  return (
    <div id="runners-section" className="w-full max-w-7xl mx-auto px-6 mt-15">
      {/* Left-Aligned Heading */}
      <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-8 text-blend">
        Runners
      </h2>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8 mb-8">
        {runners.map((player) => (
          <RunnerCard key={player.name} player={player} />
        ))}
      </div>
    </div>
  );
};
  

export default RunnerSection;
