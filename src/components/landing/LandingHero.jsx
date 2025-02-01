import React from 'react'

const LandingHero = () => {
  return (
    <div className="relative h-screen bg-[var(--color-dark)]">
      {/* Background Blur Effect */}
      <div className="absolute inset-0">
        <div className="relative h-full w-full bg-[var(--color-dark)] [&>div]:absolute [&>div]:inset-0 [&>div]:bg-[var(--color-primary)] [&>div]:bg-[size:20px_20px] [&>div]:opacity-20 [&>div]:blur-[100px]">
          <div></div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative flex flex-col items-center justify-center h-full text-[var(--color-text-light)]">
        <h1 className="text-4xl font-bold text-[var(--color-primary)]">Find your Hitless Runner</h1>
        <p className="mt-2 text-[var(--color-text-muted)]">Look for a legend and see their current and past Runs!</p>

        {/* Search Button */}
        <div className="flex gap-4">
            <button className="mt-4 px-6 py-2 bg-[var(--color-primary)] text-[var(--color-dark)] rounded-lg shadow-lg hover:bg-[var(--color-primary-hover)] transition">
              Search Now
            </button>
            <button className="mt-4 px-6 py-2 bg-[var(--color-primary)] text-[var(--color-dark)] rounded-lg shadow-lg hover:bg-[var(--color-primary-hover)] transition">
              Clear
            </button>
        </div>
      </div>
    </div>
  );
};

export default LandingHero