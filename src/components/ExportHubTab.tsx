import React, { useState } from "react";
import {
  Download,
  Copy,
  Check,
  FileCode,
  FileText,
  Sparkles,
  Mail,
  ArrowDownToLine,
  RefreshCw,
  Loader2,
  Send,
  SlidersHorizontal,
  CheckCircle2
} from "lucide-react";
import { AnalysisResult, AISettings, CoverLetterTone } from "../types";
import { safeCopyToClipboard, safeDownloadFile } from "../utils/safeHelpers";
import { generateCoverLetter } from "../services/aiService";

interface ExportHubTabProps {
  result: AnalysisResult;
  sourceResumeText: string;
  jobDescription?: string;
  settings?: AISettings;
  selectedBulletIndices: number[];
  onToggleBulletSelect: (index: number) => void;
  onShowToast?: (text: string, type: "info" | "warning" | "error" | "success") => void;
}

export const ExportHubTab: React.FC<ExportHubTabProps> = ({
  result,
  sourceResumeText,
  jobDescription = "",
  settings,
  selectedBulletIndices,
  onToggleBulletSelect,
  onShowToast,
}) => {
  const [copiedCv, setCopiedCv] = useState(false);
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);
  const [coverLetterText, setCoverLetterText] = useState<string>(result.cover_letter || "");
  const [selectedTone, setSelectedTone] = useState<CoverLetterTone>("confident");
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);

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
          application: "RoleFit",
          version: "1.0",
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
        cover_letter: coverLetterText || undefined,
      };

      const res = safeDownloadFile(
        JSON.stringify(reportData, null, 2),
        `RoleFit_Report_${new Date().toISOString().slice(0, 10)}.json`,
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

  const handleGenerateCoverLetter = async () => {
    setIsGeneratingCoverLetter(true);
    try {
      const activeSettings: AISettings = settings || {
        groqApiKey: "",
        groqModel: "openai/gpt-oss-120b",
        geminiApiKey: "",
        geminiModel: "gemini-2.5-flash",
        enableGeminiFallback: true,
        forceMockMode: false,
      };

      const letter = await generateCoverLetter(
        sourceResumeText,
        jobDescription,
        result,
        activeSettings,
        selectedTone
      );

      setCoverLetterText(letter);
      if (onShowToast) {
        onShowToast(`Tailored ${selectedTone} cover letter generated successfully!`, "success");
      }
    } catch (e: any) {
      if (onShowToast) {
        onShowToast("Failed to generate cover letter. Try again or check API settings.", "error");
      }
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  const handleCopyCoverLetter = async () => {
    if (!coverLetterText) return;
    const res = await safeCopyToClipboard(coverLetterText);
    if (res.success) {
      setCopiedCoverLetter(true);
      setTimeout(() => setCopiedCoverLetter(false), 2000);
      if (onShowToast) onShowToast("Cover letter copied to clipboard!", "success");
    } else {
      if (onShowToast) onShowToast("Could not copy text automatically. Please copy manually.", "error");
    }
  };

  const handleDownloadCoverLetter = (format: "txt" | "md") => {
    if (!coverLetterText) return;
    const extension = format === "md" ? "md" : "txt";
    const res = safeDownloadFile(
      coverLetterText,
      `Cover_Letter_${new Date().toISOString().slice(0, 10)}.${extension}`,
      "text/plain;charset=utf-8"
    );

    if (res.success) {
      if (onShowToast) onShowToast(`Cover letter downloaded as .${extension}`, "success");
    } else {
      if (onShowToast) onShowToast(res.error || "Download failed.", "error");
    }
  };

  const coverLetterWords = coverLetterText.trim() ? coverLetterText.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6 font-simple">
      {/* Top Action Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Full JSON Report Export */}
        <div className="bg-white dark:bg-[#0F1626] border border-[#eee5d8] dark:border-[#1C2638] rounded-[24px] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4 transition-colors">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#fdf0e2] dark:bg-[#341F1A] border border-[#f5dcc2] dark:border-[#4A2C24] flex items-center justify-center text-[#e07a4f] shadow-2xs">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#14332a] dark:text-white uppercase tracking-wider">
                  Download Match Report (JSON)
                </h3>
                <p className="text-xs text-[#7a8f87] dark:text-slate-400 font-medium">
                  Full structured assessment data & telemetry
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#3b4f48] dark:text-slate-300 leading-relaxed mb-4">
              Exports a machine-readable audit report containing verified skill matrices, ATS diagnostics, readiness tiers, and execution telemetry for downstream tooling or archival.
            </p>
          </div>

          <button
            type="button"
            id="download-json-report-btn"
            onClick={handleDownloadReportJSON}
            className="w-full py-3 px-5 rounded-full bg-[#fdf8f0] dark:bg-[#162032] hover:bg-[#f6eee3] dark:hover:bg-[#1E2B42] border border-[#eee5d8] dark:border-[#27354E] text-xs sm:text-sm font-semibold text-[#14332a] dark:text-slate-200 flex items-center justify-center gap-2.5 transition active:scale-98 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#2d6a4f] dark:text-[#4ADE80]" />
            <span>Download Structured JSON Report</span>
          </button>
        </div>

        {/* Card 2: Formatted Tailored CV Export */}
        <div className="bg-white dark:bg-[#0F1626] border border-[#eee5d8] dark:border-[#1C2638] rounded-[24px] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4 transition-colors">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#e6f0e6] dark:bg-[#132A1F] border border-[#d6e6d6] dark:border-[#1E4D38] text-[#2d6a4f] dark:text-[#4ADE80] flex items-center justify-center shadow-2xs">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#14332a] dark:text-white uppercase tracking-wider">
                  Export Tailored Resume
                </h3>
                <p className="text-xs text-[#7a8f87] dark:text-slate-400 font-medium">
                  Formatted text with active STAR bullets
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#3b4f48] dark:text-slate-300 leading-relaxed mb-4">
              Generates an updated resume combining candidate experience with high-relevance STAR achievements selected in the optimizer tab.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              id="download-cv-txt-btn"
              onClick={() => handleDownloadCVFile("txt")}
              className="py-3 px-4 rounded-full bg-[#fdf8f0] dark:bg-[#162032] hover:bg-[#f6eee3] dark:hover:bg-[#1E2B42] border border-[#eee5d8] dark:border-[#27354E] text-xs font-semibold text-[#14332a] dark:text-slate-200 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
            >
              <ArrowDownToLine className="w-4 h-4 text-[#7a8f87] dark:text-slate-400" />
              <span>Download (.txt)</span>
            </button>
            <button
              type="button"
              id="download-cv-md-btn"
              onClick={() => handleDownloadCVFile("md")}
              className="py-3 px-4 rounded-full bg-[#14332a] hover:bg-[#0f2d22] dark:bg-emerald-900 dark:hover:bg-emerald-800 text-xs font-bold text-white flex items-center justify-center gap-2 transition active:scale-98 shadow-[0_4px_12px_rgba(20,51,42,0.18)] dark:shadow-none cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#fde9d9]" />
              <span>Download (.md)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature 1: 1-Click AI Cover Letter Generator Card */}
      <div className="bg-white dark:bg-[#0F1626] border border-[#eee5d8] dark:border-[#1C2638] rounded-[28px] p-5 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eee5d8] dark:border-[#1C2638]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#fde9d9] dark:bg-[#341F1A] border border-[#f5cbb2] dark:border-[#4A2C24] flex items-center justify-center text-[#e07a4f] shadow-2xs shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-[#14332a] dark:text-white uppercase tracking-wider">
                  1-Click AI Cover Letter Generator
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#fdf0e2] dark:bg-[#341F1A] border border-[#f5dcc2] dark:border-[#4A2C24] text-[10px] font-bold text-[#c26a3a] dark:text-[#E88463] uppercase">
                  NEW
                </span>
              </div>
              <p className="text-xs text-[#7a8f87] dark:text-slate-400 font-medium mt-0.5">
                High-converting 3-paragraph letter strictly anchored in real candidate achievements
              </p>
            </div>
          </div>

          {/* Tone Selector Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#fdf8f0] dark:bg-[#0B101D] border border-[#eee5d8] dark:border-[#1C2638] self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setSelectedTone("confident")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                selectedTone === "confident"
                  ? "bg-[#14332a] dark:bg-emerald-900 text-white shadow-2xs"
                  : "text-[#7a8f87] dark:text-slate-400 hover:text-[#14332a] dark:hover:text-white"
              }`}
            >
              Direct & Confident
            </button>
            <button
              type="button"
              onClick={() => setSelectedTone("enthusiastic")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                selectedTone === "enthusiastic"
                  ? "bg-[#14332a] dark:bg-emerald-900 text-white shadow-2xs"
                  : "text-[#7a8f87] dark:text-slate-400 hover:text-[#14332a] dark:hover:text-white"
              }`}
            >
              Modern & Enthusiastic
            </button>
            <button
              type="button"
              onClick={() => setSelectedTone("executive")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                selectedTone === "executive"
                  ? "bg-[#14332a] dark:bg-emerald-900 text-white shadow-2xs"
                  : "text-[#7a8f87] dark:text-slate-400 hover:text-[#14332a] dark:hover:text-white"
              }`}
            >
              Executive & Strategic
            </button>
          </div>
        </div>

        {/* Generator Controls / State */}
        {!coverLetterText ? (
          <div className="rounded-[20px] bg-[#fffdf8] dark:bg-[#0B101D] border border-dashed border-[#e6ddd0] dark:border-[#1C2638] p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#fdf0e2] dark:bg-[#341F1A] text-[#e07a4f] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#14332a] dark:text-white">
                No Cover Letter Generated Yet
              </h4>
              <p className="text-xs text-[#7a8f87] dark:text-slate-400 max-w-md mx-auto mt-1">
                Click below to synthesize a tailored cover letter customized for your target role using verified candidate metrics.
              </p>
            </div>

            <button
              type="button"
              id="generate-cover-letter-btn"
              onClick={handleGenerateCoverLetter}
              disabled={isGeneratingCoverLetter}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#14332a] hover:bg-[#0f2d22] dark:bg-emerald-900 dark:hover:bg-emerald-800 text-white text-xs font-bold shadow-[0_4px_16px_rgba(20,51,42,0.2)] dark:shadow-none transition active:scale-98 cursor-pointer disabled:opacity-75"
            >
              {isGeneratingCoverLetter ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Composing {selectedTone} Cover Letter...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#fde9d9]" />
                  <span>Generate Tailored Cover Letter</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Live Editable Textarea */}
            <div className="relative rounded-[20px] bg-[#fffdf8] dark:bg-[#0B101D] border border-[#eee5d8] dark:border-[#1C2638] p-4 sm:p-5 transition-colors">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#eee5d8] dark:border-[#1C2638]">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#2d6a4f] dark:text-[#4ADE80]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{selectedTone.toUpperCase()} TONE COVER LETTER</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#c26a3a] dark:text-[#E88463] uppercase">
                    {coverLetterWords} Words
                  </span>
                </div>
              </div>

              <textarea
                value={coverLetterText}
                onChange={(e) => setCoverLetterText(e.target.value)}
                placeholder="Your generated cover letter will appear here..."
                className="w-full h-64 bg-transparent text-xs leading-relaxed text-[#3b4f48] dark:text-slate-200 placeholder-stone-400 focus:outline-none resize-y custom-scroll font-simple"
              />
            </div>

            {/* Cover Letter Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={handleGenerateCoverLetter}
                disabled={isGeneratingCoverLetter}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#fdf8f0] dark:bg-[#162032] hover:bg-[#f6eee3] dark:hover:bg-[#1E2B42] border border-[#eee5d8] dark:border-[#27354E] text-xs font-semibold text-[#14332a] dark:text-slate-200 transition cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingCoverLetter ? "animate-spin" : ""}`} />
                <span>Regenerate with New Tone</span>
              </button>

              <div className="flex items-center gap-2.5 ml-auto">
                <button
                  type="button"
                  id="copy-cover-letter-btn"
                  onClick={handleCopyCoverLetter}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#fdf8f0] dark:bg-[#162032] hover:bg-[#f6eee3] dark:hover:bg-[#1E2B42] border border-[#eee5d8] dark:border-[#27354E] text-xs font-semibold text-[#14332a] dark:text-slate-200 transition active:scale-98 cursor-pointer"
                >
                  {copiedCoverLetter ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#2d6a4f] dark:text-[#4ADE80]" />
                      <span className="text-[#2d6a4f] dark:text-[#4ADE80]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#7a8f87] dark:text-slate-400" />
                      <span>Copy Letter</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadCoverLetter("txt")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#fdf8f0] dark:bg-[#162032] hover:bg-[#f6eee3] dark:hover:bg-[#1E2B42] border border-[#eee5d8] dark:border-[#27354E] text-xs font-semibold text-[#14332a] dark:text-slate-200 transition active:scale-98 cursor-pointer"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5 text-[#7a8f87] dark:text-slate-400" />
                  <span>.txt</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadCoverLetter("md")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#14332a] hover:bg-[#0f2d22] dark:bg-emerald-900 dark:hover:bg-emerald-800 text-xs font-bold text-white transition active:scale-98 shadow-2xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#fde9d9]" />
                  <span>.md</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live Tailored Resume Preview Box */}
      <div className="bg-white dark:bg-[#0F1626] border border-[#eee5d8] dark:border-[#1C2638] rounded-[28px] p-5 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#eee5d8] dark:border-[#1C2638]">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#14332a] dark:text-white uppercase tracking-wider">
              Live Tailored Resume Preview
            </h3>
            <p className="text-xs text-[#7a8f87] dark:text-slate-400 font-medium">
              {selectedBulletIndices.length} of {(result.rewrite_suggestions || []).length} AI STAR replacements active
            </p>
          </div>

          <button
            type="button"
            id="copy-tailored-cv-btn"
            onClick={handleCopyTailoredCV}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#fdf8f0] dark:bg-[#162032] hover:bg-[#f6eee3] dark:hover:bg-[#1E2B42] border border-[#eee5d8] dark:border-[#27354E] text-xs font-semibold text-[#14332a] dark:text-slate-200 transition active:scale-98 cursor-pointer"
          >
            {copiedCv ? (
              <>
                <Check className="w-4 h-4 text-[#2d6a4f] dark:text-[#4ADE80]" />
                <span className="text-[#2d6a4f] dark:text-[#4ADE80]">Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#7a8f87] dark:text-slate-400" />
                <span>Copy Full Resume</span>
              </>
            )}
          </button>
        </div>

        {/* Editable / Viewable Preview Area */}
        <div className="p-4 sm:p-5 bg-[#fffdf8] dark:bg-[#0B101D] border border-[#eee5d8] dark:border-[#1C2638] rounded-[20px]">
          <pre className="text-xs text-[#3b4f48] dark:text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-[360px] overflow-y-auto custom-scroll">
            {tailoredResume}
          </pre>
        </div>
      </div>
    </div>
  );
};
