import React from "react";

// 🏆 Component to Display Past No-Hit Runs
// --------------------------------------------
// This component receives "pastRuns" as a prop and renders a grid layout of past successful runs.
// Each run includes a YouTube thumbnail, run title, badges, and game info.
const PastNoHitRuns = ({ pastRuns }) => {
  
  // 🛑 If no past runs exist, display a message instead
  if (!pastRuns || pastRuns.length === 0) {
    return <p className="text-[var(--color-text-muted)] mt-5">No successful runs yet!</p>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 mt-10">
      {/* Section Heading */}
      <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">Past NoHit Runs</h2>

      {/* 📌 Grid Layout for Runs */}
      {/* Responsive grid: 1 column on small screens, 2 on medium, 3 on large */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {pastRuns.map((run, index) => ( // goes through every run and maps through the whole index 
          <a
            key={index} // Unique key for React rendering optimization
            href={run.youtube} // Link to the run's YouTube video
            target="_blank" 
            rel="noopener noreferrer" // Security best practice for external links
            className="block border border-[var(--color-primary)] rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform w-full"
          >
            {/* 🖼️ YouTube Thumbnail */}
            <img 
              src={run.thumbnail} // Image from YouTube
              alt={run.name} // Run name as alt text for accessibility
              className="w-full h-48 object-cover" // Ensure consistent size & cropping
            />

            {/* 📌 Run Info Container */}
            <div className="p-4 bg-[var(--color-dark)] flex flex-col justify-between min-h-[180px]">
              
              {/* 🎯 Title & Badges */}
              <div>
                {/* Run Title */}
                <h3 className="text-lg font-bold text-[var(--color-text-light)]">
                  {run.name}
                </h3>

                {/* 🎖️ Run Badges */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {run.badges.map((badge, i) => ( // This is a nested .map() that happens inside the first .map() loop.
                    <span 
                      key={i}  // badge → Holds the current badge value ("Any%", "Unrestricted", etc.).
                      className="px-2 py-1 text-xs font-semibold bg-[var(--color-primary)] text-[var(--color-dark)] rounded-lg"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* 🎮 Game Name & Run Type */}
              <div className="mt-auto pt-4 border-t border-[var(--color-primary)] text-sm text-[var(--color-text-muted)]">
                {/* If it's a Marathon, display all games; otherwise, just show one game */}
                {run.type === "Marathon" ? run.games.join(", ") : run.game} • {run.type}
              </div>

            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default PastNoHitRuns;
