"use client";

import { BookOpen, Clock3, Eye } from "lucide-react";

import type { AdminWorkload } from "@/lib/adminWorkload";

interface WorkloadTableProps {
  workload: AdminWorkload[];
  loading: boolean;
  onView: (workload: AdminWorkload) => void;
}

export default function WorkloadTable({
  workload,
  loading,
  onView,
}: WorkloadTableProps) {
  if (loading) {
    return (
      <div className="px-4 py-10 text-center">
        <p className="text-sm text-slate-500">Loading workload records...</p>
      </div>
    );
  }

  if (workload.length === 0) {
    return (
      <div className="px-4 py-10 text-center">
        <BookOpen size={22} className="mx-auto mb-2 text-slate-300" />

        <p className="text-sm font-medium text-slate-700">
          No workload records found
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Try changing your filters or add a workload record.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] text-left">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Lecturer
            </th>

            <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Course
            </th>

            <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Department
            </th>

            <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Semester
            </th>

            <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Session
            </th>

            <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Hours
            </th>

            <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {workload.map((item) => (
            <tr key={item._id} className="transition hover:bg-slate-50">
              <td className="px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {item.lecturer?.fullName || "Unknown Lecturer"}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {item.lecturer?.staffId || "—"}
                  </p>
                </div>
              </td>

              <td className="px-4 py-3">
                <div className="flex items-start gap-2">
                  <BookOpen
                    size={14}
                    className="mt-0.5 shrink-0 text-slate-400"
                  />

                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {item.courseCode}
                    </p>

                    <p className="mt-0.5 max-w-[220px] truncate text-xs text-slate-500">
                      {item.courseTitle}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-4 py-3 text-sm text-slate-600">
                {item.department || "—"}
              </td>

              <td className="px-4 py-3">
                <span className="inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                  {item.semester === "FIRST" ? "First" : "Second"}
                </span>
              </td>

              <td className="px-4 py-3 text-sm text-slate-600">
                {item.academicSession || "—"}
              </td>

              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <Clock3 size={14} className="text-slate-400" />

                  <span className="text-sm font-medium text-slate-700">
                    {item.weeklyTeachingHours}h
                  </span>
                </div>
              </td>

              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => onView(item)}
                  title="View workload"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-blue-600"
                >
                  <Eye size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
