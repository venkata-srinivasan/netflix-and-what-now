"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

interface DeviceMockupProps {
  children: React.ReactNode;
  className?: string;
}

export function PhoneMockup({ children, className }: DeviceMockupProps) {
  return (
    <div className={`relative mx-auto ${className || ""}`}>
      {/* Phone frame */}
      <div className="relative w-[280px] sm:w-[320px] rounded-[2.5rem] border-[8px] border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/50 overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-zinc-900 rounded-b-2xl z-20" />
        {/* Screen */}
        <div className="relative w-full aspect-[9/19.5] overflow-hidden bg-black rounded-[2rem]">
          {children}
        </div>
      </div>
      {/* Glow underneath */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-primary/20 blur-3xl rounded-full" />
    </div>
  );
}

export function IPadMockup({ children, className }: DeviceMockupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [15, 0, 0, -5]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.85, 1, 1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [60, 0, -30]);

  return (
    <div ref={ref} className={`perspective-[1200px] ${className || ""}`}>
      <motion.div
        style={{ rotateX, scale, y }}
        className="relative mx-auto max-w-[900px]"
      >
        {/* iPad frame */}
        <div className="relative rounded-[1.5rem] sm:rounded-[2rem] border-[6px] sm:border-[10px] border-zinc-800 bg-zinc-900 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Camera dot */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-zinc-700 z-20" />
          {/* Screen */}
          <div className="relative w-full aspect-[4/3] overflow-hidden bg-black">
            {children}
          </div>
        </div>
        {/* Glow underneath */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-2/3 h-20 bg-primary/15 blur-[60px] rounded-full" />
      </motion.div>
    </div>
  );
}

export function BrowserMockup({ children, className, url }: DeviceMockupProps & { url?: string }) {
  return (
    <div className={`relative mx-auto ${className || ""}`}>
      <div className="rounded-xl border border-border/60 bg-zinc-900 shadow-2xl shadow-black/40 overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800/80 border-b border-border/40">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
          </div>
          {url && (
            <div className="flex-1 ml-3">
              <div className="bg-zinc-900/80 rounded-md px-3 py-1 text-[11px] text-zinc-500 font-mono max-w-xs">
                {url}
              </div>
            </div>
          )}
        </div>
        {/* Content */}
        <div className="relative">
          {children}
        </div>
      </div>
    </div>
  );
}
