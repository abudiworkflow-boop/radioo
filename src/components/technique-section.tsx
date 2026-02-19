import { Monitor, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Technique } from "@/types";

const qualityBadge = (value: string) => {
  const v = value.toLowerCase();
  if (v === "adequate" || v === "none")
    return "bg-green-100 text-green-800";
  if (v === "mild" || v === "low" || v === "under" || v === "over")
    return "bg-amber-100 text-amber-800";
  return "bg-gray-100 text-gray-600";
};

export function TechniqueSection({ technique }: { technique: Technique }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Monitor className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-bold text-gray-900">
          Technique &amp; Quality
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-4">
        <div>
          <span className="text-gray-500 text-xs uppercase tracking-wide">View</span>
          <p className="text-gray-900 font-medium">{technique.view}</p>
        </div>
        <div>
          <span className="text-gray-500 text-xs uppercase tracking-wide">Position</span>
          <p className="text-gray-900 font-medium capitalize">{technique.position}</p>
        </div>
        <div>
          <span className="text-gray-500 text-xs uppercase tracking-wide">Rotation</span>
          <span
            className={cn(
              "inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium capitalize",
              qualityBadge(technique.quality?.rotation || "unknown")
            )}
          >
            {technique.quality?.rotation || "unknown"}
          </span>
        </div>
        <div>
          <span className="text-gray-500 text-xs uppercase tracking-wide">Inspiration</span>
          <span
            className={cn(
              "inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium capitalize",
              qualityBadge(technique.quality?.inspiration || "unknown")
            )}
          >
            {technique.quality?.inspiration || "unknown"}
          </span>
        </div>
      </div>

      <div className="mb-2">
        <span className="text-gray-500 text-xs uppercase tracking-wide">Exposure</span>
        <span
          className={cn(
            "inline-block ml-2 px-2 py-0.5 rounded text-xs font-medium capitalize",
            qualityBadge(technique.quality?.exposure || "unknown")
          )}
        >
          {technique.quality?.exposure || "unknown"}
        </span>
      </div>

      {technique.limitations?.length > 0 && (
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
              Limitations
            </span>
          </div>
          <ul className="list-disc list-inside text-sm text-amber-900 space-y-0.5">
            {technique.limitations.map((lim, i) => (
              <li key={i}>{lim}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
