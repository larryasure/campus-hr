"use client";

import { ShieldCheck } from "lucide-react";

interface AdminHeaderProps {
  adminName: string;
}

export default function AdminHeader({
  adminName,
}: AdminHeaderProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
          HR Administration
        </p>

        <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          Welcome back, {adminName}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage lecturer records, HR requests and institutional communications.
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
        <ShieldCheck className="h-4 w-4 text-blue-600" />

        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
            Access
          </p>

          <p className="text-xs font-semibold text-slate-700">
            HR Administrator
          </p>
        </div>
      </div>
    </div>
  );
}