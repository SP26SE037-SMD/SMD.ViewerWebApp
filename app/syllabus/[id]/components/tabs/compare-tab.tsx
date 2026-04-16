// app/syllabus/[id]/components/tabs/compare-tab.tsx
"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FlaskConical,
  RefreshCw,
} from "lucide-react";
import SectionCard from "@/components/section-card";

type Props = {
  syllabusId: string;
};

type ComparisonView = "basic" | "sessions" | "clos" | "assessments";

type CompareContent = {
  syllabusCode: string;
  syllabusName: string;
  credit: number;
  minAvgGrade: number;
  status: string;
  approvedDate?: string;
  createdAt?: string;
};

type CompareSession = {
  sessionId: string;
  sessionNumber: number;
  sessionTitle: string;
  content: string;
  teachingMethods: string;
};

type CompareClo = {
  cloCode: string;
  cloName: string;
};

type CompareAssessment = {
  assessmentId: string;
  categoryName: string;
  completionCriteria: string;
  weight: number;
};

type CompareVersion = {
  content: CompareContent;
  sessions: CompareSession[];
  clos: CompareClo[];
  assessments: CompareAssessment[];
};

type CompareData = {
  published: CompareVersion;
  archived: CompareVersion;
};

const MOCK_COMPARE_DATA: CompareData = {
  published: {
    content: {
      syllabusCode: "SWE201-PUB-v3",
      syllabusName: "Software Engineering Fundamentals",
      credit: 3,
      minAvgGrade: 5,
      status: "PUBLISHED",
      approvedDate: "2026-03-20",
      createdAt: "2026-03-01",
    },
    sessions: [
      {
        sessionId: "pub-1",
        sessionNumber: 1,
        sessionTitle: "Introduction to SDLC",
        content: "Overview of software process models and project constraints.",
        teachingMethods: "Lecture + mini case study",
      },
      {
        sessionId: "pub-2",
        sessionNumber: 2,
        sessionTitle: "Requirements Engineering",
        content: "Functional and non-functional requirement elicitation.",
        teachingMethods: "Lecture + group discussion",
      },
    ],
    clos: [
      {
        cloCode: "CLO1",
        cloName: "Apply SDLC concepts to solve practical software problems.",
      },
      {
        cloCode: "CLO2",
        cloName: "Create and review requirement specifications.",
      },
    ],
    assessments: [
      {
        assessmentId: "pub-a1",
        categoryName: "Assignment",
        completionCriteria: "Submit requirement specification and peer review.",
        weight: 30,
      },
      {
        assessmentId: "pub-a2",
        categoryName: "Final Exam",
        completionCriteria:
          "Closed-book written exam about process and design.",
        weight: 40,
      },
    ],
  },
  archived: {
    content: {
      syllabusCode: "SWE201-ARC-v2",
      syllabusName: "Software Engineering",
      credit: 3,
      minAvgGrade: 4,
      status: "ARCHIVED",
      approvedDate: "2025-08-12",
      createdAt: "2025-07-28",
    },
    sessions: [
      {
        sessionId: "arc-1",
        sessionNumber: 1,
        sessionTitle: "Software Process Basics",
        content: "Basic process models and team roles.",
        teachingMethods: "Lecture",
      },
      {
        sessionId: "arc-2",
        sessionNumber: 2,
        sessionTitle: "Requirement Gathering",
        content: "Interview techniques and documenting requirements.",
        teachingMethods: "Lecture + individual task",
      },
    ],
    clos: [
      {
        cloCode: "CLO1",
        cloName:
          "Understand fundamental software development life cycle phases.",
      },
      {
        cloCode: "CLO2",
        cloName: "Describe requirement analysis artifacts.",
      },
    ],
    assessments: [
      {
        assessmentId: "arc-a1",
        categoryName: "Assignment",
        completionCriteria: "Submit requirement document draft.",
        weight: 20,
      },
      {
        assessmentId: "arc-a2",
        categoryName: "Final Exam",
        completionCriteria:
          "Written exam on lifecycle models and requirements.",
        weight: 50,
      },
    ],
  },
};

