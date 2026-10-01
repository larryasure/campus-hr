"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  Plus,
  Search,
  Users,
} from "lucide-react";

import { getMyProfile } from "@/lib/lecturer";
import { getAllAdminRequests, getAllLecturers } from "@/lib/admin";

import type { HRRequest, User } from "@/types";

export default function AdminDashboardPage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [lecturers, setLecturers] = useState<User[]>([]);
  const [requests, setRequests] = useState<HRRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [profileResponse, lecturersResponse, requestsResponse] =
          await Promise.all([
            getMyProfile(),
            getAllLecturers(),
            getAllAdminRequests(),
          ]);

        setProfile(profileResponse);
        setLecturers(lecturersResponse.data);
        setRequests(requestsResponse.data);
      } catch (error) {
        console.error("Failed to load admin dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const formattedDate = new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: browserTimeZone,
      }).format(now);

      const formattedTime = new Intl.DateTimeFormat("en-GB", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: browserTimeZone,
      }).format(now);

      setCurrentDate(`${formattedDate} • ${formattedTime}`);

      /*
       * Use the user's local browser time for the greeting.
       *
       * 5:00 AM - 11:59 AM  -> Good morning
       * 12:00 PM - 4:59 PM  -> Good afternoon
       * 5:00 PM - 4:59 AM   -> Good evening
       */
      const currentHour = Number(
        new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          hour12: false,
          timeZone: browserTimeZone,
        }).format(now),
      );

      if (currentHour >= 5 && currentHour < 12) {
        setGreeting("Good morning");
      } else if (currentHour >= 12 && currentHour < 17) {
        setGreeting("Good afternoon");
      } else {
        setGreeting("Good evening");
      }
    };

    updateDateTime();

    const interval = window.setInterval(updateDateTime, 60 * 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const activeLecturers = useMemo(
    () =>
      lecturers.filter((lecturer) => lecturer.employmentStatus === "ACTIVE")
        .length,
    [lecturers],
  );

  const pendingRequests = useMemo(
    () =>
      requests.filter(
        (request) =>
          request.status === "PENDING" || request.status === "UNDER_REVIEW",
      ),
    [requests],
  );

  const approvedRequests = useMemo(
    () => requests.filter((request) => request.status === "APPROVED").length,
    [requests],
  );

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-1 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-blue-600">Human Resources</p>

          <h1 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
            {greeting}, {profile?.fullName?.split(" ")[0] || "Admin"}
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Here&apos;s what&apos;s happening
          </p>
        </div>

        <p className="text-xs text-slate-400">{currentDate}</p>
      </header>

      {/* Metrics */}
      <section className="grid grid-cols-2 border border-slate-200 bg-white lg:grid-cols-4">
        <Metric icon={Users} label="Lecturers" value={lecturers.length} />

        <Metric
          icon={Clock3}
          label="Pending Requests"
          value={pendingRequests.length}
          bordered
        />

        <Metric
          icon={CheckCircle2}
          label="Approved Requests"
          value={approvedRequests}
          bordered
        />

        <Metric
          icon={Bell}
          label="Active Staff"
          value={activeLecturers}
          bordered
        />
      </section>

      {/* Main content */}
      <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        {/* Requests */}
        <div className="min-w-0 border border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-slate-900">Requests</h2>

              <p className="mt-0.5 text-[11px] text-slate-400">
                Items currently requiring attention
              </p>
            </div>

            <a
              href="/dashboard/admin/requests"
              className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700"
            >
              View all
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <CheckCircle2 className="mx-auto h-5 w-5 text-emerald-500" />

              <p className="mt-2 text-xs font-medium text-slate-700">
                No pending requests
              </p>

              <p className="mt-1 text-[11px] text-slate-400">
                Everything is currently up to date.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingRequests.slice(0, 5).map((request) => (
                <RequestRow key={request._id} request={request} />
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="min-w-0 border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Quick actions
            </h2>

            <p className="mt-0.5 text-[11px] text-slate-400">Common HR tasks</p>
          </div>

          <div className="p-2">
            <QuickAction
              icon={Plus}
              label="Create announcement"
              href="/dashboard/admin/announcements"
            />

            <QuickAction
              icon={Search}
              label="Search lecturers"
              href="/dashboard/admin/lecturers"
            />

            <QuickAction
              icon={FileText}
              label="Review requests"
              href="/dashboard/admin/requests"
            />

            <QuickAction
              icon={Users}
              label="View workload"
              href="/dashboard/admin/workload"
            />
          </div>
        </div>
      </section>

      {/* Activity */}
      <section className="border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Recent HR activity
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          <ActivityRow
            icon={Bell}
            title="Institutional announcements"
            detail="Manage staff notices and HR communication"
            href="/dashboard/admin/announcements"
          />

          <ActivityRow
            icon={Users}
            title="Lecturer directory"
            detail={`${lecturers.length} lecturer records available`}
            href="/dashboard/admin/lecturers"
          />

          <ActivityRow
            icon={FileText}
            title="HR requests"
            detail={`${requests.length} requests recorded`}
            href="/dashboard/admin/requests"
          />
        </div>
      </section>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  bordered = false,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  bordered?: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 items-center justify-between px-3 py-4 sm:px-4 ${
        bordered ? "border-l border-slate-200" : ""
      }`}
    >
      <div className="min-w-0">
        <p className="truncate text-[10px] font-medium text-slate-400 sm:text-[11px]">
          {label}
        </p>

        <p className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
          {value}
        </p>
      </div>

      <Icon className="hidden h-4 w-4 shrink-0 text-slate-300 sm:block" />
    </div>
  );
}

function RequestRow({ request }: { request: HRRequest }) {
  return (
    <a
      href="/dashboard/admin/requests"
      className="flex min-w-0 items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50"
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-blue-50 text-blue-600">
        <FileText className="h-3.5 w-3.5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-slate-800">
          {request.type}
        </p>

        <p className="mt-0.5 truncate text-[11px] text-slate-400">
          {request.status.replace("_", " ")}
        </p>
      </div>

      <span className="shrink-0 text-[10px] font-medium text-amber-600">
        Review
      </span>

      <ArrowRight className="h-3 w-3 shrink-0 text-slate-300" />
    </a>
  );
}

function QuickAction({
  icon: Icon,
  label,
  href,
}: {
  icon: typeof Plus;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 px-3 py-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
    >
      <Icon className="h-3.5 w-3.5 shrink-0 text-blue-600" />

      <span className="min-w-0 flex-1 truncate">{label}</span>

      <ArrowRight className="h-3 w-3 shrink-0 text-slate-300" />
    </a>
  );
}

function ActivityRow({
  icon: Icon,
  title,
  detail,
  href,
}: {
  icon: typeof Bell;
  title: string;
  detail: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50"
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-slate-50 text-slate-500">
        <Icon className="h-3.5 w-3.5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-slate-800">{title}</p>

        <p className="mt-0.5 truncate text-[11px] text-slate-400">{detail}</p>
      </div>

      <ArrowRight className="h-3 w-3 shrink-0 text-slate-300" />
    </a>
  );
}
