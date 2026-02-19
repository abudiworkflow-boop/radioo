import { Activity } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">RadAssist</h1>
          <p className="text-xs text-gray-500">
            AI-Powered Radiology Analysis
          </p>
        </div>
      </div>
    </header>
  );
}
