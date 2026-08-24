import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BarChart3,
  Edit3,
  ShieldCheck,
  Download,
  Sparkles,
} from "lucide-react";
import { AnalysisResult } from "../types";
import { QuickOverviewGrid } from "./QuickOverviewGrid";
import { GapAnalysisTab } from "./GapAnalysisTab";
import { BulletOptimizerTab } from "./BulletOptimizerTab";
import { AtsDiagnosticsTab } from "./AtsDiagnosticsTab";
import { ExportHubTab } from "./ExportHubTab";
import { ErrorBoundary } from "./ErrorBoundary";

export type DashboardTab = "dashboard" | "gap" | "bullets" | "ats" | "export";

interface AnalysisDashboardProps {
  result: AnalysisResult;
  sourceResumeText: string;
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  onShowToast?: (text: string, type: "info" | "warning" | "error" | "success") => void;
  isAnalyzing?: boolean;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  result,
  sourceResumeText,
  activeTab,
  setActiveTab,
  onShowToast,
  isAnalyzing = false,
}) => {
  const [selectedBulletIndices, setSelectedBulletIndices] = useState<number[]>(
    (result.rewrite_suggestions || []).map((_, i) => i)
  );

  useEffect(() => {
    setSelectedBulletIndices((result.rewrite_suggestions || []).map((_, i) => i));
  }, [result]);

  const handleToggleBullet = (index: number) => {
    setSelectedBulletIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSelectAllBullets = () => {
    setSelectedBulletIndices((result.rewrite_suggestions || []).map((_, i) => i));
  };

  const handleDeselectAllBullets = () => {
    setSelectedBulletIndices([]);
  };

  const subTabs: Array<{ id: DashboardTab; label: string; icon: React.ReactNode }> = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "gap", label: "Gap Analysis", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "bullets", label: "Bullet Point Optimizer", icon: <Edit3 className="w-4 h-4" /> },
    { id: "ats", label: "ATS & Compliance", icon: <ShieldCheck className="w-4 h-4" /> },
    { id: "export", label: "Export & Delivery", icon: <Download className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 pt-2 font-simple">
      {/* Horizontal Tab Navigation Bar (Under Input & CTA Section) */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-[#eee5d8] dark:border-[#1C2638] pb-px overflow-x-auto no-scrollbar smooth-touch-scroll -mx-1 px-1">
        {subTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              disabled={isAnalyzing}
              onClick={() => setActiveTab(tab.id)}
              className={`relative pb-3 pt-2 text-xs sm:text-[13px] font-semibold tracking-tight flex items-center gap-2 transition-all whitespace-nowrap min-h-[42px] shrink-0 px-3.5 rounded-t-xl cursor-pointer ${
                isAnalyzing ? "opacity-50 cursor-not-allowed" : ""
              } ${
                isActive
                  ? "text-[#e07a4f] dark:text-[#E88463] font-bold bg-white/60 dark:bg-[#131A26]/60"
                  : "text-[#7a8f87] dark:text-slate-400 hover:text-[#14332a] dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-800/40"
              }`}
            >
              <span className={isActive ? "text-[#e07a4f] dark:text-[#E88463]" : "text-[#9aa8a2] dark:text-slate-500"}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[#e07a4f] dark:bg-[#E88463] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab View with Error Boundary Isolation */}
      <div>
        {activeTab === "dashboard" && (
          <ErrorBoundary
            fallbackTitle="Dashboard View Unavailable"
            fallbackMessage="An issue occurred rendering the dashboard overview. Reloading will restore standard view."
          >
            <QuickOverviewGrid result={result} />
          </ErrorBoundary>
        )}

        {activeTab === "gap" && (
          <ErrorBoundary
            fallbackTitle="Gap Analysis Visualization Unavailable"
            fallbackMessage="An issue occurred rendering the gap analysis charts. Reloading will restore standard view."
          >
            <div className="space-y-6">
              <GapAnalysisTab result={result} />
            </div>
          </ErrorBoundary>
        )}

        {activeTab === "bullets" && (
          <ErrorBoundary
            fallbackTitle="Bullet Optimizer Unavailable"
            fallbackMessage="An issue occurred displaying rewrite suggestions. Reloading will safely refresh the list."
          >
            <BulletOptimizerTab
              suggestions={result.rewrite_suggestions || []}
              selectedIndices={selectedBulletIndices}
              onToggleSelect={handleToggleBullet}
              onSelectAll={handleSelectAllBullets}
              onDeselectAll={handleDeselectAllBullets}
              onShowToast={onShowToast}
            />
          </ErrorBoundary>
        )}

        {activeTab === "ats" && (
          <ErrorBoundary
            fallbackTitle="ATS Diagnostics Unavailable"
            fallbackMessage="An issue occurred displaying ATS diagnostic rules."
          >
            <AtsDiagnosticsTab result={result} />
          </ErrorBoundary>
        )}

        {activeTab === "export" && (
          <ErrorBoundary
            fallbackTitle="Export Hub Unavailable"
            fallbackMessage="An issue occurred generating the tailored CV export."
          >
            <ExportHubTab
              result={result}
              sourceResumeText={sourceResumeText}
              selectedBulletIndices={selectedBulletIndices}
              onToggleBulletSelect={handleToggleBullet}
              onShowToast={onShowToast}
            />
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
};
