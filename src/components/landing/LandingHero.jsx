import React from 'react'
import SearchBar from './SearchBar';

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

        {/* Search Bar */}
        <div className="mt-10">
            <SearchBar />
        </div>
      </div>
    </div>
  );
};

export default LandingHero