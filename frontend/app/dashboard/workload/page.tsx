"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Clock3, Loader2, BookOpen } from "lucide-react";

import api from "@/lib/api";
import type { Workload } from "@/types";

import WorkloadTable from "./components/WorkloadTable";

export default function WorkloadPage() {
  const [workload, setWorkload] = useState<Workload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWorkload = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/workload");

      setWorkload(response.data.data ?? []);
    } catch (err) {
      console.error("Failed to load workload:", err);

      setError(
        "We couldn't load your teaching workload. Please refresh and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkload();
  }, []);

  const totalHours = workload.reduce(
    (total, course) => total + course.weeklyTeachingHours,
    0,
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          Loading teaching workload...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      {/* Header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
          Teaching & Workload
        </p>

        <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
          Teaching Workload
        </h1>

        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          View your current teaching assignments, academic sessions, and weekly
          teaching hours.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

          <p className="text-xs leading-5 text-red-700">{error}</p>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 sm:max-w-md">
        <div className="border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Assigned Courses
              </p>

              <p className="mt-0.5 text-lg font-semibold text-slate-900">
                {workload.length}
              </p>
            </div>
          </div>
        </div>

        <div className="border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50">
              <Clock3 className="h-4 w-4 text-blue-600" />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Weekly Hours
              </p>

              <p className="mt-0.5 text-lg font-semibold text-slate-900">
                {totalHours}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Workload */}
      <section>
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Current Assignments
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Your institution-assigned teaching workload.
          </p>
        </div>

        <WorkloadTable workload={workload} />
      </section>
    </div>
  );
}
