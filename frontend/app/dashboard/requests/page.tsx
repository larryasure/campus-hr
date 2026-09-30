"use client";

import { useEffect, useState } from "react";
import { AlertCircle, FileText, Loader2, Plus } from "lucide-react";

import api from "@/lib/api";
import type { HRRequest } from "@/types";

import RequestForm, { type HRRequestFormData } from "./components/RequestForm";

import RequestList from "./components/RequestList";

export default function RequestsPage() {
  const [requests, setRequests] = useState<HRRequest[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/requests");

      setRequests(response.data.data ?? []);
    } catch (err) {
      console.error("Failed to load HR requests:", err);

      setError(
        "We couldn't load your HR requests. Please refresh and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleOpenForm = () => {
    setSuccessMessage("");
    setError("");
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
  };

  const handleSave = async (data: HRRequestFormData) => {
    setError("");

    const response = await api.post("/requests", data);

    const newRequest = response.data.data;

    setRequests((current) => [newRequest, ...current]);

    setIsFormOpen(false);

    setSuccessMessage("Your HR request was submitted successfully.");
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          Loading HR requests...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
            HR Requests
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Submit requests to Human Resources and track their progress from
            submission to resolution.
          </p>
        </div>

        {!isFormOpen && (
          <button
            type="button"
            onClick={handleOpenForm}
            className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-lg bg-blue-600 px-2 text-xs font-semibold text-white transition hover:bg-blue-700 sm:self-auto "
          >
            <Plus className="h-3.5 w-3.5" />
            New HR Request
          </button>
        )}
      </div>

      {/* Feedback */}
      {successMessage && (
        <div
          role="status"
          className="border border-blue-200 bg-blue-50 px-4 py-3 text-xs font-medium text-blue-800"
        >
          {successMessage}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

          <p className="text-xs leading-5 text-red-700">{error}</p>
        </div>
      )}

      {/* Form */}
      {isFormOpen && (
        <RequestForm onSave={handleSave} onCancel={handleCancel} />
      )}

      {/* Request summary */}
      <div className="grid grid-cols-2 gap-3 sm:max-w-md">
        <div className="border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Total Requests
              </p>

              <p className="mt-0.5 text-lg font-semibold text-slate-900">
                {requests.length}
              </p>
            </div>
          </div>
        </div>

        <div className="border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-50">
              <FileText className="h-4 w-4 text-amber-600" />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Pending
              </p>

              <p className="mt-0.5 text-lg font-semibold text-slate-900">
                {
                  requests.filter((request) => request.status === "PENDING")
                    .length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Requests */}
      <section>
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Your Requests
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            View the status and HR feedback for your submitted requests.
          </p>
        </div>

        <RequestList requests={requests} />
      </section>
    </div>
  );
}
