import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  FileText,
  GraduationCap,
  ShieldCheck,
  Users,
} from "lucide-react";

const platformLinks = [
  { label: "Lecturer profiles", href: "#platform" },
  { label: "Academic records", href: "#modules" },
  { label: "Teaching workload", href: "#modules" },
  { label: "HR requests", href: "#workflow" },
];

const accessLinks = [
  { label: "Sign in", href: "/login" },
  { label: "Register", href: "/register" },
];

export default function Footer() {
  return (
    <footer className="px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="mx-auto max-w-[1500px] overflow-hidden rounded-[28px] border border-slate-200 bg-white sm:rounded-[38px]">
        {/* Main footer */}
        <div className="grid gap-12 p-7 sm:p-10 lg:grid-cols-[1.4fr_0.8fr_0.8fr] lg:p-14">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                C
              </span>

              <div>
                <span className="block text-sm font-semibold text-slate-950">
                  CampusHR
                </span>
              </div>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-6 text-slate-500">
              A focused HR workspace for managing lecturer records, academic
              information, workload and HR requests.
            </p>
          </div>

          {/* Platform */}
          <div>
            <p className="text-[9px] font-semibold uppercase text-slate-400">
              Platform
            </p>

            <nav className="mt-5 space-y-3">
              {platformLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-xs font-medium text-slate-600 transition hover:text-blue-600"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Access */}
          <div>
            <p className="text-[9px] font-semibold uppercase text-slate-400">
              Access
            </p>

            <nav className="mt-5 space-y-3">
              {accessLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-2 text-xs font-medium text-slate-600 transition hover:text-blue-600"
                >
                  {link.label}
                  <ArrowUpRight size={12} />
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-3 px-7 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-14">
          <p className="text-xs text-slate-400">
            © 2026 CampusHR. University Lecturer HR Management System.
          </p>

          <div className="flex items-center gap-5 text-xs text-slate-400">
            <span>Professional</span>
            <span>Secure</span>
            <span>Focused</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
