"use client";

import {
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Finding } from "@/types";
import { useState } from "react";

const urgencyConfig: Record<
  string,
  { icon: typeof AlertTriangle; badge: string; border: string; label: string }
> = {
  CRITICAL: {
    icon: AlertTriangle,
    badge: "bg-red-100 text-red-800",
    border: "border-l-red-500",
    label: "CRITICAL",
  },
  URGENT: {
    icon: AlertCircle,
    badge: "bg-amber-100 text-amber-800",
    border: "border-l-amber-500",
    label: "URGENT",
  },
  ROUTINE: {
    icon: Info,
    badge: "bg-green-100 text-green-700",
    border: "border-l-green-400",
    label: "ROUTINE",
  },
  INFORMATIONAL: {
    icon: Info,
    badge: "bg-gray-100 text-gray-600",
    border: "border-l-gray-400",
    label: "INFO",
  },
};

const systemConfig: Record<string, { label: string; color: string }> = {
  lungs: { label: "Lungs", color: "bg-sky-100 text-sky-800" },
  pleura: { label: "Pleura", color: "bg-indigo-100 text-indigo-800" },
  heart: { label: "Heart", color: "bg-rose-100 text-rose-800" },
  mediastinum: { label: "Mediastinum", color: "bg-purple-100 text-purple-800" },
  bones: { label: "Bones", color: "bg-orange-100 text-orange-800" },
  other: { label: "Other", color: "bg-gray-100 text-gray-700" },
};

const confidenceColors: Record<string, string> = {
  high: "text-green-700",
  moderate: "text-amber-700",
  low: "text-red-700",
};

export function FindingsCard({ finding }: { finding: Finding }) {
  const [expanded, setExpanded] = useState(false);
  const config =
    urgencyConfig[finding.urgency?.toUpperCase()] || urgencyConfig.ROUTINE;
  const Icon = config.icon;
  const system =
    systemConfig[finding.system?.toLowerCase()] || systemConfig.other;

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
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                system.color
              )}
            >
              {system.label}
            </span>
            <span className="text-xs text-gray-500">{finding.location}</span>
            <span
              className={cn(
                "text-xs font-medium",
                confidenceColors[finding.confidence?.toLowerCase()] ||
                  "text-gray-500"
              )}
            >
              {finding.confidence} confidence
            </span>
          </div>
          <p className="text-sm text-gray-900 font-medium leading-relaxed">
            {finding.finding}
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
          {finding.description && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Description
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {finding.description}
              </p>
            </div>
          )}

          {finding.differential?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Differential Diagnosis
              </h4>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-0.5">
                {finding.differential.map((dx, i) => (
                  <li key={i}>{dx}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
