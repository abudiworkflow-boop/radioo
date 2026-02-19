"use client";

import { FileText, Monitor } from "lucide-react";
import type { AnalysisResponse } from "@/types";
import { FindingsCard } from "./findings-card";
import { ImpressionSection } from "./impression-section";
import { RecommendationsList } from "./recommendations-list";
import { PatientSummary } from "./patient-summary";
import { ReferencesPanel } from "./references-panel";
import { DisclaimerBanner } from "./disclaimer-banner";

export function MedicalReport({ data }: { data: AnalysisResponse }) {
  const { report, disclaimer } = data;

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">
            Radiology Report
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Exam:</span>{" "}
            <span className="text-gray-900 font-medium">
              {report.header.exam}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Date:</span>{" "}
            <span className="text-gray-900 font-medium">
              {report.header.date}
            </span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-gray-500">Clinical Indication:</span>{" "}
            <span className="text-gray-900">
              {report.header.clinicalIndication}
            </span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-gray-500">Technique:</span>{" "}
            <span className="text-gray-900">{report.header.technique}</span>
          </div>
        </div>
      </div>

      {/* Technical Quality */}
      {report.technicalQuality && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
          <Monitor className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-500">Image Quality:</span>
          <span className="text-xs font-medium text-gray-700 capitalize">
            {report.technicalQuality.overall}
          </span>
          <span className="text-xs text-gray-400">
            &mdash; {report.technicalQuality.details}
          </span>
        </div>
      )}

      {/* Findings */}
      {report.findings?.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
            Findings ({report.findings.length})
          </h3>
          <div className="space-y-3">
            {report.findings.map((finding) => (
              <FindingsCard key={finding.id} finding={finding} />
            ))}
          </div>
        </div>
      )}

      {/* Impression */}
      {report.impression && (
        <ImpressionSection impression={report.impression} />
      )}

      {/* Recommendations */}
      <RecommendationsList recommendations={report.recommendations} />

      {/* Patient Summary */}
      <PatientSummary summary={report.patientSummary} />

      {/* References */}
      <ReferencesPanel references={report.references} />

      {/* Disclaimer */}
      {disclaimer && <DisclaimerBanner text={disclaimer} />}
    </div>
  );
}
