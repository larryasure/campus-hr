"use client";

import {
  Award,
  BookOpen,
  Building2,
  ChevronDown,
  GraduationCap,
  Pencil,
  Trash2,
} from "lucide-react";

import type { AcademicRecord } from "@/types";

interface AcademicRecordListProps {
  records: AcademicRecord[];
  onEdit: (record: AcademicRecord) => void;
  onDelete: (id: string) => void;
  deletingId?: string | null;
}

export default function AcademicRecordList({
  records,
  onEdit,
  onDelete,
  deletingId,
}: AcademicRecordListProps) {
  if (records.length === 0) {
    return (
      <div className="border border-slate-200 bg-white px-5 py-12 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <GraduationCap className="h-5 w-5" />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-slate-900">
          No academic records yet
        </h3>

        <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
          Add your qualifications and academic career information to keep your
          professional profile complete.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {records.map((record, index) => (
        <AcademicRecordCard
          key={record._id}
          record={record}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
          deleting={deletingId === record._id}
        />
      ))}
    </div>
  );
}

interface AcademicRecordCardProps {
  record: AcademicRecord;
  index: number;
  onEdit: (record: AcademicRecord) => void;
  onDelete: (id: string) => void;
  deleting: boolean;
}

function AcademicRecordCard({
  record,
  index,
  onEdit,
  onDelete,
  deleting,
}: AcademicRecordCardProps) {
  return (
    <article className="overflow-hidden border border-slate-200 bg-white">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <GraduationCap className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900">
                {record.degree}
              </h3>

              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                {record.year}
              </span>
            </div>

            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <Building2 className="h-3.5 w-3.5 shrink-0" />

              <span className="truncate">{record.institution}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => onEdit(record)}
            className="flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(record._id)}
            disabled={deleting}
            className="flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <div className="grid border-t border-slate-100 sm:grid-cols-2 lg:grid-cols-4">
        <InfoItem
          icon={Award}
          label="Academic Rank"
          value={record.academicRank || "Not specified"}
        />

        <InfoItem
          icon={BookOpen}
          label="Research Interests"
          value={
            record.researchInterests?.length
              ? record.researchInterests.join(", ")
              : "Not specified"
          }
        />

        <InfoItem
          icon={BookOpen}
          label="Publications"
          value={
            record.publications?.length
              ? `${record.publications.length} listed`
              : "None listed"
          }
        />

        <InfoItem
          icon={Award}
          label="Certifications"
          value={
            record.certifications?.length
              ? `${record.certifications.length} listed`
              : "None listed"
          }
        />
      </div>

      <ExpandableDetails record={record} />
    </article>
  );
}

interface InfoItemProps {
  icon: typeof Award;
  label: string;
  value: string;
}

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="border-b border-slate-100 p-4 last:border-b-0 sm:border-r lg:border-b-0">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-blue-600" />

        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
      </div>

      <p className="mt-1.5 text-xs leading-5 text-slate-700">{value}</p>
    </div>
  );
}

function ExpandableDetails({ record }: { record: AcademicRecord }) {
  const hasDetails =
    Boolean(record.promotionHistory?.length) ||
    Boolean(record.publications?.length) ||
    Boolean(record.certifications?.length) ||
    Boolean(record.affiliations?.length);

  if (!hasDetails) {
    return null;
  }

  return (
    <details className="group border-t border-slate-100">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-xs font-medium text-slate-600 transition hover:bg-slate-50 sm:px-5">
        <span>View additional details</span>

        <ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" />
      </summary>

      <div className="grid gap-5 border-t border-slate-100 bg-slate-50/40 p-4 sm:grid-cols-2 sm:p-5">
        {record.promotionHistory?.length ? (
          <DetailList
            title="Promotion History"
            items={record.promotionHistory}
          />
        ) : null}

        {record.publications?.length ? (
          <DetailList title="Publications" items={record.publications} />
        ) : null}

        {record.certifications?.length ? (
          <DetailList
            title="Professional Certifications"
            items={record.certifications}
          />
        ) : null}

        {record.affiliations?.length ? (
          <DetailList
            title="Professional Affiliations"
            items={record.affiliations}
          />
        ) : null}
      </div>
    </details>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <ul className="mt-2 space-y-1.5">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="text-xs leading-5 text-slate-700"
          >
            <span className="mr-2 text-blue-500">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
