import React from "react";
import { Sparkles, ShieldCheck, User, Check, Search, Loader2, ChevronDown } from "lucide-react";

interface HeroBannerProps {
  onAnalyze: () => void;
  isAnalyzing?: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onAnalyze,
  isAnalyzing = false,
}) => {
  return (
    <div className="relative rounded-[40px] bg-gradient-to-br from-[#fef6ec] to-[#fdf8f0] dark:from-[#131A26] dark:to-[#0F1626] border border-[#f1e6d6] dark:border-[#1C2638] overflow-hidden px-8 sm:px-12 lg:px-20 py-16 lg:py-24 mb-12 min-h-[calc(100vh-140px)] flex flex-col justify-center transition-colors">
      {/* Background Ornaments */}
      <div className="pointer-events-none absolute -bottom-36 -left-16 w-[640px] h-[420px] bg-[#fde9d9] dark:bg-[#341F1A]/50 rounded-[100%] opacity-80" />
      <div className="pointer-events-none absolute -top-24 right-32 w-[340px] h-[340px] bg-[#d8f0d8] dark:bg-[#132A1F]/50 rounded-full opacity-70" />
      <div className="pointer-events-none absolute top-16 right-[420px] w-36 h-36 bg-[#f8cbb1] dark:bg-[#4A2C24]/50 rounded-full opacity-60" />
      <div className="pointer-events-none absolute bottom-16 right-[560px] w-16 h-16 bg-[#f5a07a] dark:bg-[#E88463]/30 rounded-full opacity-70" />
      
      {/* SVG Wave Line */}
      <svg className="pointer-events-none absolute left-[22%] top-[68%] hidden lg:block" width="120" height="60" viewBox="0 0 80 40" fill="none">
        <path d="M2 30 C 20 5, 50 5, 76 18" stroke="#d8a48a" strokeWidth="1.5" strokeDasharray="4 4" fill="none" className="dark:stroke-slate-600" />
        <path d="M68 12 L 78 18 L 70 26" stroke="#d8a48a" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-slate-600" />
      </svg>

      <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12 z-10">
        <div className="flex-1 min-w-0">
          <h1 className="font-extrabold leading-[0.94] tracking-tight text-[48px] sm:text-[62px] lg:text-[76px] text-[#14332a] dark:text-white">
            <span className="block">Smart matches.</span>
            <span className="block">Better <span className="text-[#e07a4f] dark:text-[#E88463] font-display italic font-normal">opportunities.</span></span>
          </h1>
          <p className="mt-6 text-[17px] sm:text-[19px] text-[#7a8f87] dark:text-slate-400 max-w-[540px] leading-relaxed">
            Upload your resume and job description. We'll handle the rest with instant AI diagnostics.
          </p>
          
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <button
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="inline-flex items-center gap-3.5 bg-[#14332a] dark:bg-emerald-900 text-white rounded-full px-9 py-4.5 text-[16px] sm:text-[17px] font-bold shadow-[0_12px_30px_rgba(20,51,42,0.25)] dark:shadow-none hover:bg-[#0f2d22] dark:hover:bg-emerald-800 transition-all active:scale-98 disabled:opacity-75 cursor-pointer"
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
            
            <span className="inline-flex items-center gap-3 text-[14px] sm:text-[15px] font-medium text-[#5f7a72] dark:text-slate-400">
              <span className="w-7 h-7 rounded-full bg-[#e6f0e6] dark:bg-[#132A1F] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-[#2d6a4f] dark:text-[#4ADE80]" />
              </span>
              Instant neural match & ATS audit
            </span>
          </div>
        </div>

        <div className="flex-1 lg:flex-none flex items-center justify-center lg:justify-end w-full lg:w-auto mt-10 lg:mt-0 pr-2 sm:pr-8">
          <div className="relative">
            {/* White floating card */}
            <div className="w-[230px] sm:w-[270px] h-[270px] sm:h-[310px] bg-white dark:bg-[#0B101D] rounded-[28px] shadow-[0_28px_56px_rgba(0,0,0,0.1)] border border-[#eee5d8] dark:border-[#1C2638] p-5 flex flex-col transition-colors">
              <div className="w-full h-10 rounded-full bg-[#fde9d9] dark:bg-[#341F1A] flex items-center px-4 gap-3 shrink-0">
                <div className="w-7 h-7 rounded-full bg-white dark:bg-[#0B101D] border border-[#f5cbb2] dark:border-[#4A2C24] flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-[#e07a4f] dark:text-[#E88463]" />
                </div>
                <div className="h-2 w-24 bg-[#f5cbb2] dark:bg-[#4A2C24] rounded-full shrink-0" />
                <div className="ml-auto w-7 h-7 rounded-full bg-[#14332a] dark:bg-[#1E7E34] flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {[80, 95, 65].map((e, t) => (
                  <div key={t} className="flex gap-3.5 items-center">
                    <div className="w-4 h-4 rounded-full border border-[#e6d9c8] dark:border-slate-700 shrink-0" />
                    <div className="h-2 bg-[#efe6d8] dark:bg-slate-800 rounded-full" style={{ width: `${e}%` }} />
                  </div>
                ))}
                <div className="mt-7 grid grid-cols-3 gap-3">
                  <div className="h-16 rounded-xl bg-[#f6f0e8] dark:bg-[#1A2235]" />
                  <div className="h-16 rounded-xl bg-[#e6f0e6] dark:bg-[#132A1F]" />
                  <div className="h-16 rounded-xl bg-[#fde9d9] dark:bg-[#341F1A]" />
                </div>
              </div>
            </div>
            {/* Overlapping icon */}
            <div className="absolute -right-8 -bottom-6 w-[110px] h-[110px] z-10">
              <div className="w-[82px] h-[82px] rounded-full bg-[#fde9d9] dark:bg-[#341F1A] border-[8px] border-white dark:border-[#0F1626] shadow-[0_12px_28px_rgba(0,0,0,0.14)] flex items-center justify-center transition-colors">
                <Search className="w-8 h-8 text-[#e07a4f] dark:text-[#E88463]" />
              </div>
              <div className="absolute bottom-0 right-4 w-3.5 h-12 bg-[#f5a07a] dark:bg-[#E88463] rounded-full rotate-[35deg] shadow-sm" />
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
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity cursor-pointer z-20 group"
      >
        <span className="text-[11px] font-bold text-[#7a8f87] dark:text-slate-400 tracking-wider uppercase group-hover:text-[#14332a] dark:group-hover:text-white transition-colors">
          Scroll to analyze
        </span>
        <ChevronDown className="w-4 h-4 text-[#e07a4f] animate-bounce" />
      </div>
    </div>
  );
};
