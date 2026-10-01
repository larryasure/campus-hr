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
        <div>
          <p className="text-xs font-medium text-blue-600">Human Resources</p>

          <h1 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
            Good morning, {profile?.fullName?.split(" ")[0] || "Admin"}
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Here&apos;s what&apos;s happening
          </p>
        </div>

        <p className="text-xs text-slate-400">
          {new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }).format(new Date())}
        </p>
      </header>

      {/* Metrics */}
      <section className="grid grid-cols-2 border  border-slate-200 bg-white lg:grid-cols-4">
        <Metric icon={Users} label="Lecturers" value={lecturers.length} />

        <Metric
          icon={Clock3}
          label="Pending Request"
          value={pendingRequests.length}
          bordered
        />

        <Metric
          icon={CheckCircle2}
          label="Approved Request"
          value={approvedRequests}
          bordered
        />

        <Metric
          icon={Bell}
          label="Active staff"
          value={activeLecturers}
          bordered
        />
      </section>

      {/* Main content */}
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        {/* Requests */}
        <div className="border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Requests</h2>

              <p className="mt-0.5 text-[11px] text-slate-400">
                Items currently requiring attention
              </p>
            </div>

            <a
              href="/dashboard/admin/requests"
              className="flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700"
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
        <div className="border border-slate-200 bg-white">
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
      className={`flex items-center justify-between px-4 py-4 ${
        bordered ? "border-l border-slate-200" : ""
      }`}
    >
      <div>
        <p className="text-[11px] font-medium text-slate-400">{label}</p>

        <p className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
          {value}
        </p>
      </div>

      <Icon className="h-4 w-4 text-slate-300" />
    </div>
  );
}

function RequestRow({ request }: { request: HRRequest }) {
  return (
    <a
      href="/dashboard/admin/requests"
      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50"
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

      <span className="text-[10px] font-medium text-amber-600">Review</span>

      <ArrowRight className="h-3 w-3 text-slate-300" />
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
      <Icon className="h-3.5 w-3.5 text-blue-600" />
      <span className="flex-1">{label}</span>
      <ArrowRight className="h-3 w-3 text-slate-300" />
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
      <div className="flex h-7 w-7 items-center justify-center bg-slate-50 text-slate-500">
        <Icon className="h-3.5 w-3.5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-800">{title}</p>
        <p className="mt-0.5 text-[11px] text-slate-400">{detail}</p>
      </div>

      <ArrowRight className="h-3 w-3 text-slate-300" />
    </a>
  );
}
