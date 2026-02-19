import {
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Finding } from "@/types";
import { useState } from "react";

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    badge: "bg-red-100 text-red-800",
    border: "border-l-red-500",
    label: "CRITICAL",
  },
  significant: {
    icon: AlertCircle,
    badge: "bg-amber-100 text-amber-800",
    border: "border-l-amber-500",
    label: "SIGNIFICANT",
  },
  incidental: {
    icon: Info,
    badge: "bg-gray-100 text-gray-600",
    border: "border-l-gray-400",
    label: "INCIDENTAL",
  },
};

const confidenceColors = {
  high: "text-green-700",
  moderate: "text-amber-700",
  low: "text-red-700",
};

export function FindingsCard({ finding }: { finding: Finding }) {
  const [expanded, setExpanded] = useState(false);
  const config = severityConfig[finding.severity] || severityConfig.incidental;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "border-l-4 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden",
        config.border
      )}
    >
      <div
        className="px-4 py-3 flex items-start justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
                config.badge
              )}
            >
              <Icon className="w-3 h-3" />
              {config.label}
            </span>
            <span className="text-xs text-gray-500">
              {finding.anatomicalLocation}
            </span>
            <span
              className={cn(
                "text-xs font-medium",
                confidenceColors[finding.confidence] || "text-gray-500"
              )}
            >
              {finding.confidence} confidence
            </span>
          </div>
          <p className="text-sm text-gray-900 leading-relaxed">
            {finding.observation}
          </p>
        </div>
        <button className="ml-3 mt-1 text-gray-400 hover:text-gray-600 flex-shrink-0">
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-1 space-y-3 border-t border-gray-100">
          {finding.differentialDiagnosis?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Differential Diagnosis
              </h4>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-0.5">
                {finding.differentialDiagnosis.map((dx, i) => (
                  <li key={i}>{dx}</li>
                ))}
              </ol>
            </div>
          )}

          {finding.evidenceFromKnowledgeBase && (
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <h4 className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                  Evidence from Knowledge Base
                </h4>
              </div>
              <p className="text-sm text-blue-900 leading-relaxed">
                {finding.evidenceFromKnowledgeBase}
              </p>
            </div>
          )}

          {finding.pineconeSources?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Sources
              </h4>
              <div className="flex flex-wrap gap-1">
                {finding.pineconeSources.map((src, i) => (
                  <span
                    key={i}
                    className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    {src}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
