import React from "react";
import { Loader2 } from "lucide-react";

interface DashboardSkeletonProps {
  stageText?: string;
}

export const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({
  stageText = "Evaluating Match & ATS Alignment...",
}) => {
  return (
    <div className="space-y-6 animate-pulse font-simple">
      {/* Loading Header */}
      <div className="bg-white dark:bg-[#0F1626] border border-[#EDE8E1] dark:border-[#1C2638] rounded-3xl p-8 sm:p-10 shadow-xs flex flex-col items-center justify-center text-center space-y-4 transition-colors">
        <div className="w-14 h-14 rounded-2xl bg-[#FDE7DB] dark:bg-[#341F1A] text-[#D06540] flex items-center justify-center shadow-sm">
          <Loader2 className="w-7 h-7 animate-spin" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white font-heading tracking-tight">
            Analyzing Resume Match
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-slate-400 font-normal max-w-md mx-auto">
            {stageText}
          </p>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full max-w-xs mx-auto mt-2">
          <div className="h-1.5 bg-stone-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D06540] to-[#1E7E34] rounded-full"
              style={{
                animation: "shimmer 2s ease-in-out infinite",
                width: "60%",
              }}
            />
          </div>
        </div>
      </div>

      {/* Placeholder Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#0F1626] border border-[#EDE8E1] dark:border-[#1C2638] rounded-3xl p-6 sm:p-7 shadow-xs transition-colors"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-4 w-28 rounded-lg bg-stone-100 dark:bg-slate-800" />
                <div className="h-5 w-16 rounded-full bg-stone-100 dark:bg-slate-800" />
              </div>
              <div className="space-y-2.5 pt-2">
                <div className="h-3 w-full rounded bg-stone-100 dark:bg-slate-800" />
                <div className="h-3 w-4/5 rounded bg-stone-100 dark:bg-slate-800" />
                <div className="h-3 w-3/5 rounded bg-stone-100 dark:bg-slate-800" />
              </div>
              <div className="pt-3 border-t border-stone-100 dark:border-slate-800">
                <div className="h-3 w-32 rounded bg-stone-100 dark:bg-slate-800" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { width: 10%; margin-left: 0; }
          50% { width: 70%; margin-left: 15%; }
          100% { width: 10%; margin-left: 90%; }
        }
      `}</style>
    </div>
  );
};
