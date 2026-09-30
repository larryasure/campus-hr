"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { label: "Platform", href: "#platform" },
  { label: "Modules", href: "#modules" },
  { label: "How it works", href: "#workflow" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="relative z-30 px-5 pt-5 sm:px-8 sm:pt-7">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between border border-slate-200 bg-white px-3 py-2 shadow-[0_10px_35px_rgba(15,23,42,0.07)] rounded-xl">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 pl-1">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              C
            </span>

            <div>
              <span className="block text-sm font-semibold text-slate-950">
                CampusHR
              </span>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/login"
              className="px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className="flex items-center gap-2 bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white! transition hover:bg-blue-700 rounded-xl"
            >
              Get started
              <ArrowUpRight size={15} />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setIsOpen((current) => !current)}
            className="flex h-10 w-10 items-center justify-center border border-slate-200 text-slate-700 md:hidden"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile navigation */}
        {isOpen && (
          <div className="mt-2 border border-slate-200 bg-white p-3 shadow-[0_10px_35px_rgba(15,23,42,0.07)] md:hidden">
            <nav className="flex flex-col">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="mt-2 border-t border-slate-100 pt-3 text-white">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-3 text-sm font-medium text-slate-600"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="mt-1 flex items-center justify-center gap-2  px-4 py-3 text-sm font-semibold  "
              >
                <span className="text-white ">Get started</span>
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
