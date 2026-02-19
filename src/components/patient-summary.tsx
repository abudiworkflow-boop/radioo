import { Heart } from "lucide-react";

export function PatientSummary({ summary }: { summary: string }) {
  if (!summary) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <Heart className="w-5 h-5 text-blue-600" />
        <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wide">
          Patient-Friendly Summary
        </h3>
      </div>
      <p className="text-sm text-blue-900 leading-relaxed">{summary}</p>
    </div>
  );
}
