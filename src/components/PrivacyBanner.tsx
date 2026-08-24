import React, { useState } from "react";
import { ShieldCheck, Lock, EyeOff, X, CheckCircle2 } from "lucide-react";

export const PrivacyBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-violet-950/40 border-y border-indigo-500/20 backdrop-blur-md px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-slate-300">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div>
            <span className="font-semibold text-white">Privacy Guarantee:</span>{" "}
            All resume parsing & text processing occurs{" "}
            <span className="text-emerald-300 font-medium">ephemerally in-memory</span> with{" "}
            <span className="text-indigo-300 font-medium">zero server-side retention</span>. Your CV is never cached, indexed, or shared with third parties.
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-indigo-400" /> Client-Side Sandbox
            </span>
            <span className="flex items-center gap-1">
              <EyeOff className="w-3 h-3 text-indigo-400" /> Ephemeral Buffer
            </span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-slate-200 p-1 transition"
            aria-label="Dismiss privacy guarantee banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
