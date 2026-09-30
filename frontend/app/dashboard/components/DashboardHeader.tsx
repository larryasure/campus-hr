"use client";

import { Bell, CalendarDays } from "lucide-react";

interface DashboardHeaderProps {
  fullName: string;
  academicRank?: string;
  department?: string;
  faculty?: string;
  academicSession?: string;
}

export default function DashboardHeader({
  fullName,
  academicRank,
  department,
  faculty,
  academicSession,
}: DashboardHeaderProps) {
  const firstName = fullName?.split(" ")[0] || "Lecturer";

  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
          Lecturer Dashboard
        </p>

        <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          Welcome back, {firstName}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {academicRank || "Lecturer"}
          {department ? ` · ${department}` : ""}
          {faculty ? ` · ${faculty}` : ""}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {academicSession && (
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <CalendarDays className="h-4 w-4 text-slate-500" />

            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Academic Session
              </p>

              <p className="text-xs font-semibold text-slate-700">
                {academicSession}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
