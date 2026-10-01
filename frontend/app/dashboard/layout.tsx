"use client";

import { useState } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";
import { useAuthStore } from "@/stores/authStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const isAdmin = user?.role === "HR_ADMIN";

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">
      <div className="flex min-h-screen">
        <Sidebar
          isAdmin={isAdmin}
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() =>
            setIsMobileMenuOpen(false)
          }
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopNavbar
            isAdmin={isAdmin}
            onMobileMenuOpen={() =>
              setIsMobileMenuOpen(true)
            }
          />

          <main className="min-w-0 flex-1 px-3 py-4 sm:px-6 sm:py-5 lg:px-8">
            <div className="mx-auto w-full max-w-[1440px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}