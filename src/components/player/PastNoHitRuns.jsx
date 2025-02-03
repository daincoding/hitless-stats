import React from "react";

const PastNoHitRuns = ({ pastRuns }) => {
  if (!pastRuns || pastRuns.length === 0) {
    return <p className="text-[var(--color-text-muted)] mt-5">No successful runs yet!</p>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 mt-10">
      <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">Past NoHit Runs</h2>

      {/* Grid Layout for Runs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {pastRuns.map((run, index) => (
          <a
            key={index}
            href={run.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-[var(--color-primary)] rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform w-full"
          >
            {/* YouTube Thumbnail */}
            <img src={run.thumbnail} alt={run.name} className="w-full h-48 object-cover" />

            {/* Run Info */}
            <div className="p-4 bg-[var(--color-dark)] flex flex-col justify-between min-h-[180px]">
              {/* Title & Badges */}
              <div>
                <h3 className="text-lg font-bold text-[var(--color-text-light)]">{run.name}</h3>

                {/* Tags */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {run.badges.map((badge, i) => (
                    <span key={i} className="px-2 py-1 text-xs font-semibold bg-[var(--color-primary)] text-[var(--color-dark)] rounded-lg">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Game + Type */}
              <div className="mt-auto pt-4 border-t border-[var(--color-primary)] text-sm text-[var(--color-text-muted)]">
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
