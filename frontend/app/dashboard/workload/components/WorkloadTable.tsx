"use client";

import { BookOpen, CalendarDays, Clock3 } from "lucide-react";

import type { Workload } from "@/types";

interface WorkloadTableProps {
  workload: Workload[];
}

export default function WorkloadTable({ workload }: WorkloadTableProps) {
  if (workload.length === 0) {
    return (
      <div className="border border-slate-200 bg-white px-5 py-12 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <BookOpen className="h-5 w-5" />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-slate-900">
          No teaching assignments
        </h3>

        <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
          Your assigned courses and teaching hours will appear here once they
          have been added by your institution.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-slate-200 bg-white">
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] text-left">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Course
              </th>

              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Department
              </th>

              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Semester
              </th>

              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Academic Session
              </th>

              <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Weekly Hours
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {workload.map((course) => (
              <tr
                key={course._id}
                className="transition-colors hover:bg-blue-50/30"
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold text-blue-700">
                      {course.courseCode}
                    </p>

                    <p className="mt-0.5 text-sm font-medium text-slate-800">
                      {course.courseTitle}
                    </p>
                  </div>
                </td>

                <td className="px-4 py-3 text-xs text-slate-600">
                  {course.department}
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                    {course.semester}
                  </span>
                </td>

                <td className="px-4 py-3 text-xs text-slate-600">
                  {course.academicSession}
                </td>

                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-semibold text-slate-900">
                    {course.weeklyTeachingHours}
                  </span>

                  <span className="ml-1 text-[11px] text-slate-400">hrs</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="divide-y divide-slate-100 md:hidden">
        {workload.map((course) => (
          <article key={course._id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-blue-700">
                  {course.courseCode}
                </p>

                <h3 className="mt-1 text-sm font-semibold text-slate-900">
                  {course.courseTitle}
                </h3>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-lg font-semibold text-slate-900">
                  {course.weeklyTeachingHours}
                </p>

                <p className="text-[10px] uppercase tracking-wide text-slate-400">
                  Hours / Week
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-blue-600" />

                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Department
                  </p>
                </div>

                <p className="mt-1 text-xs text-slate-700">
                  {course.department}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-blue-600" />

                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Semester
                  </p>
                </div>

                <p className="mt-1 text-xs text-slate-700">{course.semester}</p>
              </div>

              <div className="col-span-2">
                <div className="flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5 text-blue-600" />

                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Academic Session
                  </p>
                </div>

                <p className="mt-1 text-xs text-slate-700">
                  {course.academicSession}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
