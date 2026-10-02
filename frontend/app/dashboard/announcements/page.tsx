"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Bell, Loader2, Megaphone } from "lucide-react";

import api from "@/lib/api";
import type { Announcement } from "@/types";

import Pagination from "@/components/Pagination";
import AnnouncementList from "./components/AnnouncementList";

interface AnnouncementPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

const PAGE_SIZE = 10;

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const [pagination, setPagination] = useState<AnnouncementPagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: PAGE_SIZE,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnnouncements = async (page: number) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/announcements", {
        params: {
          page,
          limit: PAGE_SIZE,
        },
      });

      setAnnouncements(response.data.data ?? []);

      setPagination(
        response.data.pagination ?? {
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
          pageSize: PAGE_SIZE,
        },
      );
    } catch (err) {
      console.error("Failed to load announcements:", err);

      setError("We couldn't load announcements. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements(pagination.currentPage);
  }, [pagination.currentPage]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          Loading announcements...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5">
      <div>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
          Announcements
        </h1>

        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          Stay informed about institutional notices, HR deadlines, reminders,
          and staff updates.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

          <p className="text-xs leading-5 text-red-700">{error}</p>
        </div>
      )}

      <div className="border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50">
            <Bell className="h-4 w-4 text-blue-600" />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Published Announcements
            </p>

            <p className="mt-0.5 text-lg font-semibold text-slate-900">
              {pagination.totalItems}
            </p>
          </div>

          <div className="ml-auto hidden items-center gap-1.5 text-[11px] text-slate-400 sm:flex">
            <Megaphone className="h-3.5 w-3.5" />
            <span>Latest staff information</span>
          </div>
        </div>
      </div>

      <section>
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Latest Announcements
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Official announcements published by Human Resources.
          </p>
        </div>

        <AnnouncementList announcements={announcements} />

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          onPageChange={(page) => {
            setPagination((current) => ({
              ...current,
              currentPage: page,
            }));
          }}
        />
      </section>
    </div>
  );
}
