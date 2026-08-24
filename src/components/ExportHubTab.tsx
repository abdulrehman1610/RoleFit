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
  CheckCircle2,
  Printer,
  Eye
} from "lucide-react";
import { AnalysisResult, AISettings, CoverLetterTone } from "../types";
import { safeCopyToClipboard, safeDownloadFile } from "../utils/safeHelpers";
import { generateCoverLetter } from "../services/aiService";
import { ResumePreviewModal } from "./ResumePreviewModal";

interface ExportHubTabProps {
  result: AnalysisResult;
  sourceResumeText: string;
  jobDescription?: string;
  settings?: AISettings;
  selectedBulletIndices: number[];
  onToggleBulletSelect: (index: number) => void;
  onShowToast?: (text: string, type: "info" | "warning" | "error" | "success") => void;
}

const TONE_LABELS: Record<CoverLetterTone, string> = {
  confident: "Direct & Confident",
  enthusiastic: "Modern & Enthusiastic",
  executive: "Executive & Strategic",
};

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
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Tone state & cache of generated letters per tone
  const [selectedTone, setSelectedTone] = useState<CoverLetterTone>("confident");
  const [activeLetterTone, setActiveLetterTone] = useState<CoverLetterTone>("confident");
  const [toneCache, setToneCache] = useState<Partial<Record<CoverLetterTone, string>>>(
    result.cover_letter ? { confident: result.cover_letter } : {}
  );
  const [coverLetterText, setCoverLetterText] = useState<string>(result.cover_letter || "");
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
        cover_letter_tone: activeLetterTone,
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

  // Generate cover letter for a specific tone
  const runGeneration = async (tone: CoverLetterTone) => {
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
        tone
      );

      setCoverLetterText(letter);
      setActiveLetterTone(tone);
      setToneCache((prev) => ({ ...prev, [tone]: letter }));

      if (onShowToast) {
        onShowToast(`${TONE_LABELS[tone]} cover letter generated successfully!`, "success");
      }
    } catch (e: any) {
      if (onShowToast) {
        onShowToast("Failed to generate cover letter. Try again or check API settings.", "error");
      }
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  // When clicking a tone pill
  const handleSelectTone = (tone: CoverLetterTone) => {
    setSelectedTone(tone);

    if (toneCache[tone]) {
      setCoverLetterText(toneCache[tone]!);
      setActiveLetterTone(tone);
      return;
    }

    if (coverLetterText) {
      runGeneration(tone);
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
      `Cover_Letter_${activeLetterTone}_${new Date().toISOString().slice(0, 10)}.${extension}`,
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
        <div className="bg-white border border-[#eee5d8] rounded-[24px] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4 transition-colors">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#fdf0e2] border border-[#f5dcc2] flex items-center justify-center text-[#e07a4f] shadow-2xs">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#14332a] uppercase tracking-wider">
                  Download Match Report (JSON)
                </h3>
                <p className="text-xs text-[#7a8f87] font-medium">
                  Full structured assessment data & telemetry
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#3b4f48] leading-relaxed mb-4">
              Exports a machine-readable audit report containing verified skill matrices, ATS diagnostics, readiness tiers, and execution telemetry for downstream tooling or archival.
            </p>
          </div>

          <button
            type="button"
            id="download-json-report-btn"
            onClick={handleDownloadReportJSON}
            className="w-full py-3 px-5 rounded-full bg-[#fdf8f0] hover:bg-[#f6eee3] border border-[#eee5d8] text-xs sm:text-sm font-semibold text-[#14332a] flex items-center justify-center gap-2.5 transition active:scale-98 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#2d6a4f]" />
            <span>Download Structured JSON Report</span>
          </button>
        </div>

        {/* Card 2: Formatted Tailored CV Export */}
        <div className="bg-white border border-[#eee5d8] rounded-[24px] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4 transition-colors">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#e6f0e6] border border-[#d6e6d6] text-[#2d6a4f] flex items-center justify-center shadow-2xs">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#14332a] uppercase tracking-wider">
                  Export Tailored Resume
                </h3>
                <p className="text-xs text-[#7a8f87] font-medium">
                  Harvard & Stanford visual PDF + raw files
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#3b4f48] leading-relaxed mb-4">
              Generates an updated resume combining candidate experience with high-relevance STAR achievements selected in the optimizer tab.
            </p>
          </div>

          <div className="space-y-2.5">
            {/* Primary Action: Visual PDF Preview Modal */}
            <button
              type="button"
              id="open-pdf-preview-btn"
              onClick={() => setIsPdfModalOpen(true)}
              className="w-full py-3 px-4 rounded-full bg-[#14332a] hover:bg-[#0f2d22] text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-2 transition active:scale-98 shadow-[0_4px_12px_rgba(20,51,42,0.18)] cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#fde9d9]" />
              <span>Preview & Export PDF (Harvard / Stanford)</span>
            </button>

            {/* Secondary Actions: .txt and .md */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="download-cv-txt-btn"
                onClick={() => handleDownloadCVFile("txt")}
                className="py-2.5 px-4 rounded-full bg-[#fdf8f0] hover:bg-[#f6eee3] border border-[#eee5d8] text-xs font-semibold text-[#14332a] flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
              >
                <ArrowDownToLine className="w-3.5 h-3.5 text-[#7a8f87]" />
                <span>Download (.txt)</span>
              </button>
              <button
                type="button"
                id="download-cv-md-btn"
                onClick={() => handleDownloadCVFile("md")}
                className="py-2.5 px-4 rounded-full bg-[#fdf8f0] hover:bg-[#f6eee3] border border-[#eee5d8] text-xs font-semibold text-[#14332a] flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#7a8f87]" />
                <span>Download (.md)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 1: 1-Click AI Cover Letter Generator Card */}
      <div className="bg-white border border-[#eee5d8] rounded-[28px] p-5 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eee5d8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#fde9d9] border border-[#f5cbb2] flex items-center justify-center text-[#e07a4f] shadow-2xs shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#14332a] uppercase tracking-wider">
                1-Click AI Cover Letter Generator
              </h3>
              <p className="text-xs text-[#7a8f87] font-medium mt-0.5">
                High-converting 3-paragraph letter strictly anchored in real candidate achievements
              </p>
            </div>
          </div>

          {/* Tone Selector Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#fdf8f0] border border-[#eee5d8] self-start sm:self-auto">
            {(["confident", "enthusiastic", "executive"] as CoverLetterTone[]).map((tone) => (
              <button
                key={tone}
                type="button"
                onClick={() => handleSelectTone(tone)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  selectedTone === tone
                    ? "bg-[#14332a] text-white shadow-2xs"
                    : "text-[#7a8f87] hover:text-[#14332a]"
                }`}
              >
                {TONE_LABELS[tone]}
              </button>
            ))}
          </div>
        </div>

        {/* Generator Controls / State */}
        {!coverLetterText && !isGeneratingCoverLetter ? (
          <div className="rounded-[20px] bg-[#fffdf8] border border-dashed border-[#e6ddd0] p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#fdf0e2] text-[#e07a4f] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#14332a]">
                No Cover Letter Generated Yet
              </h4>
              <p className="text-xs text-[#7a8f87] max-w-md mx-auto mt-1">
                Select your preferred tone above and click below to synthesize a tailored cover letter customized for your target role.
              </p>
            </div>

            <button
              type="button"
              id="generate-cover-letter-btn"
              onClick={() => runGeneration(selectedTone)}
              disabled={isGeneratingCoverLetter}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#14332a] hover:bg-[#0f2d22] text-white text-xs font-bold shadow-[0_4px_16px_rgba(20,51,42,0.2)] transition active:scale-98 cursor-pointer disabled:opacity-75"
            >
              <Sparkles className="w-4 h-4 text-[#fde9d9]" />
              <span>Generate {TONE_LABELS[selectedTone]} Cover Letter</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Live Editable Textarea */}
            <div className="relative rounded-[20px] bg-[#fffdf8] border border-[#eee5d8] p-4 sm:p-5 transition-colors">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#eee5d8]">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#2d6a4f]">
                  {isGeneratingCoverLetter ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#e07a4f]" />
                      <span className="text-[#e07a4f]">GENERATING {selectedTone.toUpperCase()} COVER LETTER...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#2d6a4f]" />
                      <span>{activeLetterTone.toUpperCase()} TONE COVER LETTER</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#c26a3a] uppercase">
                    {coverLetterWords} Words
                  </span>
                </div>
              </div>

              <div className="relative">
                {isGeneratingCoverLetter && (
                  <div className="absolute inset-0 bg-[#fffdf8]/85 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2 z-10 rounded-xl animate-fade-in">
                    <Loader2 className="w-6 h-6 text-[#14332a] animate-spin" />
                    <span className="text-xs font-bold text-[#14332a]">
                      Composing {TONE_LABELS[selectedTone]} Cover Letter...
                    </span>
                  </div>
                )}
                <textarea
                  value={coverLetterText}
                  onChange={(e) => {
                    setCoverLetterText(e.target.value);
                    setToneCache((prev) => ({ ...prev, [activeLetterTone]: e.target.value }));
                  }}
                  placeholder="Your generated cover letter will appear here..."
                  className="w-full h-64 bg-transparent text-xs leading-relaxed text-[#3b4f48] placeholder-stone-400 focus:outline-none resize-y custom-scroll font-simple"
                />
              </div>
            </div>

            {/* Cover Letter Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => runGeneration(selectedTone)}
                disabled={isGeneratingCoverLetter}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#fdf8f0] hover:bg-[#f6eee3] border border-[#eee5d8] text-xs font-semibold text-[#14332a] transition cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingCoverLetter ? "animate-spin" : ""}`} />
                <span>Regenerate ({TONE_LABELS[selectedTone]})</span>
              </button>

              <div className="flex items-center gap-2.5 ml-auto">
                <button
                  type="button"
                  id="copy-cover-letter-btn"
                  onClick={handleCopyCoverLetter}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#fdf8f0] hover:bg-[#f6eee3] border border-[#eee5d8] text-xs font-semibold text-[#14332a] transition active:scale-98 cursor-pointer"
                >
                  {copiedCoverLetter ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#2d6a4f]" />
                      <span className="text-[#2d6a4f]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#7a8f87]" />
                      <span>Copy Letter</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadCoverLetter("txt")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#fdf8f0] hover:bg-[#f6eee3] border border-[#eee5d8] text-xs font-semibold text-[#14332a] transition active:scale-98 cursor-pointer"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5 text-[#7a8f87]" />
                  <span>.txt</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadCoverLetter("md")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#14332a] hover:bg-[#0f2d22] text-xs font-bold text-white transition active:scale-98 shadow-2xs cursor-pointer"
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
      <div className="bg-white border border-[#eee5d8] rounded-[28px] p-5 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#eee5d8]">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#14332a] uppercase tracking-wider">
              Live Tailored Resume Preview
            </h3>
            <p className="text-xs text-[#7a8f87] font-medium">
              {selectedBulletIndices.length} of {(result.rewrite_suggestions || []).length} AI STAR replacements active
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsPdfModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#14332a] hover:bg-[#0f2d22] text-xs font-bold text-white transition active:scale-98 shadow-[0_4px_12px_rgba(20,51,42,0.18)] cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#fde9d9]" />
              <span>Preview & Print PDF</span>
            </button>

            <button
              type="button"
              id="copy-tailored-cv-btn"
              onClick={handleCopyTailoredCV}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#fdf8f0] hover:bg-[#f6eee3] border border-[#eee5d8] text-xs font-semibold text-[#14332a] transition active:scale-98 cursor-pointer"
            >
              {copiedCv ? (
                <>
                  <Check className="w-4 h-4 text-[#2d6a4f]" />
                  <span className="text-[#2d6a4f]">Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#7a8f87]" />
                  <span>Copy Full Resume</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Editable / Viewable Preview Area */}
        <div className="p-4 sm:p-5 bg-[#fffdf8] border border-[#eee5d8] rounded-[20px]">
          <pre className="text-xs text-[#3b4f48] font-mono whitespace-pre-wrap leading-relaxed max-h-[360px] overflow-y-auto custom-scroll">
            {tailoredResume}
          </pre>
        </div>
      </div>

      {/* Interactive Visual PDF Preview Modal */}
      <ResumePreviewModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        tailoredResumeText={tailoredResume}
        onShowToast={onShowToast}
      />
    </div>
  );
};
