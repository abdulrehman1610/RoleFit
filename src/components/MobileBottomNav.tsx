import React from "react";
import {
  LayoutDashboard,
  BarChart3,
  Edit3,
  ShieldCheck,
  Download,
  History
} from "lucide-react";
import { DashboardTab } from "./AnalysisDashboard";

interface MobileBottomNavProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  onOpenHistory?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenHistory,
}) => {
  const tabs: Array<{ id: DashboardTab; label: string; icon: React.ReactNode }> = [
    { id: "dashboard", label: "Home", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "gap", label: "Gaps", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "bullets", label: "Optimizer", icon: <Edit3 className="w-4 h-4" /> },
    { id: "ats", label: "ATS", icon: <ShieldCheck className="w-4 h-4" /> },
    { id: "export", label: "Export", icon: <Download className="w-4 h-4" /> },
  ];

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0F1626]/95 backdrop-blur-xl border-t border-stone-200/90 dark:border-[#1C2638] py-1 px-1 flex items-center justify-around shadow-lg safe-area-bottom font-simple transition-colors"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`mobile-bottom-nav-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition cursor-pointer min-h-[44px] min-w-[44px] ${
              isActive
                ? "text-[#D06540] dark:text-[#E88463] font-bold"
                : "text-stone-500 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white"
            }`}
          >
            <div className={`p-1 rounded-lg ${isActive ? "bg-[#FBECE5] dark:bg-[#341F1A] text-[#C85A32] dark:text-[#E88463]" : ""}`}>
              {tab.icon}
            </div>
            <span className="text-[10px] font-semibold tracking-tight mt-0.5">
              {tab.label}
            </span>
          </button>
        );
      })}

      {onOpenHistory && (
        <button
          onClick={onOpenHistory}
          className="flex flex-col items-center justify-center flex-1 py-1 rounded-xl text-stone-500 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white transition cursor-pointer min-h-[44px] min-w-[44px]"
        >
          <div className="p-1 rounded-lg">
            <History className="w-4 h-4 text-stone-400" />
          </div>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">
            History
          </span>
        </button>
      )}
    </nav>
  );
};
