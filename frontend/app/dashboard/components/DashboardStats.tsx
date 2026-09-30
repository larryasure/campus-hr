import {
  BookOpen,
  Clock3,
  FileCheck2,
  FileText,
} from "lucide-react";

interface DashboardStatsProps {
  totalCourses: number;
  totalTeachingHours: number;
  pendingRequests: number;
  approvedRequests: number;
}

const stats = [
  {
    key: "courses",
    label: "Assigned Courses",
    icon: BookOpen,
  },
  {
    key: "hours",
    label: "Teaching Hours",
    icon: Clock3,
  },
  {
    key: "pending",
    label: "Pending Requests",
    icon: FileText,
  },
  {
    key: "approved",
    label: "Approved Requests",
    icon: FileCheck2,
  },
];

export default function DashboardStats({
  totalCourses,
  totalTeachingHours,
  pendingRequests,
  approvedRequests,
}: DashboardStatsProps) {
  const values: Record<string, number> = {
    courses: totalCourses,
    hours: totalTeachingHours,
    pending: pendingRequests,
    approved: approvedRequests,
  };

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.key}
            className="border border-slate-200 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  {stat.label}
                </p>

                <p className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                  {values[stat.key]}
                </p>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                <Icon className="h-4 w-4" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}