"use client";

import { BriefcaseBusiness, CalendarDays, Mail, Pencil } from "lucide-react";
import type { User } from "@/types";

interface ProfileHeaderProps {
  profile: User;
  yearsOfService: number;
  isEditing: boolean;
  onEdit: () => void;
}

export default function ProfileHeader({
  profile,
  yearsOfService,
  isEditing,
  onEdit,
}: ProfileHeaderProps) {
  const initials =
    profile.fullName
      ?.split(" ")
      .filter(Boolean)
      .map((name) => name.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  const employmentDate = profile.dateOfEmployment
    ? new Date(profile.dateOfEmployment).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not provided";

  return (
    <section className="overflow-hidden rounded-xl shadow-sm border border-slate-200 bg-white">
      {/* <div className="h-2 bg-blue-600" /> */}

      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            {profile.profilePhoto ? (
              <img
                src={profile.profilePhoto}
                alt={profile.fullName}
                className="h-20 w-20 shrink-0 rounded-xl object-cover ring-4 ring-blue-50"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-blue-900 text-xl font-semibold text-white ring-4 ring-blue-50">
                {initials}
              </div>
            )}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                  {profile.fullName}
                </h1>

                <span className="rounded-md bg-blue-50 px-2 py-1 text-[8px] font-semibold uppercase tracking-wide text-blue-700">
                  {profile.employmentStatus?.replace("_", " ") || "Active"}
                </span>
              </div>

              <p className="mt-1 text-sm font-medium text-blue-700">
                {profile.academicRank || "Academic Staff"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {profile.department || "Department not specified"}
                {profile.faculty ? ` · ${profile.faculty}` : ""}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onEdit}
            disabled={isEditing}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-blue-600 px-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Pencil className="h-3.5 w-3.5" />
            {isEditing ? "Editing Profile" : "Edit Profile"}
          </button>
        </div>

        <div className="mt-6 grid border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3 border-b border-slate-100 py-3 sm:border-b-0 sm:border-r sm:pr-4 lg:border-r">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-50 text-blue-600">
              <BriefcaseBusiness className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Staff ID
              </p>

              <p className="mt-0.5 truncate text-xs font-semibold text-slate-800">
                {profile.staffId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-b border-slate-100 py-3 sm:pl-4 lg:border-b-0 lg:border-r lg:pr-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-50 text-blue-600">
              <Mail className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Email
              </p>

              <p className="mt-0.5 truncate text-xs font-semibold text-slate-800">
                {profile.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-b border-slate-100 py-3 lg:border-b-0 lg:border-r lg:pl-4 lg:pr-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-50 text-blue-600">
              <CalendarDays className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Joined
              </p>

              <p className="mt-0.5 text-xs font-semibold text-slate-800">
                {employmentDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 py-3 lg:pl-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
              <span className="text-xs font-bold">Y</span>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Service
              </p>

              <p className="mt-0.5 text-xs font-semibold text-slate-800">
                {yearsOfService} {yearsOfService === 1 ? "year" : "years"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
