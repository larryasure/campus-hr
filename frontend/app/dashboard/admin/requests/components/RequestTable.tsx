"use client";

import { Eye, FileText, Trash2 } from "lucide-react";

import type { HRRequest } from "@/types";

interface RequestTableProps {
  requests: HRRequest[];
  loading: boolean;
  onView: (request: HRRequest) => void;
  onDelete: (request: HRRequest) => void;
}

type RequestWithLecturer = HRRequest & {
  lecturer?: {
    staffId?: string;
    fullName?: string;
    email?: string;
  };
};

const formatRequestType = (type: HRRequest["type"]) => {
  const labels: Record<HRRequest["type"], string> = {
    LEAVE: "Leave",
    LETTER_OF_INTRODUCTION: "Introduction Letter",
    EMPLOYMENT_REFERENCE: "Employment / Reference",
    SABBATICAL: "Sabbatical",
    OTHER: "Other",
  };

  return labels[type];
};

const formatStatus = (status: HRRequest["status"]) => {
  const labels: Record<HRRequest["status"], string> = {
    PENDING: "Pending",
    UNDER_REVIEW: "Under Review",
    APPROVED: "Approved",
    REJECTED: "Rejected",
  };

  return labels[status];
};

const getStatusClasses = (status: HRRequest["status"]) => {
  const classes: Record<HRRequest["status"], string> = {
    PENDING: "border-amber-200 bg-amber-50 text-amber-700",
    UNDER_REVIEW: "border-blue-200 bg-blue-50 text-blue-700",
    APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    REJECTED: "border-red-200 bg-red-50 text-red-700",
  };

  return classes[status];
};

const getLecturer = (request: HRRequest) => {
  const item = request as RequestWithLecturer;

  return (
    item.lecturer || (typeof item.user === "object" ? item.user : undefined)
  );
};

export default function RequestTable({
  requests,
  loading,
  onView,
  onDelete,
}: RequestTableProps) {
  if (loading) {
    return (
      <div className="px-4 py-10 text-center">
        <p className="text-sm text-slate-500">Loading HR requests...</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="px-4 py-10 text-center">
        <FileText size={22} className="mx-auto mb-2 text-slate-300" />

        <p className="text-sm font-medium text-slate-700">
          No HR requests found
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Try changing your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <table className="w-full table-fixed text-left">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            <th className="w-[22%] px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Lecturer
            </th>

            <th className="w-[25%] px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Request
            </th>

            <th className="w-[18%] px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Type
            </th>

            <th className="w-[15%] px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Status
            </th>

            <th className="w-[10%] px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Date
            </th>

            <th className="w-[10%] px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {requests.map((request) => {
            const lecturer = getLecturer(request);

            return (
              <tr key={request._id} className="hover:bg-slate-50">
                <td className="max-w-0 px-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {lecturer?.fullName || "Unknown Lecturer"}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      {lecturer?.staffId || lecturer?.email || "—"}
                    </p>
                  </div>
                </td>

                <td className="max-w-0 px-3 py-3">
                  <p
                    className="truncate text-sm font-medium text-slate-800"
                    title={request.subject}
                  >
                    {request.subject}
                  </p>
                </td>

                <td className="max-w-0 px-3 py-3">
                  <p
                    className="truncate text-sm text-slate-600"
                    title={formatRequestType(request.type)}
                  >
                    {formatRequestType(request.type)}
                  </p>
                </td>

                <td className="px-3 py-3">
                  <span
                    className={`inline-flex max-w-full truncate whitespace-nowrap rounded-md border px-2 py-1 text-[10px] font-medium ${getStatusClasses(
                      request.status,
                    )}`}
                  >
                    {formatStatus(request.status)}
                  </span>
                </td>

                <td className="px-3 py-3 text-xs text-slate-500">
                  {new Date(request.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                  })}
                </td>

                <td className="px-3 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onView(request)}
                      title="View request"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-blue-600"
                    >
                      <Eye size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(request)}
                      title="Delete request"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 text-red-500 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
