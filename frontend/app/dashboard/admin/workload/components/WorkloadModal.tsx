"use client";

import { Clock3, Pencil, Trash2, X } from "lucide-react";

import type { User } from "@/types";

import type { AdminWorkload, WorkloadFormData } from "@/lib/adminWorkload";

type UserWithMongoId = User & {
  _id?: string;
};

interface WorkloadModalProps {
  open: boolean;
  workload: AdminWorkload | null;
  lecturers: User[];
  lecturersLoading: boolean;

  form: WorkloadFormData;

  saving: boolean;
  deleting: boolean;
  error: string;
  showDelete: boolean;

  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
  onShowDelete: () => void;
  onHideDelete: () => void;

  onLecturerChange: (lecturerId: string) => void;

  onFormChange: (updates: Partial<WorkloadFormData>) => void;
}

export default function WorkloadModal({
  open,
  workload,
  lecturers,
  lecturersLoading,
  form,
  saving,
  deleting,
  error,
  showDelete,
  onClose,
  onSave,
  onDelete,
  onShowDelete,
  onHideDelete,
  onLecturerChange,
  onFormChange,
}: WorkloadModalProps) {
  if (!open) {
    return null;
  }

  const selectedLecturer = lecturers.find((lecturer) => {
    const lecturerId = (lecturer as UserWithMongoId)._id || lecturer.id;

    return lecturerId === form.lecturer;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 px-4 py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              {workload ? "Edit Workload" : "Add Workload"}
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              {workload
                ? "Update this workload assignment."
                : "Create a new lecturer workload assignment."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving || deleting}
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Lecturer
              </label>

              <select
                value={form.lecturer}
                onChange={(event) => onLecturerChange(event.target.value)}
                disabled={saving || deleting || lecturersLoading}
                className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50"
              >
                <option value="">
                  {lecturersLoading
                    ? "Loading lecturers..."
                    : "Select lecturer"}
                </option>

                {lecturers.map((lecturer) => {
                  const lecturerId =
                    (lecturer as UserWithMongoId)._id || lecturer.id;

                  return (
                    <option key={lecturerId} value={lecturerId}>
                      {lecturer.fullName} — {lecturer.staffId}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Department
              </label>

              <input
                value={form.department}
                readOnly
                placeholder="Select a lecturer first"
                className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600 outline-none"
              />

              <p className="mt-1 text-[11px] text-slate-400">
                Automatically taken from the selected lecturer.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Course Code
              </label>

              <input
                type="text"
                value={form.courseCode}
                onChange={(event) =>
                  onFormChange({
                    courseCode: event.target.value,
                  })
                }
                placeholder="e.g. CSC301"
                disabled={saving || deleting}
                className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 uppercase"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Course Title
              </label>

              <input
                type="text"
                value={form.courseTitle}
                onChange={(event) =>
                  onFormChange({
                    courseTitle: event.target.value,
                  })
                }
                placeholder="Course title"
                disabled={saving || deleting}
                className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Semester
              </label>

              <select
                value={form.semester}
                onChange={(event) =>
                  onFormChange({
                    semester: event.target.value as "FIRST" | "SECOND",
                  })
                }
                disabled={saving || deleting}
                className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50"
              >
                <option value="FIRST">First Semester</option>

                <option value="SECOND">Second Semester</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Academic Session
              </label>

              <input
                type="text"
                value={form.academicSession}
                onChange={(event) =>
                  onFormChange({
                    academicSession: event.target.value,
                  })
                }
                placeholder="e.g. 2025/2026"
                disabled={saving || deleting}
                className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Weekly Teaching Hours
              </label>

              <div className="relative">
                <Clock3
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.weeklyTeachingHours}
                  onChange={(event) =>
                    onFormChange({
                      weeklyTeachingHours: Number(event.target.value),
                    })
                  }
                  disabled={saving || deleting}
                  className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50"
                />
              </div>
            </div>
          </div>

          {selectedLecturer && (
            <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5">
              <p className="text-xs font-medium text-slate-700">
                Selected Lecturer
              </p>

              <p className="mt-0.5 text-sm text-slate-800">
                {selectedLecturer.fullName}
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                {selectedLecturer.staffId}

                {selectedLecturer.academicRank
                  ? ` • ${selectedLecturer.academicRank}`
                  : ""}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3">
          <div>
            {workload && (
              <button
                type="button"
                onClick={onShowDelete}
                disabled={saving || deleting}
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-red-200 px-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 size={14} />
                Delete
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving || deleting}
              className="h-8 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Close
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={saving || deleting}
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-blue-600 px-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Pencil size={14} />

              {saving
                ? "Saving..."
                : workload
                  ? "Save Changes"
                  : "Create Workload"}
            </button>
          </div>
        </div>

        {showDelete && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/25 px-4">
            <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-5 shadow-xl">
              <h3 className="text-base font-semibold text-slate-900">
                Delete workload?
              </h3>

              <p className="mt-1.5 text-sm leading-5 text-slate-500">
                This will permanently remove the workload record for{" "}
                <span className="font-medium text-slate-700">
                  {workload?.courseCode}
                </span>
                .
              </p>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onHideDelete}
                  disabled={deleting}
                  className="h-8 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={onDelete}
                  disabled={deleting}
                  className="h-8 rounded-md bg-red-600 px-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                  {deleting ? "Deleting..." : "Delete Workload"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
