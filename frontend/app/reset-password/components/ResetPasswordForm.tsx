"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AuthShell from "@/components/AuthShell";
import api from "@/lib/api";

interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);

    const password = String(formData.get("password") || "");

    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (!token) {
      setError("This password reset link is invalid or incomplete.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post<ResetPasswordResponse>(
        "/auth/reset-password",
        {
          token,
          newPassword: password,
        },
      );

      const data = response.data;

      if (!data.success) {
        setError(data.message || "Unable to reset your password.");
        return;
      }

      setSuccess(
        data.message || "Password reset successfully. You can now sign in.",
      );

      window.setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        setError(
          axiosError.response?.data?.message ||
            "Unable to reset your password. The link may have expired.",
        );
      } else {
        setError("Unable to connect to the server. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Create a new password for your CampusHR account."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-[11px] font-semibold text-slate-700"
          >
            New password
          </label>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Enter your new password"
              required
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pr-10 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-slate-400 hover:text-slate-700"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-[11px] font-semibold text-slate-700"
          >
            Confirm new password
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm your new password"
              required
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pr-10 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((current) => !current)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-slate-400 hover:text-slate-700"
            >
              {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
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
          disabled={isLoading || !token}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Resetting password...
            </>
          ) : (
            <>
              Reset password
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
