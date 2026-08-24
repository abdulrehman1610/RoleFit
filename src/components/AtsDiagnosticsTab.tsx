import React from "react";
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Award,
  FileCheck,
  Search,
  Scale,
  Sparkles,
  Zap,
  Info,
  Check
} from "lucide-react";
import { AnalysisResult } from "../types";

interface AtsDiagnosticsTabProps {
  result: AnalysisResult;
}

export const AtsDiagnosticsTab: React.FC<AtsDiagnosticsTabProps> = ({ result }) => {
  const getSeniorityBadge = (seniority: string) => {
    switch ((seniority || "").toLowerCase()) {
      case "lead":
      case "senior":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/70",
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
          desc: "Demonstrates strong system architecture ownership, mentorship, and autonomous technical leadership.",
        };
      case "mid-level":
        return {
          bg: "bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/70",
          icon: <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
          desc: "Demonstrates solid autonomous feature delivery and strong foundational code craft.",
        };
      case "overqualified":
        return {
          bg: "bg-purple-50 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/70",
          icon: <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
          desc: "Candidate exceeds role requirements significantly. Consider pitching at Staff/Principal or Director level.",
        };
      default:
        return {
          bg: "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
          icon: <Info className="w-4 h-4 text-slate-500 dark:text-slate-400" />,
          desc: "Early career profile. Focus on foundational technical velocity and project contributions.",
        };
    }
  };

  const currentSeniority = result.seniority_assessment || "Mid-Level";
  const seniority = getSeniorityBadge(currentSeniority);
  const atsWarnings = result.ats_warnings || [];
  const missingSkills = result.missing_skills || [];

  return (
    <div className="space-y-6">
      {/* Top Diagnostics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Seniority Assessment */}
        <div className="bg-white dark:bg-[#0F1626] border border-[#EDE8E1] dark:border-[#1C2638] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4 font-simple transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-[#1C2638]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FDE7DB] dark:bg-[#341F1A] flex items-center justify-center text-[#D06540] shadow-2xs">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white tracking-wider uppercase font-heading">
                  Seniority Level Assessment
                </h3>
                <p className="text-xs text-stone-400 font-normal font-simple">
                  Evaluated relative to target job scope
                </p>
              </div>
            </div>

            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase border ${seniority.bg}`}>
              {seniority.icon}
              {currentSeniority.toUpperCase()} LEVEL
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {seniority.desc}
          </p>

          <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1C2638] text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <div className="font-semibold text-slate-800 dark:text-slate-200 font-simple">
              Recruiter Sourcing Perspective:
            </div>
            <p className="font-normal">
              Candidates evaluated at <strong className="text-slate-900 dark:text-white">{currentSeniority}</strong> are reviewed for architecture depth, quantitative delivery metrics, and architectural trade-off reasoning during technical screens.
            </p>
          </div>
        </div>

        {/* Card 2: Anti-Bias & EEOC Compliance Scanner */}
        <div className="bg-white dark:bg-[#0F1626] border border-[#EDE8E1] dark:border-[#1C2638] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4 font-simple transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-[#1C2638]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FDE7DB] dark:bg-[#341F1A] flex items-center justify-center text-[#D06540] shadow-2xs">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white tracking-wider uppercase font-heading">
                  Anti-Bias & Compliance Scanner
                </h3>
                <p className="text-xs text-stone-400 font-normal font-simple">
                  EEOC protected class protection
                </p>
              </div>
            </div>

            {result.bias_flagged ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/70">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                ADVISORIES ({result.bias_warnings?.length || 1})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/70">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                EEOC COMPLIANT
              </span>
            )}
          </div>

          {result.bias_flagged && result.bias_warnings && result.bias_warnings.length > 0 ? (
            <div className="space-y-2">
              {result.bias_warnings.map((warn, wIdx) => (
                <div
                  key={wIdx}
                  className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5 font-normal"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span>{warn}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              No age, marital status, gender-coded keywords, or non-job-related personal characteristics were detected in the candidate text.
            </p>
          )}

          <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1C2638] text-[11px] text-slate-500 dark:text-slate-400 font-normal">
            Scanning filters for age cues (birth years, 'recent grad'), marital status, gender assumptions, and non-occupational disclosures.
          </div>
        </div>
      </div>

      {/* ATS Formatting & Parser Diagnostics */}
      <div className="bg-white dark:bg-[#0F1626] border border-[#EDE8E1] dark:border-[#1C2638] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4 font-simple transition-colors">
        <div className="flex items-center gap-3 pb-3 border-b border-stone-100 dark:border-[#1C2638]">
          <div className="w-10 h-10 rounded-2xl bg-[#FDE7DB] dark:bg-[#341F1A] flex items-center justify-center text-[#D06540] shadow-2xs">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white tracking-wider uppercase font-heading">
              ATS Formatting & Parser Diagnostics
            </h3>
            <p className="text-xs text-stone-400 font-normal font-simple">
              Compatibility checks for Workday, Greenhouse, Lever, and Taleo parsers
            </p>
          </div>
        </div>

        {/* Warning Checklist */}
        <div className="space-y-3">
          {atsWarnings.length > 0 ? (
            atsWarnings.map((warning, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50/70 dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1C2638] flex items-start gap-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-normal"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs font-mono">
                  {idx + 1}
                </div>
                <div className="leading-relaxed">
                  {warning}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5 font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Standard chronological formatting verified. Zero parser blocking structures found.</span>
            </div>
          )}
        </div>

        {/* Keyword Optimization Checklist */}
        {missingSkills.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-[#1C2638] space-y-3">
            <div className="text-lg font-heading text-slate-900 dark:text-white flex items-center gap-2 tracking-wide uppercase">
              <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Strategic Keywords for ATS Search Indexing
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 font-simple">
              {missingSkills.slice(0, 6).map((kw, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-slate-50/70 dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1C2638] text-xs flex items-center justify-between text-slate-700 dark:text-slate-200"
                >
                  <span className="font-mono text-emerald-700 dark:text-emerald-300 font-medium">{kw}</span>
                  <span className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold bg-white dark:bg-[#162032] px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-[#27354E] font-mono shadow-2xs">
                    TARGET +1-2X
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
