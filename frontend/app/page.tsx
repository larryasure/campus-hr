import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  FileText,
  GraduationCap,
  ShieldCheck,
  Users,
} from "lucide-react";

import HeroCycle from "@/components/HeroCycle";
import Navbar from "@/components/Navbar";
import RequestWorkflow from "@/components/RequestWorkflow";
import Footer from "@/components/Footer";

const modules = [
  {
    number: "01",
    title: "Lecturer profiles",
    description:
      "Keep employment, departmental and academic information organized in one reliable staff record.",
    icon: Users,
    accent: "bg-blue-50 text-blue-600",
  },
  {
    number: "02",
    title: "Academic records",
    description:
      "Qualifications, promotions, research interests and professional affiliations stay connected to the lecturer.",
    icon: GraduationCap,
    accent: "bg-violet-50 text-violet-600",
  },
  {
    number: "03",
    title: "Teaching workload",
    description:
      "See assigned courses, academic sessions, semesters and weekly teaching hours without the clutter.",
    icon: BookOpen,
    accent: "bg-emerald-50 text-emerald-600",
  },
  {
    number: "04",
    title: "HR requests",
    description:
      "Submit, review and resolve lecturer requests through a clear status-driven workflow.",
    icon: FileText,
    accent: "bg-orange-50 text-orange-600",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f3f4f6] text-slate-950">
      {/* HERO */}
      <section className="px-3 pb-3 pt-3 sm:px-5 sm:pb-5 sm:pt-5">
        <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white sm:rounded-[38px]">
          <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-50 blur-3xl" />
          <div className="pointer-events-none absolute right-[-120px] top-24 h-96 w-96 rounded-full bg-amber-50 blur-3xl" />

          <Navbar />

          <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-4 px-5 pb-10 pt-14 sm:px-8 sm:pb-16 sm:pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-0 lg:px-12 lg:pb-20 lg:pt-12">
            {/* LEFT */}
            <div className="relative z-20 max-w-xl">
              <h1 className="max-w-xl text-[clamp(3.2rem,6vw,6.4rem)] font-semibold leading-[0.86]  text-blue-800">
                Lecturer HR,
                <br />
                <span className="text-slate-400">beautifully connected.</span>
              </h1>

              <p className="mt-7 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
                One focused workspace for lecturer profiles, academic records,
                teaching workload, HR requests and important university
                announcements.
              </p>

              <div className="mt-8 flex flex-wrap tems-center  gap-3">
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-full  px-5 py-3 text-xs font-semibold text-white transition "
                >
                  Access CampusHR
                  <ArrowUpRight size={14} />
                </Link>

                <Link
                  href="/register"
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-blue-700 transition hover:border-slate-300"
                >
                  Register an account
                  <ArrowRight size={14} className="text-slate-400" />
                </Link>
              </div>

              {/* mini product panel */}
              <div className="mt-10 max-w-md border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.07)]">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-semibold text-slate-700">
                      LECTURER WORKSPACE
                    </span>
                  </div>

                  <span className="text-[8px] text-slate-400">
                    Live overview
                  </span>
                </div>

                <div className="grid grid-cols-3 divide-x divide-slate-100">
                  <div className="px-4 py-4">
                    <p className="text-lg font-semibold tracking-tight">03</p>
                    <p className="mt-1 text-[8px] text-slate-400">Courses</p>
                  </div>

                  <div className="px-4 py-4">
                    <p className="text-lg font-semibold tracking-tight">12h</p>
                    <p className="mt-1 text-[8px] text-slate-400">
                      Weekly workload
                    </p>
                  </div>

                  <div className="px-4 py-4">
                    <p className="text-lg font-semibold tracking-tight">02</p>
                    <p className="mt-1 text-[8px] text-slate-400">
                      HR requests
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-medium text-slate-400">
                      Profile completion
                    </span>
                    <span className="text-[8px] font-semibold text-blue-600">
                      92%
                    </span>
                  </div>

                  <div className="mt-2 h-1 overflow-hidden bg-slate-100">
                    <div className="h-full w-[92%] bg-blue-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — KEEP HERO CYCLE */}
            <div className="relative min-h-[500px] lg:min-h-[590px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <HeroCycle />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="px-3 py-10 sm:px-5 sm:py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1500px] gap-10 px-4 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:px-12">
          <div>
            <p className="text-xs font-bold  text-blue-600">
              A better way to manage staff affairs
            </p>

            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-500">
              CampusHR brings the everyday HR experience of a university
              lecturer into one calm, connected system.
            </p>
          </div>

          <h2 className="max-w-5xl text-[clamp(2.5rem,5vw,5.4rem)] font-semibold leading-[0.93] tracking-[-0.05em]">
            Less searching.
            <br />
            Less paperwork.
            <br />
            <span className="text-slate-400">More clarity.</span>
          </h2>
        </div>
      </section>

      {/* PRODUCT PREVIEW */}
      <section id="platform" className="px-3 pb-3 sm:px-5 sm:pb-5">
        <div className="mx-auto max-w-[1500px] overflow-hidden rounded-[28px] border border-slate-200 bg-white sm:rounded-[38px]">
          <div className="grid lg:grid-cols-[0.75fr_1.25fr]">
            <div className="border-b border-slate-200 p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-14">
              <p className="text-[9px] font-semibold uppercase text-blue-600">
                The lecturer workspace
              </p>

              <h2 className="mt-5 max-w-md text-3xl font-semibold leading-[1]  sm:text-4xl">
                Everything important,
                <br />
                without the noise.
              </h2>

              <p className="mt-5 max-w-sm text-sm leading-6 text-slate-500">
                The lecturer dashboard puts the information that matters most
                within immediate reach.
              </p>

              <div className="mt-10 space-y-3">
                {[
                  "Employment profile",
                  "Academic history",
                  "Teaching workload",
                  "HR requests",
                  "University announcements",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 border-b border-slate-100 pb-3"
                  >
                    <CheckCircle2 size={14} className="text-blue-600" />
                    <span className="text-xs font-medium text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* dashboard composition */}
            <div className="relative overflow-hidden bg-[#f7f8fa] p-5 sm:p-8 lg:p-10">
              <div className="absolute right-[-80px] top-[-80px] h-64 w-64 rounded-full bg-blue-100/60 blur-3xl" />

              <div className="relative overflow-hidden border border-slate-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.08)]">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center bg-blue-600 text-[8px] font-bold text-white">
                      C
                    </span>
                    <span className="text-[10px] font-semibold">CampusHR</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Bell size={14} className="text-slate-400" />
                    <span className="h-6 w-6 rounded-full bg-slate-100" />
                  </div>
                </div>

                <div className="grid md:grid-cols-[150px_1fr]">
                  <div className="hidden border-r border-slate-200 bg-white p-4 md:block">
                    <p className="text-[8px] font-semibold text-slate-400">
                      WORKSPACE
                    </p>

                    <div className="mt-5 space-y-1">
                      {[
                        ["Overview", Users],
                        ["Academic", GraduationCap],
                        ["Workload", BookOpen],
                        ["Requests", FileText],
                      ].map(([label, Icon]) => (
                        <div
                          key={String(label)}
                          className={`flex items-center gap-2 px-2 py-2 ${
                            label === "Overview"
                              ? "bg-blue-50 text-blue-600"
                              : "text-slate-400"
                          }`}
                        >
                          <Icon size={12} />
                          <span className="text-[8px] font-medium">
                            {String(label)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 sm:p-7">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[8px] font-semibold uppercase text-blue-600">
                          Overview
                        </p>
                        <h3 className="mt-1 text-xl font-semibold tracking-tight">
                          Welcome back, Dr. Oladimeji
                        </h3>
                      </div>

                      <span className="hidden border border-slate-200 px-3 py-2 text-[8px] font-semibold text-slate-600 sm:block">
                        Edit profile
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-2">
                      {[
                        ["03", "Courses"],
                        ["12h", "Teaching hours"],
                        ["02", "Requests"],
                      ].map(([value, label]) => (
                        <div
                          key={label}
                          className="border border-slate-200 p-3"
                        >
                          <p className="text-lg font-semibold">{value}</p>
                          <p className="mt-1 text-[8px] text-slate-400">
                            {label}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div className="border border-slate-200 p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-[9px] font-semibold">
                            Current workload
                          </p>
                          <BookOpen size={13} className="text-blue-500" />
                        </div>

                        <div className="mt-5 space-y-4">
                          {[
                            ["CSC 401", "Advanced Software Engineering", "4h"],
                            ["CSC 315", "Database Systems", "3h"],
                            ["CSC 210", "Data Structures", "5h"],
                          ].map(([code, title, hours], index) => (
                            <div key={code}>
                              <div className="flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="text-[8px] font-semibold text-blue-600">
                                    {code}
                                  </p>
                                  <p className="truncate text-[8px] text-slate-400">
                                    {title}
                                  </p>
                                </div>
                                <span className="text-[8px] font-semibold">
                                  {hours}
                                </span>
                              </div>

                              <div className="mt-2 h-1 bg-slate-100">
                                <div
                                  className="h-full bg-blue-600"
                                  style={{
                                    width: `${48 + index * 16}%`,
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border border-slate-200 p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-[9px] font-semibold">
                            Recent activity
                          </p>
                          <CalendarDays size={13} className="text-slate-300" />
                        </div>

                        <div className="mt-5 space-y-4">
                          {[
                            ["09:42", "HR request submitted"],
                            ["09:18", "Academic record updated"],
                            ["08:55", "Workload published"],
                            ["08:31", "Announcement posted"],
                          ].map(([time, activity]) => (
                            <div key={time} className="flex items-center gap-3">
                              <span className="text-[8px] text-slate-400">
                                {time}
                              </span>
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                              <span className="text-[8px] font-medium text-slate-600">
                                {activity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-3 border border-blue-100 bg-blue-50 p-3">
                      <ShieldCheck size={16} className="text-blue-600" />
                      <div>
                        <p className="text-[8px] font-semibold text-blue-900">
                          Your staff record is up to date
                        </p>
                        <p className="mt-0.5 text-[8px] text-blue-600">
                          Last updated today
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section id="workflow" className="px-3 pb-3 sm:px-5 sm:pb-5">
        <RequestWorkflow />
      </section>

      {/* MODULES */}
      <section id="modules" className="px-3 pb-3 sm:px-5 sm:pb-5">
        <div className="mx-auto max-w-[1500px] overflow-hidden rounded-[28px] border border-slate-200 bg-white sm:rounded-[38px]">
          <div className="border-b border-slate-200 px-7 py-10 sm:px-10 lg:px-14">
            <p className="text-[9px] font-semibold uppercase text-blue-600">
              Core modules
            </p>

            <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <h2 className="max-w-2xl text-3xl font-semibold leading-[1] tracking-[-0.035em] sm:text-4xl">
                Built around the
                <br />
                lecturer experience.
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2">
            {modules.map((module, index) => {
              const Icon = module.icon;

              return (
                <div
                  key={module.number}
                  className={`group p-7 transition hover:bg-slate-50 sm:p-10 ${
                    index >= 2 ? "border-t border-slate-200" : ""
                  } ${index % 2 === 1 ? "md:border-l md:border-slate-200" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[9px] font-semibold text-slate-400">
                      {module.number}
                    </span>

                    <span
                      className={`flex h-10 w-10 items-center justify-center ${module.accent}`}
                    >
                      <Icon size={17} strokeWidth={1.7} />
                    </span>
                  </div>

                  <h3 className="mt-14 text-lg font-semibold">
                    {module.title}
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    {module.description}
                  </p>

                  <div className="mt-7 flex items-center gap-2 text-[9px] font-semibold text-slate-400 group-hover:text-blue-600">
                    Explore module
                    <ArrowRight size={12} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ADMIN + LECTURER */}
      <section className="px-3 pb-3 sm:px-5 sm:pb-5">
        <div className="mx-auto grid max-w-[1500px] gap-3 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[28px] bg-blue-950 p-7 text-white sm:p-10 lg:p-12">
            <p className="text-[9px] font-semibold uppercase text-blue-400">
              For lecturers
            </p>

            <h2 className="mt-5 max-w-lg text-3xl font-semibold leading-[0.98]  sm:text-4xl">
              Your information.
              <br />
              Your workload.
              <br />
              Your requests.
            </h2>

            <p className="mt-6 max-w-md text-sm leading-6 text-slate-400">
              Access your staff information and HR services without having to
              chase paperwork or search through disconnected systems.
            </p>

            <Link
              href="/register"
              className="mt-9 inline-flex items-center gap-2 border border-white/15 px-4 py-3 text-xs font-semibold transition hover:bg-white/5"
            >
              Create lecturer account
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-7 sm:p-10 lg:p-12">
            <p className="text-[9px] font-semibold uppercase text-blue-600">
              For HR administrators
            </p>

            <h2 className="mt-5 max-w-lg text-3xl font-semibold leading-[0.98]  sm:text-4xl">
              See the people.
              <br />
              See the requests.
              <br />
              Take action.
            </h2>

            <p className="mt-6 max-w-md text-sm leading-6 text-slate-500">
              Search lecturer records, review academic information, manage
              requests and publish university announcements from one
              administrative workspace.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-3 pb-3 sm:px-5 sm:pb-5">
        <div className="mx-auto max-w-[1500px] overflow-hidden rounded-[28px] bg-blue-950 text-white sm:rounded-[38px]">
          <div className="flex flex-col items-start justify-between gap-8 p-7 sm:p-10 lg:flex-row lg:items-center lg:p-14">
            <div>
              <p className="text-[9px] font-semibold uppercase text-blue-400">
                CampusHR
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Everything your lecturers need.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                Profiles, academic records, workload and HR requests — all in
                one place.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-xs font-semibold text-white transition hover:bg-blue-700"
              >
                Sign in
                <ArrowUpRight size={14} />
              </Link>

              <Link
                href="/register"
                className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-xs font-semibold text-white transition hover:bg-white/5"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <Footer />
      </footer>
    </main>
  );
}
