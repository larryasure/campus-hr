"use client";

import { useEffect, useMemo, useState } from "react";

import type { User } from "@/types";

import { getAllLecturers } from "@/lib/admin";

import LecturerFilters from "./components/LecturerFilters";
import LecturerTable from "./components/LecturerTable";
import LecturerModal from "./components/LecturerModal";

import Pagination from "@/components/Pagination";

export default function AdminLecturersPage() {
  const [lecturers, setLecturers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [academicRank, setAcademicRank] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState<User | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  const loadLecturers = async () => {
    try {
      setLoading(true);

      const response = await getAllLecturers();

      setLecturers(response.data || []);
    } catch (error) {
      console.error("Failed to load lecturers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLecturers();
  }, []);

  const filteredLecturers = useMemo(() => {
    return lecturers.filter((lecturer) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        lecturer.fullName?.toLowerCase().includes(searchValue) ||
        lecturer.email?.toLowerCase().includes(searchValue) ||
        lecturer.staffId?.toLowerCase().includes(searchValue);

      const matchesFaculty = !faculty || lecturer.faculty === faculty;

      const matchesDepartment =
        !department || lecturer.department === department;

      const matchesRank =
        !academicRank || lecturer.academicRank === academicRank;

      return (
        matchesSearch && matchesFaculty && matchesDepartment && matchesRank
      );
    });
  }, [lecturers, search, faculty, department, academicRank]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLecturers.length / pageSize),
  );

  const paginatedLecturers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;

    return filteredLecturers.slice(startIndex, startIndex + pageSize);
  }, [filteredLecturers, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const faculties = useMemo(() => {
    return Array.from(
      new Set(lecturers.map((lecturer) => lecturer.faculty).filter(Boolean)),
    ) as string[];
  }, [lecturers]);

  const departments = useMemo(() => {
    return Array.from(
      new Set(lecturers.map((lecturer) => lecturer.department).filter(Boolean)),
    ) as string[];
  }, [lecturers]);

  const academicRanks = useMemo(() => {
    return Array.from(
      new Set(
        lecturers.map((lecturer) => lecturer.academicRank).filter(Boolean),
      ),
    ) as string[];
  }, [lecturers]);

  const handleAddLecturer = () => {
    setSelectedLecturer(null);
    setModalOpen(true);
  };

  const handleViewLecturer = (lecturer: User) => {
    setSelectedLecturer(lecturer);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedLecturer(null);
  };

  const handleSaved = async () => {
    await loadLecturers();
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFacultyChange = (value: string) => {
    setFaculty(value);
    setCurrentPage(1);
  };

  const handleDepartmentChange = (value: string) => {
    setDepartment(value);
    setCurrentPage(1);
  };

  const handleAcademicRankChange = (value: string) => {
    setAcademicRank(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setFaculty("");
    setDepartment("");
    setAcademicRank("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Lecturers</h1>

          <p className="mt-0.5 text-xs text-slate-500">
            Manage lecturer records and information.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddLecturer}
          className="h-9 rounded-md bg-blue-600 px-4 text-xs font-medium text-white transition hover:bg-blue-700"
        >
          Add Lecturer
        </button>
      </div>

      <LecturerFilters
        search={search}
        faculty={faculty}
        department={department}
        academicRank={academicRank}
        faculties={faculties}
        departments={departments}
        academicRanks={academicRanks}
        onSearchChange={handleSearchChange}
        onFacultyChange={handleFacultyChange}
        onDepartmentChange={handleDepartmentChange}
        onAcademicRankChange={handleAcademicRankChange}
        onClear={handleClearFilters}
      />

      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <LecturerTable
          lecturers={paginatedLecturers}
          loading={loading}
          onView={handleViewLecturer}
        />

        {!loading && filteredLecturers.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredLecturers.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <LecturerModal
        lecturer={selectedLecturer}
        open={modalOpen}
        onClose={handleCloseModal}
        onSaved={handleSaved}
      />
    </div>
  );
}
