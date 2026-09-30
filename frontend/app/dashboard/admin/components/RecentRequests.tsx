"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";

import type { HRRequest } from "@/types";

interface RecentRequestsProps {
  requests: HRRequest[];
}

const statusStyles: Record<HRRequest["status"], string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  UNDER_REVIEW: "border-blue-200 bg-blue-50 text-blue-700",
  APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  REJECTED: "border-red-200 bg-red-50 text-red-700",
};

const formatStatus = (status: HRRequest["status"]) =>
  status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function RecentRequests({ requests }: RecentRequestsProps) {
  const recentRequests = requests.slice(0, 5);

  return (
    <section className="border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Recent HR Requests
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Latest requests requiring HR attention.
          </p>
        </div>

        <Link
          href="/dashboard/admin/requests"
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {recentRequests.length === 0 ? (
        <div className="flex items-center gap-3 px-4 py-8">
          <div className="flex h-8 w-8 items-center justify-center bg-slate-100">
            <ClipboardList className="h-4 w-4 text-slate-500" />
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-700">
              No HR requests yet
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              New lecturer requests will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Lecturer
                </th>

                <th className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Request
                </th>

                <th className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Date
                </th>

                <th className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {recentRequests.map((request) => {
                const lecturer =
                  typeof request.user === "string" ? null : request.user;

                return (
                  <tr
                    key={request._id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-slate-800">
                        {lecturer?.fullName || "Lecturer"}
                      </p>

                      {lecturer?.staffId && (
                        <p className="mt-0.5 text-[10px] text-slate-400">
                          {lecturer.staffId}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-slate-700">
                        {request.subject}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {request.type.replace(/_/g, " ")}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-xs text-slate-500">
                      {formatDate(request.createdAt)}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex border px-2 py-1 text-[10px] font-semibold ${statusStyles[request.status]}`}
                      >
                        {formatStatus(request.status)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
