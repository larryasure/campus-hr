"use client";

import { useCallback, useEffect, useState } from "react";
import { Megaphone, Plus, Send, Trash2 } from "lucide-react";

import PageHeader from "@/components/dashboard/PageHeader";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/Pagination";

import AnnouncementForm from "./components/AnnouncementForm";
import AnnouncementModal from "./components/AnnouncementModal";
import AnnouncementTable from "./components/AnnouncementTable";

import {
  cancelScheduledAnnouncement,
  createAnnouncement,
  deleteAnnouncement,
  getAdminAnnouncements,
  publishAnnouncement,
  scheduleAnnouncement,
  updateAnnouncement,
} from "@/lib/announcements";

import type { Announcement } from "@/types";

type ActionType = "PUBLISH" | "DELETE";

const PAGE_SIZE = 10;

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const [loading, setLoading] = useState(true);

  const [pageError, setPageError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: PAGE_SIZE,
  });

  const [formOpen, setFormOpen] = useState(false);

  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);

  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);

  const [scheduledAt, setScheduledAt] = useState("");

  const [saving, setSaving] = useState(false);

  const [modalError, setModalError] = useState("");

  const [actionType, setActionType] = useState<ActionType | null>(null);

  const [actionAnnouncement, setActionAnnouncement] =
    useState<Announcement | null>(null);

  const [actionLoading, setActionLoading] = useState(false);

  const [actionError, setActionError] = useState("");

  const loadAnnouncements = useCallback(async (page: number) => {
    try {
      setLoading(true);
      setPageError("");

      const response = await getAdminAnnouncements(page, PAGE_SIZE);

      setAnnouncements(response.announcements);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Failed to load announcements:", error);

      setPageError("Failed to load announcements. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnnouncements(currentPage);
  }, [currentPage, loadAnnouncements]);

  const handleOpenCreate = () => {
    setEditingAnnouncement(null);
    setModalError("");
    setFormOpen(true);
  };

  const handleOpenEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setModalError("");
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    if (saving) {
      return;
    }

    setFormOpen(false);
    setEditingAnnouncement(null);
    setModalError("");
  };

  const handleSaveAnnouncement = async (title: string, content: string) => {
    if (!title || !content) {
      setModalError("Title and content are required.");
      return;
    }

    try {
      setSaving(true);
      setModalError("");

      if (editingAnnouncement) {
        await updateAnnouncement(editingAnnouncement._id, {
          title,
          content,
        });
      } else {
        await createAnnouncement({
          title,
          content,
        });
      }

      setFormOpen(false);
      setEditingAnnouncement(null);

      await loadAnnouncements(currentPage);
    } catch (error) {
      console.error("Failed to save announcement:", error);

      setModalError("Failed to save the announcement. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleView = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setScheduledAt("");
    setModalError("");
  };

  const handleCloseAnnouncementModal = () => {
    if (saving) {
      return;
    }

    setSelectedAnnouncement(null);
    setScheduledAt("");
    setModalError("");
  };

  const handleSchedule = async () => {
    if (!selectedAnnouncement || !scheduledAt) {
      return;
    }

    try {
      setSaving(true);
      setModalError("");

      await scheduleAnnouncement(selectedAnnouncement._id, {
        scheduledAt: new Date(scheduledAt).toISOString(),
      });

      setSelectedAnnouncement(null);
      setScheduledAt("");

      await loadAnnouncements(currentPage);
    } catch (error) {
      console.error("Failed to schedule announcement:", error);

      setModalError("Failed to schedule the announcement. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelSchedule = async () => {
    if (!selectedAnnouncement) {
      return;
    }

    try {
      setSaving(true);
      setModalError("");

      await cancelScheduledAnnouncement(selectedAnnouncement._id);

      setSelectedAnnouncement(null);

      await loadAnnouncements(currentPage);
    } catch (error) {
      console.error("Failed to cancel announcement schedule:", error);

      setModalError("Failed to cancel the schedule. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleRequestPublish = (announcement: Announcement) => {
    setActionType("PUBLISH");
    setActionAnnouncement(announcement);
    setActionError("");
  };

  const handleRequestDelete = (announcement: Announcement) => {
    setActionType("DELETE");
    setActionAnnouncement(announcement);
    setActionError("");
  };

  const handleCloseActionModal = () => {
    if (actionLoading) {
      return;
    }

    setActionType(null);
    setActionAnnouncement(null);
    setActionError("");
  };

  const handleConfirmAction = async () => {
    if (!actionAnnouncement || !actionType) {
      return;
    }

    try {
      setActionLoading(true);
      setActionError("");

      if (actionType === "PUBLISH") {
        await publishAnnouncement(actionAnnouncement._id);
      }

      if (actionType === "DELETE") {
        await deleteAnnouncement(actionAnnouncement._id);
      }

      setActionType(null);
      setActionAnnouncement(null);

      await loadAnnouncements(currentPage);
    } catch (error) {
      console.error("Failed to perform announcement action:", error);

      setActionError(
        actionType === "PUBLISH"
          ? "Failed to publish the announcement. Please try again."
          : "Failed to delete the announcement. Please try again.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const isEditing = Boolean(editingAnnouncement);

  const actionTitle =
    actionType === "PUBLISH" ? "Publish Announcement" : "Delete Announcement";

  const actionDescription =
    actionType === "PUBLISH"
      ? "This announcement will become visible to lecturers."
      : "This action cannot be undone.";

  return (
    <div className="space-y-4">
      <PageHeader
        title="Announcements"
        description="Create and manage institutional announcements for lecturers."
      />

      {pageError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {pageError}
        </div>
      )}

      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-600">
              <Megaphone size={16} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                Institutional Announcements
              </h2>

              <p className="text-xs text-slate-500">
                Manage notices and staff communications.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={15} />
            New Announcement
          </button>
        </div>

        <AnnouncementTable
          announcements={announcements}
          loading={loading}
          onView={handleView}
          onEdit={handleOpenEdit}
          onSchedule={handleView}
          onPublish={handleRequestPublish}
          onDelete={handleRequestDelete}
        />

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      <Modal
        isOpen={formOpen}
        onClose={handleCloseForm}
        title={isEditing ? "Edit Announcement" : "New Announcement"}
        description={
          isEditing
            ? "Update this draft announcement."
            : "Create an announcement and save it as a draft."
        }
        size="lg"
      >
        <AnnouncementForm
          announcement={editingAnnouncement}
          saving={saving}
          error={modalError}
          onSave={handleSaveAnnouncement}
          onCancel={handleCloseForm}
        />
      </Modal>

      <AnnouncementModal
        open={Boolean(selectedAnnouncement)}
        announcement={selectedAnnouncement}
        scheduledAt={scheduledAt}
        saving={saving}
        error={modalError}
        onClose={handleCloseAnnouncementModal}
        onSchedule={handleSchedule}
        onCancelSchedule={handleCancelSchedule}
        onScheduledAtChange={setScheduledAt}
      />

      <Modal
        isOpen={Boolean(actionAnnouncement)}
        onClose={handleCloseActionModal}
        title={actionTitle}
        description={actionDescription}
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
                actionType === "PUBLISH"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {actionType === "PUBLISH" ? (
                <Send size={17} />
              ) : (
                <Trash2 size={17} />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800">
                {actionType === "PUBLISH"
                  ? "Publish this announcement?"
                  : "Delete this announcement?"}
              </p>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                {actionAnnouncement?.title || "This announcement"}
              </p>
            </div>
          </div>

          {actionError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
              {actionError}
            </div>
          )}

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-3">
            <button
              type="button"
              onClick={handleCloseActionModal}
              disabled={actionLoading}
              className="h-8 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirmAction}
              disabled={actionLoading}
              className={`inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                actionType === "PUBLISH"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {actionType === "PUBLISH" ? (
                <Send size={14} />
              ) : (
                <Trash2 size={14} />
              )}

              {actionLoading
                ? actionType === "PUBLISH"
                  ? "Publishing..."
                  : "Deleting..."
                : actionType === "PUBLISH"
                  ? "Publish"
                  : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
