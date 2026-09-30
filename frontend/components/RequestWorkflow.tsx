"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  Search,
  Send,
} from "lucide-react";
import { useEffect, useState } from "react";

const steps = [
  {
    label: "Submitted",
    icon: Send,
  },
  {
    label: "Under review",
    icon: Search,
  },
  {
    label: "Resolved",
    icon: CheckCircle2,
  },
];

export default function RequestWorkflow() {
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % steps.length);
    }, 2400);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section
      id="workflow"
      className="px-3 pb-3 sm:px-5 sm:pb-5"
    >
      <div className="mx-auto max-w-[1500px] overflow-hidden rounded-[28px] bg-[#0f172a] sm:rounded-[38px]">
        <div className="grid min-h-[480px] lg:grid-cols-[0.75fr_1.25fr]">
          {/* LEFT */}
          <div className="relative flex flex-col justify-between overflow-hidden p-7 sm:p-10 lg:p-14">
            <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-blue-950 blur-3xl" />

            <div className="relative z-10">
              <p className="text-[9px] font-semibold uppercase text-blue-400">
                HR requests
              </p>

              <h2 className="mt-5 max-w-md text-4xl font-semibold leading-[0.94] tracking-[-0.04em] text-white sm:text-5xl">
                One request.
                <br />
                One clear trail.
              </h2>

              <p className="mt-6 max-w-sm text-sm leading-6 text-slate-400">
                Submit it once and follow its progress without
                chasing HR.
              </p>
            </div>

            <div className="relative z-10 mt-12">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-white">
                  <Check size={15} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-white">
                    Clear from start to finish
                  </p>

                  <p className="mt-1 text-[9px] text-slate-500">
                    Lecturer → HR → Resolution
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative overflow-hidden border-t border-white/10 bg-[#f8fafc] p-5 sm:p-8 lg:border-l lg:border-t-0 lg:p-12">
            {/* background grid */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.45]"
              style={{
                backgroundImage:
                  "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)",
                backgroundSize: "38px 38px",
              }}
            />

            <div className="relative mx-auto flex  max-w-2xl h-full items-center ">
              <div className="w-full">
                <motion.div
                  layout
                  className="relative overflow-hidden border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)] rounded-xl"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center text-blue-600">
                        <FileText size={16} />
                      </div>

                      <div className="p-4">
                        <p className="text-[8px] font-semibold uppercase text-slate-400">
                          HR REQUEST
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          Employment reference letter
                        </p>
                      </div>
                    </div>

                 
                  </div>

                  <div className="grid sm:grid-cols-[1fr_180px] p-6">
                    {/* details */}
                    <div className="p-5 sm:p-6">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[8px] text-slate-400">
                            Lecturer
                          </p>
                          <p className="mt-1 text-[10px] font-semibold text-slate-800">
                            Dr. A. Oladimeji
                          </p>
                        </div>

                        <div>
                          <p className="text-[8px] text-slate-400">
                            Department
                          </p>
                          <p className="mt-1 text-[10px] font-semibold text-slate-800">
                            Computer Science
                          </p>
                        </div>
                      </div>

                      <div className="mt-7">
                        <p className="text-[8px] font-semibold uppercase text-slate-400">
                          Request progress
                        </p>

                        <div className="mt-4 flex items-center">
                          {steps.map((step, index) => {
                            const Icon = step.icon;
                            const complete = index <= activeStep;
                            const current = index === activeStep;

                            return (
                              <div
                                key={step.label}
                                className="flex flex-1 items-center"
                              >
                                <motion.div
                                  animate={{
                                    scale: current ? 1.08 : 1,
                                  }}
                                  transition={{ duration: 0.3 }}
                                  className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                                    complete
                                      ? "border-blue-600 bg-blue-600 text-white"
                                      : "border-slate-200 bg-white text-slate-300"
                                  }`}
                                >
                                  <Icon size={14} />
                                </motion.div>

                                {index !== steps.length - 1 && (
                                  <div className="relative h-px flex-1 bg-slate-200">
                                    <motion.div
                                      className="absolute inset-y-0 left-0 bg-blue-600"
                                      initial={{ width: "0%" }}
                                      animate={{
                                        width:
                                          index < activeStep
                                            ? "100%"
                                            : "0%",
                                      }}
                                      transition={{
                                        duration: 0.5,
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-3 flex justify-between">
                          {steps.map((step, index) => (
                            <span
                              key={step.label}
                              className={`text-[8px] font-medium ${
                                index <= activeStep
                                  ? "text-slate-700"
                                  : "text-slate-300"
                              }`}
                            >
                              {step.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* live status */}
                    <div className="border-t border-slate-100 bg-slate-50 p-5 sm:border-l sm:border-t-0">
                      <p className="text-[8px] font-semibold uppercase text-slate-400">
                        Current status
                      </p>

                      <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-5"
                      >
                        <div className="flex h-11 w-11 items-center justify-center bg-white shadow-sm">
                          {activeStep === 0 && (
                            <Send size={17} className="text-amber-500" />
                          )}

                          {activeStep === 1 && (
                            <Search size={17} className="text-blue-600" />
                          )}

                          {activeStep === 2 && (
                            <CheckCircle2
                              size={17}
                              className="text-emerald-500"
                            />
                          )}
                        </div>

                        <p className="mt-4 text-sm font-semibold text-slate-900">
                          {steps[activeStep].label}
                        </p>

                        <p className="mt-2 text-[9px] leading-4 text-slate-400">
                          {activeStep === 0 &&
                            "Your request has been received."}

                          {activeStep === 1 &&
                            "HR is currently reviewing your request."}

                          {activeStep === 2 &&
                            "Your request has been resolved."}
                        </p>
                      </motion.div>
                    </div>
                  </div>

                
                </motion.div>

          
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}