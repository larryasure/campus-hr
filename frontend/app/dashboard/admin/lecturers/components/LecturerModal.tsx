"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";

import type { User } from "@/types";

import { createLecturer, updateLecturer, deleteLecturer } from "@/lib/admin";

interface LecturerModalProps {
  lecturer: User | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

type LecturerWithMongoId = User & {
  _id?: string;
};

interface FormData {
  staffId: string;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  faculty: string;
  department: string;
  academicRank: string;
  dateOfEmployment: string;
  employmentStatus: string;
}

const emptyForm: FormData = {
  staffId: "",
  fullName: "",
  email: "",
  password: "",
  phone: "",
  faculty: "",
  department: "",
  academicRank: "",
  dateOfEmployment: "",
  employmentStatus: "ACTIVE",
};

export default function LecturerModal({
  lecturer,
  open,
  onClose,
  onSaved,
}: LecturerModalProps) {
  const isCreate = lecturer === null;

  const [editing, setEditing] = useState(isCreate);
  const [form, setForm] = useState<FormData>(emptyForm);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setError("");
    setShowDelete(false);

    if (lecturer) {
      setEditing(false);

      setForm({
        staffId: lecturer.staffId || "",
        fullName: lecturer.fullName || "",
        email: lecturer.email || "",
        password: "",
        phone: lecturer.phone || "",
        faculty: lecturer.faculty || "",
        department: lecturer.department || "",
        academicRank: lecturer.academicRank || "",
        dateOfEmployment: lecturer.dateOfEmployment
          ? lecturer.dateOfEmployment.substring(0, 10)
          : "",
        employmentStatus: lecturer.employmentStatus || "ACTIVE",
      });
    } else {
      setEditing(true);
      setForm(emptyForm);
    }
  }, [open, lecturer]);

  if (!open) {
    return null;
  }

  const setField = (field: keyof FormData, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setError("");

    if (!form.staffId.trim()) {
      setError("Staff ID is required.");
      return;
    }

    if (!form.fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (isCreate && !form.password.trim()) {
      setError("Password is required.");
      return;
    }

    try {
      setSaving(true);

      if (lecturer) {
        const lecturerWithMongoId = lecturer as LecturerWithMongoId;

        const lecturerId = lecturer.id || lecturerWithMongoId._id;

        if (!lecturerId) {
          setError("Lecturer ID is missing. Please refresh the page.");
          return;
        }

        await updateLecturer(lecturerId, {
          staffId: form.staffId.trim(),
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          faculty: form.faculty.trim(),
          department: form.department.trim(),
          academicRank: form.academicRank.trim(),
          dateOfEmployment: form.dateOfEmployment || undefined,
          employmentStatus: form.employmentStatus,
          ...(form.password.trim() ? { password: form.password } : {}),
        });
      } else {
        await createLecturer({
          staffId: form.staffId.trim(),
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          password: form.password,
          phone: form.phone.trim(),
          faculty: form.faculty.trim(),
          department: form.department.trim(),
          academicRank: form.academicRank.trim(),
          dateOfEmployment: form.dateOfEmployment || undefined,
          employmentStatus: form.employmentStatus,
        });
      }

      await onSaved();
      onClose();
    } catch (error: any) {
      console.error("Save lecturer error:", error);

      setError(error?.response?.data?.message || "Failed to save lecturer.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!lecturer) {
      return;
    }

    const lecturerWithMongoId = lecturer as LecturerWithMongoId;

    const lecturerId = lecturer.id || lecturerWithMongoId._id;

    if (!lecturerId) {
      setError("Lecturer ID is missing. Please refresh the page.");
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteLecturer(lecturerId);

      await onSaved();
      onClose();
    } catch (error: any) {
      console.error("Delete lecturer error:", error);

      setError(error?.response?.data?.message || "Failed to delete lecturer.");
    } finally {
      setDeleting(false);
      setShowDelete(false);
    }
  };

  const inputClass =
    "h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

  const labelClass = "mb-1 block text-[11px] font-medium text-slate-600";

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
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              {isCreate
                ? "Add Lecturer"
                : editing
                  ? "Edit Lecturer"
                  : "Lecturer Details"}
            </h2>

            <p className="mt-0.5 text-[11px] text-slate-500">
              {isCreate
                ? "Create a new lecturer account."
                : editing
                  ? "Update lecturer information."
                  : "View lecturer information."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Staff ID</label>

              <input
                className={inputClass}
                value={form.staffId}
                disabled={!editing}
                onChange={(e) => setField("staffId", e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Full Name</label>

              <input
                className={inputClass}
                value={form.fullName}
                disabled={!editing}
                onChange={(e) => setField("fullName", e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Email</label>

              <input
                type="email"
                className={inputClass}
                value={form.email}
                disabled={!editing}
                onChange={(e) => setField("email", e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Phone</label>

              <input
                className={inputClass}
                value={form.phone}
                disabled={!editing}
                onChange={(e) => setField("phone", e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Faculty</label>

              <input
                className={inputClass}
                value={form.faculty}
                disabled={!editing}
                onChange={(e) => setField("faculty", e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Department</label>

              <input
                className={inputClass}
                value={form.department}
                disabled={!editing}
                onChange={(e) => setField("department", e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Academic Rank</label>

              <input
                className={inputClass}
                value={form.academicRank}
                disabled={!editing}
                onChange={(e) => setField("academicRank", e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Employment Status</label>

              <select
                className={inputClass}
                value={form.employmentStatus}
                disabled={!editing}
                onChange={(e) => setField("employmentStatus", e.target.value)}
              >
                <option value="ACTIVE">Active</option>
                <option value="ON_LEAVE">On Leave</option>
                <option value="SABBATICAL">Sabbatical</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Date of Employment</label>

              <input
                type="date"
                className={inputClass}
                value={form.dateOfEmployment}
                disabled={!editing}
                onChange={(e) => setField("dateOfEmployment", e.target.value)}
              />
            </div>

            {editing && (
              <div>
                <label className={labelClass}>
                  {isCreate ? "Password" : "New Password"}
                </label>

                <input
                  type="password"
                  className={inputClass}
                  value={form.password}
                  placeholder={
                    isCreate ? "Required" : "Leave blank to keep current"
                  }
                  onChange={(e) => setField("password", e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3">
          <div>
            {!isCreate && editing && (
              <button
                type="button"
                onClick={() => setShowDelete(true)}
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-red-200 px-3 text-xs font-medium text-red-600 transition hover:bg-red-50"
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
              className="h-8 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Close
            </button>

            {!isCreate && !editing ? (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-blue-600 px-3 text-xs font-medium text-white transition hover:bg-blue-700"
              >
                <Pencil size={13} />
                Edit
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="h-8 rounded-md bg-blue-600 px-3 text-xs font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : isCreate
                    ? "Create Lecturer"
                    : "Save Changes"}
              </button>
            )}
          </div>
        </div>

        {/* Delete confirmation */}
        {showDelete && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/25 px-4">
            <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-5 shadow-xl">
              <h3 className="text-sm font-semibold text-slate-900">
                Delete lecturer?
              </h3>

              <p className="mt-1.5 text-xs leading-5 text-slate-500">
                This will permanently remove{" "}
                <span className="font-medium text-slate-700">
                  {lecturer?.fullName}
                </span>{" "}
                from the lecturer records.
              </p>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDelete(false)}
                  disabled={deleting}
                  className="h-8 rounded-md border border-slate-200 px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="h-8 rounded-md bg-red-600 px-3 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                  {deleting ? "Deleting..." : "Delete Lecturer"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
