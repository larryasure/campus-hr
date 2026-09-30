import { BookOpen } from "lucide-react";
import type { Workload } from "@/types";

interface WorkloadOverviewProps {
  workload: Workload[];
}

export default function WorkloadOverview({ workload }: WorkloadOverviewProps) {
  return (
    <section className="border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Teaching Workload
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Your current course assignments
          </p>
        </div>

        <BookOpen className="h-4 w-4 text-blue-600" />
      </div>

      {workload.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <BookOpen className="mx-auto h-5 w-5 text-slate-400" />

          <p className="mt-2 text-sm font-medium text-slate-700">
            No workload assigned
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Your teaching assignments will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
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
                  <td className="px-4 py-3">
                    <p className="text-xs font-semibold text-blue-700">
                      {course.courseCode}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-700">
                      {course.courseTitle}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-xs text-slate-600">
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
      )}
    </section>
  );
}
