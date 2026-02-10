"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowRight, X, CheckCircle } from "lucide-react";

const faqs = [
    {
        question: "What services do you offer?",
        answer: "We offer end-to-end automation solutions, including custom web app development, AI integration (chatbots, agents), and workflow automation using tools like Zapier and Make."
    },
    {
        question: "How long does implementation take?",
        answer: "Timelines vary by project scope. Basic automations can be live in a week, while complex custom software builds typically range from 4-8 weeks."
    },
    {
        question: "Do you offer ongoing support?",
        answer: "Yes! We have dedicated support packages to monitor your automations, update AI models, and ensure your infrastructure runs smoothly 24/7."
    },
    {
        question: "Is there a guarantee?",
        answer: "We stand by our work. If our solutions don't improve your efficiency or metrics as agreed upon, we'll work until they do."
    }
];

export function ContactSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        // Reset form logic would go here
    };

    return (
        <section className="py-24 bg-background border-t border-neutral-100 relative">
            <div className="container mx-auto px-4">
                <div className="mb-16 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
                        Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff9900] to-[#ff3300]">Amplyfy</span> your business?
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Column 1: FAQ */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-neutral-900 mb-6">FAQ</h3>
                        {faqs.map((faq, index) => (
                            <div key={index} className="border border-neutral-200 rounded-2xl overflow-hidden">
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-neutral-50 transition-colors"
                                >
                                    <span className="font-semibold text-neutral-900">{faq.question}</span>
                                    {openIndex === index ? (
                                        <Minus className="w-5 h-5 text-[#ff5500]" />
                                    ) : (
                                        <Plus className="w-5 h-5 text-neutral-400" />
                                    )}
                                </button>
                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="p-6 pt-0 text-neutral-600 bg-white">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    {/* Column 2: Cal.com Embed */}
                    <div className="h-[600px] w-full bg-white rounded-2xl border border-neutral-200 shadow-lg overflow-hidden relative">
                        <div className="absolute inset-0 z-0 flex items-center justify-center text-neutral-400">Loading Calendar...</div>
                        <iframe
                            src="https://cal.com/anthony-pernerewski/30min"
                            className="w-full h-full relative z-10"
                            frameBorder="0"
                            allowFullScreen
                        />
                    </div>

                    {/* Column 3: Contact Form */}
                    <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-xl">
                        <h3 className="text-2xl font-bold text-neutral-900 mb-6">Start your project</h3>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-[#ff9900] focus:ring-2 focus:ring-[#ff9900]/20 outline-none transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-[#ff9900] focus:ring-2 focus:ring-[#ff9900]/20 outline-none transition-all"
                                    placeholder="john@company.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Business Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-[#ff9900] focus:ring-2 focus:ring-[#ff9900]/20 outline-none transition-all"
                                    placeholder="Acme Inc."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Industry</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-[#ff9900] focus:ring-2 focus:ring-[#ff9900]/20 outline-none transition-all"
                                    placeholder="e.g. Real Estate, SaaS"
                                />
                            </div>

                            <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#ff9900] to-[#ff3300] text-white font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer">
                                Send Message <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    </div>

                </div>

                <div className="mt-24 text-center border-t border-neutral-200 pt-8">
                    <p className="text-sm text-neutral-500">© {new Date().getFullYear()} Amplyfy. All rights reserved.</p>
                </div>
            </div>

            {/* Success Popup */}
            <AnimatePresence>
                {isSubmitted && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative text-center"
                        >
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>

                            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Congratulations!</h3>
                            <p className="text-neutral-600 leading-relaxed">
                                You've taken the first step to <span className="font-bold text-[#ff5500]">Amplyfy</span> your business. Our team will be in touch shortly to schedule your audit.
                            </p>

                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="mt-8 px-8 py-3 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
