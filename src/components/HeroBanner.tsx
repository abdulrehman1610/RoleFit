import React, { useState, useEffect } from "react";
import { Sparkles, ShieldCheck, User, Check, Search, Loader2, ChevronDown } from "lucide-react";

interface HeroBannerProps {
  onAnalyze: () => void;
  isAnalyzing?: boolean;
}

const TYPING_WORDS = [
  "opportunities.",
  "possibilities.",
  "prospects.",
  "openings.",
  "chances.",
  "roles.",
  "positions.",
  "careers.",
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onAnalyze,
  isAnalyzing = false,
}) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(TYPING_WORDS[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullWord = TYPING_WORDS[wordIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      // Typing phase: type character by character
      if (displayedText.length < currentFullWord.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentFullWord.slice(0, displayedText.length + 1));
        }, 80);
      } else {
        // Full word typed: hold for reading before backspacing
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      // Deleting phase: backspace rapidly
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          const nextText = displayedText.slice(0, -1);
          if (nextText.length === 0) {
            // Immediate seamless handoff to next word without blank gap
            const nextIdx = (wordIndex + 1) % TYPING_WORDS.length;
            setWordIndex(nextIdx);
            setIsDeleting(false);
            setDisplayedText(TYPING_WORDS[nextIdx].slice(0, 1));
          } else {
            setDisplayedText(nextText);
          }
        }, 35);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, wordIndex]);

  return (
    <div className="relative rounded-[28px] sm:rounded-[40px] bg-gradient-to-br from-[#fef6ec] to-[#fdf8f0] border border-[#f1e6d6] overflow-hidden px-5 sm:px-12 lg:px-20 py-10 sm:py-16 lg:py-24 mb-8 sm:mb-12 min-h-[calc(100vh-130px)] sm:min-h-[calc(100vh-140px)] flex flex-col justify-center transition-colors">
      {/* Background Animated Organic Ornaments */}
      {/* Shape 1: Large morphing organic blob (bottom-left) */}
      <div className="pointer-events-none absolute -bottom-36 -left-16 w-[420px] sm:w-[640px] h-[300px] sm:h-[420px] bg-[#fde9d9] opacity-80 animate-morph-blob" />

      {/* Shape 2: Floating gentle sage circle (top-right) */}
      <div className="pointer-events-none absolute -top-24 right-10 sm:right-32 w-[220px] sm:w-[340px] h-[220px] sm:h-[340px] bg-[#d8f0d8] rounded-full opacity-70 animate-float-slow" />

      {/* Shape 3: Floating warm peach circle (middle-right) */}
      <div className="pointer-events-none absolute top-16 right-[420px] w-36 h-36 bg-[#f8cbb1] rounded-full opacity-60 hidden sm:block animate-float-reverse" />

      {/* Shape 4: Pulsing small terracotta accent dot (bottom-center) */}
      <div className="pointer-events-none absolute bottom-16 right-[560px] w-16 h-16 bg-[#f5a07a] rounded-full opacity-70 hidden sm:block animate-pulse-soft" />
      
      {/* Shape 5: Animated SVG Dashed Wave Path */}
      <svg className="pointer-events-none absolute left-[22%] top-[68%] hidden lg:block" width="120" height="60" viewBox="0 0 80 40" fill="none">
        <path
          d="M2 30 C 20 5, 50 5, 76 18"
          stroke="#d8a48a"
          strokeWidth="1.5"
          fill="none"
          className="animate-dash-draw"
        />
        <path
          d="M68 12 L 78 18 L 70 26"
          stroke="#d8a48a"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 z-10">
        <div className="flex-1 min-w-0 text-left">
          <h1 className="font-extrabold leading-[0.96] tracking-tight text-[36px] xs:text-[44px] sm:text-[58px] lg:text-[76px] text-[#14332a]">
            <span className="block">Smart matches.</span>
            <span className="block">
              Better{" "}
              <span className="relative inline-flex items-baseline text-[#e07a4f] font-display italic font-normal">
                <span>{displayedText}</span>
                {/* Blinking Typewriter Cursor */}
                <span className="inline-block w-[3px] sm:w-[4px] h-[0.78em] bg-[#e07a4f] ml-1 rounded-xs animate-cursor-blink self-center" />
              </span>
            </span>
          </h1>
          <p className="mt-4 sm:mt-6 text-[15px] sm:text-[18px] text-[#7a8f87] max-w-[540px] leading-relaxed font-medium">
            Upload your resume and job description. We'll handle the rest with instant AI diagnostics.
          </p>
          
          <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
            <button
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="inline-flex items-center justify-center gap-3 bg-[#14332a] text-white rounded-full px-7 sm:px-9 py-3.5 sm:py-4.5 text-[15px] sm:text-[17px] font-bold shadow-[0_12px_30px_rgba(20,51,42,0.25)] hover:bg-[#0f2d22] transition-all active:scale-98 disabled:opacity-75 cursor-pointer"
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
            
            <span className="inline-flex items-center justify-center sm:justify-start gap-2.5 sm:gap-3 text-[13px] sm:text-[15px] font-medium text-[#5f7a72]">
              <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#e6f0e6] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2d6a4f]" />
              </span>
              Instant neural match & ATS audit
            </span>
          </div>
        </div>

        <div className="flex-1 lg:flex-none flex items-center justify-center lg:justify-end w-full lg:w-auto mt-4 sm:mt-10 lg:mt-0">
          <div className="relative scale-[0.85] xs:scale-[0.92] sm:scale-100 origin-center">
            {/* White floating card with gentle levitation animation */}
            <div className="w-[230px] sm:w-[270px] h-[270px] sm:h-[310px] bg-white rounded-[24px] sm:rounded-[28px] shadow-[0_28px_56px_rgba(0,0,0,0.08)] border border-[#eee5d8] p-4 sm:p-5 flex flex-col transition-colors animate-card-float">
              <div className="w-full h-9 sm:h-10 rounded-full bg-[#fde9d9] flex items-center px-3.5 sm:px-4 gap-2.5 sm:gap-3 shrink-0">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border border-[#f5cbb2] flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e07a4f]" />
                </div>
                <div className="h-1.5 sm:h-2 w-20 sm:w-24 bg-[#f5cbb2] rounded-full shrink-0" />
                <div className="ml-auto w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#14332a] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
              </div>
              <div className="mt-5 sm:mt-6 space-y-3.5 sm:space-y-4">
                {[80, 95, 65].map((e, t) => (
                  <div key={t} className="flex gap-3 sm:gap-3.5 items-center">
                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-[#e6d9c8] shrink-0" />
                    <div className="h-2 bg-[#efe6d8] rounded-full" style={{ width: `${e}%` }} />
                  </div>
                ))}
                <div className="mt-6 sm:mt-7 grid grid-cols-3 gap-2.5 sm:gap-3">
                  <div className="h-14 sm:h-16 rounded-xl bg-[#f6f0e8]" />
                  <div className="h-14 sm:h-16 rounded-xl bg-[#e6f0e6]" />
                  <div className="h-14 sm:h-16 rounded-xl bg-[#fde9d9]" />
                </div>
              </div>
            </div>

            {/* Overlapping floating search badge */}
            <div className="absolute -right-6 sm:-right-8 -bottom-5 sm:-bottom-6 w-[90px] sm:w-[110px] h-[90px] sm:h-[110px] z-10 animate-badge-float">
              <div className="w-[70px] sm:w-[82px] h-[70px] sm:h-[82px] rounded-full bg-[#fde9d9] border-[6px] sm:border-[8px] border-white shadow-[0_12px_28px_rgba(0,0,0,0.12)] flex items-center justify-center transition-colors">
                <Search className="w-6 h-6 sm:w-8 sm:h-8 text-[#e07a4f]" />
              </div>
              <div className="absolute bottom-0 right-3.5 sm:right-4 w-3 sm:w-3.5 h-10 sm:h-12 bg-[#f5a07a] rounded-full rotate-[35deg] shadow-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div
        onClick={() => {
          const el = document.getElementById("input-section-container");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity cursor-pointer z-20 group"
      >
        <span className="text-[10px] sm:text-[11px] font-bold text-[#7a8f87] tracking-wider uppercase group-hover:text-[#14332a] transition-colors">
          Scroll to analyze
        </span>
        <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e07a4f] animate-bounce" />
      </div>
    </div>
  );
};
