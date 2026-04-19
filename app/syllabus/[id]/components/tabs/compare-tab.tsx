"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  GitCompareArrows,
  Loader2,
  RefreshCw,
} from "lucide-react";

import syllabusApiRequest from "@/apiRequests/syllabus";
import SectionCard from "@/components/section-card";
import { HttpError } from "@/lib/http";
import {
  SyllabusCompareDataType,
  SyllabusContentType,
} from "@/schemaValidations/syllabus.schema";

type Props = {
  subjectId: string;
};

type ComparePair = {
  newVersion: SyllabusContentType;
  oldVersion: SyllabusContentType;
};

const getTimestamp = (date?: string | null) => {
  if (!date) return 0;
  const parsed = new Date(date).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};

const formatDate = (date?: string | null) => {
  if (!date) return "Khong co du lieu";
  const timestamp = getTimestamp(date);
  if (!timestamp) return "Khong co du lieu";
  return new Date(timestamp).toLocaleDateString("vi-VN");
};

export default function CompareTab({ subjectId }: Props) {
  const [loadingVersions, setLoadingVersions] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comparison, setComparison] = useState<SyllabusCompareDataType | null>(
    null,
  );
  const [pair, setPair] = useState<ComparePair | null>(null);

  const loadComparableSyllabuses = useCallback(async () => {
    setLoadingVersions(true);
    setError(null);

    try {
      const syllabusesRes =
        await syllabusApiRequest.getSyllabusesBySubjectId(subjectId);
      const syllabuses = (syllabusesRes?.payload?.data ??
        []) as SyllabusContentType[];
      const sorted = [...syllabuses]
        .sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt))
        .filter((item) => Boolean(item.syllabusId));

      const newVersion = sorted.find((item) => item.status === "PUBLISHED");
      const oldVersion = sorted.find((item) => item.status === "ARCHIVED");

      if (!newVersion || !oldVersion) {
        setPair(null);
        setError("There is no available syllabuses to compare.");
        return;
      }

      setPair({ newVersion, oldVersion });
    } catch (e: unknown) {
      console.error("Failed to load syllabuses for comparison", e);
      const backendMessage =
        e instanceof HttpError
          ? e.payload?.message
          : e instanceof Error
            ? e.message
            : null;
      setError(
        backendMessage ||
          "An error occurred while loading syllabuses. Please try again.",
      );
      setPair(null);
    } finally {
      setLoadingVersions(false);
    }
  }, [subjectId]);

  const runCompare = useCallback(async () => {
    if (!pair) {
      setError("There is no available syllabuses to compare.");
      return;
    }

    setComparing(true);
    setError(null);

    try {
      const compareRes = await syllabusApiRequest.compareSyllabuses(
        pair.oldVersion.syllabusId,
        pair.newVersion.syllabusId,
      );

      setComparison(
        (compareRes?.payload?.data ?? null) as SyllabusCompareDataType | null,
      );
    } catch (e: unknown) {
      console.error("Failed to compare syllabuses", e);
      const backendMessage =
        e instanceof HttpError
          ? e.payload?.message
          : e instanceof Error
            ? e.message
            : null;
      setError(
        backendMessage ||
          "An error occurred while comparing syllabuses. Please try again.",
      );
      setComparison(null);
    } finally {
      setComparing(false);
    }
  }, [pair]);

  useEffect(() => {
    void loadComparableSyllabuses();
  }, [loadComparableSyllabuses]);

  const addedCount = useMemo(
    () => comparison?.added_concepts?.length ?? 0,
    [comparison],
  );
  const removedCount = useMemo(
    () => comparison?.removed_concepts?.length ?? 0,
    [comparison],
  );

  if (error) {
    return (
      <SectionCard className="p-8">
        <div className="flex items-start gap-3 text-red-700 bg-red-50 border border-red-100 rounded-xl p-4">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">{error}</p>
            <button
              onClick={() =>
                void (pair ? runCompare() : loadComparableSyllabuses())
              }
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#3D6B2C] bg-transparent border-2 border-[#3D6B2C] rounded-lg hover:bg-[#3D6B2C] hover:text-white transition-colors"
            >
              <RefreshCw size={16} />
              {pair ? "Compare" : "Try Again"}
            </button>
          </div>
        </div>
      </SectionCard>
    );
  }

  return (
    <div className="space-y-6">
      <SectionCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              Compare material between 2 versions
            </h3>
          </div>
          <button
            onClick={() => void runCompare()}
            disabled={loadingVersions || comparing || !pair}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#3D6B2C] bg-transparent border-2 border-[#3D6B2C] rounded-lg hover:bg-[#3D6B2C] hover:text-white transition-colors"
          >
            {comparing ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <GitCompareArrows size={16} />
            )}
            {comparing ? "Comparing..." : "Compare"}
          </button>
        </div>
        {loadingVersions ? (
          <p className="mt-3 text-sm text-gray-600">
            Loading syllabus versions...
          </p>
        ) : null}
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard className="p-6 border-l-4 border-[#3D6B2C]">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="text-[#3D6B2C]" size={18} />
            <p className="font-bold text-gray-900">New Version</p>
          </div>
          <InfoRow
            label="Syllabus"
            value={pair?.newVersion.syllabusName ?? ""}
          />{" "}
        </SectionCard>

        <SectionCard className="p-6 border-l-4 border-gray-400">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="text-gray-500" size={18} />
            <p className="font-bold text-gray-900">Old Version</p>
          </div>
          <InfoRow
            label="Syllabus"
            value={pair?.oldVersion.syllabusName ?? ""}
          />
        </SectionCard>
      </div>

      {comparison ? (
        <SectionCard className="p-6">
          <h4 className="font-bold text-gray-900 mb-4">Comparison Results</h4>

          <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-3">
            <InfoRow label="Added concepts" value={addedCount.toString()} />
            <InfoRow label="Removed concepts" value={removedCount.toString()} />
            <InfoRow
              label="Risk assessment"
              value={comparison.risk_assessment ?? "Unknown"}
            />
            <InfoRow
              label="Risk reason"
              value={comparison.risk_reason ?? "No information available"}
            />
          </div>
        </SectionCard>
      ) : (
        <SectionCard className="p-6 text-gray-600">
          Click Compare to view comparison results.
        </SectionCard>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-2">
      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
        {label}
      </p>
      <p className="text-sm text-gray-800 break-all">{value || "-"}</p>
    </div>
  );
}
