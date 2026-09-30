"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";

import AuthShell from "@/components/AuthShell";
import api from "@/lib/api";

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setIsLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const email = String(
      formData.get("email") || "",
    )
      .trim()
      .toLowerCase();

    if (!email) {
      setError("Please enter your email address.");
      setIsLoading(false);
      return;
    }

    try {
      const response =
        await api.post<ForgotPasswordResponse>(
          "/auth/forgot-password",
          {
            email,
          },
        );

      const data = response.data;

      if (!data.success) {
        setError(
          data.message ||
            "Unable to request a password reset.",
        );
        return;
      }

      setSuccess(
        data.message ||
          "Password reset link sent successfully. Please check your email.",
      );

      form.reset();
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error
      ) {
        const axiosError = error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        setError(
          axiosError.response?.data?.message ||
            "Unable to request a password reset. Please try again.",
        );
      } else {
        setError(
          "Unable to connect to the server. Please try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter your email and we'll help you reset your password."
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-[11px] font-semibold text-slate-700"
          >
            Email address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@university.edu"
            required
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-600"
          >
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2
                size={14}
                className="animate-spin"
              />
              Sending reset link...
            </>
          ) : (
            <>
              Send reset link
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      <div className="mt-5 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 transition hover:text-blue-700"
        >
          <ArrowLeft size={13} />
          Back to sign in
        </Link>
      </div>
    </AuthShell>
  );
}