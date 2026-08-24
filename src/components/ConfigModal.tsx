import React, { useState } from "react";
import { X, Cpu, Sparkles, Check, Lock, AlertTriangle } from "lucide-react";
import { AISettings } from "../types";

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AISettings;
  onSave: (newSettings: AISettings) => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [formData, setFormData] = useState<AISettings>(settings);
  const [showGroqKey, setShowGroqKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);

  if (!isOpen) return null;

  // Key format heuristics for warnings
  const isGroqKeyEntered = Boolean(formData.groqApiKey && formData.groqApiKey.trim().length > 0);
  const isGroqKeySuspicious =
    isGroqKeyEntered &&
    (!formData.groqApiKey.trim().startsWith("gsk_") || formData.groqApiKey.trim().length < 20);

  const isGeminiKeyEntered = Boolean(formData.geminiApiKey && formData.geminiApiKey.trim().length > 0);
  const isGeminiKeySuspicious =
    isGeminiKeyEntered &&
    (!formData.geminiApiKey.trim().startsWith("AIza") || formData.geminiApiKey.trim().length < 25);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-fade-in font-simple">
      <div className="w-full max-w-2xl bg-white border border-[#eee5d8] rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col max-h-[92vh] text-[#14332a] transition-colors">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-[#eee5d8] flex items-center justify-between bg-gradient-to-r from-[#fef6ec] to-[#fdf8f0] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#fde9d9] border border-[#f5cbb2] flex items-center justify-center text-[#e07a4f] shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-[14px] sm:text-[15px] font-bold text-[#14332a] uppercase tracking-wider">
                AI Engine & Settings
              </h2>
              <p className="text-[11px] sm:text-[12px] text-[#7a8f87] font-medium">
                100% Free for students. Personal API keys are completely optional.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-full bg-white border border-[#eee5d8] flex items-center justify-center text-[#7a8f87] hover:text-[#14332a] hover:bg-stone-50 transition cursor-pointer shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 text-xs sm:text-sm text-[#3b4f48] custom-scroll">
          {/* Free Default Server Notice */}
          <div className="p-4 rounded-[18px] bg-[#e6f0e6] border border-[#d6e6d6] flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#2d6a4f] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs font-bold">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <div className="space-y-0.5">
              <div className="font-bold text-[#2d6a4f] text-[13px]">
                Default Mode: Shared Free Student Server
              </div>
              <p className="text-[12px] text-[#3b4f48] leading-relaxed font-medium">
                RoleFit is pre-configured and funded for student welfare. You do not need any API key to run gap analyses or STAR bullet optimizations.
              </p>
            </div>
          </div>

          {/* Safe Dev Mock Toggle */}
          <div className="p-4 rounded-[18px] bg-[#fffdf8] border border-[#eee5d8] flex items-center justify-between">
            <div className="space-y-0.5 pr-3">
              <div className="flex items-center gap-2 font-bold text-[#14332a] text-[13px]">
                <Cpu className="w-4 h-4 text-[#2d6a4f]" />
                Offline / Safe Mock Mode
              </div>
              <p className="text-[12px] text-[#7a8f87]">
                Run instant gap analysis using verified test fixtures without making external network calls.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={formData.forceMockMode}
                onChange={(e) =>
                  setFormData({ ...formData, forceMockMode: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2d6a4f]"></div>
            </label>
          </div>

          {/* Optional BYOK Header */}
          <div className="pt-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#7a8f87]">
              Optional: Bring Your Own API Key (Fallback / Custom Models)
            </div>
            <p className="text-[12px] text-[#7a8f87] font-normal mt-0.5">
              If the shared student server is under heavy traffic, you can paste your own free Gemini or Groq key below to bypass shared queues.
            </p>
          </div>

          {/* Optional: Groq Settings */}
          <div className={`space-y-4 p-4 rounded-[18px] border transition ${formData.forceMockMode ? "opacity-50 pointer-events-none bg-stone-50/50 border-[#eee5d8]" : "bg-[#fffdf8] border-[#eee5d8]"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-[#14332a] text-[13px]">
                <span className="w-2 h-2 rounded-full bg-[#2d6a4f]"></span>
                Optional: Groq API Key
              </div>
              <span className="text-[11px] text-[#c26a3a] font-semibold bg-[#fdf0e2] px-2.5 py-0.5 rounded-full border border-[#f5dcc2]">
                Optional
              </span>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#14332a] mb-1.5">
                Groq API Key <span className="text-[#8aa099] font-normal">(gsk_...)</span>
              </label>
              <div className="relative">
                <input
                  type={showGroqKey ? "text" : "password"}
                  value={formData.groqApiKey}
                  onChange={(e) =>
                    setFormData({ ...formData, groqApiKey: e.target.value })
                  }
                  placeholder="Paste your Groq API key (optional)"
                  className="w-full px-4 py-2.5 bg-white border border-[#eee5d8] rounded-xl text-xs text-[#14332a] placeholder-stone-400 focus:outline-none focus:border-[#e07a4f] focus:ring-1 focus:ring-[#e07a4f] font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowGroqKey(!showGroqKey)}
                  className="absolute right-3.5 top-2.5 text-xs text-[#8aa099] hover:text-[#14332a] cursor-pointer font-semibold"
                >
                  {showGroqKey ? "Hide" : "Show"}
                </button>
              </div>

              {isGroqKeySuspicious && (
                <p className="text-[11px] text-amber-900 bg-amber-50 border border-amber-200 p-2 rounded-xl mt-1.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                  <span>This doesn't look like a standard Groq key (typically starts with "gsk_"). Saving is allowed.</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#14332a] mb-1.5">
                  Groq Model Selection
                </label>
                <select
                  value={formData.groqModel || "openai/gpt-oss-120b"}
                  onChange={(e) =>
                    setFormData({ ...formData, groqModel: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-white border border-[#eee5d8] rounded-xl text-xs text-[#14332a] focus:outline-none focus:border-[#e07a4f]"
                >
                  <option value="openai/gpt-oss-120b">openai/gpt-oss-120b (Flagship 120B — High Reasoning)</option>
                  <option value="openai/gpt-oss-20b">openai/gpt-oss-20b (Fast 20B — Low Latency)</option>
                  <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Llama 3.3 70B)</option>
                  <option value="llama-3.1-8b-instant">llama-3.1-8b-instant (Llama 3.1 8B Instant)</option>
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <p className="text-[11px] text-[#7a8f87] leading-normal">
                  Groq runs open models (including GPT-OSS & Llama 3) via ultra-fast LPU hardware for instant gap analysis.
                </p>
              </div>
            </div>
          </div>

          {/* Secondary: Gemini Settings */}
          <div className="space-y-4 p-4 rounded-[18px] bg-[#fffdf8] border border-[#eee5d8]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-[#14332a] text-[13px]">
                <Sparkles className="w-4 h-4 text-[#e07a4f]" />
                Optional: Personal Gemini API Key
              </div>
              <span className="text-[11px] text-[#c26a3a] font-semibold bg-[#fdf0e2] px-2.5 py-0.5 rounded-full border border-[#f5dcc2]">
                Optional
              </span>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#14332a] mb-1.5">
                Gemini API Key <span className="text-[#8aa099] font-normal">(AIza...)</span>
              </label>
              <div className="relative">
                <input
                  type={showGeminiKey ? "text" : "password"}
                  value={formData.geminiApiKey}
                  onChange={(e) =>
                    setFormData({ ...formData, geminiApiKey: e.target.value })
                  }
                  placeholder="Optional: leave blank to use the free shared student server"
                  className="w-full px-4 py-2.5 bg-white border border-[#eee5d8] rounded-xl text-xs text-[#14332a] placeholder-stone-400 focus:outline-none focus:border-[#e07a4f] focus:ring-1 focus:ring-[#e07a4f] font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-3.5 top-2.5 text-xs text-[#8aa099] hover:text-[#14332a] cursor-pointer font-semibold"
                >
                  {showGeminiKey ? "Hide" : "Show"}
                </button>
              </div>

              {isGeminiKeySuspicious && (
                <p className="text-[11px] text-amber-900 bg-amber-50 border border-amber-200 p-2 rounded-xl mt-1.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                  <span>This doesn't look like a standard Gemini key (typically starts with "AIza"). Saving is allowed.</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#14332a] mb-1.5">
                  Gemini Model Selection
                </label>
                <select
                  value={formData.geminiModel || "gemini-2.5-flash"}
                  onChange={(e) =>
                    setFormData({ ...formData, geminiModel: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-white border border-[#eee5d8] rounded-xl text-xs text-[#14332a] focus:outline-none focus:border-[#e07a4f]"
                >
                  <option value="gemini-2.5-flash">gemini-2.5-flash (High Availability / Recommended)</option>
                  <option value="gemini-2.0-flash">gemini-2.0-flash (Ultra-Fast & Stable)</option>
                  <option value="gemini-1.5-flash">gemini-1.5-flash (Standard Production)</option>
                  <option value="gemini-3.7-flash">gemini-3.7-flash (Preview — High Reasoning)</option>
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <p className="text-[11px] text-[#7a8f87] leading-normal">
                  Auto-invoked if Groq encounters rate limits (429), timeouts (&gt;15s), or invalid credentials.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-[16px] bg-[#e6f0e6] border border-[#d6e6d6] text-[#2d6a4f] text-xs">
            <Lock className="w-4 h-4 text-[#2d6a4f] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Zero-Storage Guarantee:</strong> Your key is used only in this session and never stored. No resume text is indexed or stored in persistent databases.
            </div>
          </div>
        </div>

        {/* Clean Responsive Modal Footer */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-t border-[#eee5d8] bg-[#FAF8F5] flex items-center justify-end gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 rounded-full bg-white border border-[#eee5d8] hover:bg-[#f6eee3] text-xs font-semibold text-[#7a8f87] transition active:scale-98 cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-full bg-[#14332a] hover:bg-[#0f2d22] text-xs font-bold text-white transition active:scale-98 text-center cursor-pointer whitespace-nowrap"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
