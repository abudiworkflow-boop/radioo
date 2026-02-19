import { ClipboardList } from "lucide-react";

export function ImpressionSection({ impression }: { impression: string }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <ClipboardList className="w-5 h-5 text-amber-700" />
        <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wide">
          Impression
        </h3>
      </div>
      <div className="text-sm text-amber-950 leading-relaxed whitespace-pre-line font-medium">
        {impression}
      </div>
    </div>
  );
}
