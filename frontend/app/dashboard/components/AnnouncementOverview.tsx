import { Megaphone } from "lucide-react";
import type { Announcement } from "@/types";

interface AnnouncementOverviewProps {
  announcements: Announcement[];
}

export default function AnnouncementOverview({
  announcements,
}: AnnouncementOverviewProps) {
  const recentAnnouncements = announcements.slice(0, 3);

  return (
    <section className="border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Announcements
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Recent notices from HR
          </p>
        </div>

        <Megaphone className="h-4 w-4 text-blue-600" />
      </div>

      {recentAnnouncements.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <Megaphone className="mx-auto h-5 w-5 text-slate-400" />

          <p className="mt-2 text-sm font-medium text-slate-700">
            No announcements
          </p>

          <p className="mt-1 text-xs text-slate-500">
            New HR announcements will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {recentAnnouncements.map((announcement) => (
            <article key={announcement._id} className="px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-medium text-slate-800">
                  {announcement.title}
                </h3>

                {announcement.publishedAt && (
                  <time
                    dateTime={announcement.publishedAt}
                    className="shrink-0 text-[11px] text-slate-400"
                  >
                    {new Date(announcement.publishedAt).toLocaleDateString()}
                  </time>
                )}
              </div>

              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                {announcement.content}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
