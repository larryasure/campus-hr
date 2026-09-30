"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, X } from "lucide-react";
import type { User } from "@/types";

interface ProfileFormProps {
  profile: User;
  onSave: (data: Partial<User>) => Promise<void>;
  onCancel: () => void;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  faculty: string;
  department: string;
  academicRank: string;
  dateOfEmployment: string;
}

export default function ProfileForm({
  profile,
  onSave,
  onCancel,
}: ProfileFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    faculty: "",
    department: "",
    academicRank: "",
    dateOfEmployment: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData({
      fullName: profile.fullName || "",
      email: profile.email || "",
      phone: profile.phone || "",
      faculty: profile.faculty || "",
      department: profile.department || "",
      academicRank: profile.academicRank || "",
      dateOfEmployment: profile.dateOfEmployment
        ? profile.dateOfEmployment.slice(0, 10)
        : "",
    });
  }, [profile]);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email address is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await onSave({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        faculty: formData.faculty.trim(),
        department: formData.department.trim(),
        academicRank: formData.academicRank.trim(),
        dateOfEmployment: formData.dateOfEmployment || undefined,
      });
    } catch (err) {
      console.error("Failed to update profile:", err);

      setError(
        "We couldn't update your profile. Please check your information and try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="border border-blue-100 bg-white">
      <div className="border-b border-slate-200 px-4 py-4 sm:px-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Edit profile</p>

            <p className="mt-1 text-xs text-slate-500">
              Keep your university employment information accurate and up to
              date.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            aria-label="Close profile editor"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
          <div className="sm:col-span-2">
            <label
              htmlFor="fullName"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Full name
            </label>

            <input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Enter your full name"
              disabled={saving}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(event) => updateField("email", event.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="name@university.edu"
              disabled={saving}
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Phone number
            </label>

            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="+234..."
              disabled={saving}
            />
          </div>

          <div>
            <label
              htmlFor="faculty"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Faculty
            </label>

            <input
              id="faculty"
              type="text"
              value={formData.faculty}
              onChange={(event) => updateField("faculty", event.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="e.g. Faculty of Science"
              disabled={saving}
            />
          </div>

          <div>
            <label
              htmlFor="department"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Department
            </label>

            <input
              id="department"
              type="text"
              value={formData.department}
              onChange={(event) =>
                updateField("department", event.target.value)
              }
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="e.g. Computer Science"
              disabled={saving}
            />
          </div>

          <div>
            <label
              htmlFor="academicRank"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Academic rank
            </label>

            <input
              id="academicRank"
              type="text"
              value={formData.academicRank}
              onChange={(event) =>
                updateField("academicRank", event.target.value)
              }
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="e.g. Lecturer II"
              disabled={saving}
            />
          </div>

          <div>
            <label
              htmlFor="dateOfEmployment"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Date of employment
            </label>

            <input
              id="dateOfEmployment"
              type="date"
              value={formData.dateOfEmployment}
              onChange={(event) =>
                updateField("dateOfEmployment", event.target.value)
              }
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              disabled={saving}
            />
          </div>
        </div>

        {error && (
          <div className="mx-4 mb-4 border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700 sm:mx-5">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50/50 px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="h-9 rounded-md border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-blue-600 px-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}

            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </section>
  );
}
