import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [players, setPlayers] = useState([]); // Fetch players dynamically
  const [selectedIndex, setSelectedIndex] = useState(-1); // For arrow key navigation
  const navigate = useNavigate(); // Enables navigation

  useEffect(() => {
    // Fetch players dynamically from the API
    const fetchPlayers = async () => {
      try {
        const response = await fetch("http://localhost:5001/players"); // Adjust API URL if needed
        const data = await response.json();
        const playerNames = data.map((player) => player.name); // Extract names only
        setPlayers(playerNames);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchPlayers();
  }, []);

  // Handle input change and filter results
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);
    setFilteredPlayers(players.filter((player) => player.toLowerCase().includes(value)));
    setSelectedIndex(-1); // Reset selection when typing
  };

  // Handle selection from autocomplete
  const handleSelect = (player) => {
    setQuery(player);
    setFilteredPlayers([]); // Hide suggestions
    navigate(`/${player}`); // Redirect to profile page
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (filteredPlayers.length === 0) return;

    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev < filteredPlayers.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredPlayers.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      handleSelect(filteredPlayers[selectedIndex]); 
    }
  };

  // Clear search input
  const handleClear = () => {
    setQuery("");
    setFilteredPlayers([]);
    setSelectedIndex(-1);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Search Input */}
      <div className="relative flex items-center w-80 border border-[var(--color-primary)] rounded-lg bg-[var(--color-dark)]">
        <AiOutlineSearch className="absolute left-3 text-[var(--color-text-muted)] text-xl" />
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          placeholder="Search Hitless Runner..."
          className="w-full py-2 pl-10 pr-4 bg-transparent text-[var(--color-text-light)] outline-none"
        />
      </div>

      {/* Autocomplete Suggestions */}
      {filteredPlayers.length > 0 && (
        <div className="mt-2 w-80 bg-[var(--color-dark)] border border-[var(--color-primary)] rounded-lg shadow-lg">
          {filteredPlayers.map((player, index) => (
            <div
              key={player}
              className={`p-2 cursor-pointer transition-all ${
                selectedIndex === index ? "bg-[var(--color-primary-hover)] rounded-lg" : ""
              }`}
              onClick={() => handleSelect(player)}
            >
              {player}
            </div>
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => handleSelect(query)}
          disabled={!players.includes(query)}
          className={`px-6 py-2 rounded-lg shadow-lg transition ${
            players.includes(query)
              ? "bg-[var(--color-primary)] text-[var(--color-dark)] hover:bg-[var(--color-primary-hover)]"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
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
