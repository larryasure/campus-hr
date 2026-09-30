"use client";

import { useState } from "react";
import { AlertCircle, Send, X } from "lucide-react";

import type { HRRequestType } from "@/types";

export interface HRRequestFormData {
  type: HRRequestType;
  subject: string;
  description: string;
}

interface RequestFormProps {
  onSave: (data: HRRequestFormData) => Promise<void>;
  onCancel: () => void;
}

const requestTypes: {
  value: HRRequestType;
  label: string;
}[] = [
  {
    value: "LEAVE",
    label: "Leave",
  },
  {
    value: "LETTER_OF_INTRODUCTION",
    label: "Letter of Introduction",
  },
  {
    value: "EMPLOYMENT_REFERENCE",
    label: "Employment / Reference Letter",
  },
  {
    value: "SABBATICAL",
    label: "Sabbatical",
  },
  {
    value: "OTHER",
    label: "Other HR Request",
  },
];

export default function RequestForm({ onSave, onCancel }: RequestFormProps) {
  const [type, setType] = useState<HRRequestType>("LEAVE");

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    const trimmedSubject = subject.trim();
    const trimmedDescription = description.trim();

    if (!trimmedSubject) {
      setError("Please enter a subject for your request.");
      return;
    }

    if (!trimmedDescription) {
      setError("Please provide details about your request.");
      return;
    }

    if (trimmedDescription.length < 10) {
      setError("Please provide a little more detail about your request.");
      return;
    }

    try {
      setSaving(true);

      await onSave({
        type,
        subject: trimmedSubject,
        description: trimmedDescription,
      });
    } catch (err) {
      console.error("Failed to submit HR request:", err);

      setError("We couldn't submit your request. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="border border-blue-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50/70 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-slate-900">
              Submit HR Request
            </p>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Send a request to the Human Resources team.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-white hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close request form"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 border border-red-200 bg-red-50 px-3 py-2.5"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

            <p className="text-xs leading-5 text-red-700">{error}</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="request-type"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Request Type
            </label>

            <select
              id="request-type"
              value={type}
              onChange={(event) => setType(event.target.value as HRRequestType)}
              disabled={saving}
              className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            >
              {requestTypes.map((requestType) => (
                <option key={requestType.value} value={requestType.value}>
                  {requestType.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="request-subject"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Subject
            </label>

            <input
              id="request-subject"
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="e.g. Annual leave request"
              disabled={saving}
              maxLength={150}
              className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="request-description"
            className="mb-1.5 block text-xs font-medium text-slate-700"
          >
            Request Details
          </label>

          <textarea
            id="request-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Provide the relevant details for your request..."
            disabled={saving}
            rows={5}
            maxLength={2000}
            className="w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2.5 text-xs leading-5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
          />

          <div className="mt-1 flex justify-end">
            <span className="text-[10px] text-slate-400">
              {description.length}/2000
            </span>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="h-9 rounded-md border border-slate-300 px-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                Submit Request
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
