"use client";

import { useRef, useState } from "react";
import { useScroll, useTransform, motion, useMotionValueEvent } from "framer-motion";
import { BrainCircuit, Code2, Rocket, ArrowDown, Handshake } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
    {
        id: 1,
        title: "Applications Strategy Discussion",
        description: "This is where we will discover where AI is actually applicable to your business, this is where we will come up with a customized strategy.",
        icon: BrainCircuit,
    },
    {
        id: 2,
        title: "Applications Development",
        description: "In this stage Amplyfy will fully build your custom solution, keeping in touch and providing revisions.",
        icon: Code2,
    },
    {
        id: 3,
        title: "Deployment",
        description: "Our last step is simply deploying solution and staying connected for feedback and results.",
        icon: Rocket,
    },
];

export function ProcessSteps() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const [activeStep, setActiveStep] = useState(0);

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (latest < 0.2) setActiveStep(0);
        else if (latest < 0.5) setActiveStep(1);
        else if (latest < 0.75) setActiveStep(2);
        else setActiveStep(3);
    });

    // --- Animation Transforms ---

    // 1. Scene Transition: Intro -> Step 1
    const introOpacity = useTransform(scrollYProgress, [0.1, 0.25], [1, 0]);
    const introY = useTransform(scrollYProgress, [0.1, 0.25], [0, -50]);

    // Card Transforms
    const cardScale = useTransform(scrollYProgress, [0, 0.25], [0.8, 1]);
    const cardY = useTransform(scrollYProgress, [0, 0.25], [-100, 0]);
    const cardRotate = useTransform(scrollYProgress, [0, 0.25], [15, 0]);

    // Background cards fade out
    const stackOpacity = useTransform(scrollYProgress, [0.1, 0.2], [1, 0]);

    return (
        <section ref={containerRef} className="lg:h-[400vh] bg-background relative">
            {/* Desktop / Sticky Scroll Layout (lg+) */}
            <div className="hidden lg:block sticky top-0 h-screen overflow-hidden">
                <div className="container mx-auto px-4 h-full relative flex items-center">

                    {/* Background Gradient Blob */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-200/40 to-red-200/40 blur-3xl opacity-50 rounded-full pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 w-full items-center">

                        {/* Left Column: Text & Headings */}
                        <div className="relative z-10">

                            {/* Intro Text */}
                            <motion.div
                                style={{ opacity: introOpacity, y: introY }}
                                className={cn("absolute inset-0 flex flex-col justify-center", activeStep !== 0 && "pointer-events-none")}
                            >
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="text-5xl md:text-7xl font-bold text-neutral-900 mb-6 leading-tight"
                                >
                                    What is the <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff9900] to-[#ff3300]">
                                        Amplyfy Process?
                                    </span>
                                </motion.h2>
                                <div className="flex items-center gap-4">
                                    <p className="text-xl text-neutral-500">Scroll down to get the walkthrough</p>
                                    <motion.div
                                        animate={{ y: [0, 10, 0] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    >
                                        <ArrowDown className="text-[#ff9900] w-6 h-6" />
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Steps Text Container */}
                            <div className="relative min-h-[300px]">
                                {steps.map((step, index) => {
                                    const isActive = activeStep === step.id;
                                    return (
                                        <motion.div
                                            key={step.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{
                                                opacity: isActive ? 1 : 0,
                                                x: isActive ? 0 : -20,
                                                pointerEvents: isActive ? 'auto' : 'none'
                                            }}
                                            transition={{ duration: 0.5 }}
                                            className="absolute inset-0 top-1/2 -translate-y-1/2"
                                        >
                                            <div className="inline-block px-4 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-900 text-sm font-medium mb-6">
                                                Step {step.id}
                                            </div>
                                            <h3 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
                                                {step.title}
                                            </h3>
                                            <p className="text-lg text-neutral-600 leading-relaxed max-w-lg">
                                                {step.description}
                                            </p>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Right Column: 3D Cards */}
                        <div className="relative h-[600px] flex items-center justify-center [perspective:1000px]">

                            {/* Visual Stack (Decorations for Intro) */}
                            <motion.div style={{ opacity: stackOpacity }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                {/* Bottom Card - Inverted: Orange Gradient */}
                                <motion.div
                                    initial={{ opacity: 0, x: 100, rotate: 10 }}
                                    animate={{ opacity: 1, x: 20, rotate: 5 }}
                                    transition={{ delay: 0.2, duration: 0.8 }}
                                    className="absolute w-80 h-96 bg-gradient-to-br from-[#ff9900] to-[#ff3300] rounded-2xl shadow-xl z-0"
                                />
                                {/* Middle Card - Inverted: Orange Gradient */}
                                <motion.div
                                    initial={{ opacity: 0, x: -100, rotate: -10 }}
                                    animate={{ opacity: 1, x: -20, rotate: -5 }}
                                    transition={{ delay: 0.4, duration: 0.8 }}
                                    className="absolute w-80 h-96 bg-gradient-to-br from-[#ff9900] to-[#ff3300] rounded-2xl shadow-xl z-10 flex items-center justify-center"
                                >
                                    {/* Static Intro Icon - White Wrapper, Orange Icon */}
                                    <div className="p-5 rounded-2xl bg-white shadow-inner transition-all">
                                        <Handshake className="w-12 h-12 text-[#ff5500]" />
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Main Active Card - Inverted: Orange Gradient */}
                            <motion.div
                                style={{
                                    scale: cardScale,
                                    y: cardY,
                                    rotate: cardRotate,
                                }}
                                className="relative w-80 h-96 bg-gradient-to-br from-[#ff9900] to-[#ff3300] rounded-2xl shadow-2xl z-20 overflow-hidden flex flex-col items-center justify-center p-8 border border-white/20"
                            >
                                {/* Subtle Texture Overlay */}
                                <div className="absolute inset-0 bg-white/5 opacity-50" />

                                {/* Icons Container with Wipe Effect */}
                                <div className="relative w-32 h-32 flex items-center justify-center z-10">
                                    {steps.map((step, index) => {
                                        return (
                                            <motion.div
                                                key={step.id}
                                                className={cn("absolute inset-0 flex items-center justify-center")}
                                                initial={{ clipPath: "inset(100% 0 0 0)" }}
                                                animate={{
                                                    clipPath: activeStep >= step.id ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)"
                                                }}
                                                transition={{ duration: 0.6, ease: "easeInOut" }}
                                            >
                                                {/* Inverted: White BG, Orange Icon */}
                                                <div className={cn("relative p-6 rounded-2xl bg-white shadow-xl")}>
                                                    <step.icon className="w-16 h-16 text-[#ff5500]" />
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </div>

                                {/* Card Footer Decoration - Lightened for visibility on Orange */}
                                <div className="absolute bottom-8 w-2/3 h-2 rounded-full bg-white/20" />
                                <div className="absolute bottom-4 w-1/2 h-2 rounded-full bg-white/20" />

                            </motion.div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Layout (lg:hidden) - Standard Vertical Stack */}
            <div className="block lg:hidden py-16 px-4">
                <div className="mb-12 text-center">
                    <h2 className="text-4xl font-bold text-neutral-900 mb-4">
                        What is the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff9900] to-[#ff3300]">
                            Amplyfy Process?
                        </span>
                    </h2>
                    <p className="text-lg text-neutral-500">How we turn chaos into automation.</p>
                </div>

                <div className="space-y-12">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center text-center space-y-6"
                        >
                            {/* Mobile Card Visual */}
                            <div className="w-full max-w-sm aspect-[4/5] bg-gradient-to-br from-[#ff9900] to-[#ff3300] rounded-2xl shadow-xl flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/5 opacity-50" />
                                <div className="relative p-6 rounded-2xl bg-white shadow-xl z-10">
                                    <step.icon className="w-12 h-12 text-[#ff5500]" />
                                </div>
                                {/* Decorations */}
                                <div className="absolute bottom-8 w-2/3 h-2 rounded-full bg-white/20" />
                                <div className="absolute bottom-4 w-1/2 h-2 rounded-full bg-white/20" />
                            </div>

                            <div>
                                <div className="inline-block px-4 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-900 text-sm font-medium mb-4">
                                    Step {step.id}
                                </div>
                                <h3 className="text-3xl font-bold text-neutral-900 mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-base text-neutral-600 leading-relaxed max-w-md mx-auto">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
