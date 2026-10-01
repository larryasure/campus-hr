"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  User,
} from "lucide-react";

import api from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import Modal from "@/components/ui/Modal";

interface TopNavbarProps {
  isAdmin: boolean;
  onMobileMenuOpen?: () => void;
}

interface RequestItem {
  _id: string;
  subject: string;
  status: string;
  createdAt: string;
}

interface RequestsResponse {
  success: boolean;
  data: RequestItem[];
}

export default function TopNavbar({
  isAdmin,
  onMobileMenuOpen,
}: TopNavbarProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const [isProfileOpen, setIsProfileOpen] =
    useState(false);

  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState(false);

  const [isLogoutModalOpen, setIsLogoutModalOpen] =
    useState(false);

  const [requests, setRequests] = useState<RequestItem[]>([]);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const endpoint = isAdmin
          ? "/admin/requests?status=PENDING&limit=5"
          : "/requests?limit=5";

        const response = await api.get<RequestsResponse>(
          endpoint,
        );

        if (response.data.success) {
          setRequests(response.data.data || []);
        }
      } catch {
        setRequests([]);
      }
    };

    fetchNotifications();
  }, [isAdmin]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setIsProfileOpen(false);
      }

      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(target)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  const notificationCount = isAdmin
    ? requests.length
    : requests.filter(
        (request) =>
          request.status === "PENDING" ||
          request.status === "UNDER_REVIEW",
      ).length;

  const initials =
    user?.fullName
      ?.split(" ")
      .filter(Boolean)
      .map((name) => name.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const handleConfirmLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    router.replace("/login");
  };

  return (
    <>
      <header className="relative z-30 flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3 sm:px-6 lg:px-8">
        {/* Mobile menu + context */}
        <div className="flex min-w-0 items-center gap-2.5">
          <button
            type="button"
            onClick={onMobileMenuOpen}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {isAdmin
                ? "HR Administration"
                : "Lecturer Portal"}
            </p>

            <p className="hidden truncate text-xs text-slate-500 sm:block">
              {isAdmin
                ? "Manage staff records and HR operations"
                : "Manage your academic and HR activities"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* Notifications */}
          <div
            ref={notificationsRef}
            className="relative"
          >
            <button
              type="button"
              aria-label="Notifications"
              aria-expanded={isNotificationsOpen}
              onClick={() => {
                setIsNotificationsOpen(
                  (current) => !current,
                );

                setIsProfileOpen(false);
              }}
              className="relative flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              <Bell className="h-4 w-4" />

              {notificationCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-semibold leading-none text-white">
                  {notificationCount > 9
                    ? "9+"
                    : notificationCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-[320px] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Notifications
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Recent HR activity
                    </p>
                  </div>

                  {notificationCount > 0 && (
                    <span className="text-xs font-medium text-blue-600">
                      {notificationCount}{" "}
                      {notificationCount === 1
                        ? "item"
                        : "items"}
                    </span>
                  )}
                </div>

                {requests.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-md bg-slate-50">
                      <Bell className="h-4 w-4 text-slate-400" />
                    </div>

                    <p className="mt-3 text-sm font-medium text-slate-700">
                      No new notifications
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      You’re all caught up.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {requests.map((request) => (
                      <Link
                        key={request._id}
                        href={
                          isAdmin
                            ? "/dashboard/admin/requests"
                            : "/dashboard/requests"
                        }
                        onClick={() =>
                          setIsNotificationsOpen(false)
                        }
                        className="block border-b border-slate-100 px-4 py-3 transition-colors last:border-b-0 hover:bg-blue-50/50"
                      >
                        <div className="flex items-start gap-3">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-800">
                              {request.subject}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {request.status.replace(
                                "_",
                                " ",
                              )}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="hidden h-6 w-px bg-slate-200 sm:block" />

          {/* Profile */}
          <div
            ref={profileRef}
            className="relative"
          >
            <button
              type="button"
              aria-expanded={isProfileOpen}
              onClick={() => {
                setIsProfileOpen(
                  (current) => !current,
                );

                setIsNotificationsOpen(false);
              }}
              className="flex items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-slate-50"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-[11px] font-semibold text-white">
                {initials}
              </div>

              <div className="hidden max-w-36 text-left sm:block">
                <p className="truncate text-xs font-semibold text-slate-900">
                  {user?.fullName || "User"}
                </p>

                <p className="mt-0.5 truncate text-[11px] text-slate-500">
                  {isAdmin
                    ? "HR Administrator"
                    : "Lecturer"}
                </p>
              </div>

              <ChevronDown
                className={`hidden h-3.5 w-3.5 text-slate-400 transition-transform sm:block ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg">
                <Link
                  href="/dashboard/profile"
                  onClick={() =>
                    setIsProfileOpen(false)
                  }
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>

                <div className="my-1 border-t border-slate-100" />

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() =>
          setIsLogoutModalOpen(false)
        }
        title="Confirm logout"
        description="Are you sure you want to log out of your CampusHR account?"
        size="sm"
      >
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() =>
              setIsLogoutModalOpen(false)
            }
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirmLogout}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </Modal>
    </>
  );
}