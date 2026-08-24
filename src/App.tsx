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
import { AlertCircle, WifiOff, Linkedin, Twitter, Github, Mail, ShieldCheck, Heart } from "lucide-react";

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

  useEffect(() => {
    try {
      document.documentElement.classList.remove("dark");
      localStorage.removeItem("resumematch_theme");
    } catch (e) {}
  }, []);

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
    <div className="min-h-screen bg-[#fdf8f0] text-[#14332a] antialiased overflow-x-hidden flex flex-col justify-between">
      <div className="max-w-[1440px] mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-0 w-full flex-1 flex flex-col justify-between">
        {/* Top Floating Action Bar (Navbar) */}
        <Navbar
          settings={settings}
          onOpenSettings={() => setIsConfigOpen(true)}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onLoadSample={handleLoadSample}
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
                  jobDescription={jobDescription}
                  settings={settings}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  onShowToast={showToast}
                  isAnalyzing={isAnalyzing}
                />
              </ErrorBoundary>
            </div>
          )}
        </main>

        {/* Global Footer (Matching Cards & Rounded Top Corners) */}
        <footer className="mt-12 sm:mt-16 rounded-t-[28px] sm:rounded-t-[36px] rounded-b-none bg-gradient-to-br from-[#fef6ec] to-[#fdf8f0] border-t border-x border-[#f1e6d6] border-b-0 relative overflow-hidden font-simple shadow-xs">
          {/* Animated Organic Ornaments (Hero-Style) */}
          {/* Shape 1: Morphing peach blob on the left */}
          <div className="pointer-events-none absolute -bottom-32 -left-24 w-[400px] h-[400px] bg-[#fde9d9] opacity-60 animate-morph-blob" />
          
          {/* Shape 2: Floating gentle sage circle on the right */}
          <div className="pointer-events-none absolute -top-20 -right-16 w-[300px] h-[300px] bg-[#d8f0d8] rounded-full opacity-50 animate-float-slow" />
          
          {/* Shape 3: Floating warm peach circle middle right */}
          <div className="pointer-events-none absolute bottom-20 right-[15%] w-24 h-24 bg-[#f8cbb1] rounded-full opacity-40 hidden sm:block animate-float-reverse" />
          
          {/* Shape 4: Pulsing small terracotta accent dot near left */}
          <div className="pointer-events-none absolute top-24 left-[20%] w-8 h-8 bg-[#f5a07a] rounded-full opacity-50 hidden sm:block animate-pulse-soft" />
          
          <div className="w-full px-6 sm:px-10 lg:px-12 py-12 sm:py-14 relative z-10">
            <div className="flex flex-col xl:flex-row justify-between gap-10 xl:gap-8">
              
              {/* Left Column: Brand & Socials */}
              <div className="xl:w-[25%] flex flex-col items-center xl:items-start text-center xl:text-left">
                <div className="flex items-center gap-2.5 mb-4">
                  <img src="/favicon.svg" alt="RoleFit Logo" className="w-8 h-8 rounded-lg shadow-2xs shrink-0" />
                  <span className="font-black text-[#14332a] text-xl tracking-tight">ROLE<span className="text-[#e07a4f]">FIT</span></span>
                </div>
                <p className="text-[13px] text-[#7a8f87] leading-relaxed mb-5 max-w-[280px]">
                  AI-powered platform to optimize your resume, match roles, and accelerate your career growth.
                </p>
                <div className="flex items-center justify-center xl:justify-start gap-2.5">
                  <a href="#" className="w-9 h-9 rounded-full bg-[#f4ebd9] flex items-center justify-center text-[#14332a] hover:bg-[#14332a] hover:text-white transition-colors shadow-2xs">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-9 h-9 rounded-full bg-[#f4ebd9] flex items-center justify-center text-[#14332a] hover:bg-[#14332a] hover:text-white transition-colors shadow-2xs">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href="https://github.com/abdulrehman1610/RoleFit" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#f4ebd9] flex items-center justify-center text-[#14332a] hover:bg-[#14332a] hover:text-white transition-colors shadow-2xs">
                    <Github className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-9 h-9 rounded-full bg-[#f4ebd9] flex items-center justify-center text-[#14332a] hover:bg-[#14332a] hover:text-white transition-colors shadow-2xs">
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Middle Columns: Links */}
              <div className="xl:w-[45%] grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
                {/* Product */}
                <div>
                  <h4 className="text-[11px] font-bold text-[#14332a] uppercase tracking-wider mb-4">Product</h4>
                  <ul className="space-y-3 text-[13px] text-[#7a8f87] font-medium">
                    <li><a href="#" className="hover:text-[#14332a] transition-colors">Dashboard</a></li>
                    <li><a href="#" className="hover:text-[#14332a] transition-colors">Gap Analysis</a></li>
                    <li><a href="#" className="hover:text-[#14332a] transition-colors">Bullet Optimizer</a></li>
                    <li><a href="#" className="hover:text-[#14332a] transition-colors">ATS & Compliance</a></li>
                    <li><a href="#" className="hover:text-[#14332a] transition-colors">Export & Delivery</a></li>
                  </ul>
                </div>

                {/* Resources */}
                <div>
                  <h4 className="text-[11px] font-bold text-[#14332a] uppercase tracking-wider mb-4">Resources</h4>
                  <ul className="space-y-3 text-[13px] text-[#7a8f87] font-medium">
                    <li><a href="#" className="hover:text-[#14332a] transition-colors">Resume Tips</a></li>
                    <li><a href="#" className="hover:text-[#14332a] transition-colors">ATS Guide</a></li>
                    <li><a href="#" className="hover:text-[#14332a] transition-colors">Skill Matrix</a></li>
                    <li><a href="#" className="hover:text-[#14332a] transition-colors">Blog</a></li>
                    <li><a href="#" className="hover:text-[#14332a] transition-colors">Help Center</a></li>
                  </ul>
                </div>

                {/* Company */}
                <div>
                  <h4 className="text-[11px] font-bold text-[#14332a] uppercase tracking-wider mb-4">Company</h4>
                  <ul className="space-y-3 text-[13px] text-[#7a8f87] font-medium">
                    <li><a href="#" className="hover:text-[#14332a] transition-colors">About Us</a></li>
                    <li><a href="#" className="hover:text-[#14332a] transition-colors">Careers</a></li>
                    <li><a href="#" className="hover:text-[#14332a] transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-[#14332a] transition-colors">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-[#14332a] transition-colors">Contact Us</a></li>
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h4 className="text-[11px] font-bold text-[#14332a] uppercase tracking-wider mb-4">Support</h4>
                  <ul className="space-y-3 text-[13px] text-[#7a8f87] font-medium">
                    <li><a href="#" className="hover:text-[#14332a] transition-colors">Documentation</a></li>
                    <li><a href="#" className="hover:text-[#14332a] transition-colors">FAQs</a></li>
                    <li><a href="#" className="hover:text-[#14332a] transition-colors">Report an Issue</a></li>
                    <li><a href="#" className="hover:text-[#14332a] transition-colors">Feature Request</a></li>
                  </ul>
                </div>
              </div>

              {/* Right Column: Newsletter */}
              <div className="xl:w-[30%] flex justify-center xl:justify-end">
                <div className="bg-white border border-[#eee5d8] rounded-2xl p-5 sm:p-6 shadow-2xs max-w-sm w-full h-fit">
                  <h4 className="text-[11px] font-bold text-[#14332a] uppercase tracking-widest mb-2.5">Stay Ahead In Your Career</h4>
                  <p className="text-[12px] text-[#7a8f87] mb-4 leading-relaxed">
                    Get career tips, resume strategies and updates straight to your inbox.
                  </p>
                  <div className="flex items-stretch gap-2 h-9">
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="flex-1 bg-[#fdf8f0] border border-[#eee5d8] rounded-lg px-3 text-xs text-[#14332a] placeholder:text-[#a1b3ac] focus:outline-none focus:border-[#6ee7a0] focus:ring-1 focus:ring-[#6ee7a0]/20 transition-all min-w-0"
                    />
                    <button className="bg-[#14332a] text-white px-3.5 rounded-lg text-xs font-semibold hover:bg-[#1a4237] transition shrink-0 shadow-2xs">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Bar */}
            <div className="mt-12 pt-6 border-t border-[#eee5d8] flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-[#7a8f87]">
              <p>&copy; {new Date().getFullYear()} RoleFit. All rights reserved.</p>
              
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#14332a]" />
                <span>Your data is secure & never shared.</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span>Made with</span>
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>for job seekers worldwide</span>
              </div>
            </div>

          </div>
        </footer>
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
