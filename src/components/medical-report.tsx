"use client";

import type { AnalysisResponse } from "@/types";
import { TechniqueSection } from "./technique-section";
import { DevicesSection } from "./devices-section";
import { FindingsCard } from "./findings-card";
import { ImpressionSection } from "./impression-section";
import { RecommendationsList } from "./recommendations-list";
import { SafetyBanner } from "./safety-banner";
import { DisclaimerBanner } from "./disclaimer-banner";

export function MedicalReport({ data }: { data: AnalysisResponse }) {
  const { report, disclaimer } = data;

  return (
    <div className="space-y-6">
      {/* Technique & Quality */}
      {report.technique && (
        <TechniqueSection technique={report.technique} />
      )}

      {/* Devices & Lines */}
      {report.devices?.length > 0 && (
        <DevicesSection devices={report.devices} />
      )}

      {/* Findings */}
      {report.findings?.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
            Findings ({report.findings.length})
          </h3>
          <div className="space-y-3">
            {report.findings.map((finding, idx) => (
              <FindingsCard key={idx} finding={finding} />
            ))}
          </div>
        </div>
      )}

      {/* Impression */}
      {report.impression?.length > 0 && (
        <ImpressionSection items={report.impression} />
      )}

      {/* Recommendations */}
      <RecommendationsList recommendations={report.recommendations} />

      {/* Safety Banner */}
      {report.safety && <SafetyBanner safety={report.safety} />}

      {/* Disclaimer */}
      {disclaimer && <DisclaimerBanner text={disclaimer} />}
    </div>
  );
}
