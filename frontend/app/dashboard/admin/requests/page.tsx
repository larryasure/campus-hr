"use client";

import { useCallback, useEffect, useState } from "react";
import { FileText, Trash2 } from "lucide-react";

import PageHeader from "@/components/dashboard/PageHeader";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/Pagination";

import RequestFilters from "./components/RequestFilters";
import RequestTable from "./components/RequestTable";
import RequestModal from "./components/RequestModal";

import {
  deleteAdminRequest,
  getAllAdminRequests,
  updateAdminRequest,
} from "@/lib/adminRequests";

import type { HRRequest } from "@/types";

const PAGE_SIZE = 10;

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<HRRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [statusFilter, setStatusFilter] = useState("");

  const [typeFilter, setTypeFilter] = useState("");

  const [selectedRequest, setSelectedRequest] = useState<HRRequest | null>(
    null,
  );

  const [deleteRequest, setDeleteRequest] = useState<HRRequest | null>(null);

  const [reviewStatus, setReviewStatus] =
    useState<HRRequest["status"]>("PENDING");

  const [adminComment, setAdminComment] = useState("");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllAdminRequests({
        page: currentPage,
        limit: PAGE_SIZE,
        status: statusFilter || undefined,
        type: typeFilter || undefined,
      });

      setRequests(response.data);
      setTotalItems(response.pagination.total);
      setTotalPages(response.pagination.totalPages);
    } catch (requestError) {
      console.error("Failed to load HR requests:", requestError);

      setError("Failed to load HR requests. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, typeFilter]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setStatusFilter("");
    setTypeFilter("");
    setCurrentPage(1);
  };

  const handleView = (request: HRRequest) => {
    setSelectedRequest(request);
    setReviewStatus(request.status);
    setAdminComment(request.adminComment || "");
    setError("");
  };

  const handleCloseReview = () => {
    if (saving) {
      return;
    }

    setSelectedRequest(null);
    setAdminComment("");
    setError("");
  };

  const handleSaveReview = async () => {
    if (!selectedRequest) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateAdminRequest(selectedRequest._id, {
        status: reviewStatus,
        adminComment: adminComment.trim(),
      });

      setSelectedRequest(null);
      setAdminComment("");

      await loadRequests();
    } catch (requestError) {
      console.error("Failed to update HR request:", requestError);

      setError("Failed to update the request. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (request: HRRequest) => {
    setDeleteRequest(request);
    setDeleteError("");
  };

  const handleCloseDelete = () => {
    if (deleting) {
      return;
    }

    setDeleteRequest(null);
    setDeleteError("");
  };

  const confirmDelete = async () => {
    if (!deleteRequest) {
      return;
    }

    try {
      setDeleting(true);
      setDeleteError("");

      await deleteAdminRequest(deleteRequest._id);

      setDeleteRequest(null);

      if (requests.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        await loadRequests();
      }
    } catch (requestError) {
      console.error("Failed to delete HR request:", requestError);

      setDeleteError("Failed to delete the request. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="HR Requests"
        description="Review and manage lecturer HR requests."
      />

      {error && !selectedRequest && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <RequestFilters
        status={statusFilter}
        type={typeFilter}
        onStatusChange={handleStatusChange}
        onTypeChange={handleTypeChange}
        onClear={handleClearFilters}
      />

      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-600">
              <FileText size={16} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                Lecturer Requests
              </h2>

              <p className="text-xs text-slate-500">
                Review submitted HR requests and update their status.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            {totalItems} {totalItems === 1 ? "request" : "requests"}
          </p>
        </div>

        <RequestTable
          requests={requests}
          loading={loading}
          onView={handleView}
          onDelete={handleDelete}
        />

        {!loading && totalItems > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <RequestModal
        open={Boolean(selectedRequest)}
        request={selectedRequest}
        status={reviewStatus}
        adminComment={adminComment}
        saving={saving}
        error={error}
        onClose={handleCloseReview}
        onSave={handleSaveReview}
        onStatusChange={setReviewStatus}
        onCommentChange={setAdminComment}
      />

      <Modal
        isOpen={Boolean(deleteRequest)}
        onClose={handleCloseDelete}
        title="Delete HR Request"
        description="This action cannot be undone."
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-600">
              <Trash2 size={17} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800">
                Delete this request?
              </p>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                {deleteRequest?.subject || "This HR request"} will be
                permanently removed.
              </p>
            </div>
          </div>

          {deleteError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
              {deleteError}
            </div>
          )}

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-3">
            <button
              type="button"
              onClick={handleCloseDelete}
              disabled={deleting}
              className="h-8 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={confirmDelete}
              disabled={deleting}
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-red-600 px-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Delete Request"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
