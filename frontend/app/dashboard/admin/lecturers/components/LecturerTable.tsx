"use client";

import { Eye, UserRound } from "lucide-react";

import type { User } from "@/types";

interface LecturerTableProps {
  lecturers: User[];
  loading: boolean;
  onView: (lecturer: User) => void;
}

type UserWithMongoId = User & {
  _id?: string;
};

export default function LecturerTable({
  lecturers,
  loading,
  onView,
}: LecturerTableProps) {
  if (loading) {
    return (
      <div className="rounded-md border border-slate-200 bg-white">
        <div className="flex h-32 items-center justify-center text-xs text-slate-500">
          Loading lecturers...
        </div>
      </div>
    );
  }

  if (lecturers.length === 0) {
    return (
      <div className="rounded-md border border-slate-200 bg-white">
        <div className="flex h-32 flex-col items-center justify-center">
          <UserRound size={20} className="text-slate-400" />

          <p className="mt-2 text-xs font-medium text-slate-700">
            No lecturers found
          </p>

          <p className="mt-0.5 text-xs text-slate-400">
            Try changing your filters or add a lecturer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Lecturer
              </th>

              <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Staff ID
              </th>

              <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Department
              </th>

              <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Faculty
              </th>

              <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Rank
              </th>

              <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="w-12 px-4 py-2.5" />
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {lecturers.map((lecturer) => {
              const lecturerWithId = lecturer as UserWithMongoId;

              const lecturerId =
                lecturer.id || lecturerWithId._id || lecturer.staffId;

              const initials = lecturer.fullName
                .split(" ")
                .filter(Boolean)
                .map((name) => name[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <tr key={lecturerId} className="transition hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-xs font-semibold text-blue-700">
                        {initials}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-slate-800">
                          {lecturer.fullName}
                        </p>

                        <p className="truncate text-[11px] text-slate-500">
                          {lecturer.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-xs text-slate-600">
                    {lecturer.staffId}
                  </td>

                  <td className="px-4 py-3 text-xs text-slate-600">
                    {lecturer.department || "—"}
                  </td>

                  <td className="px-4 py-3 text-xs text-slate-600">
                    {lecturer.faculty || "—"}
                  </td>

                  <td className="px-4 py-3 text-xs text-slate-600">
                    {lecturer.academicRank || "—"}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-md px-2 py-1 text-[9px] font-medium ${
                        lecturer.employmentStatus === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700"
                          : lecturer.employmentStatus === "ON_LEAVE"
                            ? "bg-amber-50 text-amber-700"
                            : lecturer.employmentStatus === "SABBATICAL"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {lecturer.employmentStatus
                        ? lecturer.employmentStatus.replace("_", " ")
                        : "—"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onView(lecturer)}
                      className="rounded-md p-1.5 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                      title="View lecturer"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-100 px-4 py-2">
        <p className="text-[11px] text-slate-400">
          {lecturers.length} lecturer
          {lecturers.length === 1 ? "" : "s"} found
        </p>
      </div>
    </div>
  );
}
