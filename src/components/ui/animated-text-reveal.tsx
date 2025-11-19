"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedTextRevealProps {
  text: string;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
  triggerOnScroll?: boolean;
  once?: boolean;
}

export function AnimatedTextReveal({
  text,
  className,
  staggerDelay = 0.05,
  initialDelay = 0.3,
  triggerOnScroll = false,
  once = true,
}: AnimatedTextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-100px" });

  // Split text into words
  const words = text.split(" ");

  // Determine if we should animate based on trigger type
  const shouldAnimate = triggerOnScroll ? isInView : true;

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={
            shouldAnimate
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 20, filter: "blur(8px)" }
          }
          transition={{
            duration: 0.5,
            delay: shouldAnimate ? initialDelay + index * staggerDelay : 0,
            ease: [0.16, 1, 0.3, 1], // Custom easing for smooth effect
          }}
          className="inline-block mr-[0.35em]"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}
