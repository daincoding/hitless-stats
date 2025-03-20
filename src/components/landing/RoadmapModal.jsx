import { motion } from "framer-motion";
import { FaRocket, FaCode, FaCheckCircle, FaBug, FaPalette, FaTimes } from "react-icons/fa";

const roadmapSteps = [
  { title: "Performance Improvements", icon: <FaRocket />, description: "Currently especially on mobile the performance is really bad - focusing on increasing the performance heavily!" },
  { title: "Performance Improvements", icon: <FaBug />, description: "Fixing a Bug that Schedule of a Player can never be fully empty!" },
  { title: "Better Statistics Design", icon: <FaPalette />, description: "There is improvment to be made on the Statistics. I want them to be more clear especially on Single Game Runs with many Splits" },
  { title: "More Statistics", icon: <FaPalette />, description: "Adding more statistics. If you have Ideas please let me know on Discord or Github!" },
  { title: "Twitch Clip Integration", icon: <FaCode />, description: "Having the possibility to add a Clip to a Hit that Links to Twitch.TV" },
  { title: "Adding more Socials", icon: <FaRocket />, description: "Possibility to add more Socials to your Profiles." }
];

const RoadmapModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      {/* ✅ Modal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.9 }} 
        className="bg-[var(--color-dark)] text-[var(--color-text-light)] w-full max-w-lg md:max-w-xl p-6 md:p-8 rounded-lg shadow-lg relative"
      >
        {/* ✅ Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition">
          <FaTimes size={20} />
        </button>

        {/* ✅ Title */}
        <h2 className="text-xl md:text-2xl font-bold text-center text-[var(--color-primary)] mb-6 flex items-center justify-center gap-2">
          🚀 Roadmap
        </h2>

        {/* ✅ Roadmap Steps (Icons Above Titles & Separator Line) */}
        <div className="space-y-6">
          {roadmapSteps.map((step, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.2 }}
              className="flex flex-col items-center text-center"
            >
              {/* ✅ Small Icon Above Title */}
              <div className="text-[var(--color-primary)] w-5 h-5 flex items-center justify-center mb-2">
                {step.icon}
              </div>
              
              {/* ✅ Title */}
              <h3 className="text-base md:text-lg font-semibold text-[var(--color-primary)]">{step.title}</h3>
              
              {/* ✅ Description */}
              <p className="text-sm md:text-base text-[var(--color-text-muted)]">{step.description}</p>
              
              {/* ✅ Separator Line (Not added for the last item) */}
              {index !== roadmapSteps.length - 1 && <div className="w-16 h-px bg-[var(--color-primary)] my-4"></div>}
            </motion.div>
          ))}
        </div>

        {/* ✅ Close Button (Bottom) */}
        <div className="flex justify-center mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm md:text-base bg-[var(--color-primary)] text-[var(--color-text-light)] rounded-md shadow-md hover:bg-[var(--color-primary-hover)] transition">
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RoadmapModal;