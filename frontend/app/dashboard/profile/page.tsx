"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import { getMyProfile, updateMyProfile } from "@/lib/lecturer";
import type { User } from "@/types";

import ProfileHeader from "./components/ProfileHeader";
import ProfileForm from "./components/ProfileForm";

export default function ProfilePage() {
  const [profile, setProfile] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const profileData = await getMyProfile();

        setProfile(profileData);
      } catch (err) {
        console.error("Failed to load profile:", err);

        setError(
          "We couldn't load your profile. Please refresh and try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async (data: Partial<User>) => {
    if (!profile) {
      return;
    }

    setSuccessMessage("");

    const updatedProfile = await updateMyProfile(data);

    setProfile(updatedProfile);
    setIsEditing(false);
    setSuccessMessage("Your profile has been updated successfully.");

    window.setTimeout(() => {
      setSuccessMessage("");
    }, 4000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSuccessMessage("");
  };

  const yearsOfService = (() => {
    if (!profile?.dateOfEmployment) {
      return 0;
    }

    const employmentDate = new Date(profile.dateOfEmployment);

    if (Number.isNaN(employmentDate.getTime())) {
      return 0;
    }

    const today = new Date();

    let years = today.getFullYear() - employmentDate.getFullYear();

    const monthDifference = today.getMonth() - employmentDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < employmentDate.getDate())
    ) {
      years--;
    }

    return Math.max(years, 0);
  })();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          Loading your profile...
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex max-w-md items-start gap-3 border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

          <div>
            <p className="text-sm font-semibold text-red-800">
              Unable to load profile
            </p>

            <p className="mt-1 text-xs leading-5 text-red-700">
              {error || "Your profile could not be loaded. Please try again."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      {/* Page heading */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
          My Profile
        </p>

        <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
          Professional Profile
        </h1>

        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          Manage the university information associated with your lecturer
          account.
        </p>
      </div>

      {/* Success message */}
      {successMessage && (
        <div
          role="status"
          className="flex items-center justify-between gap-4 border border-blue-200 bg-blue-50 px-4 py-3"
        >
          <p className="text-xs font-medium text-blue-800">{successMessage}</p>

          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            className="text-xs font-medium text-blue-600 hover:text-blue-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Profile identity */}
      <ProfileHeader
        profile={profile}
        yearsOfService={yearsOfService}
        isEditing={isEditing}
        onEdit={() => {
          setSuccessMessage("");
          setIsEditing(true);
        }}
      />

      {/* Profile editor */}
      {isEditing && (
        <ProfileForm
          profile={profile}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {/* Profile information */}
      {!isEditing && (
        <div className="grid gap-5 lg:grid-cols-2">
          <section className="border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-900">
                Professional Information
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Your current academic appointment.
              </p>
            </div>

            <div className="grid sm:grid-cols-2">
              <div className="border-b border-slate-100 p-4 sm:border-r">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Academic Rank
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {profile.academicRank || "Not specified"}
                </p>
              </div>

              <div className="border-b border-slate-100 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Faculty
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {profile.faculty || "Not specified"}
                </p>
              </div>

              <div className="p-4 sm:border-r sm:border-slate-100">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Department
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {profile.department || "Not specified"}
                </p>
              </div>

              <div className="p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Staff ID
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {profile.staffId}
                </p>
              </div>
            </div>
          </section>

          <section className="border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-900">
                Contact Information
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Your primary contact details.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Email Address
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {profile.email}
                </p>
              </div>

              <div className="p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Phone Number
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {profile.phone || "Not provided"}
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
