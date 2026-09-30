"use client";

import { Building2, ClipboardList, Users, UserCheck } from "lucide-react";

interface AdminStatsProps {
  totalLecturers: number;
  activeLecturers: number;
  pendingRequests: number;
  departments: number;
}

const stats = [
  {
    key: "totalLecturers",
    label: "Total Lecturers",
    icon: Users,
  },
  {
    key: "activeLecturers",
    label: "Active Lecturers",
    icon: UserCheck,
  },
  {
    key: "pendingRequests",
    label: "Pending Requests",
    icon: ClipboardList,
  },
  {
    key: "departments",
    label: "Departments",
    icon: Building2,
  },
] as const;

export default function AdminStats({
  totalLecturers,
  activeLecturers,
  pendingRequests,
  departments,
}: AdminStatsProps) {
  const values = {
    totalLecturers,
    activeLecturers,
    pendingRequests,
    departments,
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div key={stat.key} className="border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  {stat.label}
                </p>

                <p className="mt-2 text-xl font-semibold text-slate-900">
                  {values[stat.key]}
                </p>
              </div>

              <div className="flex h-8 w-8 items-center justify-center bg-blue-50">
                <Icon className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
