import { ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImpressionItem } from "@/types";

const urgencyBadge: Record<string, string> = {
  CRITICAL: "bg-red-100 text-red-800",
  URGENT: "bg-amber-100 text-amber-800",
  ROUTINE: "bg-green-100 text-green-700",
  INFORMATIONAL: "bg-gray-100 text-gray-600",
};

export function ImpressionSection({ items }: { items: ImpressionItem[] }) {
  if (!items?.length) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <ClipboardList className="w-5 h-5 text-amber-700" />
        <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wide">
          Impression
        </h3>
      </div>
      <ol className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-sm font-bold text-amber-800 mt-0.5 flex-shrink-0">
              {i + 1}.
            </span>
            <span
              className={cn(
                "px-1.5 py-0.5 rounded text-xs font-semibold flex-shrink-0 mt-0.5",
                urgencyBadge[item.urgency?.toUpperCase()] ||
                  urgencyBadge.ROUTINE
              )}
            >
              {item.urgency?.toUpperCase() || "ROUTINE"}
            </span>
            <span className="text-sm text-amber-950 leading-relaxed font-medium">
              {item.text}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
