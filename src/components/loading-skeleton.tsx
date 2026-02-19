import { Activity } from "lucide-react";

export function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-center gap-3 py-8">
        <Activity className="w-6 h-6 text-blue-500 animate-pulse" />
        <div>
          <p className="text-sm font-medium text-gray-700">
            AI Radiologist Analyzing Your Scan
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Querying knowledge base and generating report...
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-5 bg-gray-200 rounded w-2/5" />
        <div className="h-20 bg-gray-200 rounded" />
        <div className="h-5 bg-gray-200 rounded w-1/3" />
        <div className="h-32 bg-gray-200 rounded" />
        <div className="h-5 bg-gray-200 rounded w-1/4" />
        <div className="h-16 bg-gray-200 rounded" />
        <div className="h-24 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
