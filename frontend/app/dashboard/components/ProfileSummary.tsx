import { BriefcaseBusiness, Mail, UserRound } from "lucide-react";
import Image from "next/image";

import type { User } from "@/types";

interface ProfileSummaryProps {
  profile: User;
  yearsOfService: number;
}

export default function ProfileSummary({
  profile,
  yearsOfService,
}: ProfileSummaryProps) {
  const initials = profile.fullName
    .split(" ")
    .map((name) => name[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <section className="min-w-0 max-w-full overflow-hidden border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-900">
          Profile Summary
        </h2>

        <p className="mt-0.5 wrap-break-word text-xs text-slate-500">
          Your current employment information
        </p>
      </div>

      <div className="min-w-0 p-4">
        <div className="flex min-w-0 items-center gap-3">
          {profile.profilePhoto ? (
            <Image
              src={profile.profilePhoto}
              alt={profile.fullName}
              width={44}
              height={44}
              className="h-11 w-11 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
              {initials}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              {profile.fullName}
            </p>

            <p className="truncate text-xs text-slate-500">
              {profile.academicRank || "Academic Staff"}
            </p>
          </div>
        </div>

        <div className="mt-4 min-w-0 space-y-3">
          <div className="flex min-w-0 items-start gap-3">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Email
              </p>

              <p className="break-all text-xs text-slate-700">
                {profile.email}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-start gap-3">
            <BriefcaseBusiness className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Department
              </p>

              <p className="wrap-break-word text-xs leading-5 text-slate-700">
                {profile.department || "Not specified"}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-start gap-3">
            <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Years of Service
              </p>

              <p className="text-xs font-medium text-slate-700">
                {yearsOfService} {yearsOfService === 1 ? "year" : "years"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
