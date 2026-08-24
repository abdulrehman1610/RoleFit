import React from "react";
import { X, Sparkles, Check, Gem, ArrowRight } from "lucide-react";

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const features = [
    "Unlimited instant resume & job description scans",
    "Deep semantic alignment & executive readiness diagnostics",
    "Tailored STAR bullet points with grounded metric preservation",
    "Direct ATS parsing diagnostics & EEOC compliance audit",
    "Clean JSON export and tailored markdown/text resume generator",
    "100% ephemeral privacy — zero data storage guarantee",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in font-simple">
      <div className="w-full max-w-md bg-white dark:bg-[#0F1626] border border-stone-200 dark:border-[#1C2638] rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-colors">
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-[#182C25] to-[#25463B] p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-3 text-emerald-300 shadow-inner">
            <Gem className="w-6 h-6" />
          </div>

          <h3 className="text-2xl font-bold font-heading text-white">RoleFit Pro</h3>
          <p className="text-xs text-emerald-100 font-normal mt-1 max-w-xs mx-auto">
            Supercharge your career readiness with precision AI resume optimization.
          </p>

          <div className="mt-4 inline-flex items-baseline gap-1 bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
            <span className="text-2xl font-extrabold font-heading text-white">$19</span>
            <span className="text-xs text-emerald-100">/ month</span>
          </div>
        </div>

        {/* Feature List */}
        <div className="p-6 space-y-4">
          <div className="space-y-2.5">
            {features.map((feat, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-stone-700 dark:text-slate-300">
                <div className="w-4 h-4 rounded-full bg-[#EAF7EE] dark:bg-[#132A1F] text-[#1E7E34] dark:text-[#4ADE80] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>{feat}</span>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-[#182C25] hover:bg-[#233F35] active:scale-98 text-xs font-bold text-white transition shadow-md shadow-[#182C25]/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Start 7-Day Free Trial</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <p className="text-[11px] text-center text-stone-400 dark:text-slate-500">
            Cancel anytime • Ephemeral privacy preserved • Free for students
          </p>
        </div>
      </div>
    </div>
  );
};
