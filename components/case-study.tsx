"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

function Counter({
    value,
    suffix = "",
    prefix = "",
    className = "",
}: {
    value: number;
    suffix?: string;
    prefix?: string;
    className?: string;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 100,
        stiffness: 100,
    });
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = `${prefix}${latest.toFixed(0)}${suffix}`;
            }
        });
    }, [springValue, suffix, prefix]);

    return <span className={className} ref={ref} />;
}

export function CaseStudy() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white to-orange-50" />
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto rounded-3xl border border-neutral-200 bg-white/50 backdrop-blur-md p-8 md:p-12 shadow-sm">
                    <h2 className="text-3xl font-bold mb-8 text-center text-neutral-900">ROI You Can Measure.</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                        <div className="p-4">
                            <div className="text-sm text-neutral-500 mb-2">Before</div>
                            <div className="text-4xl font-bold text-neutral-900 flex justify-center items-baseline gap-1">
                                <Counter value={15} suffix="hrs" />
                                <span className="text-lg text-red-500">/wk</span>
                            </div>
                            <div className="text-xs text-neutral-400 mt-2">Manual Data Entry</div>
                        </div>
                        <div className="p-4">
                            <div className="text-sm text-neutral-500 mb-2">After</div>
                            {/* Animate to 0 */}
                            <div className="text-4xl font-bold text-[#ff5500] flex justify-center items-baseline">
                                <Counter value={2} suffix="hrs" />
                            </div>
                            <div className="text-xs text-neutral-400 mt-2">Fully Automated</div>
                        </div>
                        <div className="p-4">
                            <div className="text-sm text-neutral-500 mb-2">Savings</div>
                            <div className="text-4xl font-bold text-neutral-900 flex justify-center items-baseline gap-1">
                                <Counter value={40} prefix="$" suffix="k" />
                                <span className="text-lg text-[#ff5500]">/yr</span>
                            </div>
                            <div className="text-xs text-neutral-400 mt-2">Billable Time Recaptured</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
