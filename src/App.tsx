/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { HeroBanner } from "./components/HeroBanner";
import { InputSection } from "./components/InputSection";
import { AnalysisDashboard, DashboardTab } from "./components/AnalysisDashboard";
import { DashboardSkeleton } from "./components/DashboardSkeleton";
import { ConfigModal } from "./components/ConfigModal";
import { HistoryModal } from "./components/HistoryModal";
import { ProUpgradeModal } from "./components/ProUpgradeModal";
import { ToastContainer, ToastMessage } from "./components/Toast";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AISettings, AnalysisResult } from "./types";
import { analyzeResumeWithFallback } from "./services/aiService";
import { SAMPLE_RESUMES, SAMPLE_JOB_DESCRIPTIONS, MOCK_ANALYSIS_RESULT } from "./data/sampleData";
import { AlertCircle, WifiOff } from "lucide-react";

const SETTINGS_STORAGE_KEY = "resumematch_settings_v3";
const HISTORY_STORAGE_KEY = "resumematch_analysis_history_v2";

export default function App() {
  const [resumeText, setResumeText] = useState<string>(SAMPLE_RESUMES.senior_swe.text);
  const [jobDescription, setJobDescription] = useState<string>(SAMPLE_JOB_DESCRIPTIONS.senior_swe_role.text);

  const [activeTab, setActiveTab] = useState<DashboardTab>("dashboard");
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try {
      return (localStorage.getItem("resumematch_theme") as "dark" | "light") || "light";
    } catch (e) {
      return "light";
    }
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem("resumematch_theme", theme);
    } catch (e) {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [analysisStage, setAnalysisStage] = useState<string>("Evaluating Match & ATS Alignment...");

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(MOCK_ANALYSIS_RESULT);

  const showToast = (
    text: string,
    type: "info" | "warning" | "error" | "success" = "info",
    duration = 5000
  ) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, text, type, duration }]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Online / Offline listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast("Network restored. Online live inference active.", "success");
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast("You're offline. App will use instant local demo analysis.", "warning");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const [settings, setSettings] = useState<AISettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // safe fallback
    }
    return {
      groqApiKey: "",
      groqModel: "openai/gpt-oss-120b",
      geminiApiKey: "",
      geminiModel: "gemini-2.5-flash",
      enableGeminiFallback: true,
      forceMockMode: false,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn("Could not persist settings to localStorage:", e);
    }
  }, [settings]);

  // Safe history save with quota protection
  const saveToHistory = (result: AnalysisResult) => {
    try {
      const existingRaw = localStorage.getItem(HISTORY_STORAGE_KEY);
      const existing: AnalysisResult[] = existingRaw ? JSON.parse(existingRaw) : [];
      const updated = [result, ...existing.filter((item) => item.timestamp !== result.timestamp)].slice(0, 10);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage quota limit reached while saving history:", e);
    }
  };

  const handleRunAnalysis = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setErrorMessage("Please provide both a Candidate Resume and Target Job Description.");
      return;
    }

    setErrorMessage(null);
    setIsAnalyzing(true);
    setAnalysisStage("Evaluating Match & ATS Alignment...");

    try {
      const result = await analyzeResumeWithFallback(
        resumeText,
        jobDescription,
        settings,
        {
          onStageChange: (stage) => setAnalysisStage(stage),
          onNotice: (notice) => showToast(notice, "info", 4000),
        }
      );

      setAnalysisResult(result);
      saveToHistory(result);
      showToast("Analysis complete!", "success");

      // Auto-scroll to results dashboard
      setTimeout(() => {
        const dashboardEl = document.getElementById("analysis-dashboard-section");
        if (dashboardEl) {
          dashboardEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } catch (err: any) {
      console.error("[Analysis Error]:", err);
      const safeErrMessage = err?.message || "An unexpected issue occurred during analysis. Try again or check settings.";
      setErrorMessage(safeErrMessage);
      showToast(safeErrMessage, "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadSample = (sampleKey: "senior_swe" | "cloud_ai") => {
    if (sampleKey === "senior_swe") {
      setResumeText(SAMPLE_RESUMES.senior_swe.text);
      setJobDescription(SAMPLE_JOB_DESCRIPTIONS.senior_swe_role.text);
      showToast("Loaded Senior Full-Stack SWE sample pairing", "info");
    } else if (sampleKey === "cloud_ai") {
      setResumeText(SAMPLE_RESUMES.cloud_ai.text);
      setJobDescription(SAMPLE_JOB_DESCRIPTIONS.staff_ai_role.text);
      showToast("Loaded Staff AI / Cloud Architect sample pairing", "info");
    }
    setErrorMessage(null);
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-[#080D1A] text-slate-200" : "bg-[#fdf8f0] text-[#14332a]"} antialiased transition-colors duration-200 overflow-x-hidden`}>
      <div className="max-w-[1440px] mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Top Floating Action Bar (Navbar) */}
        <Navbar
          settings={settings}
          onOpenSettings={() => setIsConfigOpen(true)}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onLoadSample={handleLoadSample}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Offline Banner if disconnected */}
        {!isOnline && (
          <div className="bg-amber-500 text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 font-simple shadow-xs mb-6 rounded-2xl">
            <WifiOff className="w-4 h-4" />
            <span>You are currently offline. RoleFit is operating in Instant Local Analysis mode.</span>
          </div>
        )}

        {/* Main Content Area */}
        <main className="space-y-6">
          {/* Error Alert Box if any */}
          {errorMessage && (
            <div className="p-4 rounded-3xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs font-simple">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => setIsConfigOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-semibold shrink-0 transition min-h-[44px] flex items-center cursor-pointer"
              >
                Configure Settings
              </button>
            </div>
          )}

          {/* Hero Banner Section */}
          <HeroBanner
            onAnalyze={handleRunAnalysis}
            isAnalyzing={isAnalyzing}
          />

          {/* Dual Resume & Target Role Input Section */}
          <InputSection
            resumeText={resumeText}
            setResumeText={setResumeText}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            onAnalyze={handleRunAnalysis}
            isAnalyzing={isAnalyzing}
            onLoadSample={handleLoadSample}
            onShowToast={showToast}
          />

          {/* Loading Skeleton during in-flight analysis */}
          {isAnalyzing && (
            <div id="analysis-loading-section">
              <DashboardSkeleton stageText={analysisStage} />
            </div>
          )}

          {/* Dynamic Analysis Dashboard with Horizontal Tabs Directly Under Inputs */}
          {!isAnalyzing && analysisResult && (
            <div id="analysis-dashboard-section" className="pt-2">
              <ErrorBoundary
                fallbackTitle="Dashboard Rendering Notice"
                fallbackMessage="An isolated display issue occurred in the dashboard. Click below to refresh the view."
              >
                <AnalysisDashboard
                  result={analysisResult}
                  sourceResumeText={resumeText}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  onShowToast={showToast}
                  isAnalyzing={isAnalyzing}
                />
              </ErrorBoundary>
            </div>
          )}
        </main>
      </div>

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Modals */}
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        settings={settings}
        onSave={(newSettings) => {
          setSettings(newSettings);
          showToast("AI provider configuration saved.", "success");
        }}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectResult={(res) => {
          setAnalysisResult(res);
          showToast("Loaded analysis from history.", "info");
        }}
      />

      <ProUpgradeModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
      />
    </div>
  );
}
