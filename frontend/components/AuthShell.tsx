import type { ReactNode } from "react";
import Link from "next/link";
import AuthVisual from "@/components/AuthVisual";

interface AuthShellProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthShell({
  children,
  title,
  subtitle,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[#f3f4f6]">
      <div className="mx-auto min-h-screen max-w-[1500px] ">
        <div className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
          {/* Visual side */}
          <section className="relative hidden min-h-screen overflow-hidden lg:block">
            <div className="absolute left-8 top-8 z-20">
              <Link href="/" className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  C
                </span>

                <span className="text-sm font-semibold text-slate-950">
                  CampusHR
                </span>
              </Link>
            </div>

            <AuthVisual />

            <div className="absolute bottom-8 left-8 right-8">
              <p className="max-w-sm text-[10px] leading-5 text-slate-400">
                A focused workspace for lecturer profiles, academic records,
                teaching workload and university HR requests.
              </p>
            </div>
          </section>

          {/* Authentication side */}
          <section className="flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex w-full max-w-[500px] flex-col bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.08)] sm:p-8 rounded-xl">
              {/* Mobile brand */}
              <div className="mb-8 flex items-center lg:hidden">
                <Link href="/" className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    C
                  </span>

                  <span className="text-sm font-semibold text-slate-950">
                    CampusHR
                  </span>
                </Link>
              </div>

              <div className="mb-7 ">
         

                <h1 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-slate-950 sm:text-2xl">
                  {title}
                </h1>

                <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
                  {subtitle}
                </p>
              </div>

              {children}

              <div className="mt-8 border-t border-slate-100 pt-4 text-center">
                <p className="text-[9px] text-slate-400">
                  Secure university staff workspace
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}