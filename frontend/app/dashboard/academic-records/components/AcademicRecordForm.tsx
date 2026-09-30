"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Save, X } from "lucide-react";

import type { AcademicRecord } from "@/types";

interface AcademicRecordFormProps {
  record?: AcademicRecord | null;
  onSave: (data: AcademicRecordFormData) => Promise<void>;
  onCancel: () => void;
}

export interface AcademicRecordFormData {
  degree: string;
  institution: string;
  year: number;
  academicRank: string;
  promotionHistory: string[];
  researchInterests: string[];
  publications: string[];
  certifications: string[];
  affiliations: string[];
}

const emptyForm: AcademicRecordFormData = {
  degree: "",
  institution: "",
  year: new Date().getFullYear(),
  academicRank: "",
  promotionHistory: [],
  researchInterests: [],
  publications: [],
  certifications: [],
  affiliations: [],
};

export default function AcademicRecordForm({
  record,
  onSave,
  onCancel,
}: AcademicRecordFormProps) {
  const [formData, setFormData] = useState<AcademicRecordFormData>(emptyForm);

  const [promotionHistory, setPromotionHistory] = useState("");
  const [researchInterests, setResearchInterests] = useState("");
  const [publications, setPublications] = useState("");
  const [certifications, setCertifications] = useState("");
  const [affiliations, setAffiliations] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(record);

  useEffect(() => {
    if (!record) {
      setFormData(emptyForm);
      setPromotionHistory("");
      setResearchInterests("");
      setPublications("");
      setCertifications("");
      setAffiliations("");
      return;
    }

    setFormData({
      degree: record.degree || "",
      institution: record.institution || "",
      year: record.year || new Date().getFullYear(),
      academicRank: record.academicRank || "",
      promotionHistory: record.promotionHistory || [],
      researchInterests: record.researchInterests || [],
      publications: record.publications || [],
      certifications: record.certifications || [],
      affiliations: record.affiliations || [],
    });

    setPromotionHistory(record.promotionHistory?.join("\n") || "");

    setResearchInterests(record.researchInterests?.join("\n") || "");

    setPublications(record.publications?.join("\n") || "");

    setCertifications(record.certifications?.join("\n") || "");

    setAffiliations(record.affiliations?.join("\n") || "");
  }, [record]);

  const updateField = (
    field: keyof AcademicRecordFormData,
    value: string | number,
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const parseList = (value: string) =>
    value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.degree.trim()) {
      setError("Degree is required.");
      return;
    }

    if (!formData.institution.trim()) {
      setError("Institution is required.");
      return;
    }

    if (
      !formData.year ||
      formData.year < 1900 ||
      formData.year > new Date().getFullYear()
    ) {
      setError("Please enter a valid qualification year.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await onSave({
        degree: formData.degree.trim(),
        institution: formData.institution.trim(),
        year: Number(formData.year),
        academicRank: formData.academicRank.trim(),
        promotionHistory: parseList(promotionHistory),
        researchInterests: parseList(researchInterests),
        publications: parseList(publications),
        certifications: parseList(certifications),
        affiliations: parseList(affiliations),
      });
    } catch (err) {
      console.error("Failed to save academic record:", err);

      setError(
        "We couldn't save this academic record. Please check the information and try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="border border-blue-100 bg-white">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-4 py-4 sm:px-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600">
              {isEditing ? (
                <Save className="h-3.5 w-3.5" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
            </div>

            <p className="text-sm font-semibold text-slate-900">
              {isEditing ? "Edit academic record" : "Add academic record"}
            </p>
          </div>

          <p className="mt-1.5 text-xs leading-5 text-slate-500">
            Add your qualification and relevant academic career information.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          aria-label="Close academic record form"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6 p-4 sm:p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Qualification
            </p>

            <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_1fr_140px]">
              <Field
                label="Degree / Qualification"
                required
                value={formData.degree}
                onChange={(value) => updateField("degree", value)}
                placeholder="e.g. PhD Computer Science"
                disabled={saving}
              />

              <Field
                label="Institution"
                required
                value={formData.institution}
                onChange={(value) => updateField("institution", value)}
                placeholder="e.g. University of Lagos"
                disabled={saving}
              />

              <Field
                label="Year"
                required
                type="number"
                value={String(formData.year)}
                onChange={(value) => updateField("year", Number(value))}
                min={1900}
                max={new Date().getFullYear()}
                disabled={saving}
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Academic Career
            </p>

            <div className="mt-3">
              <Field
                label="Academic Rank"
                value={formData.academicRank}
                onChange={(value) => updateField("academicRank", value)}
                placeholder="e.g. Lecturer II"
                disabled={saving}
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Professional Information
            </p>

            <p className="mt-1 text-xs text-slate-500">
              For lists, enter one item per line.
            </p>

            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <TextArea
                label="Promotion History"
                value={promotionHistory}
                onChange={setPromotionHistory}
                placeholder={"Assistant Lecturer — 2020\nLecturer II — 2023"}
                disabled={saving}
              />

              <TextArea
                label="Research Interests"
                value={researchInterests}
                onChange={setResearchInterests}
                placeholder={"Artificial Intelligence\nMachine Learning"}
                disabled={saving}
              />

              <TextArea
                label="Publications"
                value={publications}
                onChange={setPublications}
                placeholder="Publication title or citation"
                disabled={saving}
              />

              <TextArea
                label="Professional Certifications"
                value={certifications}
                onChange={setCertifications}
                placeholder="Certification or professional qualification"
                disabled={saving}
              />

              <TextArea
                label="Professional Affiliations"
                value={affiliations}
                onChange={setAffiliations}
                placeholder="Professional association or institution"
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-4 mb-4 border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700 sm:mx-5">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50/50 px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="h-9 rounded-md border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-blue-600 px-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}

            {saving ? "Saving..." : isEditing ? "Save changes" : "Add record"}
          </button>
        </div>
      </form>
    </section>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number";
  min?: number;
  max?: number;
  required?: boolean;
  disabled?: boolean;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  max,
  required,
  disabled,
}: FieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-700">
        {label}

        {required && <span className="ml-1 text-blue-600">*</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        required={required}
        disabled={disabled}
        className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
      />
    </div>
  );
}

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  disabled,
}: TextAreaProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-700">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        disabled={disabled}
        className="w-full resize-y rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm leading-5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
      />
    </div>
  );
}
