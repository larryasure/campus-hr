"use client";

import { motion } from "motion/react";
import {
  BookOpen,
  FileText,
  GraduationCap,
  UserRound,
  UsersRound,
} from "lucide-react";

const items = [
  {
    label: "Your profile",
    icon: UserRound,
    position: "left-[8%] top-[18%]",
    tone: "blue",
  },
  {
    label: "Academic records",
    icon: GraduationCap,
    position: "right-[6%] top-[20%]",
    tone: "violet",
  },
  {
    label: "Teaching workload",
    icon: BookOpen,
    position: "left-[4%] bottom-[20%]",
    tone: "emerald",
  },
  {
    label: "HR requests",
    icon: FileText,
    position: "right-[7%] bottom-[18%]",
    tone: "orange",
  },
  {
    label: "Staff updates",
    icon: UsersRound,
    position: "left-1/2 top-[8%] -translate-x-1/2",
    tone: "sky",
  },
];

const toneStyles = {
  blue: {
    background: "#eaf2ff",
    border: "#cfe0ff",
    icon: "#2563eb",
  },
  violet: {
    background: "#f2edff",
    border: "#e1d6ff",
    icon: "#7c3aed",
  },
  emerald: {
    background: "#e8f8f0",
    border: "#cceede",
    icon: "#16835a",
  },
  orange: {
    background: "#fff1e9",
    border: "#ffe0cf",
    icon: "#d45d2c",
  },
  sky: {
    background: "#e8f7fb",
    border: "#cdebf2",
    icon: "#1684a5",
  },
};

export default function AuthVisual() {
  return (
    <div className="relative flex min-h-[520px] w-full items-center justify-center overflow-hidden">
      {/* Soft ambient glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/60 blur-3xl"
        animate={{
          scale: [0.92, 1.05, 0.92],
          opacity: [0.45, 0.7, 0.45],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Pulse rings */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full border  border-blue-300"
        animate={{
          scale: [0.85, 1.18],
          opacity: [0.6, 0],
        }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-200/50"
        animate={{
          scale: [0.85, 1.18],
          opacity: [0.45, 0],
        }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          ease: "easeOut",
          delay: 1.9,
        }}
      />

      {/* Structural circles */}
      <div className="absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-100/80" />

      <div className="absolute left-1/2 top-1/2 h-[270px] w-[270px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200/60" />

      {/* Connection lines */}
      <div className="absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2">
        <span className="absolute left-1/2 top-0 h-[calc(50%-95px)] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-slate-200 to-slate-200" />
        <span className="absolute bottom-0 left-1/2 h-[calc(50%-95px)] w-px -translate-x-1/2 bg-gradient-to-t from-transparent via-slate-200 to-slate-200" />
        <span className="absolute left-0 top-1/2 h-px w-[calc(50%-95px)] -translate-y-1/2 bg-gradient-to-r from-transparent via-slate-200 to-slate-200" />
        <span className="absolute right-0 top-1/2 h-px w-[calc(50%-95px)] -translate-y-1/2 bg-gradient-to-l from-transparent via-slate-200 to-slate-200" />
      </div>

      {/* Floating modules */}
      {items.map((item, index) => {
        const Icon = item.icon;
        const tone = toneStyles[item.tone as keyof typeof toneStyles];

        return (
          <motion.div
            key={item.label}
            className={`absolute ${item.position} z-20`}
            animate={{
              y: index % 2 === 0 ? [0, -8, 0] : [0, 8, 0],
              x: index === 1 || index === 3 ? [0, 4, 0] : [0, -4, 0],
            }}
            transition={{
              duration: 4 + index * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.35,
            }}
          >
            <div
              className="flex items-center gap-2.5 border bg-white px-3 py-2 shadow-[0_16px_40px_rgba(15,23,42,0.08)] rounded-xl"
              style={{
                borderColor: tone.border,
              }}
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{
                  backgroundColor: tone.background,
                  color: tone.icon,
                }}
              >
                <Icon size={15} strokeWidth={1.8} />
              </span>

              <span className="whitespace-nowrap text-[10px] font-semibold text-slate-600 ">
                {item.label}
              </span>
            </div>
          </motion.div>
        );
      })}

      {/* Center object */}
      <motion.div
        className="relative z-30 flex h-[190px] w-[190px] items-center justify-center rounded-[46px] bg-blue-600 shadow-[0_35px_80px_rgba(37,99,235,0.25)]"
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="absolute inset-4 rounded-[36px] border border-white/15" />

        <div className="relative flex h-[108px] w-[108px] flex-col items-center justify-center rounded-full border-[3px] border-white/85">
          <span className="text-3xl font-semibold text-white">C</span>

          <span className="mt-1 text-[8px] font-semibold uppercase text-white/75">
            CampusHR
          </span>
        </div>

        {/* Small status indicator */}
        <motion.span
          className="absolute right-5 top-5 h-2.5 w-2.5 rounded-full bg-emerald-300 ring-4 ring-blue-600/40"
          animate={{
            opacity: [0.45, 1, 0.45],
            scale: [0.9, 1.15, 0.9],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Decorative nodes */}
      <motion.span
        className="absolute left-[17%] top-1/2 h-2 w-2 rounded-full bg-blue-500"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.span
        className="absolute right-[17%] top-1/2 h-2 w-2 rounded-full bg-violet-500"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.7,
        }}
      />

      <motion.span
        className="absolute bottom-[12%] left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-emerald-500"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
        }}
      />
    </div>
  );
}