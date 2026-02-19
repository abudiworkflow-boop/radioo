import { Cable, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Device } from "@/types";

const statusConfig: Record<string, { icon: typeof CheckCircle; badge: string; label: string }> = {
  appropriate: {
    icon: CheckCircle,
    badge: "bg-green-100 text-green-800",
    label: "Appropriate",
  },
  malpositioned: {
    icon: AlertTriangle,
    badge: "bg-red-100 text-red-800",
    label: "Malpositioned",
  },
  uncertain: {
    icon: HelpCircle,
    badge: "bg-amber-100 text-amber-800",
    label: "Uncertain",
  },
  not_present: {
    icon: CheckCircle,
    badge: "bg-gray-100 text-gray-600",
    label: "Not Present",
  },
};

const urgencyBorder: Record<string, string> = {
  CRITICAL: "border-l-red-500",
  URGENT: "border-l-amber-500",
  INFORMATIONAL: "border-l-green-400",
};

const deviceLabels: Record<string, string> = {
  ETT: "Endotracheal Tube",
  NGT: "Nasogastric Tube",
  CVC: "Central Venous Catheter",
  other: "Other Device",
};

export function DevicesSection({ devices }: { devices: Device[] }) {
  if (!devices?.length) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Cable className="w-4 h-4 text-gray-600" />
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
          Devices &amp; Lines
        </h3>
      </div>
      <div className="space-y-2">
        {devices.map((device, i) => {
          const status =
            statusConfig[device.status] || statusConfig.uncertain;
          const Icon = status.icon;
          const border =
            urgencyBorder[device.urgency?.toUpperCase()] ||
            "border-l-gray-300";

          return (
            <div
              key={i}
              className={cn(
                "border-l-4 bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-start gap-3",
                border
              )}
            >
              <Icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-medium text-gray-900">
                    {deviceLabels[device.type] || device.type}
                  </span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-semibold",
                      status.badge
                    )}
                  >
                    {status.label}
                  </span>
                  {device.confidence && (
                    <span className="text-xs text-gray-500">
                      {device.confidence} confidence
                    </span>
                  )}
                </div>
                {device.details && (
                  <p className="text-sm text-gray-600">{device.details}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
