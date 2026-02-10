"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
    Database,
    Server,
    Cpu,
    Code2,
    MessageSquare,
    Zap,
    LayoutTemplate
} from "lucide-react";

const icons = [
    { name: "n8n", icon: Zap, color: "#ff6600" },          // Workflow automation
    { name: "Supabase", icon: Database, color: "#3ecf8e" }, // Database
    { name: "Azure", icon: Server, color: "#0078d4" },      // Cloud
    { name: "Gemini", icon: Cpu, color: "#8e44ad" },        // AI
    { name: "ChatGPT", icon: MessageSquare, color: "#10a37f" }, // AI
    { name: "Antigravity", icon: Code2, color: "#ff9900" }, // Custom
    { name: "Framer", icon: LayoutTemplate, color: "#0055ff" }, // Design
    { name: "Higgsfield", icon: Zap, color: "#F84F8D" }, // AI Video (Placeholder Icon)
    { name: "qDrant", icon: Database, color: "#BF1F44" }, // Vector DB
];

export function ExpertiseSection() {
    return (
        <section className="py-24 bg-neutral-50 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-16">

                    {/* Left Column: Copy */}
                    <div className="flex-1 space-y-8 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
                                Gain Access to our <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff9900] to-[#ff3300]">Expertise</span>
                            </h2>
                            <p className="text-xl text-neutral-600 leading-relaxed max-w-lg mx-auto md:mx-0">
                                Our Amplyfy team has spent over 6 months and $5,000 learning every aspect of applicable AI applications, so you don't have to.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto md:mx-0">
                            <div className="p-4 bg-white rounded-2xl shadow-sm border border-neutral-100">
                                <div className="text-3xl font-bold text-[#ff5500] mb-1">6+</div>
                                <div className="text-sm text-neutral-500">Months R&D</div>
                            </div>
                            <div className="p-4 bg-white rounded-2xl shadow-sm border border-neutral-100">
                                <div className="text-3xl font-bold text-[#ff5500] mb-1">$5k+</div>
                                <div className="text-sm text-neutral-500">Invested</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Interactive Icon Cloud */}
                    <div className="flex-1 w-full flex justify-center perspective-1000">
                        <IconCloud />
                    </div>
                </div>
            </div>
        </section>
    );
}

function IconCloud() {
    // A simple floating grid effect
    return (
        <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
            {/* Central Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff9900]/20 to-[#ff3300]/20 blur-3xl rounded-full opacity-50" />

            <div className="relative w-full h-full grid grid-cols-3 gap-4 p-8">
                {icons.map((item, i) => (
                    <FloatingIcon key={item.name} item={item} index={i} />
                ))}
            </div>
        </div>
    );
}

function FloatingIcon({ item, index }: { item: typeof icons[0], index: number }) {
    // Random float duration and delay based on index
    const duration = 3 + (index % 3);
    const delay = index * 0.2;

    return (
        <motion.div
            className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-lg border border-neutral-100 hover:border-[#ff9900]/50 transition-colors cursor-pointer group"
            animate={{
                y: [0, -15, 0],
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay,
            }}
            whileHover={{ scale: 1.1, y: -5 }}
        >
            <div
                className="w-12 h-12 flex items-center justify-center rounded-full bg-neutral-50 mb-2 group-hover:bg-orange-50 transition-colors"
                style={{ color: item.color }}
            >
                <item.icon className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-neutral-700">{item.name}</span>
        </motion.div>
    )
}
