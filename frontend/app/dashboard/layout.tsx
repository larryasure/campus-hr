"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";
import { useAuthStore } from "@/stores/authStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();

  const isAdmin = user?.role === "HR_ADMIN";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <Sidebar isAdmin={isAdmin} />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopNavbar isAdmin={isAdmin} />

          <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-[1440px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}