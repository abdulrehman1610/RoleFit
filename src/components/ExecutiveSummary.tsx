import React from "react";
import {
  FileText,
  Award,
  Check
} from "lucide-react";
import { AnalysisResult } from "../types";

interface ExecutiveSummaryProps {
  result: AnalysisResult;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ result }) => {
  return (
    <div className="bg-white dark:bg-[#0F1626] border border-[#EDE8E1] dark:border-[#1C2638] rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden transition-colors">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
        <div className="flex-1 space-y-3.5">
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#FDE7DB] dark:bg-[#341F1A] text-[#D06540] flex items-center justify-center shadow-2xs shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white uppercase tracking-wider font-heading">
                  Executive Assessment & Strategy
                </h3>
                <p className="text-[11px] text-stone-400 font-normal font-simple">
                  Semantic synthesis of candidate qualifications vs role seniority
                </p>
              </div>
            </div>

            {/* Assessment Status & Latency */}
            <div className="flex items-center gap-2.5 text-xs font-mono bg-[#FAF8F5] dark:bg-[#0B101D] border border-stone-200/80 dark:border-[#1C2638] px-3.5 py-1.5 rounded-xl text-stone-500 dark:text-slate-400 font-simple">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1E7E34] dark:bg-[#4ADE80] animate-pulse"></span>
                <span className="text-stone-700 dark:text-slate-300 font-medium">Neural Match Complete</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span>Latency:</span>
                <strong className="text-[#D06540] dark:text-[#E88463] font-semibold">{result.latency_ms ?? 240}ms</strong>
              </span>
            </div>
          </div>

          {/* Qualitative Summary Content */}
          <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-300 leading-relaxed max-w-4xl font-normal font-simple">
            {result.qualitative_summary || result.readiness_rationale}
          </p>
        </div>

        {/* Right Decorative Mountain + Flag Graphic */}
        <div className="hidden lg:flex shrink-0 items-center justify-center relative p-3">
          <div className="w-28 h-24 relative">
            <svg viewBox="0 0 160 120" fill="none" className="w-full h-full">
              <path d="M20,120 L80,50 L140,120 Z" fill="#FCEEE7" className="dark:fill-slate-800/50" />
              <path d="M70,120 L120,40 L160,120 Z" fill="#EAF7EE" className="dark:fill-slate-800/30" />
              <path d="M120,40 L120,15" stroke="#182C25" strokeWidth="2" strokeLinecap="round" className="dark:stroke-slate-600" />
              <path d="M120,15 L145,23 L120,31 Z" fill="#1E7E34" className="dark:fill-emerald-600" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
