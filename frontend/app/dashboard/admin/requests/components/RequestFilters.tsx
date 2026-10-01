"use client";

import { X } from "lucide-react";

interface RequestFiltersProps {
  status: string;
  type: string;
  onStatusChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onClear: () => void;
}

export default function RequestFilters({
  status,
  type,
  onStatusChange,
  onTypeChange,
  onClear,
}: RequestFiltersProps) {
  const hasFilters =
    status !== "" || type !== "";

  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <select
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value)
          }
          className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:w-48"
        >
          <option value="">
            All Statuses
          </option>
          <option value="PENDING">
            Pending
          </option>
          <option value="UNDER_REVIEW">
            Under Review
          </option>
          <option value="APPROVED">
            Approved
          </option>
          <option value="REJECTED">
            Rejected
          </option>
        </select>

        <select
          value={type}
          onChange={(event) =>
            onTypeChange(event.target.value)
          }
          className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:w-56"
        >
          <option value="">
            All Request Types
          </option>
          <option value="LEAVE">
            Leave
          </option>
          <option value="LETTER_OF_INTRODUCTION">
            Letter of Introduction
          </option>
          <option value="EMPLOYMENT_REFERENCE">
            Employment / Reference Letter
          </option>
          <option value="SABBATICAL">
            Sabbatical
          </option>
          <option value="OTHER">
            Other
          </option>
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
          >
            <X size={15} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}