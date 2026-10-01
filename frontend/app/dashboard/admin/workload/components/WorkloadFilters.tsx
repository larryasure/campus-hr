"use client";

import { Search, X } from "lucide-react";

interface WorkloadFiltersProps {
  search: string;
  department: string;
  semester: string;
  academicSession: string;

  departments: string[];
  academicSessions: string[];

  onSearchChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onSemesterChange: (value: string) => void;
  onAcademicSessionChange: (value: string) => void;
  onClear: () => void;
}

export default function WorkloadFilters({
  search,
  department,
  semester,
  academicSession,
  departments,
  academicSessions,
  onSearchChange,
  onDepartmentChange,
  onSemesterChange,
  onAcademicSessionChange,
  onClear,
}: WorkloadFiltersProps) {
  const hasFilters =
    search !== "" ||
    department !== "" ||
    semester !== "" ||
    academicSession !== "";

  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search lecturer or course..."
            className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Department */}
        <select
          value={department}
          onChange={(event) =>
            onDepartmentChange(event.target.value)
          }
          className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Departments</option>

          {departments.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {/* Semester */}
        <select
          value={semester}
          onChange={(event) =>
            onSemesterChange(event.target.value)
          }
          className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Semesters</option>
          <option value="FIRST">First Semester</option>
          <option value="SECOND">Second Semester</option>
        </select>

        {/* Academic Session + Clear */}
        <div className="flex gap-2">
          <select
            value={academicSession}
            onChange={(event) =>
              onAcademicSessionChange(
                event.target.value,
              )
            }
            className="h-9 min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">
              All Academic Sessions
            </option>

            {academicSessions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {hasFilters && (
            <button
              type="button"
              onClick={onClear}
              title="Clear filters"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}