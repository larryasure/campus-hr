"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";

import type { Announcement } from "@/types";

interface AnnouncementFormProps {
  announcement: Announcement | null;
  saving: boolean;
  error: string;
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
}

export default function AnnouncementForm({
  announcement,
  saving,
  error,
  onSave,
  onCancel,
}: AnnouncementFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    setTitle(announcement?.title || "");
    setContent(announcement?.content || "");
  }, [announcement]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSave(title.trim(), content.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="announcement-title"
          className="mb-1 block text-xs font-medium text-slate-600"
        >
          Title
        </label>

        <input
          id="announcement-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={saving}
          placeholder="Enter announcement title"
          className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50"
        />
      </div>

      <div>
        <label
          htmlFor="announcement-content"
          className="mb-1 block text-xs font-medium text-slate-600"
        >
          Announcement
        </label>

        <textarea
          id="announcement-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          disabled={saving}
          rows={7}
          placeholder="Write the announcement..."
          className="w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm leading-5 text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50"
        />
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="h-8 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving || !title.trim() || !content.trim()}
          className="inline-flex h-8 items-center gap-1.5 rounded-md bg-blue-600 px-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={14} />

          {saving ? "Saving..." : announcement ? "Save Changes" : "Save Draft"}
        </button>
      </div>
    </form>
  );
}
