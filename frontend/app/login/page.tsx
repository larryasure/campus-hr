"use client";

import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import AuthShell from "@/components/AuthShell";
import api from "@/lib/api";

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    staffId: string;
    fullName: string;
    email: string;
    role: "LECTURER" | "HR_ADMIN";
  };
}

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
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

    const formData = new FormData(event.currentTarget);

    const email = String(
      formData.get("email") || "",
    ).trim();

    const password = String(
      formData.get("password") || "",
    );

    if (!email || !password) {
      setError("Email and password are required.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post<LoginResponse>(
        "/auth/login",
        {
          email,
          password,
        },
      );

      const data = response.data;

      if (!data.success) {
        setError(
          data.message || "Unable to sign in.",
        );
        return;
      }

      localStorage.setItem(
        "campushr-auth",
        JSON.stringify({
          state: {
            token: data.token,
            user: data.user,
          },
        }),
      );

      setSuccess(
        data.message || "Login successful.",
      );

      setTimeout(() => {
        if (data.user.role === "HR_ADMIN") {
          router.push("/dashboard/admin");
        } else {
          router.push("/dashboard");
        }
      }, 1500);
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
            "Invalid email or password.",
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
      title="Welcome back"
      subtitle="Sign in to your CampusHR workspace."
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

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-[11px] font-semibold text-slate-700"
            >
              Password
            </label>
          </div>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              autoComplete="current-password"
              placeholder="Enter your password"
              required
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pr-10 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="button"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              onClick={() =>
                setShowPassword(
                  (current) => !current,
                )
              }
              className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-slate-400 transition hover:text-slate-700"
            >
              {showPassword ? (
                <EyeOff
                  size={15}
                  strokeWidth={1.8}
                />
              ) : (
                <Eye
                  size={15}
                  strokeWidth={1.8}
                />
              )}
            </button>
          </div>

          <div className="my-2 flex items-center justify-end">
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Forgot password?
            </Link>
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
          disabled={isLoading}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2
                size={14}
                className="animate-spin"
              />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-100" />

        <span className="text-[10px] font-medium text-slate-400">
          OR
        </span>

        <div className="h-px flex-1 bg-slate-100" />
      </div>

      <p className="text-center text-xs text-slate-500">
        Don&apos;t have a CampusHR account?{" "}
        <Link
          href="/register"
          className="font-semibold text-blue-600 transition hover:text-blue-700"
        >
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}