import React, { useState, useRef } from "react";
import {
  X,
  Printer,
  Copy,
  Check,
  Download,
  FileText,
  Sliders,
  Type,
  Layout,
  ExternalLink,
  Sparkles,
  BookOpen
} from "lucide-react";
import { parseResumeToStructure, StructuredResume } from "../utils/resumeParser";
import { safeCopyToClipboard } from "../utils/safeHelpers";

export type ResumeTemplateId = "harvard" | "stanford" | "tech";
export type ResumeDensity = "compact" | "regular" | "spacious";

interface ResumePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tailoredResumeText: string;
  onShowToast?: (text: string, type: "info" | "warning" | "error" | "success") => void;
}

export const ResumePreviewModal: React.FC<ResumePreviewModalProps> = ({
  isOpen,
  onClose,
  tailoredResumeText,
  onShowToast,
}) => {
  const [template, setTemplate] = useState<ResumeTemplateId>("harvard");
  const [density, setDensity] = useState<ResumeDensity>("regular");
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const parsedResume: StructuredResume = parseResumeToStructure(tailoredResumeText);

  const handlePrint = () => {
    if (!printRef.current) {
      window.print();
      return;
    }

    // Create an isolated hidden iframe dedicated strictly to the single resume
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    const contentHtml = printRef.current.innerHTML;
    const fontFamilies = {
      harvard: "Georgia, Cambria, 'Times New Roman', Times, serif",
      stanford: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      tech: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace",
    }[template];

    const densitySizes = {
      compact: { base: "9.5pt", line: "1.3", h1: "15pt", h2: "10.5pt" },
      regular: { base: "10.5pt", line: "1.4", h1: "17pt", h2: "11.5pt" },
      spacious: { base: "11.5pt", line: "1.5", h1: "19pt", h2: "12.5pt" },
    }[density];

    const styles = `
      @page {
        size: letter portrait;
        margin: 0.45in;
      }
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      body {
        font-family: ${fontFamilies};
        font-size: ${densitySizes.base};
        line-height: ${densitySizes.line};
        color: #000000;
        background: #ffffff;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      h1 {
        font-size: ${densitySizes.h1};
        line-height: 1.15;
      }
      h2 {
        font-size: ${densitySizes.h2};
        line-height: 1.2;
      }
      ul {
        margin-left: 18px;
      }
      li {
        margin-bottom: 2px;
      }
      p {
        margin-bottom: 3px;
      }
      .avoid-break {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      .font-serif { font-family: Georgia, Cambria, 'Times New Roman', serif; }
      .font-sans { font-family: Inter, system-ui, sans-serif; }
      .font-mono { font-family: ui-monospace, monospace; }
      .text-center { text-align: center; }
      .text-left { text-align: left; }
      .uppercase { text-transform: uppercase; }
      .tracking-wider { letter-spacing: 0.05em; }
      .tracking-widest { letter-spacing: 0.1em; }
      .tracking-tight { letter-spacing: -0.025em; }
      .font-bold { font-weight: bold; }
      .font-extrabold { font-weight: 800; }
      .font-semibold { font-weight: 600; }
      .border-b-2 { border-bottom-width: 2px; border-bottom-style: solid; }
      .border-b { border-bottom-width: 1px; border-bottom-style: solid; }
      .border-black { border-color: #000000; }
      .border-stone-300 { border-color: #d6d3d1; }
      .border-stone-200 { border-color: #e7e5e4; }
      .text-stone-900, .text-black { color: #000000; }
      .text-stone-800, .text-slate-800 { color: #1f2937; }
      .text-stone-700 { color: #374151; }
      .text-stone-600 { color: #4b5563; }
      .text-stone-400 { color: #9ca3af; }
      .text-\\[\\#14332a\\] { color: #14332a; }
      .border-\\[\\#14332a\\] { border-color: #14332a; }
      .border-\\[\\#14332a\\]\\/30 { border-color: rgba(20, 51, 42, 0.3); }
      .text-\\[\\#2d6a4f\\] { color: #2d6a4f; }
      .border-\\[\\#2d6a4f\\]\\/20 { border-color: rgba(45, 106, 79, 0.2); }
      .list-disc { list-style-type: disc; }
      .flex { display: flex; }
      .flex-wrap { flex-wrap: wrap; }
      .items-center { align-items: center; }
      .items-baseline { align-items: baseline; }
      .justify-center { justify-content: center; }
      .justify-between { justify-content: space-between; }
      .gap-x-2 { column-gap: 8px; }
      .gap-y-0\\.5 { row-gap: 2px; }
      .mb-1 { margin-bottom: 4px; }
      .mb-1\\.5 { margin-bottom: 6px; }
      .mb-2 { margin-bottom: 8px; }
      .mt-1 { margin-top: 4px; }
      .mt-1\\.5 { margin-top: 6px; }
      .mt-4 { margin-top: 14px; }
      .pb-0\\.5 { padding-bottom: 2px; }
      .pb-1 { padding-bottom: 4px; }
      .pb-2 { padding-bottom: 8px; }
      .pb-3 { padding-bottom: 12px; }
      .space-y-1 > * + * { margin-top: 4px; }
      .space-y-0\\.5 > * + * { margin-top: 2px; }
      .space-y-2 > * + * { margin-top: 8px; }
      .space-y-2\\.5 > * + * { margin-top: 10px; }
      .space-y-3 > * + * { margin-top: 12px; }
      .space-y-4 > * + * { margin-top: 16px; }
      .space-y-5 > * + * { margin-top: 20px; }
      .whitespace-nowrap { white-space: nowrap; }
    `;

    doc.open();
    doc.write(`<!DOCTYPE html>
<html>
  <head>
    <title>${parsedResume.name || "Resume"}</title>
    <style>${styles}</style>
  </head>
  <body>
    ${contentHtml}
  </body>
</html>`);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1500);
    }, 250);
  };

  const handleCopy = async () => {
    const res = await safeCopyToClipboard(tailoredResumeText);
    if (res.success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (onShowToast) onShowToast("Resume text copied to clipboard!", "success");
    }
  };

  // Density styles
  const densityStyles = {
    compact: {
      fontSize: "text-[11px] leading-[1.35]",
      headerSize: "text-lg",
      sectionHeaderSize: "text-[12px]",
      itemSpacing: "space-y-2",
      sectionSpacing: "space-y-2.5",
      padding: "p-6 sm:p-8",
    },
    regular: {
      fontSize: "text-[12px] leading-[1.45]",
      headerSize: "text-xl",
      sectionHeaderSize: "text-[13px]",
      itemSpacing: "space-y-3",
      sectionSpacing: "space-y-4",
      padding: "p-8 sm:p-12",
    },
    spacious: {
      fontSize: "text-[13px] leading-[1.6]",
      headerSize: "text-2xl",
      sectionHeaderSize: "text-[14px]",
      itemSpacing: "space-y-4",
      sectionSpacing: "space-y-5",
      padding: "p-10 sm:p-14",
    },
  }[density];

  // Template typography & styling
  const getTemplateClasses = () => {
    switch (template) {
      case "harvard":
        return {
          font: "font-serif",
          headerClass: "text-center pb-2 border-b-2 border-black",
          sectionHeaderClass: "font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 font-serif",
          nameClass: "font-bold tracking-normal uppercase",
          bulletClass: "list-disc ml-4 space-y-1 text-stone-900",
        };
      case "stanford":
        return {
          font: "font-sans",
          headerClass: "text-left pb-3 border-b-2 border-[#14332a]",
          sectionHeaderClass: "font-extrabold uppercase tracking-wider text-[#14332a] border-b border-[#14332a]/30 pb-1 mb-2",
          nameClass: "font-extrabold tracking-tight text-[#14332a]",
          bulletClass: "list-disc ml-4 space-y-1 text-slate-800",
        };
      case "tech":
        return {
          font: "font-sans",
          headerClass: "text-left pb-2 border-b border-stone-300",
          sectionHeaderClass: "font-bold uppercase tracking-widest text-[#2d6a4f] text-[11px] border-b border-[#2d6a4f]/20 pb-0.5 mb-1.5 font-mono",
          nameClass: "font-bold tracking-tight text-black",
          bulletClass: "list-disc ml-4 space-y-0.5 text-stone-800",
        };
    }
  };

  const tClasses = getTemplateClasses();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in font-simple">
      <div className="w-full max-w-5xl bg-[#f8f6f0] border border-[#eee5d8] rounded-[28px] shadow-[0_30px_70px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Controls Toolbar (Hidden during actual print) */}
        <div className="no-print px-4 sm:px-6 py-3.5 border-b border-[#eee5d8] bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#fde9d9] flex items-center justify-center text-[#e07a4f] shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#14332a] uppercase tracking-wider">
                Print-Ready ATS Resume Preview
              </h2>
              <p className="text-[11px] text-[#7a8f87]">
                Harvard & Stanford single-column standard (100% ATS parser compliant)
              </p>
            </div>
          </div>

          {/* Template & Density Switchers */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Template Selector Pills */}
            <div className="flex items-center gap-1 p-1 bg-[#fdf8f0] rounded-full border border-[#eee5d8]">
              <button
                type="button"
                onClick={() => setTemplate("harvard")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                  template === "harvard"
                    ? "bg-[#14332a] text-white shadow-2xs"
                    : "text-[#7a8f87] hover:text-[#14332a]"
                }`}
              >
                🎓 Harvard
              </button>
              <button
                type="button"
                onClick={() => setTemplate("stanford")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                  template === "stanford"
                    ? "bg-[#14332a] text-white shadow-2xs"
                    : "text-[#7a8f87] hover:text-[#14332a]"
                }`}
              >
                🏛️ Stanford
              </button>
              <button
                type="button"
                onClick={() => setTemplate("tech")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                  template === "tech"
                    ? "bg-[#14332a] text-white shadow-2xs"
                    : "text-[#7a8f87] hover:text-[#14332a]"
                }`}
              >
                ⚡ Tech
              </button>
            </div>

            {/* Density Selector */}
            <div className="hidden sm:flex items-center gap-1 p-1 bg-[#fdf8f0] rounded-full border border-[#eee5d8]">
              {(["compact", "regular", "spacious"] as ResumeDensity[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDensity(d)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize transition cursor-pointer ${
                    density === d
                      ? "bg-[#14332a] text-white"
                      : "text-[#7a8f87] hover:text-[#14332a]"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Print / Export Action Button */}
            <button
              type="button"
              onClick={handlePrint}
              id="modal-print-pdf-btn"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#14332a] hover:bg-[#0f2d22] text-white text-xs font-bold shadow-[0_4px_12px_rgba(20,51,42,0.18)] transition active:scale-98 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#fde9d9]" />
              <span>Print / Save PDF</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#fdf8f0] border border-[#eee5d8] flex items-center justify-center text-[#7a8f87] hover:text-[#14332a] hover:bg-stone-100 transition cursor-pointer shrink-0 ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Canvas */}
        <div className="p-3 sm:p-8 overflow-y-auto flex justify-center bg-[#eae4d9] custom-scroll">
          {/* Authentic 8.5" x 11" Paper Canvas */}
          <div
            ref={printRef}
            id="printable-resume-canvas"
            className={`print-container w-full max-w-[816px] min-h-[1056px] bg-white text-black shadow-xl border border-stone-200 ${densityStyles.padding} ${densityStyles.fontSize} ${tClasses.font} transition-all`}
          >
            {/* 1. Header (Name, Title, Contact Info) */}
            <div className={tClasses.headerClass}>
              <h1 className={`${densityStyles.headerSize} ${tClasses.nameClass} mb-1 leading-tight`}>
                {parsedResume.name}
              </h1>
              {parsedResume.headline && (
                <div className="text-[13px] font-semibold text-stone-700 tracking-normal mb-1">
                  {parsedResume.headline}
                </div>
              )}
              {parsedResume.contactDetails.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[11px] text-stone-600">
                  {parsedResume.contactDetails.map((contact, idx) => (
                    <React.Fragment key={idx}>
                      <span>{contact}</span>
                      {idx < parsedResume.contactDetails.length - 1 && <span className="text-stone-400">•</span>}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Structured Sections */}
            <div className={`mt-4 ${densityStyles.sectionSpacing}`}>
              {parsedResume.sections.map((section, sIdx) => (
                <div key={sIdx} className="avoid-break">
                  {/* Section Title */}
                  <h2 className={`${densityStyles.sectionHeaderSize} ${tClasses.sectionHeaderClass}`}>
                    {section.title}
                  </h2>

                  {/* Section Items (Experience / Education / Projects) */}
                  {section.items && section.items.length > 0 ? (
                    <div className={densityStyles.itemSpacing}>
                      {section.items.map((item, iIdx) => (
                        <div key={iIdx} className="avoid-break">
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-x-2">
                            <div className="font-bold text-stone-900">
                              {item.title}
                              {item.organization && (
                                <span className="font-semibold text-stone-700"> — {item.organization}</span>
                              )}
                            </div>
                            {item.date && (
                              <div className="text-[11px] font-medium text-stone-600 whitespace-nowrap shrink-0">
                                {item.date}
                              </div>
                            )}
                          </div>

                          {/* Bullets */}
                          {item.bullets && item.bullets.length > 0 && (
                            <ul className={`mt-1.5 ${tClasses.bulletClass}`}>
                              {item.bullets.map((b, bIdx) => (
                                <li key={bIdx} className="leading-snug">
                                  {b}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {/* Raw Lines if section has no nested sub-items (e.g. Summary / Skills) */}
                  {section.rawLines && section.rawLines.length > 0 && (
                    <div className="text-stone-800 mt-1 leading-relaxed">
                      {section.rawLines.map((line, lIdx) => (
                        <p key={lIdx} className="mb-1">
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="no-print px-6 py-3 border-t border-[#eee5d8] bg-white flex items-center justify-between text-xs text-[#7a8f87]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2d6a4f]"></span>
            <span>Formatted with active STAR replacements</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#fdf8f0] hover:bg-[#f6eee3] border border-[#eee5d8] text-xs font-semibold text-[#14332a] transition active:scale-98 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#2d6a4f]" />
                  <span className="text-[#2d6a4f]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#7a8f87]" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-5 py-1.5 rounded-full bg-[#14332a] hover:bg-[#0f2d22] text-white text-xs font-bold transition active:scale-98 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#fde9d9]" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
