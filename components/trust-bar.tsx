"use client";

import { useRef } from "react";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    useVelocity,
    useAnimationFrame
} from "framer-motion";
import { wrap } from "@motionone/utils";

interface ParallaxProps {
    children: React.ReactNode;
    baseVelocity: number;
}

function ParallaxText({ children, baseVelocity = 100 }: ParallaxProps) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false
    });

    /**
     * This is a magic wrapping for the length of the text - you
     * have to replace for wrapping that works for you or dynamically
     * calculate
     */
    const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

    const directionFactor = useRef<number>(1);
    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        /**
         * This is what changes the direction of the scroll once we
         * switch scrolling directions.
         */
        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();

        baseX.set(baseX.get() + moveBy);
    });

    /**
     * The number of times to repeat the child text should be dynamic based on
     * the size of the text and viewport. Likewise, the x motion value is
     * currently wrapped between -20 and -45% - this 25% is derived from the fact
     * that we have four children (100% / 4). This would also want creating dynamically.
     */
    return (
        <div className="parallax overflow-hidden m-0 whitespace-nowrap flex flex-nowrap">
            <motion.div className="scroller font-bold uppercase text-6xl flex whitespace-nowrap flex-nowrap gap-8" style={{ x }}>
                {children}
                {children}
                {children}
                {children}
            </motion.div>
        </div>
    );
}

function LogoPlaceholder() {
    return (
        <div className="flex items-center justify-center w-48 h-20 bg-neutral-100 border border-neutral-200 rounded-lg shrink-0">
            <span className="text-neutral-400 font-bold uppercase tracking-widest text-sm">Logo Here</span>
        </div>
    );
}

export function TrustBar() {
    return (
        <section className="py-8 border-y border-neutral-200 bg-background overflow-hidden space-y-8">
            <div className="container mx-auto px-4 text-center mb-8">
                <p className="text-sm font-medium text-neutral-500 uppercase tracking-widest">
                    Powering operations for
                </p>
            </div>

            {/* Single Row: Left -> Right (Positive Velocity moves right initially?) 
                Actually default ParallaxText logic:
                baseVelocity > 0 -> Moves Left? 
                Let's check logic: `moveBy = directionFactor * baseVelocity`. 
                If baseVelocity is negative, it moves left (x decreases). 
                If user wants "moving left to right", x should increase. 
                So baseVelocity should be positive?
                Wait, standard marquee usually moves Right-to-Left (Text appearing from right, moving left).
                User said: "moving left to right". So items appear from left and move right?
                Or maybe just standard reading direction? 
                "One stack moving left to right". I will assume standard reading direction (Left->Right motion).
            */}
            <ParallaxText baseVelocity={1}>
                <div className="flex gap-8 mr-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <LogoPlaceholder key={i} />
                    ))}
                </div>
            </ParallaxText>
        </section>
    );
}
