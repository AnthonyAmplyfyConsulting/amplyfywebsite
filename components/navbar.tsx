"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        setIsMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const navLinks = [
        { name: "Services", id: "expertise" },
        { name: "Process", id: "process" },
        { name: "Results", id: "results" },
        { name: "Pricing", id: "pricing" },
        { name: "Contact", id: "contact" },
    ];

    return (
        <nav
            className={cn(
                "fixed top-4 left-0 right-0 z-50 transition-all duration-300",
                scrolled ? "px-4 md:px-8" : "px-4"
            )}
        >
            <div
                className={cn(
                    "relative mx-auto max-w-5xl rounded-full border transition-all duration-300 backdrop-blur-md",
                    scrolled
                        ? "bg-white/80 border-neutral-200 py-3 shadow-lg shadow-black/5"
                        : "bg-white/50 border-white/20 py-4"
                )}
            >
                <div className="flex items-center justify-between px-6">
                    {/* Logo (Amplyfy text for now, or SVG) */}
                    <div
                        className="flex items-center gap-2 cursor-pointer font-bold text-xl tracking-tighter"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <span className="text-neutral-900">Amplyfy</span>
                        <span className="w-2 h-2 rounded-full bg-[#ff5500]" />
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => scrollToSection(link.id)}
                                className="text-sm font-medium text-neutral-600 hover:text-[#ff5500] transition-colors"
                            >
                                {link.name}
                            </button>
                        ))}
                    </div>

                    <div className="hidden md:block">
                        <a
                            href="/login"
                            className="px-6 py-2.5 bg-neutral-900 text-white text-sm font-bold rounded-full hover:bg-[#ff5500] transition-colors"
                        >
                            Log In
                        </a>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-neutral-900"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-[calc(100%+0.5rem)] left-0 right-0 bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-neutral-200 flex flex-col gap-4 md:hidden"
                    >
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => scrollToSection(link.id)}
                                className="text-lg font-bold text-neutral-900 py-2 border-b border-neutral-100 last:border-0 text-left"
                            >
                                {link.name}
                            </button>
                        ))}
                        <button
                            onClick={() => scrollToSection("contact")}
                            className="mt-4 w-full py-4 bg-[#ff5500] text-white font-bold rounded-xl"
                        >
                            Book Call
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
