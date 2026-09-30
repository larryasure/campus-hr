"use client";

import { ChevronDown, Clock3, FileText, MessageSquare } from "lucide-react";
import { useState } from "react";

import type { HRRequest, HRRequestStatus } from "@/types";

interface RequestListProps {
  requests: HRRequest[];
}

const statusStyles: Record<HRRequestStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  UNDER_REVIEW: "bg-blue-50 text-blue-700 border-blue-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
};

const statusLabels: Record<HRRequestStatus, string> = {
  PENDING: "Pending",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

const requestTypeLabels: Record<string, string> = {
  LEAVE: "Leave",
  LETTER_OF_INTRODUCTION: "Letter of Introduction",
  EMPLOYMENT_REFERENCE: "Employment / Reference Letter",
  SABBATICAL: "Sabbatical",
  OTHER: "Other HR Request",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function StatusBadge({ status }: { status: HRRequestStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-1 text-[10px] font-semibold ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}

export default function RequestList({ requests }: RequestListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (requests.length === 0) {
    return (
      <div className="border border-slate-200 bg-white px-5 py-12 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <FileText className="h-5 w-5" />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-slate-900">
          No HR requests yet
        </h3>

        <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
          Requests you submit to Human Resources will appear here so you can
          track their progress.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {requests.map((request) => {
        const isExpanded = expandedId === request._id;

        return (
          <div key={request._id} className="border border-slate-200 bg-white">
            <button
              type="button"
              onClick={() => setExpandedId(isExpanded ? null : request._id)}
              className="flex w-full items-start gap-3 p-4 text-left transition hover:bg-slate-50"
              aria-expanded={isExpanded}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                <FileText className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-medium text-blue-600">
                      {requestTypeLabels[request.type] ?? request.type}
                    </p>

                    <h3 className="mt-0.5 text-sm font-semibold text-slate-900">
                      {request.subject}
                    </h3>
                  </div>

                  <StatusBadge status={request.status} />
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-3 w-3" />
                    {formatDate(request.createdAt)}
                  </span>

                  <span>Updated {formatDate(request.updatedAt)}</span>
                </div>
              </div>

              <ChevronDown
                className={`mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {isExpanded && (
              <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Request Description
                  </p>

                  <p className="mt-1.5 whitespace-pre-wrap text-xs leading-5 text-slate-600">
                    {request.description}
                  </p>
                </div>

                {request.adminComment && (
                  <div className="mt-4 border border-blue-100 bg-blue-50 px-2 py-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-3.5 w-3.5 text-blue-600" />

                      <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-700">
                        HR Comment
                      </p>
                    </div>

                    <p className="mt-1.5 text-xs leading-5 text-blue-900">
                      {request.adminComment}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
