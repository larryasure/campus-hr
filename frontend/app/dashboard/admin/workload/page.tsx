"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";

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
import WorkloadModal from "./components/WorkloadModal";

import Pagination from "@/components/Pagination";

type UserWithMongoId = User & {
  _id?: string;
};

export default function AdminWorkloadPage() {
  const [workload, setWorkload] = useState<AdminWorkload[]>([]);

  const [lecturers, setLecturers] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);
  const [lecturersLoading, setLecturersLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [academicSession, setAcademicSession] = useState("");

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

  const [showDelete, setShowDelete] = useState(false);

  const [form, setForm] = useState<WorkloadFormData>({
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

      const response = await getAllAdminWorkload({
        page: currentPage,
        limit: pageSize,
        search: search.trim() || undefined,
        department: department || undefined,
        semester: semester || undefined,
        academicSession: academicSession || undefined,
      });

      setWorkload(response.data || []);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Failed to load workload:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadLecturers = async () => {
    try {
      setLecturersLoading(true);

      const response = await getAllLecturers();

      setLecturers(response.data || []);
    } catch (error) {
      console.error("Failed to load lecturers:", error);
    } finally {
      setLecturersLoading(false);
    }
  };

  useEffect(() => {
    loadWorkload();
  }, [currentPage, search, department, semester, academicSession]);

  useEffect(() => {
    loadLecturers();
  }, []);

  const departments = useMemo(() => {
    return Array.from(
      new Set(
        lecturers
          .map((lecturer) => lecturer.department)
          .filter((department): department is string => Boolean(department)),
      ),
    ).sort();
  }, [lecturers]);

  const academicSessions = useMemo(() => {
    return Array.from(
      new Set(
        workload
          .map((item) => item.academicSession)
          .filter((session): session is string => Boolean(session)),
      ),
    ).sort((a, b) => b.localeCompare(a));
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

  const handleView = (item: AdminWorkload) => {
    const lecturerId = item.lecturer?._id || "";

    setSelectedWorkload(item);

    setForm({
      lecturer: lecturerId,
      courseCode: item.courseCode || "",
      courseTitle: item.courseTitle || "",
      department: item.department || "",
      semester: item.semester === "SECOND" ? "SECOND" : "FIRST",
      academicSession: item.academicSession || "",
      weeklyTeachingHours: item.weeklyTeachingHours ?? 0,
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

  const handleLecturerChange = (lecturerId: string) => {
    const lecturer = lecturers.find((item) => {
      const itemId = (item as UserWithMongoId)._id || item.id;

      return itemId === lecturerId;
    });

    setForm((current) => ({
      ...current,
      lecturer: lecturerId,
      department: lecturer?.department || "",
    }));
  };

  const handleFormChange = (updates: Partial<WorkloadFormData>) => {
    setForm((current) => ({
      ...current,
      ...updates,
    }));
  };

  const handleSave = async () => {
    setError("");

    const lecturer = lecturers.find((item) => {
      const itemId = (item as UserWithMongoId)._id || item.id;

      return itemId === form.lecturer;
    });

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
      setError("Academic session is required.");
      return;
    }

    const teachingHours = Number(form.weeklyTeachingHours);

    if (Number.isNaN(teachingHours) || teachingHours < 0) {
      setError("Weekly teaching hours must be a valid number.");
      return;
    }

    try {
      setSaving(true);

      const payload: WorkloadFormData = {
        lecturer: form.lecturer,
        courseCode: form.courseCode.trim().toUpperCase(),
        courseTitle: form.courseTitle.trim(),
        department: lecturer.department,
        semester: form.semester,
        academicSession: form.academicSession.trim(),
        weeklyTeachingHours: teachingHours,
      };

      if (selectedWorkload) {
        await updateAdminWorkload(selectedWorkload._id, payload);
      } else {
        await createAdminWorkload(payload);
      }

      setModalOpen(false);
      setSelectedWorkload(null);
      resetForm();

      await loadWorkload();
    } catch (error: any) {
      console.error("Save workload error:", error);

      setError(error?.response?.data?.message || "Failed to save workload.");
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

      await deleteAdminWorkload(selectedWorkload._id);

      setShowDelete(false);
      setModalOpen(false);
      setSelectedWorkload(null);
      resetForm();

      if (workload.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        await loadWorkload();
      }
    } catch (error: any) {
      console.error("Delete workload error:", error);

      setError(error?.response?.data?.message || "Failed to delete workload.");
    } finally {
      setDeleting(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleDepartmentChange = (value: string) => {
    setDepartment(value);
    setCurrentPage(1);
  };

  const handleSemesterChange = (value: string) => {
    setSemester(value);
    setCurrentPage(1);
  };

  const handleAcademicSessionChange = (value: string) => {
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Workload Management
          </h1>

          <p className="mt-0.5 text-sm text-slate-500">
            Manage lecturer teaching assignments and weekly workload.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={15} />
          Add Workload
        </button>
      </div>

      <WorkloadFilters
        search={search}
        department={department}
        semester={semester}
        academicSession={academicSession}
        departments={departments}
        academicSessions={academicSessions}
        onSearchChange={handleSearchChange}
        onDepartmentChange={handleDepartmentChange}
        onSemesterChange={handleSemesterChange}
        onAcademicSessionChange={handleAcademicSessionChange}
        onClear={handleClearFilters}
      />

      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <WorkloadTable
          workload={workload}
          loading={loading}
          onView={handleView}
        />

        {!loading && pagination.total > 0 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            pageSize={pagination.limit}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <WorkloadModal
        open={modalOpen}
        workload={selectedWorkload}
        lecturers={lecturers}
        lecturersLoading={lecturersLoading}
        form={form}
        saving={saving}
        deleting={deleting}
        error={error}
        showDelete={showDelete}
        onClose={handleClose}
        onSave={handleSave}
        onDelete={handleDelete}
        onShowDelete={() => setShowDelete(true)}
        onHideDelete={() => setShowDelete(false)}
        onLecturerChange={handleLecturerChange}
        onFormChange={handleFormChange}
      />
    </div>
  );
}
