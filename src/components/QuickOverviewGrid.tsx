import React from "react";
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  Shield,
  Target,
  Sparkles,
  Award,
  TrendingUp,
  Star,
  Check,
  TriangleAlert,
  Crown
} from "lucide-react";
import { AnalysisResult } from "../types";

interface QuickOverviewGridProps {
  result: AnalysisResult;
}

export const QuickOverviewGrid: React.FC<QuickOverviewGridProps> = ({ result }) => {
  const matchedList = result.matched_skills || [];
  const missingList = result.missing_skills || [];
  const totalSkills = matchedList.length + missingList.length;
  const matchPct = totalSkills > 0 ? Math.round((matchedList.length / totalSkills) * 100) : 67;

  // Tier copy and color
  const getTierInfo = () => {
    switch (result.readiness_tier) {
      case 5:
        return { label: "Tier 5 Candidate (Executive / Direct Fit)", badge: "DIRECT ALIGNMENT", color: "text-[#1E7E34]", stroke: "#1E7E34" };
      case 4:
        return { label: "Tier 4 Candidate (High Match)", badge: "HIGH FIT", color: "text-[#1E7E34]", stroke: "#1E7E34" };
      case 3:
        return { label: "Tier 3 Candidate (Moderate Fit)", badge: "MODERATE FIT", color: "text-[#D06540]", stroke: "#D06540" };
      case 2:
        return { label: "Tier 2 Candidate (Developing Fit)", badge: "DEVELOPING", color: "text-[#D06540]", stroke: "#D06540" };
      default:
        return { label: "Tier 1 Candidate (Skill Misalignment)", badge: "MISALIGNMENT", color: "text-[#D06540]", stroke: "#D06540" };
    }
  };

  const tier = getTierInfo();

  return (
    <div className="space-y-6 font-simple">
      {/* 3 Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Card 1: Readiness Score */}
        <div className="bg-white dark:bg-[#0F1626] rounded-[24px] border border-[#eee5d8] dark:border-[#1C2638] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#fdf0e2] dark:bg-[#341F1A] border border-[#f5dcc2] dark:border-[#4A2C24] flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4 text-[#e07a4f]" />
                </div>
                <h3 className="font-bold text-[11px] tracking-[0.14em] uppercase text-[#14332a] dark:text-white">
                  Readiness Score
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#e6f0e6] dark:bg-[#132A1F] border border-[#d6e6d6] dark:border-[#1E4D38] text-[11px] font-semibold text-[#2d6a4f] dark:text-[#4ADE80]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2d6a4f] dark:bg-[#4ADE80]" />
                Validated
              </span>
            </div>

            <div className="mt-6 flex gap-5 items-center">
              {/* Circular Gauge */}
              <div className="relative w-[118px] h-[118px] shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2d6a4f" />
                      <stop offset="100%" stopColor="#e07a4f" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="#f1e6d6"
                    strokeWidth="10"
                    fill="transparent"
                    className="dark:stroke-[#1C2638]"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="url(#grad)"
                    strokeWidth="10"
                    strokeDasharray="314.159"
                    strokeDashoffset={314.159 - (314.159 * matchPct) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="text-[28px] font-extrabold leading-none text-[#14332a] dark:text-white">
                    {matchPct}%
                  </div>
                  <div className="text-[9px] font-bold tracking-[0.12em] text-[#7a8f87] dark:text-slate-400 uppercase mt-1 text-center">
                    {tier.badge}
                  </div>
                </div>
              </div>

              <p className="text-[13px] leading-[18px] text-[#5f7a72] dark:text-slate-300">
                You're on the right track! Strengthen key skills and fill the gaps to reach a high match tier.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#fdf0e2] dark:bg-[#341F1A] border border-[#f5dcc2] dark:border-[#4A2C24] text-[11px] font-semibold text-[#14332a] dark:text-slate-200">
              <Star className="w-3.5 h-3.5 text-[#e07a4f]" />
              <span>{tier.label}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Matched Skills */}
        <div className="bg-white dark:bg-[#0F1626] rounded-[24px] border border-[#eee5d8] dark:border-[#1C2638] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#e6f0e6] dark:bg-[#132A1F] border border-[#d6e6d6] dark:border-[#1E4D38] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-[#2d6a4f] dark:text-[#4ADE80]" />
                </div>
                <h3 className="font-bold text-[11px] tracking-[0.14em] uppercase text-[#14332a] dark:text-white">
                  Matched Skills
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#e6f0e6] dark:bg-[#132A1F] border border-[#d6e6d6] dark:border-[#1E4D38] text-[11px] font-bold text-[#2d6a4f] dark:text-[#4ADE80]">
                {matchedList.length} of {totalSkills || 15}
              </span>
            </div>

            {/* Pill chips */}
            <div className="mt-5 flex flex-wrap gap-2 max-h-36 overflow-y-auto custom-scroll">
              {matchedList.slice(0, 10).map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#eef6ee] dark:bg-[#132A1F]/80 border border-[#d6e6d6] dark:border-[#1E4D38] text-[12px] font-medium text-[#2d6a4f] dark:text-[#4ADE80]"
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>{skill}</span>
                </span>
              ))}
              {matchedList.length > 10 && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#f6f0e8] dark:bg-[#1A2235] border border-[#e8ddd0] dark:border-[#2C384D] text-[12px] font-medium text-[#14332a] dark:text-slate-300">
                  +{matchedList.length - 10} more
                </span>
              )}
            </div>
          </div>

          <div className="mt-auto pt-5 flex items-center gap-2 text-[11px] font-medium text-[#5f7a72] dark:text-slate-500">
            <Award className="w-4 h-4 text-[#2d6a4f] dark:text-[#4ADE80]" />
            <span>Target skills verified in resume</span>
          </div>
        </div>

        {/* Card 3: Missing Skills */}
        <div className="bg-white dark:bg-[#0F1626] rounded-[24px] border border-[#eee5d8] dark:border-[#1C2638] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#fde9e0] dark:bg-[#341F1A] border border-[#f5cbb2] dark:border-[#4A2C24] flex items-center justify-center shrink-0">
                  <TriangleAlert className="w-4 h-4 text-[#e07a4f] dark:text-[#E88463]" />
                </div>
                <h3 className="font-bold text-[11px] tracking-[0.14em] uppercase text-[#14332a] dark:text-white">
                  Missing Skills
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#fde9e0] dark:bg-[#341F1A] border border-[#f5cbb2] dark:border-[#4A2C24] text-[11px] font-bold text-[#c26a3a] dark:text-[#E88463]">
                {missingList.length} Gaps
              </span>
            </div>

            {/* Pill chips */}
            <div className="mt-5 flex flex-wrap gap-2 max-h-36 overflow-y-auto custom-scroll">
              {missingList.length > 0 ? (
                missingList.map((skill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fdf0e2] dark:bg-[#341F1A]/80 border border-[#f5dcc2] dark:border-[#4A2C24] text-[12px] font-medium text-[#8a4a2e] dark:text-[#E88463]"
                  >
                    <TriangleAlert className="w-3 h-3 text-[#e07a4f] dark:text-[#E88463]" />
                    <span>{skill}</span>
                  </span>
                ))
              ) : (
                <p className="text-xs text-[#2d6a4f] font-medium py-2">
                  ✓ No critical skill gaps identified for this role!
                </p>
              )}
            </div>
          </div>

          <div className="mt-auto pt-5 flex items-center gap-2 text-[11px] font-medium text-[#8a7a6f] dark:text-slate-500">
            <Target className="w-4 h-4 text-[#e07a4f] dark:text-[#E88463]" />
            <span>Identified for role alignment</span>
          </div>
        </div>
      </div>

      {/* Row 2: Executive Assessment & Strategy Card */}
      <div className="bg-white dark:bg-[#0F1626] rounded-[24px] border border-[#eee5d8] dark:border-[#1C2638] p-5 lg:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden transition-colors">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-[#fdf0e2] dark:bg-[#341F1A] border border-[#f5dcc2] dark:border-[#4A2C24] flex items-center justify-center shrink-0">
              <Crown className="w-4 h-4 text-[#e07a4f] dark:text-[#E88463]" />
            </div>
            <div>
              <h3 className="font-bold text-[12px] tracking-[0.14em] uppercase text-[#14332a] dark:text-white">
                Executive Assessment & Strategy
              </h3>
              <p className="text-[12px] text-[#8aa099] dark:text-slate-400 mt-1">
                Semantic synthesis of candidate qualifications vs role seniority
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e6f0e6] dark:bg-[#132A1F] border border-[#d6e6d6] dark:border-[#1E4D38] text-[11px] font-semibold text-[#2d6a4f] dark:text-[#4ADE80]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2d6a4f] dark:bg-[#4ADE80]" />
              Neural Match Complete
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#fdf0e2] dark:bg-[#341F1A] border border-[#f5dcc2] dark:border-[#4A2C24] text-[11px] font-medium text-[#14332a] dark:text-slate-300">
              Latency: <span className="font-bold text-[#e07a4f] dark:text-[#E88463]">{result.latency_ms ?? 240}ms</span>
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-col lg:flex-row gap-8">
          <p className="flex-1 text-[14px] leading-[22px] text-[#3b4f48] dark:text-slate-300">
            {result.qualitative_summary || result.readiness_rationale || "Candidate exhibits strong core engineering foundations with potential gaps in advanced system design."}
          </p>
          
          {/* Card-in-Card Graphic */}
          <div className="lg:w-[220px] shrink-0 flex items-center justify-center">
            <div className="relative w-[180px] h-[92px]">
              <div className="absolute bottom-0 left-0 w-[110px] h-[70px] bg-[#d8efe0] dark:bg-[#132A1F] rounded-t-[60px]" />
              <div className="absolute bottom-0 left-[70px] w-[90px] h-[56px] bg-[#fde9d9] dark:bg-[#341F1A] rounded-t-[50px]" />
              <div className="absolute bottom-[46px] left-[98px] flex items-start">
                <div className="w-[2px] h-[22px] bg-[#14332a] dark:bg-emerald-800" />
                <div className="w-5 h-3 bg-[#2d6a4f] dark:bg-[#4ADE80] rounded-r-[3px] -ml-[1px]" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[6px] bg-[#14332a]/10 dark:bg-black/50 rounded-full blur-[0.5px]" />
              <div className="absolute bottom-2 left-6 w-1 h-1 bg-white rounded-full opacity-80" />
              <div className="absolute bottom-5 left-12 w-1.5 h-1.5 bg-white rounded-full opacity-60" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
