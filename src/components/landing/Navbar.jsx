import { Link, useLocation } from "react-router-dom";
import { FaHeart, FaHome } from "react-icons/fa";
import { GiBroadsword } from "react-icons/gi";

const Navbar = () => {
  const location = useLocation(); // Get the current route from React Router

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-[var(--color-dark)] flex items-center justify-between px-6 border-b border-[var(--color-primary)] shadow-lg z-50">
      
      {/* ✅ Left Section: Logo */}
      <div className="flex items-center gap-2 text-[var(--color-primary)] text-xl font-bold">
        <GiBroadsword size={24} /> 
        <span>HitlessStats</span> 
      </div>

      {/* ✅ Middle Section: Navigation Links (Hidden on Mobile) */}
      <div className="hidden md:flex gap-8 text-[var(--color-text-light)]">
        
        {/* 🔗 External Link to Team Hitless (Opens in New Tab) */}
        <a
          href="https://teamhitless.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--color-primary)] transition hidden md:inline"
        >
          Team Hitless
        </a>

        {/* 🔘 Button to Scroll to Runners Section (Smooth Scroll) */}
        <button
          onClick={() => document.getElementById("runners-section")?.scrollIntoView({ behavior: "smooth" })} // Gets the runners-section ID for scrolling and the ? just shows that its optional so it doesnt break if its not possible
          className="hover:text-[var(--color-primary)] transition hidden md:inline"
        >
          Runners
        </button>
      </div>

      {/* ✅ Right Section: Home Button + Signature */}
      <div className="flex items-center gap-6">
        
        {/* 🏠 Home Button (Only Shown on Player Profile Pages) - actually redundant now because we have 2 NavBars but doesnt matter */}
        {location.pathname !== "/" && ( // Checks if its NOT the landing page - location is set at the top by useLocation()
          <Link 
            to="/"  // the link to the landing page again.
            className="flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition"
          >
            <FaHome size={18} /> 
            <span>Home</span>
          </Link>
        )}

        {/* ❤️ "With Love by dain" Signature */}
        <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
          <span>With</span>
          <FaHeart className="text-red-500" /> {/* Heart icon */}
          <span>by dain</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
