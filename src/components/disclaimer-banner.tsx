import { ShieldAlert } from "lucide-react";

export function DisclaimerBanner({ text }: { text: string }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-3">
      <ShieldAlert className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-gray-500 leading-relaxed">{text}</p>
    </div>
  );
}
