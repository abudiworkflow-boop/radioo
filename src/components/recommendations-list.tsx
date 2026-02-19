import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Recommendation } from "@/types";

const urgencyConfig = {
  immediate: { badge: "bg-red-100 text-red-800", label: "IMMEDIATE" },
  urgent: { badge: "bg-amber-100 text-amber-800", label: "URGENT" },
  routine: { badge: "bg-green-100 text-green-800", label: "ROUTINE" },
};

export function RecommendationsList({
  recommendations,
}: {
  recommendations: Recommendation[];
}) {
  if (!recommendations?.length) return null;

  return (
    <div>
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
        Recommendations
      </h3>
      <div className="space-y-2">
        {recommendations.map((rec, i) => {
          const config =
            urgencyConfig[rec.urgency] || urgencyConfig.routine;
          return (
            <div
              key={i}
              className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-3"
            >
              <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-semibold",
                      config.badge
                    )}
                  >
                    {config.label}
                  </span>
                </div>
                <p className="text-sm text-gray-900">{rec.action}</p>
                {rec.guideline && (
                  <p className="text-xs text-gray-500 mt-1 italic">
                    {rec.guideline}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
