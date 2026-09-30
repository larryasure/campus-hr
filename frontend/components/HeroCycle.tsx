"use client";

import { motion } from "motion/react";
import {
  BookOpen,
  FileText,
  GraduationCap,
  ShieldCheck,
  Users,
} from "lucide-react";

const modules = [
  {
    label: "Profile",
    icon: Users,
    background: "#dff5ff",
    color: "#1677a8",
  },
  {
    label: "Academic",
    icon: GraduationCap,
    background: "#fff0a8",
    color: "#806600",
  },
  {
    label: "Requests",
    icon: FileText,
    background: "#ffe0d7",
    color: "#b84b31",
  },
  {
    label: "Workload",
    icon: BookOpen,
    background: "#d9f3e7",
    color: "#237653",
  },
  {
    label: "Security",
    icon: ShieldCheck,
    background: "#eee2ff",
    color: "#7041bb",
  },
];

export default function HeroCycle() {
  return (
    <div className="relative mx-auto h-[560px] w-full max-w-[760px]">
      {/* Orbit rings */}
      <div className="absolute left-1/2 top-1/2 h-[470px] w-[470px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200/70" />

      <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200/60" />

      {/* Soft blue atmosphere */}
      <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/60 blur-3xl" />

      {/* 360 DEGREE ORBIT */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {modules.map((module, index) => {
          const Icon = module.icon;

          const positions = [
            "left-1/2 top-0 -translate-x-1/2",
            "right-0 top-[23%]",
            "right-[8%] bottom-[8%]",
            "left-[8%] bottom-[8%]",
            "left-0 top-[23%]",
          ];

          return (
            <div
              key={module.label}
              className={`absolute ${positions[index]}`}
            >
              {/* Counter rotation keeps each module upright */}
              <motion.div
                animate={{
                  rotate: -360,
                }}
                transition={{
                  duration: 24,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div
                  className="flex h-[82px] w-[82px] flex-col items-center justify-center rounded-[24px] border border-white/80 shadow-[0_18px_45px_rgba(15,23,42,0.12)]"
                  style={{
                    backgroundColor: module.background,
                    color: module.color,
                  }}
                >
                  <Icon
                    size={27}
                    strokeWidth={1.7}
                  />

                  <span className="mt-2 text-[9px] font-semibold uppercase">
                    {module.label}
                  </span>
                </div>
              </motion.div>
            </div>
          );
        })}
      </motion.div>

      {/* Center CampusHR object */}
      <div className="absolute left-1/2 top-1/2 z-10 flex h-[205px] w-[205px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[48px] bg-blue-600 shadow-[0_25px_40px_rgba(37,99,235,0.18)]">
        <div className="absolute inset-4 rounded-[38px] border border-white/15" />

        <div className="relative flex h-[108px] w-[108px] flex-col items-center justify-center rounded-full border-[3px] border-white/85">
          <span className="text-3xl font-semibold text-white">
            C
          </span>

          <span className="mt-1 text-[8px] font-semibold uppercase text-white/75">
            CampusHR
          </span>
        </div>
      </div>

      {/* Orbit markers */}
      <span className="absolute left-1/2 top-[28px] h-2 w-2 -translate-x-1/2 rounded-full bg-blue-600" />

      <span className="absolute right-[82px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-blue-600" />

      <span className="absolute bottom-[54px] right-[185px] h-2 w-2 rounded-full bg-blue-600" />

      <span className="absolute bottom-[54px] left-[185px] h-2 w-2 rounded-full bg-blue-600" />

      <span className="absolute left-[82px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-blue-600" />

      {/* Supporting information cards */}
      <motion.div
        className="absolute left-[1%] top-[42%] hidden border border-slate-200 bg-white px-4 py-2F shadow-[0_14px_35px_rgba(15,23,42,0.08)] sm:block rounded-xl"
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <p className="text-[9px] font-medium text-slate-400">
          Active staff
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-900">
          248 lecturers
        </p>
      </motion.div>

      <motion.div
        className="absolute right-[1%] top-[42%] hidden border border-slate-200 bg-white px-4 py-2 shadow-[0_14px_35px_rgba(15,23,42,0.08)] sm:block rounded-xl"
        animate={{
          y: [0, 6, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <p className="text-[9px] font-medium text-slate-400">
          HR requests
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-900">
          12 pending
        </p>
      </motion.div>
    </div>
  );
}