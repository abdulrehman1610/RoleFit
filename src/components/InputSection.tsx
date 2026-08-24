import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  Briefcase,
  CheckCircle2,
  Trash2,
  Sparkles,
  FileUp,
  Loader2,
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronDown,
  Upload,
  ClipboardPaste,
  X
} from "lucide-react";
import { parseDocumentFile, MAX_FILE_SIZE_BYTES } from "../services/documentParser";
import { MAX_SAFE_INPUT_LENGTH } from "../services/aiService";

interface InputSectionProps {
  resumeText: string;
  setResumeText: (val: string) => void;
  jobDescription: string;
  setJobDescription: (val: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onLoadSample: (sampleKey: string) => void;
  onShowToast?: (text: string, type: "info" | "warning" | "error" | "success") => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  resumeText,
  setResumeText,
  jobDescription,
  setJobDescription,
  onAnalyze,
  isAnalyzing,
  onLoadSample,
  onShowToast,
}) => {
  const [inputMode, setInputMode] = useState<"upload" | "paste">("upload");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [showSampleDropdown, setShowSampleDropdown] = useState(false);
  const [hasAttemptedAnalyze, setHasAttemptedAnalyze] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resumeWords = resumeText.trim().split(/\s+/).filter(Boolean).length;
  const jobWords = jobDescription.trim().split(/\s+/).filter(Boolean).length;

  const isResumeEmpty = resumeText.trim().length === 0;
  const isJobEmpty = jobDescription.trim().length === 0;

  const isResumeTooShort = !isResumeEmpty && resumeWords < 50;
  const isJobTooShort = !isJobEmpty && jobWords < 40;

  const isResumeTruncated = resumeText.length > MAX_SAFE_INPUT_LENGTH;
  const isJobTruncated = jobDescription.length > MAX_SAFE_INPUT_LENGTH;

  const handleProcessFile = async (file: File) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const msg = "File exceeds 5MB limit. Try a smaller file or paste text instead.";
      setParseError(msg);
      if (onShowToast) onShowToast(msg, "warning");
      return;
    }

    const fileName = file.name.toLowerCase();
    const supported = [".pdf", ".docx", ".txt", ".md", ".markdown", ".rtf"];
    if (!supported.some((ext) => fileName.endsWith(ext)) && !file.type.startsWith("text/")) {
      const msg = "Unsupported format. Please upload PDF, DOCX, or TXT.";
      setParseError(msg);
      if (onShowToast) onShowToast(msg, "error");
      return;
    }

    setIsParsing(true);
    setParseError(null);

    try {
      const extracted = await parseDocumentFile(file);
      setResumeText(extracted);
      setUploadedFileName(file.name);
      if (onShowToast) onShowToast(`Successfully extracted ${file.name}`, "success");
    } catch (err: any) {
      const errorMsg = err.message || "We couldn't read this file. Try pasting the text manually.";
      setParseError(errorMsg);
      if (onShowToast) onShowToast(errorMsg, "error");
      setInputMode("paste");
    } finally {
      setIsParsing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleClearResume = () => {
    setResumeText("");
    setUploadedFileName(null);
    setParseError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAnalyzeClick = () => {
    setHasAttemptedAnalyze(true);
    if (isResumeEmpty || isJobEmpty) {
      if (onShowToast) {
        onShowToast("Please provide both a Resume and a Job Description.", "warning");
      }
      return;
    }
    onAnalyze();
  };

  return (
    <div id="input-section-container" className="space-y-6 scroll-mt-6">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx,.txt,.md"
        className="hidden"
      />

      {/* Dual Input Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Card: Resume Source */}
        <div className="bg-white dark:bg-[#0F1626] rounded-[24px] border border-[#eee5d8] dark:border-[#1C2638] p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-colors">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#fdf0e2] dark:bg-[#341F1A] border border-[#f5dcc2] dark:border-[#4A2C24] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-[#e07a4f]" />
                </div>
                <div>
                  <h3 className="font-bold text-[12px] tracking-[0.12em] uppercase text-stone-900 dark:text-white">
                    Resume Source
                  </h3>
                  <p className="text-[12px] text-[#8aa099] dark:text-slate-400 mt-0.5">
                    Upload PDF/DOCX or paste raw resume text
                  </p>
                </div>
              </div>

              {/* Mode Toggle Buttons */}
              <div className="flex items-center gap-2 self-stretch sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setInputMode("upload");
                    fileInputRef.current?.click();
                  }}
                  className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] transition cursor-pointer ${
                    inputMode === "upload"
                      ? "bg-[#e6f0e6] dark:bg-[#132A1F] text-[#2d6a4f] dark:text-[#4ADE80] border-[#d2e3d2] dark:border-[#1E4D38] font-semibold"
                      : "bg-white dark:bg-[#0F1626] text-stone-600 dark:text-slate-400 border-[#e6ddd0] dark:border-[#2C384D] font-medium"
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode("paste")}
                  className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] transition cursor-pointer ${
                    inputMode === "paste"
                      ? "bg-[#fde9d9] dark:bg-[#341F1A] text-[#e07a4f] dark:text-[#E88463] border-[#f5cbb2] dark:border-[#4A2C24] font-semibold"
                      : "bg-white dark:bg-[#0F1626] text-stone-600 dark:text-slate-400 border-[#e6ddd0] dark:border-[#2C384D] font-medium"
                  }`}
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span>Paste</span>
                </button>
              </div>
            </div>

            {resumeText && !isParsing && (
              <div className="mt-5 rounded-[18px] bg-[#f5faf5] dark:bg-[#0B101D] border border-[#dde9dd] dark:border-[#1C2638] p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#2d6a4f] dark:bg-[#1E7E34] flex items-center justify-center text-white shrink-0">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      <span className="font-bold text-[14px] text-stone-900 dark:text-white">
                        {inputMode === "upload" && uploadedFileName
                          ? uploadedFileName
                          : "Active Resume Loaded"}
                      </span>
                    </div>
                    <div className="mt-1.5 ml-7 text-[11px] font-bold tracking-[0.1em] text-[#5aa27a] dark:text-emerald-400 uppercase">
                      {resumeWords} WORDS EXTRACTED
                    </div>
                  </div>
                  <button
                    onClick={handleClearResume}
                    className="w-7 h-7 rounded-full bg-white dark:bg-[#0F1626] border border-[#e3ddd2] dark:border-[#2C384D] flex items-center justify-center hover:bg-stone-50 dark:hover:bg-slate-800 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-[#9aa8a2] dark:text-slate-400" />
                  </button>
                </div>
                
                <div className="mt-4 bg-white dark:bg-[#0F1626] rounded-[14px] border border-[#e8e0d2] dark:border-[#2C384D] p-4 max-h-[168px] overflow-hidden relative">
                  <div className="text-[12px] leading-[18px] text-[#3b4f48] dark:text-slate-300 font-medium whitespace-pre-wrap font-mono">
                    {resumeText}
                  </div>
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-[#0F1626] to-transparent" />
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#5aa27a] dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Ready for semantic extraction
                  </span>
                  <button
                    onClick={handleClearResume}
                    className="text-[12px] font-semibold underline underline-offset-4 decoration-[#b8c9c2] dark:decoration-slate-600 text-stone-600 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white"
                  >
                    Change File
                  </button>
                </div>
              </div>
            )}

            {/* Parsing State */}
            {isParsing && (
              <div className="border border-dashed border-[#1E7E34] rounded-2xl p-6 text-center bg-[#EAF7EE]/50 flex flex-col items-center justify-center min-h-[160px]">
                <Loader2 className="w-6 h-6 animate-spin text-[#1E7E34] mb-2" />
                <p className="text-xs font-bold text-stone-800 dark:text-white">
                  Extracting Document Text...
                </p>
              </div>
            )}

            {/* Empty Upload Dropzone */}
            {!resumeText && !isParsing && inputMode === "upload" && (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-200 dark:border-[#1E293B] hover:border-[#D06540] rounded-2xl p-6 text-center cursor-pointer transition bg-[#FAF8F5]/60 dark:bg-[#0B101D]/70 flex flex-col items-center justify-center min-h-[160px]"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#FDE7DB] dark:bg-[#341F1A] text-[#D06540] flex items-center justify-center mb-2 shadow-2xs">
                  <FileUp className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-stone-800 dark:text-white mb-0.5">
                  Drag & drop your resume file here
                </p>
                <p className="text-[11px] text-stone-400 font-normal">
                  or <span className="text-[#D06540] font-medium hover:underline">browse from computer</span> (PDF, DOCX, TXT)
                </p>
              </div>
            )}

            {/* Textarea for preview/edit */}
            {(resumeText || inputMode === "paste") && !isParsing && (
              <div className="relative">
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your raw resume text (experience, skills, education)..."
                  className="w-full h-44 p-4 bg-[#FAF8F5] dark:bg-[#070B14] border border-stone-200/80 dark:border-[#1C2638] rounded-2xl text-xs text-stone-800 dark:text-slate-200 placeholder-stone-400 focus:outline-none focus:border-[#D06540] focus:ring-1 focus:ring-[#D06540] font-mono leading-relaxed resize-none transition"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Card: Target Role Specification */}
        <div className="bg-white dark:bg-[#0F1626] rounded-[24px] border border-[#eee5d8] dark:border-[#1C2638] p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-colors">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#fdf0e2] dark:bg-[#341F1A] border border-[#f5dcc2] dark:border-[#4A2C24] flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4 text-[#e07a4f]" />
                </div>
                <div>
                  <h3 className="font-bold text-[12px] tracking-[0.12em] uppercase text-stone-900 dark:text-white">
                    Target Role Specification
                  </h3>
                  <p className="text-[12px] text-[#8aa099] dark:text-slate-400 mt-0.5">
                    Paste the official job description or requirement list
                  </p>
                </div>
              </div>

              {/* Load Sample Button */}
              <div className="relative self-stretch sm:self-auto">
                <button
                  type="button"
                  onClick={() => setShowSampleDropdown(!showSampleDropdown)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fdf0e2] dark:bg-[#341F1A] border border-[#f5dcc2] dark:border-[#4A2C24] text-[12px] font-semibold text-[#c26a3a] dark:text-[#E88463] transition cursor-pointer shadow-2xs hover:bg-[#FDE7DB] dark:hover:bg-slate-800"
                >
                  <FileUp className="w-3.5 h-3.5" /> <span>Load Sample</span>
                </button>

                {showSampleDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowSampleDropdown(false)}
                    />
                    <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 w-60 max-w-[calc(100vw-3rem)] bg-white dark:bg-[#0F172A] border border-stone-200 dark:border-[#1E293B] rounded-2xl shadow-xl z-20 py-1.5 text-xs overflow-hidden font-simple animate-fade-in">
                      <button
                        type="button"
                        onClick={() => {
                          onLoadSample("senior_swe");
                          setShowSampleDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-[#FBECE5] dark:hover:bg-slate-800 text-stone-800 dark:text-slate-200 hover:text-[#C85A32] font-medium transition cursor-pointer"
                      >
                        Senior Full-Stack SWE
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onLoadSample("cloud_ai");
                          setShowSampleDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-[#FBECE5] dark:hover:bg-slate-800 text-stone-800 dark:text-slate-200 hover:text-[#C85A32] font-medium transition border-t border-stone-100 dark:border-slate-800 cursor-pointer"
                      >
                        Staff AI / Cloud Architect
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Input Card Container */}
            <div className="mt-5 rounded-[18px] bg-[#fffdf8] dark:bg-[#0B101D] border border-[#eee5d8] dark:border-[#1C2638] p-4 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold tracking-[0.14em] text-[#8aa099] uppercase">
                  Job Description Text
                </span>
                <span className="text-[11px] font-bold text-[#c26a3a] dark:text-[#E88463]">
                  {jobWords} Words
                </span>
              </div>

              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job requirements, responsibilities, and qualifications..."
                className="w-full h-40 sm:h-44 bg-transparent text-[12px] leading-[18px] text-[#3b4f48] dark:text-slate-200 placeholder-stone-400 focus:outline-none resize-none transition custom-scroll"
              />
              
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-dashed border-[#e8ddd0] dark:border-slate-800">
                <span className="text-[11px] font-bold tracking-[0.1em] text-[#c26a3a] dark:text-[#E88463] uppercase">
                  {jobWords} WORDS
                </span>

                <button
                  type="button"
                  onClick={() => setJobDescription("")}
                  className="inline-flex items-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded-full bg-white dark:bg-[#0F1626] border border-[#e8ddd0] dark:border-[#2C384D] hover:bg-stone-50 dark:hover:bg-slate-800 transition cursor-pointer text-[#9aa8a2] dark:text-slate-400 hover:text-[#14332a] dark:hover:text-white"
                >
                  <span>Clear</span>
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Central Analyze CTA Button Under Upload & JD Section */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
        <button
          type="button"
          id="main-analyze-btn"
          onClick={handleAnalyzeClick}
          disabled={isAnalyzing}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#14332a] dark:bg-emerald-900 hover:bg-[#0f2d22] dark:hover:bg-emerald-800 text-white rounded-full px-7 sm:px-9 py-3.5 sm:py-4 text-[15px] sm:text-[16px] font-bold shadow-[0_10px_25px_rgba(20,51,42,0.22)] dark:shadow-none transition-all active:scale-98 cursor-pointer disabled:opacity-75"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Evaluating Alignment...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-[#fde9d9]" />
              <span>Analyze Resume Match</span>
            </>
          )}
        </button>

        <span className="inline-flex items-center gap-2.5 text-[13px] sm:text-[14px] font-medium text-[#5f7a72] dark:text-slate-400">
          <span className="w-6 h-6 rounded-full bg-[#e6f0e6] dark:bg-[#132A1F] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-[#2d6a4f] dark:text-[#4ADE80]" />
          </span>
          Instant neural match & ATS audit
        </span>
      </div>
    </div>
  );
};
