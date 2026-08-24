import React from "react";
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  Shield,
  Target,
  Star,
  Check,
  AlertTriangle
} from "lucide-react";
import { AnalysisResult } from "../types";

interface GapAnalysisTabProps {
  result: AnalysisResult;
}

export const GapAnalysisTab: React.FC<GapAnalysisTabProps> = ({ result }) => {
  const matched = result.matched_skills || [];
  const missing = result.missing_skills || [];
  const totalSkills = matched.length + missing.length;
  const matchPercentage = totalSkills > 0
    ? Math.round((matched.length / totalSkills) * 100)
    : 67;

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
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (matchPercentage / 100) * circumference;

  return (
    <div className="space-y-6 font-simple">
      {/* Top 3 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Card 1: Readiness Score */}
        <div className="bg-white dark:bg-[#0F1626] border border-[#EDE8E1] dark:border-[#1C2638] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between items-center text-center relative transition-colors">
          <div className="w-full flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#D06540]" />
              <h3 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider font-heading">
                Readiness Score
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EAF7EE] dark:bg-[#132A1F] text-[#1E7E34] dark:text-[#4ADE80] text-[11px] font-semibold">
              Validated
            </span>
          </div>

          {/* Circular SVG Gauge */}
          <div className="relative my-4 flex items-center justify-center">
            <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 130 130">
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="text-stone-100 dark:text-slate-800"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="65"
                cy="65"
                r={radius}
                stroke={tier.stroke}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white font-heading">
                {matchPercentage}%
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400 -mt-1">
                {tier.badge}
              </span>
            </div>
          </div>

          {/* Tier Footer Badge */}
          <div className="w-full pt-1">
            <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FDF0EB] dark:bg-[#341F1A] border border-[#F5D5C8] dark:border-[#4A2C24] text-xs font-semibold text-[#C85A32] dark:text-[#E88463] w-full">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{tier.label}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Matched Skills */}
        <div className="bg-white dark:bg-[#0F1626] border border-[#EDE8E1] dark:border-[#1C2638] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1E7E34] dark:text-[#4ADE80]" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider font-heading">
                  Matched Skills
                </h3>
              </div>
              <span className="text-xs text-stone-400 font-mono font-medium">
                {matched.length} of {totalSkills || 15}
              </span>
            </div>

            {/* Skill Pills */}
            <div className="flex flex-wrap gap-2 pt-1 max-h-48 overflow-y-auto">
              {matched.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EAF7EE] dark:bg-[#132A1F] text-[#1E7E34] dark:text-[#4ADE80] border border-[#CDEED5] dark:border-[#1E4D38] shadow-2xs"
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>{skill}</span>
                </span>
              ))}
              {matched.length === 0 && (
                <span className="text-xs text-stone-400 italic">
                  No verified skills matched.
                </span>
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-stone-100 dark:border-slate-800 text-xs text-stone-500 dark:text-slate-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#1E7E34]" />
            <span>Target skills verified in resume</span>
          </div>
        </div>

        {/* Card 3: Missing Skills */}
        <div className="bg-white dark:bg-[#0F1626] border border-[#EDE8E1] dark:border-[#1C2638] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#D06540]" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider font-heading">
                  Missing Skills
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FDF0EB] dark:bg-[#341F1A] text-[#C85A32] dark:text-[#E88463] text-[11px] font-bold">
                {missing.length} Gaps
              </span>
            </div>

            {/* Missing Skill Pills */}
            <div className="flex flex-wrap gap-2 pt-1 max-h-48 overflow-y-auto">
              {missing.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FDF0EB] dark:bg-[#341F1A] text-[#C85A32] dark:text-[#E88463] border border-[#F5D5C8] dark:border-[#4A2C24] shadow-2xs"
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>{skill}</span>
                </span>
              ))}
              {missing.length === 0 && (
                <span className="text-xs text-[#1E7E34] font-medium">
                  ✓ 100% skill coverage achieved!
                </span>
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-stone-100 dark:border-slate-800 text-xs text-stone-500 dark:text-slate-400 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-[#D06540]" />
            <span>Identified for role alignment</span>
          </div>
        </div>
      </div>
    </div>
  );
};
