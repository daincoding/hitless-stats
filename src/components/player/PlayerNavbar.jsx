import { Link } from "react-router-dom";
import { FaHeart, FaHome, FaBars, FaTimes } from "react-icons/fa";
import { GiBroadsword } from "react-icons/gi";
import { useState } from "react";

const PlayerNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Scroll to section
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false); // Close menu on selection (Mobile)
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-[var(--color-dark)] flex items-center justify-between px-6 border-b border-[var(--color-primary)] shadow-lg z-50">
      {/* Left: Logo */}
      <div className="flex items-center gap-2 text-[var(--color-primary)] text-xl font-bold">
        <GiBroadsword size={24} />
        <span>Hitless Tracker</span>
      </div>

      {/* Middle: Section Links (Hidden on Mobile) */}
      <div className="hidden md:flex gap-8 text-[var(--color-text-light)]">
        <button onClick={() => scrollToSection("hero-section")} className="hover:text-[var(--color-primary)] transition">
          Info
        </button>
        <button onClick={() => scrollToSection("current-runs-section")} className="hover:text-[var(--color-primary)] transition">
          Current Runs
        </button>
        <button onClick={() => scrollToSection("past-runs-section")} className="hover:text-[var(--color-primary)] transition">
          Videos
        </button>
      </div>

      {/* Right: Home Button */}
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition">
          <FaHome size={18} />
          <span>Home</span>
        </Link>
        <div className="hidden md:flex items-center gap-2 text-[var(--color-text-muted)]">
          <span>With</span>
          <FaHeart className="text-red-500" />
          <span>by dain</span>
        </div>

        {/* Burger Menu Button (Mobile) */}
        <button className="md:hidden text-[var(--color-primary)]" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-[var(--color-dark)] shadow-lg border-t border-[var(--color-primary)] flex flex-col items-center py-4 gap-4 md:hidden text-[var(--color-text-light)]">
          <button onClick={() => scrollToSection("hero-section")} className="hover:text-[var(--color-primary)] transition">
            Info
          </button>
          <button onClick={() => scrollToSection("current-runs-section")} className="hover:text-[var(--color-primary)] transition">
            Current Runs
          </button>
          <button onClick={() => scrollToSection("past-runs-section")} className="hover:text-[var(--color-primary)] transition">
            Videos
          </button>
          <Link to="/" className="hover:text-[var(--color-primary)] transition" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <p className="text-[var(--color-text-muted)]">With ❤️ by dain.</p>
        </div>
      )}
    </nav>
  );
};

export default PlayerNavbar;
