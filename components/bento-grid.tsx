"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Code, Bot, Workflow, ArrowUpRight } from "lucide-react";

interface BentoItemProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    className?: string;
    children?: React.ReactNode;
}

function BentoItem({ title, description, icon, className, children }: BentoItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
                "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 hover:border-[#00ff88]/50 transition-colors duration-500",
                className
            )}
        >
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#00ff88]/10 text-[#00ff88]">
                    {icon}
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                    <p className="text-neutral-400">{description}</p>
                </div>
            </div>

            {/* Background Gradient/Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00ff88]/0 via-[#00ff88]/0 to-[#00ff88]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {children}
        </motion.div>
    );
}

export function BentoGrid() {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="mb-16 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        An Ecosystem, Not Just a Website.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] md:auto-rows-[350px]">
                    {/* Item 1: High-Conversion Web Dev (Large, Left) */}
                    <BentoItem
                        title="High-Conversion Web Dev"
                        description="Built for speed, SEO, and sales. No bloat, just performance."
                        icon={<Code className="w-6 h-6" />}
                        className="md:col-span-2 md:row-span-2"
                    >
                        <div className="absolute right-0 bottom-0 w-3/4 h-3/4 bg-white/5 border-l border-t border-white/10 rounded-tl-3xl translate-x-10 translate-y-10 group-hover:translate-x-5 group-hover:translate-y-5 transition-transform duration-500 overflow-hidden">
                            {/* Mockup Placeholder */}
                            <div className="p-4 space-y-3">
                                <div className="w-full h-8 bg-white/10 rounded-lg animate-pulse" />
                                <div className="w-3/4 h-4 bg-white/5 rounded-lg" />
                                <div className="w-1/2 h-4 bg-white/5 rounded-lg" />
                                <div className="flex gap-2 pt-4">
                                    <div className="w-full h-32 bg-gradient-to-br from-[#ff5500]/20 to-transparent rounded-xl border border-[#ff5500]/20" />
                                </div>
                            </div>
                        </div>
                    </BentoItem>

                    {/* Item 2: AI Automation (Top Right) */}
                    <BentoItem
                        title="AI Automation"
                        description="Zapier, Make.com, & Python scripts that do the heavy lifting."
                        icon={<Workflow className="w-6 h-6" />}
                        className="md:col-span-1"
                    >
                        <ArrowUpRight className="absolute top-8 right-8 w-6 h-6 text-neutral-400 group-hover:text-[#ff5500] transition-colors" />
                    </BentoItem>

                    {/* Item 3: Custom Chatbots (Bottom Right) */}
                    <BentoItem
                        title="Custom Chatbots"
                        description="Support agents that never sleep and know your business."
                        icon={<Bot className="w-6 h-6" />}
                        className="md:col-span-1"
                    >
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#ff5500]/10 to-transparent" />
                    </BentoItem>
                </div>
            </div>
        </section>
    );
}
