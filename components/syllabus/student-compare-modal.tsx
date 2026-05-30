"use client";

import { useEffect, useState } from "react";
import { X, AlertTriangle, CheckCircle, Info, ArrowRight } from "lucide-react";
import syllabusApiRequest from "@/apiRequests/syllabus";
import { SyllabusStudentCompareDataType } from "@/schemaValidations/syllabus.schema";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  syllabusId: string;
};

export default function StudentCompareModal({ isOpen, onClose, syllabusId }: Props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SyllabusStudentCompareDataType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen || !syllabusId) return;
      setLoading(true);
      setError(null);
      try {
        const response = await syllabusApiRequest.getSyllabusCompareStudent(syllabusId);
        if (response.payload?.data) {
          setData(response.payload.data);
        } else {
          setError("No comparison data available.");
        }
      } catch (err: any) {
        console.error("Failed to fetch compare data", err);
        setError("Failed to fetch comparison data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, syllabusId]);

  if (!isOpen) return null;

  let assessmentDiff: any = null;
  let conceptDiff: any = null;

  if (data) {
    try {
      if (data.assessmentDiffJson) assessmentDiff = JSON.parse(data.assessmentDiffJson);
      if (data.conceptDiffJson) conceptDiff = JSON.parse(data.conceptDiffJson);
    } catch (e) {
      console.error("Failed to parse diff JSON", e);
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk?.toUpperCase()) {
      case "HIGH":
        return "bg-red-50 text-red-700 border-red-200";
      case "MEDIUM":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "LOW":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk?.toUpperCase()) {
      case "HIGH":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case "MEDIUM":
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case "LOW":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Syllabus Version Changes</h2>
            <p className="text-sm text-gray-500 mt-1">Review the changes from the previous syllabus version.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
              <p className="text-gray-500 mt-4">Loading changes...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{error}</p>
            </div>
          ) : data ? (
            <div className="space-y-8">
              {/* Risk Assessment */}
              {conceptDiff?.risk_assessment && (
                <div className={`p-4 rounded-xl border ${getRiskColor(conceptDiff.risk_assessment)} flex items-start gap-3`}>
                  <div className="mt-0.5">{getRiskIcon(conceptDiff.risk_assessment)}</div>
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-wider mb-1">
                      Risk Assessment: {conceptDiff.risk_assessment}
                    </h3>
                    <p className="text-sm opacity-90">{conceptDiff.risk_reason}</p>
                  </div>
                </div>
              )}

              {/* Assessment Changes */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Info size={16} />
                  </div>
                  Assessment Changes
                </h3>
                
                {assessmentDiff?.addedAssessments?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-green-700 mb-2">Added Assessments</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      {assessmentDiff.addedAssessments.map((a: any, i: number) => (
                        <li key={i}>{a.assessmentIdentifier || JSON.stringify(a)}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {assessmentDiff?.removedAssessments?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-red-700 mb-2">Removed Assessments</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      {assessmentDiff.removedAssessments.map((a: any, i: number) => (
                        <li key={i} className="line-through">{a.assessmentIdentifier || JSON.stringify(a)}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {assessmentDiff?.changedAssessments?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-orange-700 mb-2">Modified Assessments</h4>
                    <div className="space-y-3">
                      {assessmentDiff.changedAssessments.map((a: any, i: number) => (
                        <div key={i} className="bg-orange-50/50 p-3 rounded-lg border border-orange-100">
                          <p className="font-medium text-orange-900 text-sm mb-1">{a.assessmentIdentifier}</p>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-orange-800">
                            {a.detailChanges?.map((change: string, idx: number) => (
                              <li key={idx}>{change}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!assessmentDiff?.addedAssessments?.length && !assessmentDiff?.removedAssessments?.length && !assessmentDiff?.changedAssessments?.length) && (
                  <p className="text-sm text-gray-500 italic">No assessment changes.</p>
                )}
              </div>

              {/* Concept Changes */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Info size={16} />
                  </div>
                  Concept Changes
                </h3>

                {conceptDiff?.added_concepts?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-green-700 mb-2">Added Concepts</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      {conceptDiff.added_concepts.map((c: string, i: number) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {conceptDiff?.removed_concepts?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-red-700 mb-2">Removed Concepts</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      {conceptDiff.removed_concepts.map((c: string, i: number) => (
                        <li key={i} className="line-through">{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {conceptDiff?.modified_concepts?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-orange-700 mb-2">Modified Concepts</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      {conceptDiff.modified_concepts.map((c: string, i: number) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {(!conceptDiff?.added_concepts?.length && !conceptDiff?.removed_concepts?.length && !conceptDiff?.modified_concepts?.length) && (
                  <p className="text-sm text-gray-500 italic">No concept changes.</p>
                )}
              </div>

            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              <p>No data available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
