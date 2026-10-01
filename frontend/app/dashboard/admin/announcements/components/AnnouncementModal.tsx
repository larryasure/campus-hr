"use client";

import {
  CalendarClock,
  CheckCircle2,
  FileText,
  X,
} from "lucide-react";

import type { Announcement } from "@/types";

interface AnnouncementModalProps {
  open: boolean;
  announcement: Announcement | null;
  scheduledAt: string;
  saving: boolean;
  error: string;
  onClose: () => void;
  onSchedule: () => void;
  onCancelSchedule: () => void;
  onScheduledAtChange: (
    value: string,
  ) => void;
}

const formatStatus = (
  status: Announcement["status"],
) => {
  const labels: Record<
    Announcement["status"],
    string
  > = {
    DRAFT: "Draft",
    SCHEDULED: "Scheduled",
    PUBLISHED: "Published",
  };

  return labels[status];
};

const getStatusClasses = (
  status: Announcement["status"],
) => {
  const classes: Record<
    Announcement["status"],
    string
  > = {
    DRAFT:
      "border-slate-200 bg-slate-50 text-slate-600",
    SCHEDULED:
      "border-blue-200 bg-blue-50 text-blue-700",
    PUBLISHED:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
  };

  return classes[status];
};

const formatDateTime = (
  date?: string,
) => {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
};

export default function AnnouncementModal({
  open,
  announcement,
  scheduledAt,
  saving,
  error,
  onClose,
  onSchedule,
  onCancelSchedule,
  onScheduledAtChange,
}: AnnouncementModalProps) {
  if (!open || !announcement) {
    return null;
  }

  const createdBy =
    typeof announcement.createdBy ===
    "object"
      ? announcement.createdBy
      : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 px-4 py-6"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900">
              Announcement
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              View announcement details and
              manage its publication status.
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

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
              <FileText size={17} />
            </div>

            <div className="min-w-0">
              <h3 className="text-base font-semibold text-slate-900">
                {announcement.title}
              </h3>

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${getStatusClasses(
                    announcement.status,
                  )}`}
                >
                  {formatStatus(
                    announcement.status,
                  )}
                </span>

                {createdBy?.fullName && (
                  <span className="text-xs text-slate-500">
                    By {createdBy.fullName}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-md border border-slate-200 bg-white px-3 py-3">
            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {announcement.content}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Created
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {formatDateTime(
                  announcement.createdAt,
                )}
              </p>
            </div>

            {announcement.status ===
              "SCHEDULED" && (
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Scheduled For
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {formatDateTime(
                    announcement.scheduledAt,
                  )}
                </p>
              </div>
            )}

            {announcement.status ===
              "PUBLISHED" && (
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Published
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {formatDateTime(
                    announcement.publishedAt,
                  )}
                </p>
              </div>
            )}
          </div>

          {announcement.status ===
            "DRAFT" && (
            <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-2">
                <CalendarClock
                  size={16}
                  className="text-blue-600"
                />

                <p className="text-sm font-medium text-slate-800">
                  Schedule announcement
                </p>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Choose when this announcement
                should be published.
              </p>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label
                    htmlFor="scheduled-at"
                    className="mb-1 block text-xs font-medium text-slate-600"
                  >
                    Date and time
                  </label>

                  <input
                    id="scheduled-at"
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(event) =>
                      onScheduledAtChange(
                        event.target.value,
                      )
                    }
                    disabled={saving}
                    className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50"
                  />
                </div>

                <button
                  type="button"
                  onClick={onSchedule}
                  disabled={
                    saving || !scheduledAt
                  }
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CalendarClock
                    size={14}
                  />

                  {saving
                    ? "Saving..."
                    : "Schedule"}
                </button>
              </div>
            </div>
          )}

          {announcement.status ===
            "SCHEDULED" && (
            <div className="mt-5 flex items-center justify-between gap-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-3">
              <div className="flex items-start gap-2">
                <CalendarClock
                  size={16}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Scheduled announcement
                  </p>

                  <p className="mt-0.5 text-xs text-blue-700">
                    You can cancel the schedule
                    and return it to draft.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onCancelSchedule}
                disabled={saving}
                className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-blue-200 bg-white px-3 text-xs font-medium text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel Schedule
              </button>
            </div>
          )}

          {announcement.status ===
            "PUBLISHED" && (
            <div className="mt-5 flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-3">
              <CheckCircle2
                size={16}
                className="shrink-0 text-emerald-600"
              />

              <p className="text-sm text-emerald-700">
                This announcement has been
                published and cannot be edited.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end border-t border-slate-200 bg-slate-50 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-8 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}