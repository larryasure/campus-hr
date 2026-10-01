"use client";

import { Search, X } from "lucide-react";

interface LecturerFiltersProps {
  search: string;
  faculty: string;
  department: string;
  academicRank: string;
  faculties: string[];
  departments: string[];
  academicRanks: string[];
  onSearchChange: (value: string) => void;
  onFacultyChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onAcademicRankChange: (value: string) => void;
  onClear: () => void;
}

export default function LecturerFilters({
  search,
  faculty,
  department,
  academicRank,
  faculties,
  departments,
  academicRanks,
  onSearchChange,
  onFacultyChange,
  onDepartmentChange,
  onAcademicRankChange,
  onClear,
}: LecturerFiltersProps) {
  const hasFilters =
    search !== "" ||
    faculty !== "" ||
    department !== "" ||
    academicRank !== "";

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
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search lecturer..."
            className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Faculty */}
        <select
          value={faculty}
          onChange={(e) => onFacultyChange(e.target.value)}
          className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Faculties</option>

          {faculties.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {/* Department */}
        <select
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Departments</option>

          {departments.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {/* Rank + clear */}
        <div className="flex gap-2">
          <select
            value={academicRank}
            onChange={(e) =>
              onAcademicRankChange(e.target.value)
            }
            className="h-9 min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Ranks</option>

            {academicRanks.map((item) => (
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