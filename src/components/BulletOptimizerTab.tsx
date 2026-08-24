import React, { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  CheckSquare,
  Square,
  FileQuestion,
} from "lucide-react";
import { RewriteSuggestion } from "../types";
import { safeCopyToClipboard } from "../utils/safeHelpers";

interface BulletOptimizerTabProps {
  suggestions: RewriteSuggestion[];
  selectedIndices: number[];
  onToggleSelect: (index: number) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onShowToast?: (text: string, type: "info" | "warning" | "error" | "success") => void;
}

export const BulletOptimizerTab: React.FC<BulletOptimizerTabProps> = ({
  suggestions,
  selectedIndices,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onShowToast,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    const res = await safeCopyToClipboard(text);
    if (res.success) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      if (res.fallbackUsed && onShowToast) {
        onShowToast("Couldn't copy automatically — text selected for manual copy.", "info");
      }
    } else {
      if (onShowToast) {
        onShowToast("Failed to copy to clipboard. Please select text manually.", "error");
      }
    }
  };

  const getGroundingBadge = (suggestion: RewriteSuggestion) => {
    const score = suggestion.grounding_confidence ?? 90;
    const tier = suggestion.grounding_tier ?? (score >= 85 ? "HIGH" : score >= 65 ? "MEDIUM" : "LOW");

    if (tier === "HIGH") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          HIGH GROUNDING ({score}%)
        </span>
      );
    }
    if (tier === "MEDIUM") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 font-mono">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          MEDIUM GROUNDING ({score}%)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 font-mono">
        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
        LOW GROUNDING ({score}%)
      </span>
    );
  };

  // 3. Scenario: No rewrite suggestions returned -> Empty state card
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="bg-white dark:bg-[#0F1626] border border-[#EDE8E1] dark:border-[#1C2638] rounded-3xl p-8 sm:p-12 text-center shadow-xs space-y-4 font-simple transition-colors">
        <div className="w-14 h-14 rounded-2xl bg-[#FDE7DB] dark:bg-[#341F1A] text-[#D06540] flex items-center justify-center mx-auto">
          <FileQuestion className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white tracking-tight font-heading mb-1">
            No suggestions generated for this resume/role pairing
          </h3>
          <p className="text-xs text-stone-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Your candidate bullet points already align closely with the target role, or no specific bullet refactors were needed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white dark:bg-[#0F1626] border border-[#EDE8E1] dark:border-[#1C2638] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white flex items-center gap-2.5 tracking-wider uppercase font-heading">
            <Sparkles className="w-5 h-5 text-[#D06540]" />
            Evidence-Grounded STAR Bullet Optimizer
          </h2>
          <p className="text-xs text-stone-400 font-normal mt-0.5 font-simple">
            Re-architected bullet points grounded in real candidate achievements with verified metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 font-simple">
          <button
            type="button"
            onClick={onSelectAll}
            className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-[#162032] hover:bg-stone-200 dark:hover:bg-[#1E2B42] border border-stone-200 dark:border-[#27354E] text-xs font-medium text-stone-800 dark:text-slate-200 transition cursor-pointer"
          >
            Select All ({suggestions.length})
          </button>
          <button
            type="button"
            onClick={onDeselectAll}
            className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-[#162032] hover:bg-stone-200 dark:hover:bg-[#1E2B42] border border-stone-200 dark:border-[#27354E] text-xs font-medium text-stone-800 dark:text-slate-200 transition cursor-pointer"
          >
            Deselect All
          </button>
        </div>
      </div>

      {/* Suggestion Cards List */}
      <div className="space-y-4">
        {suggestions.map((item, idx) => {
          const isSelected = selectedIndices.includes(idx);

          return (
            <div
              key={idx}
              className={`rounded-3xl border transition-all duration-200 bg-white dark:bg-[#0F1626] overflow-hidden shadow-xs ${
                isSelected
                  ? "border-[#1E7E34]/50 shadow-[#1E7E34]/10 dark:border-emerald-500/50"
                  : "border-[#EDE8E1] dark:border-[#1C2638] opacity-85"
              }`}
            >
              {/* Card Top Header */}
              <div className="p-4 sm:p-5 bg-[#FAF8F5] dark:bg-[#0B101D] border-b border-stone-100 dark:border-[#1C2638] flex flex-wrap items-center justify-between gap-3 font-simple">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onToggleSelect(idx)}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    )}
                    <span className="bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-md text-xs font-mono tracking-wider uppercase">
                      {item.section || `EXPERIENCE`}
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-3 font-simple">
                  {getGroundingBadge(item)}

                  <button
                    type="button"
                    onClick={() => handleCopy(item.suggested_bullet, idx)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#162032] border border-slate-200 dark:border-[#27354E] hover:bg-slate-100 dark:hover:bg-[#1E2B42] text-xs font-medium text-slate-700 dark:text-slate-200 transition shadow-2xs cursor-pointer"
                    title="Copy AI Bullet"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Comparison Content */}
              <div className="p-5 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Original Bullet */}
                  <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-[#0B101D] border border-slate-200 dark:border-[#1C2638] space-y-2 font-simple">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                      Original Candidate Bullet
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                      {item.original_bullet || "(No original bullet provided)"}
                    </p>
                  </div>

                  {/* Suggested AI Bullet */}
                  <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/25 border border-emerald-200/80 dark:border-emerald-800/50 space-y-2 font-simple">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Optimized STAR Bullet (Keyword-Aligned)
                    </span>
                    <p className="text-xs text-slate-900 dark:text-slate-100 leading-relaxed font-mono">
                      {item.suggested_bullet}
                    </p>
                  </div>
                </div>

                {/* Grounding & Rationale Drawer */}
                <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1C2638] text-xs text-slate-600 dark:text-slate-300 space-y-2 font-simple">
                  <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                    <span>Strategic Rationale:</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.rationale}
                  </p>

                  {item.ungrounded_tokens && item.ungrounded_tokens.length > 0 && (
                    <div className="pt-2 border-t border-slate-200 dark:border-[#1C2638] flex flex-wrap items-center gap-2 text-[11px] text-amber-800 dark:text-amber-300">
                      <span className="font-semibold">Unverified additions flagged:</span>
                      {item.ungrounded_tokens.map((tok, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 font-mono text-[10px]"
                        >
                          {tok}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
