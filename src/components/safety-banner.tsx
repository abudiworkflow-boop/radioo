import { ShieldCheck } from "lucide-react";
import type { Safety } from "@/types";

export function SafetyBanner({ safety }: { safety: Safety }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="w-5 h-5 text-slate-600" />
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          AI Confidence &amp; Safety
        </h3>
      </div>
      <p className="text-sm text-slate-700 leading-relaxed mb-3">
        {safety.confidence_summary}
      </p>
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
          Not a Diagnosis
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
          Radiologist Review Required
        </span>
      </div>
    </div>
  );
}
