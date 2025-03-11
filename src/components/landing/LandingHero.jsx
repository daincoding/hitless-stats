import SearchBar from "./SearchBar"; 
import RunnerSection from "./RunnerSection"; 
import Footer from "./Footer"; 
import BackgroundWrapper from "../layout/BackgroundWrapper"; 
import { FaAngleDown } from "react-icons/fa"; 
import { motion } from "framer-motion"; 

// Animation Presets
const aniContainerLeft = (delay) => ({
    hidden: { x: -100, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.5, delay: delay },
    },
});

const aniContainerRight = (delay) => ({
    hidden: { x: 100, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.5, delay: delay },
    },
});

const aniContainerOpacity = (delay) => ({
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.75, delay: delay },
    },
});

const LandingHero = () => {
    return (
        <BackgroundWrapper>
            {/* ✅ Hero Content - Now pushed down correctly */}
            <div className="min-h-screen flex flex-col items-center justify-center text-[var(--color-text-light)] px-6 pt-[7rem] md:pt-[10rem]">
                
                {/* ✅ Centered Heading */}
                <motion.h1 
                    variants={aniContainerLeft(0.25)}
                    initial="hidden"
                    animate="visible"
                    className="text-3xl md:text-5xl font-bold text-[var(--color-primary)] text-center"
                >
                    Find your Hitless Runner
                </motion.h1>

                {/* ✅ Centered Subtitle */}
                <motion.p 
                    variants={aniContainerRight(0.5)}
                    initial="hidden"
                    animate="visible"
                    className="mt-2 text-[var(--color-text-muted)] text-center text-lg md:text-xl"
                >
                    Look for a legend and see their current and past Runs!
                </motion.p>

                {/* ✅ Search Bar - Now correctly spaced & centered */}
                <motion.div
                    variants={aniContainerOpacity(1)}
                    initial="hidden"
                    animate="visible"
                    className="w-full flex flex-col items-center mt-6 md:mt-10"
                >
                    <SearchBar />

                    {/* ✅ Animated Arrow (now properly aligned) */}
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="mt-8 md:mt-12 text-[var(--color-text-muted)]"
                    >
                        <FaAngleDown size={32} />
                    </motion.div>
                </motion.div>
            </div>

            {/* ✅ Runners Section */}
            <RunnerSection />

            {/* ✅ Footer */}
            <Footer />
        </BackgroundWrapper>
    );
};

export default LandingHero;