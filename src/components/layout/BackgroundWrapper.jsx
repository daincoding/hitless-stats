const BackgroundWrapper = ({ children }) => {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[var(--color-dark)]">
        {/* Cyberpunk Background Layer */}
        <div className="cyberpunk-bg"></div>
  
        {/* Neon Blurred Glows */}
        <div className="cyberpunk-neon-glow neon-purple"></div>
        <div className="cyberpunk-neon-glow neon-blue"></div>
        <div className="cyberpunk-neon-glow neon-pink"></div>
  
        {/* Page Content */}
        <div className="relative z-10">{children}</div>
      </div>
    );
  };
  
  export default BackgroundWrapper;
  