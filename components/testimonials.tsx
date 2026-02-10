"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
    {
        id: 1,
        text: "Amplyfy didn't just build us a website, they built a machine. Our lead flow has tripled since we implemented their automated follow-up loops.",
        author: "Sarah Jenkins",
        role: "Director of Operations, TechFlow",
    },
    {
        id: 2,
        text: "The ROI was clear within the first month. The custom chatbot handles 80% of our support inquiries now, freeing up my team to focus on high-value clients.",
        author: "Michael Chen",
        role: "Founder, ScaleUp Agency",
    },
    {
        id: 3,
        text: "Finally, a dev agency that understands business. They didn't just take orders; they architected a solution that actually drives revenue.",
        author: "David Miller",
        role: "VP of Sales, GrowthCorp",
    }
];

export function Testimonials() {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        // Standard infinite loop logic
        let nextIndex = current + newDirection;
        if (nextIndex < 0) nextIndex = testimonials.length - 1;
        if (nextIndex >= testimonials.length) nextIndex = 0;
        setCurrent(nextIndex);
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0,
        }),
    };

    return (
        <section className="py-32 bg-background border-t border-neutral-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                    {/* Left Column: Heading & Controls */}
                    <div className="space-y-8">
                        <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight">
                            Here's what our <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff9900] to-[#ff3300]">
                                partners have to say.
                            </span>
                        </h2>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => paginate(-1)}
                                className="p-4 rounded-full border border-neutral-200 bg-white text-neutral-600 hover:border-[#ff9900] hover:text-[#ff9900] transition-colors focus:outline-none"
                                aria-label="Previous testimonial"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => paginate(1)}
                                className="p-4 rounded-full border border-neutral-200 bg-white text-neutral-600 hover:border-[#ff9900] hover:text-[#ff9900] transition-colors focus:outline-none"
                                aria-label="Next testimonial"
                            >
                                <ArrowRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Review Card */}
                    <div className="relative">
                        {/* Static Large Quote Icon */}
                        <div className="absolute -top-12 -left-4 z-0 text-neutral-100">
                            <Quote className="w-32 h-32 fill-current" />
                        </div>

                        <div className="relative z-10 min-h-[300px] flex items-center">
                            <AnimatePresence initial={false} mode="wait" custom={direction}>
                                <motion.div
                                    key={current}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 }
                                    }}
                                    className="w-full bg-white p-8 md:p-12 rounded-3xl border border-neutral-100 shadow-xl shadow-orange-500/5"
                                >
                                    <div className="mb-8">
                                        <div className="flex gap-1 mb-6">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} className="w-2 h-2 rounded-full bg-[#ff9900]" />
                                            ))}
                                        </div>
                                        <p className="text-xl md:text-2xl text-neutral-700 font-medium leading-relaxed italic">
                                            "{testimonials[current].text}"
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-bold text-neutral-900">
                                            {testimonials[current].author}
                                        </h4>
                                        <p className="text-sm text-neutral-500 font-medium tracking-wide uppercase">
                                            {testimonials[current].role}
                                        </p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
