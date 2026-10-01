"use client";

import {
  CalendarClock,
  Eye,
  FileText,
  Pencil,
  Send,
  Trash2,
} from "lucide-react";

import type { Announcement } from "@/types";

interface AnnouncementTableProps {
  announcements: Announcement[];
  loading: boolean;
  onView: (announcement: Announcement) => void;
  onEdit: (announcement: Announcement) => void;
  onSchedule: (announcement: Announcement) => void;
  onPublish: (announcement: Announcement) => void;
  onDelete: (announcement: Announcement) => void;
}

const formatStatus = (status: Announcement["status"]) => {
  const labels: Record<Announcement["status"], string> = {
    DRAFT: "Draft",
    SCHEDULED: "Scheduled",
    PUBLISHED: "Published",
  };

  return labels[status];
};

const getStatusClasses = (status: Announcement["status"]) => {
  const classes: Record<Announcement["status"], string> = {
    DRAFT: "border-slate-200 bg-slate-50 text-slate-600",
    SCHEDULED: "border-blue-200 bg-blue-50 text-blue-700",
    PUBLISHED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };

  return classes[status];
};

const formatDate = (date?: string) => {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getDateLabel = (announcement: Announcement) => {
  if (announcement.status === "PUBLISHED" && announcement.publishedAt) {
    return formatDate(announcement.publishedAt);
  }

  if (announcement.status === "SCHEDULED" && announcement.scheduledAt) {
    return formatDate(announcement.scheduledAt);
  }

  return formatDate(announcement.createdAt);
};

export default function AnnouncementTable({
  announcements,
  loading,
  onView,
  onEdit,
  onSchedule,
  onPublish,
  onDelete,
}: AnnouncementTableProps) {
  if (loading) {
    return (
      <div className="px-4 py-10 text-center">
        <p className="text-sm text-slate-500">Loading announcements...</p>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="px-4 py-10 text-center">
        <FileText size={22} className="mx-auto mb-2 text-slate-300" />

        <p className="text-sm font-medium text-slate-700">
          No announcements found
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Create an announcement to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[760px] text-left">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            <th className="w-[30%] px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Announcement
            </th>

            <th className="w-[16%] px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Status
            </th>

            <th className="w-[18%] px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Date
            </th>

            <th className="w-[20%] px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Created By
            </th>

            <th className="w-[16%] px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {announcements.map((announcement) => {
            const createdBy =
              typeof announcement.createdBy === "object"
                ? announcement.createdBy
                : undefined;

            return (
              <tr key={announcement._id} className="hover:bg-slate-50">
                <td className="max-w-0 px-3 py-3">
                  <div className="min-w-0">
                    <p
                      className="truncate text-sm font-medium text-slate-800"
                      title={announcement.title}
                    >
                      {announcement.title}
                    </p>

                    <p
                      className="mt-0.5 truncate text-xs text-slate-500"
                      title={announcement.content}
                    >
                      {announcement.content}
                    </p>
                  </div>
                </td>

                <td className="px-3 py-3">
                  <span
                    className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${getStatusClasses(
                      announcement.status,
                    )}`}
                  >
                    {formatStatus(announcement.status)}
                  </span>
                </td>

                <td className="px-3 py-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    {announcement.status === "SCHEDULED" && (
                      <CalendarClock size={14} />
                    )}

                    {getDateLabel(announcement)}
                  </div>
                </td>

                <td className="px-3 py-3">
                  <p className="truncate text-sm text-slate-600">
                    {createdBy?.fullName || "—"}
                  </p>
                </td>

                <td className="px-3 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onView(announcement)}
                      title="View announcement"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-blue-600"
                    >
                      <Eye size={15} />
                    </button>

                    {announcement.status === "DRAFT" && (
                      <>
                        <button
                          type="button"
                          onClick={() => onEdit(announcement)}
                          title="Edit announcement"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-blue-600"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onSchedule(announcement)}
                          title="Schedule announcement"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-blue-600"
                        >
                          <CalendarClock size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onPublish(announcement)}
                          title="Publish announcement"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-emerald-200 text-emerald-600 transition hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <Send size={15} />
                        </button>
                      </>
                    )}

                    {announcement.status === "SCHEDULED" && (
                      <button
                        type="button"
                        onClick={() => onPublish(announcement)}
                        title="Publish now"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-emerald-200 text-emerald-600 transition hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <Send size={15} />
                      </button>
                    )}

                    {announcement.status !== "PUBLISHED" && (
                      <button
                        type="button"
                        onClick={() => onDelete(announcement)}
                        title="Delete announcement"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 text-red-500 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
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
