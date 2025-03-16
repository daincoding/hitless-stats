import { useEffect, useState } from "react";

const Guides = ({ guides }) => {
  const [guidesList, setGuidesList] = useState(guides || []); // Uses useState to store guidesList (initializing with guides or an empty array).

  useEffect(() => { // Uses useEffect to update the list when guides changes.
    console.log("📖 Updating Guides Section:", guides);
    setGuidesList(guides || []);
  }, [guides]);

  if (!guidesList || guidesList.length === 0) {
    return <p className="text-center text-[var(--color-text-muted)] mt-10">No guides available</p>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 mt-20 mb-20">
      <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">Guides & Creations</h2>

      {/* Grid Layout for Guides (3 Per Row & Wider) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {guidesList.map((guide, index) => (
          <a
            key={index}
            href={guide.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-[var(--color-primary)] rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform w-full"
          >
            {/* YouTube Thumbnail */}
            <img src={guide.thumbnail} alt={guide.name} className="w-full h-48 object-cover" />

            {/* Guide Info */}
            <div className="p-4 bg-[var(--color-dark)] flex flex-col justify-between min-h-[180px]">
              {/* Title */}
              <h3 className="text-lg font-bold text-[var(--color-text-light)]">{guide.name}</h3>

              {/* Badges */}
              <div className="mt-auto pt-4 border-t border-[var(--color-primary)] text-sm text-[var(--color-text-muted)] flex flex-wrap gap-2">
                {guide.badges.map((badge, i) => (
                  <span key={i} className="px-2 py-1 text-xs font-semibold bg-[var(--color-primary)] text-[var(--color-dark)] rounded-lg">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Guides;
