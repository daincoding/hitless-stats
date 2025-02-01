import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

const players = ["dain", "dinossindgeil", "JtheHelmet"]; // Temporary static data

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState([]);

  // Handle input change and filter results
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);
    setFilteredPlayers(players.filter((player) => player.toLowerCase().includes(value)));
  };

  // Handle selection from autocomplete
  const handleSelect = (player) => {
    setQuery(player); // Set input to selected player
    setFilteredPlayers([]); // Hide suggestions
  };

  // Clear search input
  const handleClear = () => {
    setQuery("");
    setFilteredPlayers([]);
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative flex items-center w-80 border border-[var(--color-primary)] rounded-lg bg-[var(--color-dark)]">
        <AiOutlineSearch className="absolute left-3 text-[var(--color-text-muted)] text-xl" />
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search Hitless Runner..."
          className="w-full py-2 pl-10 pr-4 bg-transparent text-[var(--color-text-light)] outline-none"
        />
      </div>

      {/* Autocomplete Suggestions */}
      {filteredPlayers.length > 0 && (
        <div className="mt-2 w-80 bg-[var(--color-dark)] border border-[var(--color-primary)] rounded-lg shadow-lg">
          {filteredPlayers.map((player) => (
            <div
              key={player}
              className="p-2 hover:bg-[var(--color-primary-hover)] cursor-pointer"
              onClick={() => handleSelect(player)}
            >
              {player}
            </div>
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4 mt-4">
        <button className="px-6 py-2 bg-[var(--color-primary)] text-[var(--color-dark)] rounded-lg shadow-lg hover:bg-[var(--color-primary-hover)] transition">
          Search Now
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-[var(--color-primary)] text-[var(--color-dark)] rounded-lg shadow-lg hover:bg-[var(--color-primary-hover)] transition"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
