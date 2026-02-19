"use client";

import { useState } from "react";
import { BookMarked, ChevronDown, ChevronUp } from "lucide-react";

export function ReferencesPanel({ references }: { references: string[] }) {
  const [open, setOpen] = useState(false);

  if (!references?.length) return null;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookMarked className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            References ({references.length})
          </span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {open && (
        <div className="px-4 py-3 space-y-1.5">
          {references.map((ref, i) => (
            <p key={i} className="text-xs text-gray-600 leading-relaxed">
              [{i + 1}] {ref}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
