import React, { useState } from 'react';
import { X, Play, ArrowRight, ArrowLeft, CheckCircle2, Shield, Flag, LayoutDashboard, Sparkles } from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunStepAction: (stepNumber: number) => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose, onRunStepAction }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const demoSteps = [
    {
      title: 'Step 1: Scanner Ingestion & Explaining Threats',
      badge: '00:00 - 00:20',
      icon: Sparkles,
      desc: 'The user pastes an urgent SMS ("Your SBI account is blocked. Update KYC immediately at sbi-kyc-update.xyz"). PhishGuard instantly isolates the link, detects urgency manipulation, lookalike subdomains, and produces a 0-100 score with human-readable reasons.',
      actionText: 'Load Scam SMS into Scanner',
      actionStep: 1
    },
    {
      title: 'Step 2: Safe Link Isolation & Defensive Action',
      badge: '00:20 - 00:35',
      icon: Shield,
      desc: 'Instead of loading the malicious destination, PhishGuard defangs the link into "hxxps://sbi-kyc-update[.]xyz", prevents session token leakage, provides protective advice, and exposes a one-click "Report this" button.',
      actionText: 'Inspect Defensive Guidance',
      actionStep: 2
    },
    {
      title: 'Step 3: Incident Submission & Citizen Tracking ID',
      badge: '00:35 - 00:50',
      icon: Flag,
      desc: 'The citizen files an incident report. Personal details (emails, phone numbers) are masked client-side before storage, generating a unique PG-2026-00XXX tracking ID for timeline tracking and 1930 escalation.',
      actionText: 'Open Incident Submission',
      actionStep: 3
    },
    {
      title: 'Step 4: Admin SOC Triage & Threat Syndicate Clustering',
      badge: '00:50 - 01:00',
      icon: LayoutDashboard,
      desc: 'Cyber analysts access the triage dashboard to cluster repeated scam domains, analyze weekly intake velocity, update investigation status, and export sanitized CSVs for CERT-In / law enforcement takedowns.',
      actionText: 'Open Admin SOC Dashboard',
      actionStep: 4
    }
  ];

  const step = demoSteps[currentStep];
  const Icon = step.icon;

  const handleStepAction = () => {
    onRunStepAction(step.actionStep);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 md:p-8 shadow-2xl shadow-cyan-950/60 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Play className="w-6 h-6 fill-cyan-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-0.5 rounded-full">
              Hackathon 60-Second Demo Walkthrough
            </span>
            <h3 className="text-xl font-extrabold text-slate-100 mt-1">
              PhishGuard Live Demo Tour
            </h3>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          {demoSteps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                idx === currentStep ? 'bg-cyan-400' : idx < currentStep ? 'bg-cyan-700' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Content Box */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Icon className="w-4 h-4 text-cyan-400" />
              <span>{step.title}</span>
            </span>
            <span className="text-[11px] font-mono text-cyan-400 font-bold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
              {step.badge}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {step.desc}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentStep === demoSteps.length - 1}
              onClick={() => setCurrentStep(prev => Math.min(demoSteps.length - 1, prev + 1))}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleStepAction}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-cyan-950/50"
          >
            <span>{step.actionText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
