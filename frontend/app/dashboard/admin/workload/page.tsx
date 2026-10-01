"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Clock3,
} from "lucide-react";

import type { User } from "@/types";

import { getAllLecturers } from "@/lib/admin";

import {
  getAllAdminWorkload,
  createAdminWorkload,
  updateAdminWorkload,
  deleteAdminWorkload,
  type AdminWorkload,
  type WorkloadFormData,
} from "@/lib/adminWorkload";

import WorkloadFilters from "./components/WorkloadFilters";
import WorkloadTable from "./components/WorkloadTable";

import Pagination from "@/components/Pagination";

type UserWithMongoId = User & {
  _id?: string;
};

export default function AdminWorkloadPage() {
  const [workload, setWorkload] = useState<
    AdminWorkload[]
  >([]);

  const [lecturers, setLecturers] = useState<User[]>(
    [],
  );

  const [loading, setLoading] = useState(true);
  const [lecturersLoading, setLecturersLoading] =
    useState(true);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [academicSession, setAcademicSession] =
    useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  const [pagination, setPagination] = useState({
    page: 1,
    limit: pageSize,
    total: 0,
    totalPages: 1,
  });

  const [modalOpen, setModalOpen] = useState(false);

  const [selectedWorkload, setSelectedWorkload] =
    useState<AdminWorkload | null>(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");

  const [showDelete, setShowDelete] =
    useState(false);

  const [form, setForm] =
    useState<WorkloadFormData>({
      lecturer: "",
      courseCode: "",
      courseTitle: "",
      department: "",
      semester: "FIRST",
      academicSession: "",
      weeklyTeachingHours: 0,
    });

  const loadWorkload = async () => {
    try {
      setLoading(true);

      const response =
        await getAllAdminWorkload({
          page: currentPage,
          limit: pageSize,
          search: search.trim() || undefined,
          department:
            department || undefined,
          semester:
            semester || undefined,
          academicSession:
            academicSession || undefined,
        });

      setWorkload(response.data || []);
      setPagination(response.pagination);
    } catch (error) {
      console.error(
        "Failed to load workload:",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  const loadLecturers = async () => {
    try {
      setLecturersLoading(true);

      const response =
        await getAllLecturers();

      setLecturers(response.data || []);
    } catch (error) {
      console.error(
        "Failed to load lecturers:",
        error,
      );
    } finally {
      setLecturersLoading(false);
    }
  };

  useEffect(() => {
    loadWorkload();
  }, [
    currentPage,
    search,
    department,
    semester,
    academicSession,
  ]);

  useEffect(() => {
    loadLecturers();
  }, []);

  const departments = useMemo(() => {
    return Array.from(
      new Set(
        lecturers
          .map(
            (lecturer) =>
              lecturer.department,
          )
          .filter(Boolean),
      ),
    ).sort();
  }, [lecturers]);

  const academicSessions = useMemo(() => {
    return Array.from(
      new Set(
        workload
          .map(
            (item) =>
              item.academicSession,
          )
          .filter(Boolean),
      ),
    ).sort((a, b) =>
      b.localeCompare(a),
    );
  }, [workload]);

  const resetForm = () => {
    setForm({
      lecturer: "",
      courseCode: "",
      courseTitle: "",
      department: "",
      semester: "FIRST",
      academicSession: "",
      weeklyTeachingHours: 0,
    });

    setError("");
    setShowDelete(false);
  };

  const handleAdd = () => {
    setSelectedWorkload(null);
    resetForm();
    setModalOpen(true);
  };

  const handleView = (
    item: AdminWorkload,
  ) => {
    const lecturerId =
      item.lecturer?._id || "";

    setSelectedWorkload(item);

    setForm({
      lecturer: lecturerId,
      courseCode:
        item.courseCode || "",
      courseTitle:
        item.courseTitle || "",
      department:
        item.department || "",
      semester:
        item.semester || "FIRST",
      academicSession:
        item.academicSession || "",
      weeklyTeachingHours:
        item.weeklyTeachingHours ?? 0,
    });

    setError("");
    setShowDelete(false);
    setModalOpen(true);
  };

  const handleClose = () => {
    if (saving || deleting) {
      return;
    }

    setModalOpen(false);
    setSelectedWorkload(null);
    resetForm();
  };

  const handleLecturerChange = (
    lecturerId: string,
  ) => {
    const lecturer = lecturers.find(
      (item) => {
        const itemId =
          (item as UserWithMongoId)._id ||
          item.id;

        return itemId === lecturerId;
      },
    );

    setForm((current) => ({
      ...current,
      lecturer: lecturerId,
      department:
        lecturer?.department || "",
    }));
  };

  const handleSave = async () => {
    setError("");

    const lecturer = lecturers.find(
      (item) => {
        const itemId =
          (item as UserWithMongoId)._id ||
          item.id;

        return itemId === form.lecturer;
      },
    );

    if (!form.lecturer) {
      setError("Please select a lecturer.");
      return;
    }

    if (!lecturer) {
      setError(
        "The selected lecturer could not be found. Please select the lecturer again.",
      );
      return;
    }

    if (!form.courseCode.trim()) {
      setError("Course code is required.");
      return;
    }

    if (!form.courseTitle.trim()) {
      setError("Course title is required.");
      return;
    }

    if (!lecturer.department) {
      setError(
        "The selected lecturer does not have a department. Please complete the lecturer profile first.",
      );
      return;
    }

    if (!form.academicSession.trim()) {
      setError(
        "Academic session is required.",
      );
      return;
    }

    const teachingHours = Number(
      form.weeklyTeachingHours,
    );

    if (
      Number.isNaN(teachingHours) ||
      teachingHours < 0
    ) {
      setError(
        "Weekly teaching hours must be a valid number.",
      );
      return;
    }

    try {
      setSaving(true);

      const payload: WorkloadFormData = {
        lecturer: form.lecturer,

        courseCode:
          form.courseCode
            .trim()
            .toUpperCase(),

        courseTitle:
          form.courseTitle.trim(),

        // Always use the selected
        // lecturer's actual department.
        department:
          lecturer.department,

        semester: form.semester,

        academicSession:
          form.academicSession.trim(),

        weeklyTeachingHours:
          teachingHours,
      };

      if (selectedWorkload) {
        await updateAdminWorkload(
          selectedWorkload._id,
          payload,
        );
      } else {
        await createAdminWorkload(
          payload,
        );
      }

      setModalOpen(false);
      setSelectedWorkload(null);
      resetForm();

      await loadWorkload();
    } catch (error: any) {
      console.error(
        "Save workload error:",
        error,
      );

      setError(
        error?.response?.data?.message ||
          "Failed to save workload.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedWorkload) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteAdminWorkload(
        selectedWorkload._id,
      );

      setShowDelete(false);

      setModalOpen(false);
      setSelectedWorkload(null);
      resetForm();

      if (
        workload.length === 1 &&
        currentPage > 1
      ) {
        setCurrentPage(
          currentPage - 1,
        );
      } else {
        await loadWorkload();
      }
    } catch (error: any) {
      console.error(
        "Delete workload error:",
        error,
      );

      setError(
        error?.response?.data?.message ||
          "Failed to delete workload.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleSearchChange = (
    value: string,
  ) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleDepartmentChange = (
    value: string,
  ) => {
    setDepartment(value);
    setCurrentPage(1);
  };

  const handleSemesterChange = (
    value: string,
  ) => {
    setSemester(value);
    setCurrentPage(1);
  };

  const handleAcademicSessionChange = (
    value: string,
  ) => {
    setAcademicSession(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setDepartment("");
    setSemester("");
    setAcademicSession("");
    setCurrentPage(1);
  };

  const selectedLecturer =
    lecturers.find((lecturer) => {
      const lecturerId =
        (lecturer as UserWithMongoId)._id ||
        lecturer.id;

      return lecturerId === form.lecturer;
    });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Workload Management
          </h1>

          <p className="mt-0.5 text-xs text-slate-500">
            Manage lecturer teaching assignments
            and weekly workload.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-blue-600 px-4 text-xs font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={14} />
          Add Workload
        </button>
      </div>

      {/* Filters */}
      <WorkloadFilters
        search={search}
        department={department}
        semester={semester}
        academicSession={
          academicSession
        }
        departments={departments}
        academicSessions={
          academicSessions
        }
        onSearchChange={
          handleSearchChange
        }
        onDepartmentChange={
          handleDepartmentChange
        }
        onSemesterChange={
          handleSemesterChange
        }
        onAcademicSessionChange={
          handleAcademicSessionChange
        }
        onClear={handleClearFilters}
      />

      {/* Table */}
      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <WorkloadTable
          workload={workload}
          loading={loading}
          onView={handleView}
        />

        {!loading &&
          pagination.total > 0 && (
            <Pagination
              currentPage={
                pagination.page
              }
              totalPages={
                pagination.totalPages
              }
              totalItems={
                pagination.total
              }
              pageSize={
                pagination.limit
              }
              onPageChange={
                setCurrentPage
              }
            />
          )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 px-4 py-6"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              handleClose();
            }
          }}
        >
          <div className="relative w-full max-w-2xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  {selectedWorkload
                    ? "Edit Workload"
                    : "Add Workload"}
                </h2>

                <p className="mt-0.5 text-[11px] text-slate-500">
                  {selectedWorkload
                    ? "Update this workload assignment."
                    : "Create a new lecturer workload assignment."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
              {error && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Lecturer */}
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-600">
                    Lecturer
                  </label>

                  <select
                    value={
                      form.lecturer
                    }
                    onChange={(event) =>
                      handleLecturerChange(
                        event.target.value,
                      )
                    }
                    disabled={
                      saving ||
                      lecturersLoading
                    }
                    className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50"
                  >
                    <option value="">
                      {lecturersLoading
                        ? "Loading lecturers..."
                        : "Select lecturer"}
                    </option>

                    {lecturers.map(
                      (lecturer) => {
                        const lecturerId =
                          (lecturer as UserWithMongoId)
                            ._id ||
                          lecturer.id;

                        return (
                          <option
                            key={
                              lecturerId
                            }
                            value={
                              lecturerId
                            }
                          >
                            {
                              lecturer.fullName
                            }{" "}
                            —{" "}
                            {
                              lecturer.staffId
                            }
                          </option>
                        );
                      },
                    )}
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-600">
                    Department
                  </label>

                  <input
                    value={
                      form.department
                    }
                    readOnly
                    placeholder="Select a lecturer first"
                    className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-xs text-slate-600 outline-none"
                  />

                  <p className="mt-1 text-[10px] text-slate-400">
                    Automatically taken from
                    the selected lecturer.
                  </p>
                </div>

                {/* Course Code */}
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-600">
                    Course Code
                  </label>

                  <input
                    value={
                      form.courseCode
                    }
                    onChange={(event) =>
                      setForm(
                        (current) => ({
                          ...current,
                          courseCode:
                            event.target
                              .value,
                        }),
                      )
                    }
                    placeholder="e.g. CSC301"
                    className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Course Title */}
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-600">
                    Course Title
                  </label>

                  <input
                    value={
                      form.courseTitle
                    }
                    onChange={(event) =>
                      setForm(
                        (current) => ({
                          ...current,
                          courseTitle:
                            event.target
                              .value,
                        }),
                      )
                    }
                    placeholder="Course title"
                    className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Semester */}
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-600">
                    Semester
                  </label>

                  <select
                    value={
                      form.semester
                    }
                    onChange={(event) =>
                      setForm(
                        (current) => ({
                          ...current,
                          semester:
                            event.target
                              .value as
                              | "FIRST"
                              | "SECOND",
                        }),
                      )
                    }
                    className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="FIRST">
                      First Semester
                    </option>

                    <option value="SECOND">
                      Second Semester
                    </option>
                  </select>
                </div>

                {/* Academic Session */}
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-600">
                    Academic Session
                  </label>

                  <input
                    value={
                      form.academicSession
                    }
                    onChange={(event) =>
                      setForm(
                        (current) => ({
                          ...current,
                          academicSession:
                            event.target
                              .value,
                        }),
                      )
                    }
                    placeholder="e.g. 2025/2026"
                    className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Weekly Hours */}
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-600">
                    Weekly Teaching Hours
                  </label>

                  <div className="relative">
                    <Clock3
                      size={14}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={
                        form.weeklyTeachingHours
                      }
                      onChange={(event) =>
                        setForm(
                          (current) => ({
                            ...current,
                            weeklyTeachingHours:
                              Number(
                                event.target
                                  .value,
                              ),
                          }),
                        )
                      }
                      className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Selected Lecturer Info */}
              {selectedLecturer && (
                <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <p className="text-[11px] font-medium text-slate-700">
                    Selected Lecturer
                  </p>

                  <p className="mt-0.5 text-xs text-slate-800">
                    {
                      selectedLecturer.fullName
                    }
                  </p>

                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {
                      selectedLecturer.staffId
                    }

                    {selectedLecturer.academicRank
                      ? ` • ${selectedLecturer.academicRank}`
                      : ""}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3">
              <div>
                {selectedWorkload && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowDelete(true)
                    }
                    disabled={
                      saving ||
                      deleting
                    }
                    className="inline-flex h-8 items-center gap-1.5 rounded-md border border-red-200 px-3 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={
                    handleClose
                  }
                  disabled={
                    saving ||
                    deleting
                  }
                  className="h-8 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={
                    handleSave
                  }
                  disabled={
                    saving ||
                    deleting
                  }
                  className="inline-flex h-8 items-center gap-1.5 rounded-md bg-blue-600 px-3 text-xs font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Pencil size={13} />

                  {saving
                    ? "Saving..."
                    : selectedWorkload
                      ? "Save Changes"
                      : "Create Workload"}
                </button>
              </div>
            </div>

            {/* Delete Confirmation */}
            {showDelete && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/25 px-4">
                <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-5 shadow-xl">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Delete workload?
                  </h3>

                  <p className="mt-1.5 text-xs leading-5 text-slate-500">
                    This will permanently
                    remove the workload
                    record for{" "}
                    <span className="font-medium text-slate-700">
                      {
                        selectedWorkload?.courseCode
                      }
                    </span>
                    .
                  </p>

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setShowDelete(
                          false,
                        )
                      }
                      disabled={
                        deleting
                      }
                      className="h-8 rounded-md border border-slate-200 px-3 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={
                        handleDelete
                      }
                      disabled={
                        deleting
                      }
                      className="h-8 rounded-md bg-red-600 px-3 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60"
                    >
                      {deleting
                        ? "Deleting..."
                        : "Delete Workload"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}