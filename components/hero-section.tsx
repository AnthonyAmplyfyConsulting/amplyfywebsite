"use client";

import { useRef, useEffect } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Ensure video freezes on last frame
    const handleVideoEnded = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            // Optional: seek to exact end if loop logic interferes, 
            // but standard behavior is to stop at last frame if loop={false}
        }
    };

    // Text 1: 0% - 30%
    const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.3], [1, 1, 0]);
    const y1 = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

    // Text 2: 30% - 70%
    const opacity2 = useTransform(scrollYProgress, [0.35, 0.5, 0.65], [0, 1, 0]);
    const y2 = useTransform(scrollYProgress, [0.35, 0.65], [50, -50]);

    // Text 3: 70% - 100%
    const opacity3 = useTransform(scrollYProgress, [0.7, 0.85, 1], [0, 1, 1]);
    const y3 = useTransform(scrollYProgress, [0.7, 1], [50, 0]);


    return (
        <section ref={containerRef} className="relative h-[300vh] bg-background">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    loop={false}
                    onEnded={handleVideoEnded}
                    src="/Amplyfy Hero 4.mp4"
                />
                {/* Fallback color/overlay if needed */}
                <div className="absolute inset-0 bg-white/0" />

                <div className="relative z-20 flex h-full items-center px-4 w-full container mx-auto">
                    <div className="w-full md:w-2/3 flex flex-col justify-center items-start text-left">

                        {/* Section 1 */}
                        <motion.div
                            style={{ opacity: opacity1, y: y1 }}
                            className="absolute max-w-xl space-y-4 md:space-y-6 px-4 md:px-0"
                        >
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-neutral-900 leading-tight">
                                Why pay for busywork when you can <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff9900] to-[#ff3300]">automate it?</span>
                            </h1>
                            <p className="text-lg md:text-xl text-neutral-600 max-w-md">
                                Stop wasting your valuable billable hours on repetitive tasks that stifle your growth.
                            </p>
                        </motion.div>

                        {/* Section 2 */}
                        <motion.div
                            style={{ opacity: opacity2, y: y2 }}
                            className="absolute max-w-xl space-y-4 md:space-y-6 px-4 md:px-0"
                        >
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-neutral-900 leading-tight">
                                We Architect the <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff9900] to-[#ff3300]">AI Loops</span> That Connect Your Apps.
                            </h1>
                            <p className="text-lg md:text-xl text-neutral-600 max-w-md">
                                We build custom workflows that turn your static website into an intelligen, 24/7 sales engine.
                            </p>
                        </motion.div>

                        {/* Section 3 */}
                        <motion.div
                            style={{ opacity: opacity3, y: y3 }}
                            className="absolute max-w-xl space-y-6 md:space-y-8 px-4 md:px-0"
                        >
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-neutral-900 leading-tight">
                                Maximum Output. <br /> Minimum <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff9900] to-[#ff3300]">Input.</span>
                            </h1>

                            <button className="group relative px-8 py-4 bg-gradient-to-r from-[#ff9900] to-[#ff3300] text-white font-bold text-lg rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/20">
                                <span className="relative z-10 flex items-center gap-2">
                                    Book Your Free Automation Audit <ArrowRight className="w-5 h-5" />
                                </span>
                            </button>
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    );
}
