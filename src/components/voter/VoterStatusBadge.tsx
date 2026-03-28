import React from "react";
import { VoterStatus } from "@/lib/voter-logic";
import { cn } from "@/lib/utils";

interface VoterStatusBadgeProps {
  status: VoterStatus;
  className?: string;
}

export function VoterStatusBadge({ status, className }: VoterStatusBadgeProps) {
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-4 py-2 rounded-full border border-opacity-20 shadow-sm",
      status.bg,
      className
    )}
    style={{ borderColor: status.color }}
    >
      <span className="text-lg">{status.icon}</span>
      <span className="text-xs font-black uppercase tracking-widest" style={{ color: status.color }}>
        {status.label}
      </span>
      {status.level >= 3 && (
        <div className="flex gap-0.5 ml-1">
          {[...Array(status.level)].map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full" style={{ backgroundColor: status.color }} />
          ))}
        </div>
      )}
    </div>
  );
}
