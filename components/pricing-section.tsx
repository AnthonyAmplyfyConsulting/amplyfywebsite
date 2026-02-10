"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
    {
        name: "Entry",
        price: "$1,000 - $5,000",
        description: "Perfect for businesses starting their automation journey.",
        features: [
            "Custom Site Design",
            "P.A.G.E.S Framework",
            "Sales Funnel Setup",
            "Customer Relationship Automations",
            "Basic AI Integration"
        ]
    },
    {
        name: "Premium",
        price: "$5,000 - $10,000",
        description: "Advanced infrastructure for scaling operations.",
        features: [
            "Everything in Entry",
            "WebApp Infrastructure",
            "Medium-High Level AI Integration",
            "Custom Dashboard",
            "Priority Support"
        ]
    },
    {
        name: "Enterprise",
        price: "$15,000+",
        description: "Full-scale partnership for industry leaders.",
        features: [
            "Everything in Premium",
            "Full Automation Agency Partnership",
            "Highest Level AI Implementation",
            "Dedicated Account Manager",
            "24/7 Monitoring & Maintenance"
        ]
    }
];

export function PricingSection() {
    return (
        <section className="py-24 bg-background border-t border-neutral-100">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 mb-6">
                        We understand you have a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff9900] to-[#ff3300]">budget.</span>
                    </h2>
                    <p className="text-base md:text-lg text-neutral-500 max-w-2xl mx-auto">
                        Transparent pricing for every stage of growth.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative p-8 rounded-3xl border border-neutral-200 bg-gradient-to-br from-white to-neutral-50 transition-all duration-300 hover:scale-105 hover:border-[#ff9900]/0"
                        >
                            {/* Hover Gradient Background */}
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#ff9900] to-[#ff3300] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                            {/* White Background for content if needed, but we want full card color change. 
                                Actually, user said "glow into a bright orange gradient covering the card". 
                                So the card itself becomes orange. Text needs to invert.
                            */}
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#ff9900] to-[#ff3300] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                            <div className="relative z-10 group-hover:text-white">
                                <h3 className="text-xl font-bold text-neutral-900 group-hover:text-white mb-2">{plan.name}</h3>
                                <div className="text-3xl md:text-4xl font-bold text-neutral-900 group-hover:text-white mb-4">
                                    {plan.price}
                                </div>
                                <p className="text-neutral-500 group-hover:text-white/90 mb-8 min-h-[48px]">
                                    {plan.description}
                                </p>

                                <ul className="space-y-4">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3">
                                            <div className="p-1 rounded-full bg-[#ff9900]/10 group-hover:bg-white/20 mt-0.5">
                                                <Check className="w-4 h-4 text-[#ff5500] group-hover:text-white" />
                                            </div>
                                            <span className="text-neutral-600 group-hover:text-white">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-8 pt-8 border-t border-neutral-200 group-hover:border-white/20">
                                    <button className="w-full py-4 rounded-xl bg-neutral-900 text-white font-bold group-hover:bg-white group-hover:text-[#ff5500] transition-colors">
                                        Get Started
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
