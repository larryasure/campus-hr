import { BookOpen } from "lucide-react";

import type { Workload } from "@/types";

interface WorkloadOverviewProps {
  workload: Workload[];
}

export default function WorkloadOverview({ workload }: WorkloadOverviewProps) {
  return (
    <section className="min-w-0 max-w-full overflow-hidden border border-slate-200 bg-white">
      <div className="flex min-w-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-slate-900">
            Teaching Workload
          </h2>

          <p className="mt-0.5 wrap-break-word text-xs text-slate-500">
            Your current course assignments
          </p>
        </div>

        <BookOpen className="h-4 w-4 shrink-0 text-blue-600" />
      </div>

      {workload.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <BookOpen className="mx-auto h-5 w-5 text-slate-400" />

          <p className="mt-2 text-sm font-medium text-slate-700">
            No workload assigned
          </p>

          <p className="mt-1 wrap-break-word text-xs text-slate-500">
            Your teaching assignments will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[650px] text-left">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600">
                    Course
                  </th>

                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600">
                    Department
                  </th>

                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600">
                    Semester
                  </th>

                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600">
                    Session
                  </th>

                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-600">
                    Hours
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {workload.map((course) => (
                  <tr key={course._id} className="hover:bg-slate-50">
                    <td className="max-w-[280px] px-4 py-3">
                      <p className="wrap-break-word text-xs font-semibold text-blue-700">
                        {course.courseCode}
                      </p>

                      <p className="mt-0.5 wrap-break-word text-sm text-slate-700">
                        {course.courseTitle}
                      </p>
                    </td>

                    <td className="max-w-[180px] wrap-break-word px-4 py-3 text-xs text-slate-600">
                      {course.department}
                    </td>

                    <td className="px-4 py-3 text-xs text-slate-600">
                      {course.semester}
                    </td>

                    <td className="px-4 py-3 text-xs text-slate-600">
                      {course.academicSession}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-semibold text-slate-900">
                        {course.weeklyTeachingHours}
                      </span>

                      <span className="ml-1 text-xs text-slate-500">hrs</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="divide-y divide-slate-100 md:hidden">
            {workload.map((course) => (
              <div key={course._id} className="min-w-0 px-4 py-3">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="wrap-break-word text-xs font-semibold text-blue-700">
                      {course.courseCode}
                    </p>

                    <p className="mt-0.5 wrap-break-word text-sm font-medium leading-5 text-slate-800">
                      {course.courseTitle}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {course.weeklyTeachingHours}
                    </p>

                    <p className="text-[10px] text-slate-400">hrs/week</p>
                  </div>
                </div>

                <div className="mt-3 grid min-w-0 grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-100 pt-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                      Department
                    </p>

                    <p className="mt-0.5 wrap-break-word text-xs text-slate-600">
                      {course.department}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                      Semester
                    </p>

                    <p className="mt-0.5 wrap-break-word text-xs text-slate-600">
                      {course.semester}
                    </p>
                  </div>

                  <div className="col-span-2 min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                      Academic Session
                    </p>

                    <p className="mt-0.5 wrap-break-word text-xs text-slate-600">
                      {course.academicSession}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
