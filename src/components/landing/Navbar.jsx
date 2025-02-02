import { Link, useLocation } from "react-router-dom";
import { FaHeart, FaHome } from "react-icons/fa";
import { GiBroadsword } from "react-icons/gi";

const Navbar = () => {
  const location = useLocation(); // Get current route

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-[var(--color-dark)] flex items-center justify-between px-6 border-b border-[var(--color-primary)] shadow-lg z-50">
      {/* Left: Logo */}
      <div className="flex items-center gap-2 text-[var(--color-primary)] text-xl font-bold">
        <GiBroadsword size={24} />
        <span>HitlessStats</span>
      </div>

      {/* Middle: Links (Hidden on Mobile) */}
      <div className="hidden md:flex gap-8 text-[var(--color-text-light)]">
        <a
          href="https://teamhitless.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--color-primary)] transition hidden md:inline"
        >
          Team Hitless
        </a>
        <button
          onClick={() => document.getElementById("runners-section")?.scrollIntoView({ behavior: "smooth" })}
          className="hover:text-[var(--color-primary)] transition hidden md:inline"
        >
          Runners
        </button>
      </div>

      {/* Right: Home Button (Only on Player Profile Pages) */}
      <div className="flex items-center gap-6">
        {location.pathname !== "/" && (
          <Link to="/" className="flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition">
            <FaHome size={18} />
            <span>Home</span>
          </Link>
        )}
        <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
          <span>With</span>
          <FaHeart className="text-red-500" />
          <span>by dain</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
