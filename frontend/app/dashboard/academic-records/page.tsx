"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2, Plus } from "lucide-react";

import {
  createAcademicRecord,
  deleteAcademicRecord,
  getAcademicRecords,
  updateAcademicRecord,
} from "@/lib/academicRecords";

import type { AcademicRecord } from "@/types";

import Modal from "@/components/ui/Modal";

import AcademicRecordForm, {
  type AcademicRecordFormData,
} from "./components/AcademicRecordForm";

import AcademicRecordList from "./components/AcademicRecordList";

export default function AcademicRecordsPage() {
  const [records, setRecords] = useState<AcademicRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] =
    useState<AcademicRecord | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [recordToDelete, setRecordToDelete] =
    useState<AcademicRecord | null>(null);

  const [successMessage, setSuccessMessage] = useState("");

  const loadRecords = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAcademicRecords(1, 100);

      setRecords(response.data);
    } catch (err) {
      console.error("Failed to load academic records:", err);

      setError(
        "We couldn't load your academic records. Please refresh and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleAdd = () => {
    setEditingRecord(null);
    setSuccessMessage("");
    setIsFormOpen(true);
  };

  const handleEdit = (record: AcademicRecord) => {
    setEditingRecord(record);
    setSuccessMessage("");
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingRecord(null);
  };

  const handleSave = async (data: AcademicRecordFormData) => {
    try {
      setError("");
      setSuccessMessage("");

      if (editingRecord) {
        const updatedRecord = await updateAcademicRecord(
          editingRecord._id,
          data,
        );

        setRecords((current) =>
          current.map((record) =>
            record._id === updatedRecord._id ? updatedRecord : record,
          ),
        );

        setSuccessMessage("Academic record updated successfully.");
      } else {
        const newRecord = await createAcademicRecord(data);

        setRecords((current) => [newRecord, ...current]);

        setSuccessMessage("Academic record added successfully.");
      }

      setIsFormOpen(false);
      setEditingRecord(null);
    } catch (err) {
      console.error("Failed to save academic record:", err);

      throw err;
    }
  };

  const handleDelete = (id: string) => {
    const record = records.find((item) => item._id === id);

    if (!record) {
      return;
    }

    setRecordToDelete(record);
  };

  const handleConfirmDelete = async () => {
    if (!recordToDelete) {
      return;
    }

    try {
      setDeletingId(recordToDelete._id);
      setError("");
      setSuccessMessage("");

      await deleteAcademicRecord(recordToDelete._id);

      setRecords((current) =>
        current.filter(
          (record) => record._id !== recordToDelete._id,
        ),
      );

      setSuccessMessage("Academic record deleted successfully.");
      setRecordToDelete(null);
    } catch (err) {
      console.error("Failed to delete academic record:", err);

      setError(
        "We couldn't delete this academic record. Please try again.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          Loading academic records...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto w-full max-w-6xl space-y-5">
        {/* Page heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
              Academic Profile
            </p>

            <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
              Academic Records
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Keep your qualifications, academic career, and professional
              achievements up to date.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-md bg-blue-600 px-2 text-xs font-semibold text-white transition hover:bg-blue-700 sm:self-auto"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Academic Record
          </button>
        </div>

        {/* Success message */}
        {successMessage && (
          <div
            role="status"
            className="border border-blue-200 bg-blue-50 px-4 py-3 text-xs font-medium text-blue-800"
          >
            {successMessage}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

            <p className="text-xs leading-5 text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* Add / Edit form */}
        {isFormOpen && (
          <AcademicRecordForm
            record={editingRecord}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}

        {/* Records */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Your Records
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                {records.length}{" "}
                {records.length === 1
                  ? "academic record"
                  : "academic records"}
              </p>
            </div>
          </div>

          <AcademicRecordList
            records={records}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        </section>
      </div>

      {/* Delete Confirmation */}
      <Modal
        isOpen={Boolean(recordToDelete)}
        onClose={() => setRecordToDelete(null)}
        title="Delete academic record"
        description={
          recordToDelete
            ? `Are you sure you want to delete your ${recordToDelete.degree} record from ${recordToDelete.institution}? This action cannot be undone.`
            : undefined
        }
        size="sm"
      >
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setRecordToDelete(null)}
            disabled={deletingId !== null}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={deletingId !== null}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deletingId !== null && (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            )}

            {deletingId !== null ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </>
  );
}