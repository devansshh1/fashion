"use client";
import React from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export function Button({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: any;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: any;
}) {
  const innerRadius = `calc(${borderRadius} * 0.92)`;
  const glowRadius = `calc(${borderRadius} + 24px)`;

  return (
    <Component
      className={cn(
        "group relative inline-flex w-fit overflow-visible bg-transparent p-[1.5px] text-xl transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/55 focus-visible:ring-offset-0",
        containerClassName,
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="pointer-events-none absolute inset-[-20px] -z-10 opacity-100 blur-[30px] transition-all duration-500 group-hover:opacity-100 group-hover:blur-[42px]"
        style={{
          borderRadius: glowRadius,
          background:
            "radial-gradient(circle at 50% 50%, rgba(56,189,248,0.42) 0%, rgba(99,102,241,0.34) 28%, rgba(168,85,247,0.30) 50%, rgba(236,72,153,0.23) 66%, rgba(15,23,42,0) 82%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-[-8px] -z-10 opacity-80 blur-xl transition-all duration-500 group-hover:opacity-95"
        style={{
          borderRadius: glowRadius,
          background:
            "radial-gradient(circle at 50% 50%, rgba(129,140,248,0.22) 0%, rgba(56,189,248,0.16) 35%, rgba(236,72,153,0.12) 60%, rgba(15,23,42,0) 78%)",
        }}
      />

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ borderRadius }}
      >
        <div
          className="absolute inset-0 opacity-95"
          style={{
            background:
              "linear-gradient(135deg, rgba(56,189,248,0.92) 0%, rgba(129,140,248,0.95) 36%, rgba(168,85,247,0.92) 66%, rgba(236,72,153,0.86) 100%)",
          }}
        />
        <div
          className="absolute inset-[1px]"
          style={{
            borderRadius: innerRadius,
            background:
              "linear-gradient(135deg, rgba(7,12,24,0.98) 0%, rgba(11,18,33,0.97) 50%, rgba(13,24,43,0.95) 100%)",
          }}
        />

        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "h-28 w-28 rounded-full bg-[radial-gradient(circle,_rgba(125,211,252,1)_0%,_rgba(129,140,248,0.96)_28%,_rgba(217,70,239,0.84)_54%,_rgba(236,72,153,0)_76%)] opacity-100 blur-[1px]",
              borderClassName,
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative z-10 inline-flex w-full items-center justify-center gap-2 whitespace-nowrap border border-white/12 bg-[linear-gradient(135deg,rgba(10,16,29,0.94),rgba(13,20,36,0.94))] px-5 py-3 text-sm text-white antialiased shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_14px_34px_rgba(4,10,28,0.52)] backdrop-blur-xl transition-all duration-300 group-hover:border-white/24 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_22px_44px_rgba(39,94,176,0.42)]",
          className,
        )}
        style={{
          borderRadius: innerRadius,
        }}
      >
        <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-75" />
        {children}
      </div>
    </Component>
  );
}

export const MovingBorder = ({
  children,
  duration = 3000,
  rx,
  ry,
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  [key: string]: any;
}) => {
  const pathRef = useRef<any>();
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).x,
  );
  const y = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).y,
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
