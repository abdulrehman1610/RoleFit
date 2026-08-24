import React from "react";
import {
  LayoutDashboard,
  BarChart3,
  Edit3,
  ShieldCheck,
  Download,
  Gem,
  Settings,
  ArrowRight,
  X,
  History,
  Sun,
  Moon
} from "lucide-react";
import { DashboardTab } from "./AnalysisDashboard";

interface SidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  onOpenSettings?: () => void;
  onOpenHistory?: () => void;
  onOpenProModal?: () => void;
  theme?: "dark" | "light";
  onToggleTheme?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettings,
  onOpenHistory,
  onOpenProModal,
  theme = "light",
  onToggleTheme,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems: Array<{ id: DashboardTab; label: string; icon: React.ReactNode }> = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "gap", label: "Gap Analysis", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "bullets", label: "Bullet Point Optimizer", icon: <Edit3 className="w-4 h-4" /> },
    { id: "ats", label: "ATS & Compliance", icon: <ShieldCheck className="w-4 h-4" /> },
    { id: "export", label: "Export & Delivery", icon: <Download className="w-4 h-4" /> },
  ];

  const handleSelectTab = (tabId: DashboardTab) => {
    setActiveTab(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full space-y-6">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-1 py-1 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#14332a] flex items-center justify-center text-white font-bold text-[18px] tracking-tight shadow-sm">
              R
            </div>
            <div className="flex items-baseline gap-0.5 tracking-tight">
              <span className="text-[#14332a] dark:text-white font-extrabold text-[18px]">RESUME</span>
              <span className="text-[#e07a4f] font-extrabold text-[18px]">MATCH</span>
            </div>
          </div>

          {/* Mobile Close Button */}
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              title="Close menu"
              aria-label="Close menu"
              className="lg:hidden w-8 h-8 rounded-lg bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5 font-simple">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[14px] transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#fde9d9] dark:bg-[#341F1A] text-[#e07a4f] dark:text-[#E88463] font-semibold"
                    : "text-[#9aa8a2] dark:text-slate-400 hover:text-[#14332a] dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/60 font-medium"
                }`}
              >
                <span className={isActive ? "text-[#e07a4f] dark:text-[#E88463]" : "text-[#9aa8a2] dark:text-slate-500"}>
                  {item.icon}
                </span>
                <span className="tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Secondary Quick Action Nav Items */}
        <div className="space-y-1.5 pt-2 border-t border-dashed border-[#e8ddd0] dark:border-slate-800 font-simple">
          {onOpenHistory && (
            <button
              type="button"
              onClick={onOpenHistory}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] text-[#9aa8a2] dark:text-slate-400 hover:text-[#14332a] dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/60 font-medium transition cursor-pointer"
            >
              <History className="w-4 h-4" />
              <span>Scan History</span>
            </button>
          )}

          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] text-[#9aa8a2] dark:text-slate-400 hover:text-[#14332a] dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/60 font-medium transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                {theme}
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-0">
        {/* Pro Insights Promo Card */}
        <div className="rounded-[20px] bg-[#fdf0e2] dark:bg-[#131A26] border border-[#f5dcc2] dark:border-[#2C384D] p-5 relative overflow-hidden font-simple transition-colors">
          <div className="w-9 h-9 rounded-full bg-[#fde9d9] dark:bg-[#3D251D] flex items-center justify-center mb-3 shadow-sm">
            <Gem className="w-4 h-4 text-[#e07a4f]" />
          </div>
          <h4 className="font-bold text-[15px] leading-tight text-[#14332a] dark:text-white">
            Pro Insights
          </h4>

          <p className="text-[13px] leading-[18px] text-[#6b7d76] dark:text-slate-400 mt-2 font-normal">
            Unlock deep analytics, role benchmarks and smart recommendations.
          </p>

          <button
            type="button"
            onClick={onOpenProModal}
            className="mt-4 w-full bg-[#14332a] hover:bg-[#0f2d22] dark:bg-emerald-900 dark:hover:bg-emerald-800 text-white rounded-full py-2.5 text-[13px] font-semibold flex items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer"
          >
            <span>Upgrade to Pro</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* User Profile Capsule at Bottom */}
        <div className="mt-6">
          <div className="bg-white dark:bg-[#0F1626] rounded-[16px] border border-[#eee5d8] dark:border-[#1C2638] p-3 flex items-center gap-3 font-simple shadow-sm">
            <div className="w-9 h-9 rounded-full bg-[#14332a] dark:bg-emerald-900 text-white flex items-center justify-center font-bold text-[12px] shrink-0">
              AC
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              <span className="font-semibold text-[13px] leading-none text-[#14332a] dark:text-white truncate">
                Alex Chen
              </span>
              <span className="text-[11px] text-[#8aa099] dark:text-slate-500 truncate mt-1">
                alex.chen@example.com
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenSettings}
              title="AI Engine Settings"
              aria-label="AI Engine Settings"
              className="w-7 h-7 rounded-full bg-[#f6f0e8] dark:bg-slate-800 text-[#9aa8a2] hover:text-[#14332a] dark:hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex lg:w-[276px] lg:shrink-0 lg:sticky lg:top-0 lg:h-screen bg-[#fdf8f0] dark:bg-[#0B101D] flex-col justify-between px-5 py-6 transition-colors z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Slide-over */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative w-[276px] max-w-[85vw] bg-[#fdf8f0] dark:bg-[#0B101D] h-full px-5 py-6 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200 overflow-y-auto">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
