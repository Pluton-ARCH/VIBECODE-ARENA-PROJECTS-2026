import React from 'react';
import { ShieldCheck, PhoneCall, ExternalLink, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-900 bg-slate-950/80 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Col 1: About */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-bold text-slate-100">PhishGuard</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Advanced client-side cyber fraud defense system engineered for instantaneous threat detection, privacy-preserving incident reporting, and citizen defense education.
            </p>
          </div>

          {/* Col 2: Emergency Response Lines */}
          <div className="space-y-2">
            <span className="font-bold text-slate-200 uppercase tracking-wider block text-[11px]">
              Emergency Cybercrime Helplines (India)
            </span>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                <span>National Cyber Fraud Helpline: <strong className="text-slate-200 font-mono">1930</strong> (24x7 Toll Free)</span>
              </div>
              <div className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                <span>Portal: <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">cybercrime.gov.in</a></span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>CERT-In: incident@cert-in.org.in</span>
              </div>
            </div>
          </div>

          {/* Col 3: Privacy & Security Policy */}
          <div className="space-y-2">
            <span className="font-bold text-slate-200 uppercase tracking-wider block text-[11px]">
              Security & Privacy Guarantee
            </span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              PhishGuard operates under strict zero-network URL inspection. User-submitted links are never requested or fetched. All sensitive telephone numbers and email addresses are masked client-side prior to storage.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>© 2026 PhishGuard Cyber Defense. Built for the Smart Anti-Phishing Hackathon.</div>
          <div className="font-mono">Engine: v2.4 • Client Heuristic Rules</div>
        </div>
      </div>
    </footer>
  );
};