export default function CompareTab({ syllabusId }: Props) {
  const [activeView, setActiveView] = useState<ComparisonView>("basic");
  const comparison = MOCK_COMPARE_DATA;

  void syllabusId;

  return (
    <div className="space-y-6">
      {/* Header với nút chuyển view */}
      <SectionCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              So sánh phiên bản
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Phiên bản công bố vs Phiên bản lưu trữ mới nhất
            </p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <FlaskConical size={14} />
              Dữ liệu mẫu
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#3D6B2C] bg-transparent border-2 border-[#3D6B2C] rounded-lg hover:bg-[#3D6B2C] hover:text-white transition-colors"
          >
            <RefreshCw size={16} />
            Tải lại
          </button>
        </div>

        {/* Tabs chuyển giữa các loại so sánh */}
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { id: "basic", label: "Thông tin cơ bản" },
            { id: "sessions", label: "Buổi học" },
            { id: "clos", label: "CLOs" },
            { id: "assessments", label: "Đánh giá" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as ComparisonView)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                activeView === tab.id
                  ? "bg-[#3D6B2C] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </SectionCard>

      {/* Main comparison area - 2 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column: Phiên bản công bố (trái) */}
        <div>
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-600" size={20} />
              <div>
                <p className="font-bold text-green-900">Phiên bản công bố</p>
                <p className="text-xs text-green-700 mt-1">
                  {comparison.published.content?.approvedDate
                    ? new Date(
                        comparison.published.content.approvedDate,
                      ).toLocaleDateString("vi-VN")
                    : "Chưa được phê duyệt"}
                </p>
              </div>
            </div>
          </div>

          {activeView === "basic" && (
            <CompareBasicInfoColumn data={comparison.published.content} />
          )}
          {activeView === "sessions" && (
            <CompareSessionsColumn sessions={comparison.published.sessions} />
          )}
          {activeView === "clos" && (
            <CompareClosColumn clos={comparison.published.clos} />
          )}
          {activeView === "assessments" && (
            <CompareAssessmentsColumn
              assessments={comparison.published.assessments}
            />
          )}
        </div>

        {/* Column: Phiên bản lưu trữ (phải) */}
        <div>
          <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-blue-600" size={20} />
              <div>
                <p className="font-bold text-blue-900">Phiên bản lưu trữ</p>
                <p className="text-xs text-blue-700 mt-1">
                  {comparison.archived.content?.createdAt
                    ? new Date(
                        comparison.archived.content.createdAt,
                      ).toLocaleDateString("vi-VN")
                    : "Không có dữ liệu"}
                </p>
              </div>
            </div>
          </div>

          {activeView === "basic" && (
            <CompareBasicInfoColumn data={comparison.archived.content} />
          )}
          {activeView === "sessions" && (
            <CompareSessionsColumn sessions={comparison.archived.sessions} />
          )}
          {activeView === "clos" && (
            <CompareClosColumn clos={comparison.archived.clos} />
          )}
          {activeView === "assessments" && (
            <CompareAssessmentsColumn
              assessments={comparison.archived.assessments}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ===== Sub-components =====

function CompareBasicInfoColumn({ data }: { data: CompareContent | null }) {
  if (!data) {
    return (
      <SectionCard className="p-6 text-center text-gray-500">
        Không có dữ liệu
      </SectionCard>
    );
  }

  return (
    <SectionCard className="overflow-hidden">
      <div className="space-y-1 divide-y divide-gray-100">
        <InfoRow label="Mã tài liệu" value={data.syllabusCode} />
        <InfoRow label="Tên tài liệu" value={data.syllabusName} />
        <InfoRow label="Tín chỉ" value={String(data.credit)} />
        <InfoRow label="Điểm TB tối thiểu" value={String(data.minAvgGrade)} />
        <InfoRow label="Trạng thái" value={data.status} />
      </div>
    </SectionCard>
  );
}

function CompareSessionsColumn({ sessions }: { sessions: CompareSession[] }) {
  if (!sessions || sessions.length === 0) {
    return (
      <SectionCard className="p-6 text-center text-gray-500">
        Không có buổi học
      </SectionCard>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <SectionCard key={session.sessionId} className="p-4">
          <p className="font-semibold text-gray-900 text-sm">
            Buổi {session.sessionNumber}: {session.sessionTitle}
          </p>
          <p className="text-xs text-gray-600 mt-2 line-clamp-2">
            {session.content || "Không có nội dung"}
          </p>
          {session.teachingMethods && (
            <p className="text-xs text-gray-600 mt-1">
              <span className="font-semibold">Phương pháp:</span>{" "}
              {session.teachingMethods}
            </p>
          )}
        </SectionCard>
      ))}
    </div>
  );
}

function CompareClosColumn({ clos }: { clos: CompareClo[] }) {
  if (!clos || clos.length === 0) {
    return (
      <SectionCard className="p-6 text-center text-gray-500">
        Không có CLOs
      </SectionCard>
    );
  }

  return (
    <div className="space-y-2">
      {clos.map((clo, idx) => (
        <SectionCard key={idx} className="p-3">
          <div className="flex gap-3">
            <div className="font-semibold text-[#3D6B2C] text-xs bg-gray-100 px-2 py-1 rounded min-w-fit">
              {clo.cloCode}
            </div>
            <p className="text-sm text-gray-700">{clo.cloName}</p>
          </div>
        </SectionCard>
      ))}
    </div>
  );
}

function CompareAssessmentsColumn({
  assessments,
}: {
  assessments: CompareAssessment[];
}) {
  if (!assessments || assessments.length === 0) {
    return (
      <SectionCard className="p-6 text-center text-gray-500">
        Không có tiêu chí đánh giá
      </SectionCard>
    );
  }

  return (
    <div className="space-y-2">
      {assessments.map((assessment, idx) => (
        <SectionCard key={idx} className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900">
                {assessment.categoryName}
              </p>
              {assessment.completionCriteria && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {assessment.completionCriteria}
                </p>
              )}
            </div>
            {assessment.weight && (
              <div className="font-bold text-sm text-[#3D6B2C] bg-green-50 px-3 py-1 rounded-full whitespace-nowrap">
                {assessment.weight}%
              </div>
            )}
          </div>
        </SectionCard>
      ))}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-white">
      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
        {label}
      </p>
      <p className="text-sm text-gray-800">{value || "-"}</p>
    </div>
  );
}
