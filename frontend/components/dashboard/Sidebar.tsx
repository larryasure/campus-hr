"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  BookOpen,
  BriefcaseBusiness,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";
import { useState } from "react";

import { useAuthStore } from "@/stores/authStore";
import Modal from "@/components/ui/Modal";

interface SidebarProps {
  isAdmin: boolean;
}

export default function Sidebar({ isAdmin }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const [isLogoutModalOpen, setIsLogoutModalOpen] =
    useState(false);

  const lecturerLinks = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Profile",
      href: "/dashboard/profile",
      icon: Users,
    },
    {
      label: "Academic Records",
      href: "/dashboard/academic-records",
      icon: GraduationCap,
    },
    {
      label: "Teaching & Workload",
      href: "/dashboard/workload",
      icon: BookOpen,
    },
    {
      label: "HR Requests",
      href: "/dashboard/requests",
      icon: ClipboardList,
    },
    {
      label: "Announcements",
      href: "/dashboard/announcements",
      icon: Bell,
    },
  ];

  const adminLinks = [
    {
      label: "Dashboard",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Lecturers",
      href: "/dashboard/admin/lecturers",
      icon: Users,
    },
    {
      label: "Workload Management",
      href: "/dashboard/admin/workload",
      icon: BriefcaseBusiness,
    },
    {
      label: "HR Requests",
      href: "/dashboard/admin/requests",
      icon: ClipboardList,
    },
    {
      label: "Announcements",
      href: "/dashboard/admin/announcements",
      icon: Bell,
    },
  ];

  const links = isAdmin ? adminLinks : lecturerLinks;

  const handleConfirmLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    router.replace("/login");
  };

  return (
    <>
      <aside className="hidden min-h-screen w-[250px] shrink-0 flex-col bg-blue-950 text-white lg:flex">
        {/* Brand */}
        <div className="flex h-16 items-center border-b border-white/10 px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <span className="text-sm font-bold">C</span>
            </div>

            <span className="text-lg font-semibold tracking-tight">
              CampusHR
            </span>
          </div>
        </div>

        {/* Role */}
        <div className="px-5 pb-4 pt-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-300">
            {isAdmin ? "Administration" : "Lecturer Portal"}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Main Menu
          </p>

          <div className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;

              const isActive =
                link.href === "/dashboard" ||
                link.href === "/dashboard/admin"
                  ? pathname === link.href
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-[17px] w-[17px] ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-white"
                    }`}
                  />

                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-[17px] w-[17px]" />
            Logout
          </button>
        </div>
      </aside>

      {/* Logout Confirmation */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Confirm logout"
        description="Are you sure you want to log out of your CampusHR account?"
        size="sm"
      >
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(false)}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirmLogout}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Logout
          </button>
        </div>
      </Modal>
    </>
  );
}