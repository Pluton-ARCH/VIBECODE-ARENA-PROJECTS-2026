import React from 'react';
import {
  ShieldCheck,
  Search,
  BookOpen,
  Flag,
  Crosshair,
  LayoutDashboard,
  Play,
  Presentation,
  Moon,
  Sun,
  Activity
} from 'lucide-react';

export type ActivePage = 'scan' | 'learn' | 'report' | 'track' | 'evaluate' | 'admin';

interface NavbarProps {
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
  onOpenDemo: () => void;
  onOpenPitch: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onPageChange,
  onOpenDemo,
  onOpenPitch,
  isDark,
  onToggleTheme
}) => {
  const navItems: { id: ActivePage; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'scan', label: 'Check', icon: Search },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'report', label: 'Report', icon: Flag },
    { id: 'track', label: 'Track', icon: Crosshair },
    { id: 'evaluate', label: 'Evaluate', icon: Activity },
    { id: 'admin', label: 'Admin', icon: LayoutDashboard }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Live Pulse */}
        <div
          onClick={() => onPageChange('scan')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 p-0.5 shadow-lg shadow-cyan-950/50 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight text-slate-100">
                Phish<span className="text-cyan-400">Guard</span>
              </span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">
              Heuristic Cyber Defense
            </div>
          </div>
        </div>

        {/* Center Nav items */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-2xl border border-slate-800/60">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/40'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls: 60s Demo, Pitch, Theme Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold transition-all"
            title="60-Second Demo Walkthrough"
          >
            <Play className="w-3.5 h-3.5 fill-cyan-400" />
            <span className="hidden sm:inline">60s Demo</span>
          </button>

          <button
            onClick={onOpenPitch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-all"
            title="Pitch Deck Slides"
          >
            <Presentation className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Pitch</span>
          </button>

          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 bg-slate-950 border-t border-slate-900 gap-2 text-xs">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg shrink-0 font-medium ${
                isActive ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
