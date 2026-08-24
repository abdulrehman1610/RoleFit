import React, { useState } from "react";
import {
  History,
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
  GraduationCap,
  FileUp,
  Clock3
} from "lucide-react";
import { AISettings } from "../types";

interface NavbarProps {
  settings: AISettings;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onLoadSample?: (sampleKey: "senior_swe" | "cloud_ai") => void;
  theme?: "dark" | "light";
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onOpenSettings,
  onOpenHistory,
  onLoadSample,
  theme = "light",
  onToggleTheme,
}) => {
  const [showSampleMenu, setShowSampleMenu] = useState(false);

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 mb-6 font-simple">
      {/* Left: Student Welfare Badge */}
      <div className="flex items-center gap-2.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#e6f0e6] dark:bg-[#132A1F] border border-[#d6e6d6] dark:border-[#1E4D38]">
          <GraduationCap className="w-4 h-4 text-[#2d6a4f] dark:text-[#4ADE80]" />
          <span className="text-[13px] font-semibold text-[#2d6a4f] dark:text-[#4ADE80]">Student Welfare</span>
        </div>
      </div>

      {/* Right Action Stack */}
      <div className="flex items-center gap-2.5 ml-auto">
        {/* Load Sample Dropdown */}
        {onLoadSample && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSampleMenu(!showSampleMenu)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#0F1626] border border-[#eee5d8] dark:border-[#1C2638] text-[13px] font-medium shadow-sm transition hover:bg-stone-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              <FileUp className="w-4 h-4" /> Load Sample <ChevronDown className="w-3.5 h-3.5 text-[#9aa8a2]" />
            </button>

            {showSampleMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowSampleMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 max-w-[85vw] bg-white dark:bg-[#0F172A] border border-stone-200 dark:border-[#1E293B] text-stone-800 dark:text-slate-200 rounded-2xl shadow-xl z-50 py-1.5 text-xs overflow-hidden font-simple animate-fade-in">
                  <div className="px-3.5 py-2 font-semibold text-[10px] uppercase tracking-wider text-stone-400 bg-stone-50 dark:bg-slate-900/80 border-b border-stone-100 dark:border-slate-800">
                    Pre-configured Profiles
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onLoadSample("senior_swe");
                      setShowSampleMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-[#FBECE5] dark:hover:bg-slate-800 text-stone-700 dark:text-slate-200 hover:text-[#C85A32] dark:hover:text-emerald-300 font-medium transition cursor-pointer"
                  >
                    Senior Full-Stack SWE
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onLoadSample("cloud_ai");
                      setShowSampleMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-[#FBECE5] dark:hover:bg-slate-800 text-stone-700 dark:text-slate-200 hover:text-[#C85A32] dark:hover:text-emerald-300 font-medium transition border-t border-stone-100 dark:border-slate-800 cursor-pointer"
                  >
                    Staff AI / Cloud Architect
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Scan History Button */}
        {onOpenHistory && (
          <button
            type="button"
            onClick={onOpenHistory}
            id="scan-history-nav-btn"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#0F1626] border border-[#eee5d8] dark:border-[#1C2638] text-[13px] font-medium shadow-sm transition hover:bg-stone-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Clock3 className="w-4 h-4" /> History
          </button>
        )}

        {/* Dark / Light Theme Toggle */}
        {onToggleTheme && (
          <button
            type="button"
            onClick={onToggleTheme}
            id="theme-toggle-btn"
            aria-label="Toggle visual theme"
            className="w-9 h-9 rounded-full bg-white dark:bg-[#0F1626] border border-[#eee5d8] dark:border-[#1C2638] flex items-center justify-center shadow-sm transition hover:bg-stone-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-stone-600" />
            )}
          </button>
        )}

        {/* Free AI Active Capsule Button */}
        <button
          type="button"
          onClick={onOpenSettings}
          id="ai-engine-status-btn"
          className="inline-flex items-center gap-2 pl-2 pr-3 py-2 rounded-full bg-[#14332a] dark:bg-emerald-900/50 text-white text-[12px] font-semibold shadow-sm transition active:scale-98 cursor-pointer"
        >
          <span className="w-5 h-5 rounded-full bg-[#1f4d3e] dark:bg-emerald-800 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#6ee7a0] shadow-[0_0_8px_#6ee7a0]"></span>
          </span>
          Free AI Active
          <Sparkles className="w-3.5 h-3.5 text-[#fde9d9]" />
        </button>
      </div>
    </header>
  );
};
