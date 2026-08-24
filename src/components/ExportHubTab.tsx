import React, { useState } from "react";
import {
  Download,
  Copy,
  Check,
  FileCode,
  FileText,
  Sparkles,
  CheckSquare,
  Square,
  Shield,
  ArrowDownToLine,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { AnalysisResult } from "../types";
import { safeCopyToClipboard, safeDownloadFile } from "../utils/safeHelpers";

interface ExportHubTabProps {
  result: AnalysisResult;
  sourceResumeText: string;
  selectedBulletIndices: number[];
  onToggleBulletSelect: (index: number) => void;
  onShowToast?: (text: string, type: "info" | "warning" | "error" | "success") => void;
}

export const ExportHubTab: React.FC<ExportHubTabProps> = ({
  result,
  sourceResumeText,
  selectedBulletIndices,
  onToggleBulletSelect,
  onShowToast,
}) => {
  const [copiedCv, setCopiedCv] = useState(false);

  // Generate tailored resume by replacing original bullets with selected suggested bullets
  const generateTailoredResume = () => {
    let tailoredText = sourceResumeText || "";
    (result.rewrite_suggestions || []).forEach((item, idx) => {
      if (selectedBulletIndices.includes(idx) && item.original_bullet && item.suggested_bullet) {
        if (tailoredText.includes(item.original_bullet)) {
          tailoredText = tailoredText.replace(item.original_bullet, item.suggested_bullet);
        } else if (tailoredText.includes(item.original_bullet.trim())) {
          tailoredText = tailoredText.replace(item.original_bullet.trim(), item.suggested_bullet.trim());
        }
      }
    });
    return tailoredText;
  };

  const tailoredResume = generateTailoredResume();

  const handleCopyTailoredCV = async () => {
    const res = await safeCopyToClipboard(tailoredResume);
    if (res.success) {
      setCopiedCv(true);
      setTimeout(() => setCopiedCv(false), 2000);
      if (res.fallbackUsed && onShowToast) {
        onShowToast("Couldn't copy automatically — text selected for manual copy.", "info");
      } else if (onShowToast) {
        onShowToast("Tailored CV copied to clipboard!", "success");
      }
    } else {
      if (onShowToast) {
        onShowToast("Could not copy text automatically. Please select and copy manually.", "error");
      }
    }
  };

  const handleDownloadReportJSON = () => {
    try {
      const reportData = {
        meta: {
          application: "ResumeMatch",
          version: "2.5",
          timestamp: result.timestamp || new Date().toISOString(),
        },
        telemetry: {
          provider_used: result.provider_used,
          provider_model: result.provider_model,
          latency_ms: result.latency_ms,
          overall_grounding_score: result.overall_grounding_score,
        },
        assessment: {
          readiness_tier: result.readiness_tier,
          seniority_assessment: result.seniority_assessment,
          readiness_rationale: result.readiness_rationale,
          qualitative_summary: result.qualitative_summary,
        },
        skill_matrix: {
          matched_skills: result.matched_skills || [],
          missing_skills: result.missing_skills || [],
        },
        ats_audit: {
          warnings: result.ats_warnings || [],
          bias_flagged: Boolean(result.bias_flagged),
          bias_warnings: result.bias_warnings || [],
        },
        optimized_bullets: result.rewrite_suggestions || [],
      };

      const res = safeDownloadFile(
        JSON.stringify(reportData, null, 2),
        `ResumeMatch_Report_${new Date().toISOString().slice(0, 10)}.json`,
        "application/json"
      );

      if (res.success) {
        if (onShowToast) onShowToast("Match Report JSON downloaded successfully.", "success");
      } else {
        if (onShowToast) onShowToast(res.error || "Download failed — try again or copy the text manually.", "error");
      }
    } catch (e: any) {
      if (onShowToast) onShowToast("Download failed — try again or copy the text manually.", "error");
    }
  };

  const handleDownloadCVFile = (format: "txt" | "md") => {
    const extension = format === "md" ? "md" : "txt";
    const res = safeDownloadFile(
      tailoredResume,
      `Tailored_Resume_${new Date().toISOString().slice(0, 10)}.${extension}`,
      "text/plain;charset=utf-8"
    );

    if (res.success) {
      if (onShowToast) onShowToast(`Tailored resume downloaded as .${extension}`, "success");
    } else {
      if (onShowToast) onShowToast(res.error || "Download failed — try again or copy the text manually.", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Full JSON Report Export */}
        <div className="bg-white dark:bg-[#0F1626] border border-[#EDE8E1] dark:border-[#1C2638] rounded-3xl p-6 sm:p-7 shadow-xs dark:shadow-xl flex flex-col justify-between space-y-4 font-simple transition-colors">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FDE7DB] dark:bg-[#341F1A] flex items-center justify-center text-[#D06540] shadow-2xs">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white tracking-wider uppercase font-heading">
                  Download Match Report (JSON)
                </h3>
                <p className="text-xs text-stone-400 font-normal font-simple">
                  Full structured assessment data & telemetry
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-4">
              Exports a machine-readable audit report containing verified skill matrices, ATS diagnostics, readiness tiers, and execution telemetry for downstream tooling or archival.
            </p>
          </div>

          <button
            type="button"
            id="download-json-report-btn"
            onClick={handleDownloadReportJSON}
            className="w-full py-3.5 px-5 rounded-2xl bg-slate-100 dark:bg-[#162032] hover:bg-slate-200 dark:hover:bg-[#1E2B42] border border-slate-200 dark:border-[#27354E] text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-200 flex items-center justify-center gap-2.5 transition active:scale-98 shadow-2xs dark:shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Download Structured JSON Report</span>
          </button>
        </div>

        {/* Card 2: Formatted Tailored CV Export */}
        <div className="bg-white dark:bg-[#0F1626] border border-[#EDE8E1] dark:border-[#1C2638] rounded-3xl p-6 sm:p-7 shadow-xs dark:shadow-xl flex flex-col justify-between space-y-4 font-simple transition-colors">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white tracking-wider uppercase font-heading">
                  Export Tailored Resume
                </h3>
                <p className="text-xs text-stone-400 font-normal font-simple">
                  Ready-to-submit text formatted with active STAR bullets
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-4">
              Generates an updated resume combining candidate experience with high-relevance STAR achievements selected in the optimizer tab.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              id="download-cv-txt-btn"
              onClick={() => handleDownloadCVFile("txt")}
              className="py-3 px-4 rounded-2xl bg-slate-100 dark:bg-[#162032] hover:bg-slate-200 dark:hover:bg-[#1E2B42] border border-slate-200 dark:border-[#27354E] text-xs font-medium text-slate-900 dark:text-slate-200 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
            >
              <ArrowDownToLine className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Download (.txt)</span>
            </button>
            <button
              type="button"
              id="download-cv-md-btn"
              onClick={() => handleDownloadCVFile("md")}
              className="py-3 px-4 rounded-2xl bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-400 text-xs font-bold text-white dark:text-slate-950 flex items-center justify-center gap-2 transition active:scale-98 shadow-md shadow-emerald-500/25 cursor-pointer"
            >
              <Download className="w-4 h-4 text-white dark:text-slate-950" />
              <span>Download (.md)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Tailored Resume Preview Box */}
      <div className="bg-white dark:bg-[#0F1626] border border-[#EDE8E1] dark:border-[#1C2638] rounded-3xl p-6 sm:p-7 shadow-xs dark:shadow-xl space-y-4 font-simple transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-[#1C2638]">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white tracking-wider uppercase font-heading">
              Live Tailored Resume Preview
            </h3>
            <p className="text-xs text-slate-400 font-normal">
              {selectedBulletIndices.length} of {(result.rewrite_suggestions || []).length} AI STAR replacements active
            </p>
          </div>

          <button
            type="button"
            id="copy-tailored-cv-btn"
            onClick={handleCopyTailoredCV}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#162032] hover:bg-slate-200 dark:hover:bg-[#1E2B42] border border-slate-200 dark:border-[#27354E] text-xs font-semibold text-slate-800 dark:text-slate-200 transition active:scale-98 cursor-pointer"
          >
            {copiedCv ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-400">Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>Copy Full Resume</span>
              </>
            )}
          </button>
        </div>

        {/* Editable / Viewable Preview Area */}
        <div className="p-5 bg-slate-50/70 dark:bg-[#0B101D] border border-slate-200 dark:border-[#1C2638] rounded-2xl">
          <pre className="text-xs text-slate-800 dark:text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-[360px] overflow-y-auto">
            {tailoredResume}
          </pre>
        </div>
      </div>
    </div>
  );
};
