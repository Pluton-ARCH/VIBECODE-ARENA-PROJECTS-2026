import React from 'react';
import { ShieldCheck, Zap, Lock, Sparkles, ArrowRight } from 'lucide-react';

interface HeaderProps {
  onQuickStart: () => void;
  onOpenLearn: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onQuickStart, onOpenLearn }) => {
  return (
    <div className="relative py-10 md:py-14 text-center max-w-4xl mx-auto space-y-6">
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-cyan-500/30 text-xs font-semibold text-cyan-400 shadow-lg shadow-cyan-950/40">
        <Sparkles className="w-3.5 h-3.5" />
        <span>PhishGuard v2.4 • Client-Side Threat Intelligence</span>
      </div>

      {/* Hero Headline */}
      <div className="space-y-3">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-100">
          Check before you <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-500 bg-clip-text text-transparent">click.</span>
        </h1>
        <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Smart detection system for deceptive phishing URLs, urgency-driven SMS scams, lookalike brand typosquatting, and cyber fraud. Evaluated 100% locally with zero external network risks.
        </p>
      </div>

      {/* Highlights Bar */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Zero-Network Link Isolation</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>Sub-10ms Rule Heuristics</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-400" />
          <span>Automatic PII Masking</span>
        </div>
      </div>
    </div>
  );
};
