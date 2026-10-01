"use client";

import { CheckCircle2, FileText, X } from "lucide-react";

import type { HRRequest } from "@/types";

interface RequestModalProps {
  open: boolean;
  request: HRRequest | null;
  status: HRRequest["status"];
  adminComment: string;
  saving: boolean;
  error: string;
  onClose: () => void;
  onSave: () => void;
  onStatusChange: (value: HRRequest["status"]) => void;
  onCommentChange: (value: string) => void;
}

type RequestWithLecturer = HRRequest & {
  lecturer?: {
    staffId?: string;
    fullName?: string;
    email?: string;
    faculty?: string;
    department?: string;
    academicRank?: string;
  };
};

const formatRequestType = (type: HRRequest["type"]) => {
  const labels: Record<HRRequest["type"], string> = {
    LEAVE: "Leave",
    LETTER_OF_INTRODUCTION: "Letter of Introduction",
    EMPLOYMENT_REFERENCE: "Employment / Reference",
    SABBATICAL: "Sabbatical",
    OTHER: "Other",
  };

  return labels[type];
};

export default function RequestModal({
  open,
  request,
  status,
  adminComment,
  saving,
  error,
  onClose,
  onSave,
  onStatusChange,
  onCommentChange,
}: RequestModalProps) {
  if (!open || !request) {
    return null;
  }

  const item = request as RequestWithLecturer;

  const lecturer =
    item.lecturer || (typeof item.user === "object" ? item.user : undefined);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 px-4 py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Review HR Request
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Review the lecturer's request and update its status.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={17} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-slate-500">
                <FileText size={17} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">
                  {request.subject}
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  {formatRequestType(request.type)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-500">Lecturer</p>

              <p className="mt-1 text-sm font-medium text-slate-800">
                {lecturer?.fullName || "Unknown Lecturer"}
              </p>

              {lecturer?.staffId && (
                <p className="mt-0.5 text-xs text-slate-500">
                  {lecturer.staffId}
                </p>
              )}
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">Department</p>

              <p className="mt-1 text-sm text-slate-700">
                {lecturer?.department || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">Faculty</p>

              <p className="mt-1 text-sm text-slate-700">
                {lecturer?.faculty || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">Submitted</p>

              <p className="mt-1 text-sm text-slate-700">
                {new Date(request.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-1 text-xs font-medium text-slate-500">
              Request Description
            </p>

            <div className="rounded-md border border-slate-200 bg-white px-3 py-2.5">
              <p className="whitespace-pre-wrap text-sm leading-5 text-slate-700">
                {request.description}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Request Status
            </label>

            <select
              value={status}
              onChange={(event) =>
                onStatusChange(event.target.value as HRRequest["status"])
              }
              disabled={saving}
              className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50"
            >
              <option value="PENDING">Pending</option>

              <option value="UNDER_REVIEW">Under Review</option>

              <option value="APPROVED">Approved</option>

              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Admin Comment
            </label>

            <textarea
              value={adminComment}
              onChange={(event) => onCommentChange(event.target.value)}
              disabled={saving}
              rows={4}
              placeholder="Add a comment for the lecturer..."
              className="w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm leading-5 text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-8 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
          >
            Close
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-blue-600 px-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CheckCircle2 size={14} />

            {saving ? "Saving..." : "Save Review"}
          </button>
        </div>
      </div>
    </div>
  );
}
