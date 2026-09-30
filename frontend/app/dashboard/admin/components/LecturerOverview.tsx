"use client";

import Link from "next/link";
import { ArrowRight, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";

import type { User } from "@/types";

interface LecturerOverviewProps {
  lecturers: User[];
}

export default function LecturerOverview({
  lecturers,
}: LecturerOverviewProps) {
  const [search, setSearch] = useState("");

  const filteredLecturers = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return lecturers.slice(0, 6);
    }

    return lecturers
      .filter(
        (lecturer) =>
          lecturer.fullName.toLowerCase().includes(value) ||
          lecturer.staffId.toLowerCase().includes(value) ||
          lecturer.email.toLowerCase().includes(value),
      )
      .slice(0, 6);
  }, [lecturers, search]);

  return (
    <section className="border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Lecturer Overview
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Search and access lecturer records.
            </p>
          </div>

          <Link
            href="/dashboard/admin/lecturers"
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, staff ID or email..."
            className="h-9 w-full border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {filteredLecturers.length === 0 ? (
        <div className="flex items-center gap-3 px-4 py-8">
          <div className="flex h-8 w-8 items-center justify-center bg-slate-100">
            <Users className="h-4 w-4 text-slate-500" />
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-700">
              No lecturers found
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              Try a different search.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Lecturer
                </th>

                <th className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Department
                </th>

                <th className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Rank
                </th>

                <th className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredLecturers.map((lecturer) => (
                <tr
                  key={lecturer.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-4 py-3">
                    <p className="text-xs font-medium text-slate-800">
                      {lecturer.fullName}
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {lecturer.staffId}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-xs text-slate-600">
                    {lecturer.department || "—"}
                  </td>

                  <td className="px-4 py-3 text-xs text-slate-600">
                    {lecturer.academicRank || "—"}
                  </td>

                  <td className="px-4 py-3">
                    <span className="inline-flex border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                      {lecturer.employmentStatus === "ACTIVE"
                        ? "Active"
                        : lecturer.employmentStatus
                          ? lecturer.employmentStatus.replace(
                              /_/g,
                              " ",
                            )
                          : "Unknown"}
                    </span>
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