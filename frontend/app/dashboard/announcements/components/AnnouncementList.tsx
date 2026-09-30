"use client";

import { Bell, CalendarDays, ChevronDown, Megaphone } from "lucide-react";
import { useState } from "react";

import type { Announcement } from "@/types";

interface AnnouncementListProps {
  announcements: Announcement[];
}

function formatDate(date?: string) {
  if (!date) return "Recently published";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function AnnouncementList({
  announcements,
}: AnnouncementListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    announcements[0]?._id ?? null,
  );

  if (announcements.length === 0) {
    return (
      <div className="border border-slate-200 bg-white px-5 py-12 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Megaphone className="h-5 w-5" />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-slate-900">
          No announcements
        </h3>

        <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
          Institutional announcements from Human Resources will appear here when
          they are published.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {announcements.map((announcement) => {
        const isExpanded = expandedId === announcement._id;

        return (
          <article
            key={announcement._id}
            className={`border bg-white transition ${
              isExpanded ? "border-blue-200" : "border-slate-200"
            }`}
          >
            <button
              type="button"
              onClick={() =>
                setExpandedId(isExpanded ? null : announcement._id)
              }
              className="flex w-full items-start gap-3 p-4 text-left transition hover:bg-slate-50"
              aria-expanded={isExpanded}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
                  isExpanded
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                {isExpanded ? (
                  <Bell className="h-4 w-4" />
                ) : (
                  <Megaphone className="h-4 w-4" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {announcement.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <CalendarDays className="h-3 w-3" />

                    <span>
                      {formatDate(
                        announcement.publishedAt ?? announcement.createdAt,
                      )}
                    </span>
                  </div>
                </div>

                {!isExpanded && (
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                    {announcement.content}
                  </p>
                )}
              </div>

              <ChevronDown
                className={`mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {isExpanded && (
              <div className="border-t border-slate-100 px-4 pb-4 pl-16">
                <div className="pt-3">
                  <p className="whitespace-pre-wrap text-xs leading-6 text-slate-600">
                    {announcement.content}
                  </p>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
