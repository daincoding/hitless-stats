import { FaHeart } from "react-icons/fa";
import { GiBroadsword } from "react-icons/gi";

const Navbar = () => {
  const scrollToRunners = () => {
    document.getElementById("runners-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-14 bg-[var(--color-dark)] flex items-center justify-between px-6 border-b border-[var(--color-primary)] shadow-lg z-50">
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
          className="hover:text-[var(--color-primary)] transition"
        >
          Team Hitless
        </a>
        <button
          onClick={scrollToRunners}
          className="hover:text-[var(--color-primary)] transition"
        >
          Runners
        </button>
      </div>

      {/* Right: "With ❤️ by dain" */}
      <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
        <span>With</span>
        <FaHeart className="text-red-500" />
        <span>by dain</span>
      </div>
    </nav>
  );
};

export default Navbar;
