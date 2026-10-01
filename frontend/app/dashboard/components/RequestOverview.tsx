import { FileText } from "lucide-react";

import type { HRRequest } from "@/types";

interface RequestOverviewProps {
  requests: HRRequest[];
}

const statusStyles: Record<HRRequest["status"], string> = {
  PENDING: "bg-amber-50 text-amber-700",
  UNDER_REVIEW: "bg-blue-50 text-blue-700",
  APPROVED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-red-50 text-red-700",
};

const statusLabels: Record<HRRequest["status"], string> = {
  PENDING: "Pending",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export default function RequestOverview({ requests }: RequestOverviewProps) {
  const recentRequests = requests.slice(0, 5);

  return (
    <section className="min-w-0 max-w-full overflow-hidden border border-slate-200 bg-white">
      <div className="flex min-w-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-slate-900">HR Requests</h2>

          <p className="mt-0.5 wrap-break-word text-xs text-slate-500">
            Recent requests and their current status
          </p>
        </div>

        <FileText className="h-4 w-4 shrink-0 text-blue-600" />
      </div>

      {recentRequests.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <FileText className="mx-auto h-5 w-5 text-slate-400" />

          <p className="mt-2 text-sm font-medium text-slate-700">
            No HR requests
          </p>

          <p className="mt-1 wrap-break-word text-xs text-slate-500">
            Requests you submit will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {recentRequests.map((request) => (
            <div
              key={request._id}
              className="flex min-w-0 flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <div className="min-w-0 flex-1">
                <p className="wrap-break-word text-sm font-medium leading-5 text-slate-800">
                  {request.subject}
                </p>

                <p className="mt-0.5 wrap-break-word text-xs text-slate-500">
                  {request.type.replace(/_/g, " ")}
                </p>
              </div>

              <span
                className={`w-fit max-w-full shrink-0 rounded-md px-2 py-1 text-[11px] font-medium ${
                  statusStyles[request.status]
                }`}
              >
                {statusLabels[request.status]}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
