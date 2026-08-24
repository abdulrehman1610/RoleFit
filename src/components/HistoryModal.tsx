import React from "react";
import { X, History, Clock, FileText, ArrowRight, CheckCircle2, Trash2 } from "lucide-react";
import { AnalysisResult } from "../types";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (result: AnalysisResult) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  if (!isOpen) return null;

  // Recent scans mock / local cache list
  const historyItems = [
    {
      id: "scan-1",
      role: "Senior Full-Stack Engineer @ Stripe",
      date: "Today, 10:24 AM",
      score: "85%",
      tier: "Tier 4",
      skills: ["React", "TypeScript", "Node.js", "System Design"],
    },
    {
      id: "scan-2",
      role: "Staff Cloud & AI Systems Engineer @ Databricks",
      date: "Yesterday, 3:15 PM",
      score: "78%",
      tier: "Tier 4",
      skills: ["Kubernetes", "PyTorch", "Go", "Distributed Systems"],
    },
    {
      id: "scan-3",
      role: "Lead Frontend Architect @ Figma",
      date: "Aug 19, 2026",
      score: "92%",
      tier: "Tier 5",
      skills: ["WebGL", "Wasm", "TypeScript", "Canvas"],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-[#0F1626] border border-[#EDE8E1] dark:border-[#1C2638] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] text-stone-800 dark:text-slate-200 transition-colors">
        <div className="px-6 py-4 border-b border-stone-100 dark:border-[#1C2638] flex items-center justify-between bg-[#FAF8F5] dark:bg-[#0B101D]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FDE7DB] dark:bg-[#341F1A] flex items-center justify-center text-[#D06540]">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white tracking-wider uppercase font-heading">Analysis Scan History</h3>
              <p className="text-xs text-stone-400 font-normal font-simple">Locally saved resume audit sessions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-3">
          {historyItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-[#1C2638] bg-slate-50/70 dark:bg-[#0B101D] hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 transition-all cursor-pointer flex items-center justify-between group"
              onClick={onClose}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                    {item.role}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.date}
                  </span>
                  <span>•</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{item.tier}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1 rounded-lg font-mono">
                  {item.score}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition" />
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-[#1C2638] bg-slate-50 dark:bg-[#0B101D] text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white dark:bg-[#162032] border border-slate-200 dark:border-[#27354E] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E2B42] transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
