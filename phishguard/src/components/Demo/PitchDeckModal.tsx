import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Presentation, ShieldAlert, Cpu, CheckCircle2, TrendingUp, Layers } from 'lucide-react';

interface PitchDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PitchDeckModal: React.FC<PitchDeckModalProps> = ({ isOpen, onClose }) => {
  const [slide, setSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      num: '01 / 05',
      badge: 'THE PROBLEM',
      icon: ShieldAlert,
      title: 'The Silent Epidemic: Rapid Escalation of Social Engineering Scams',
      bulletPoints: [
        'Over 75,000 cyber fraud complaints registered every month in India alone via the 1930 helpline.',
        'SMS phishing (Smishing) masquerading as urgent electricity cutoffs, bank KYC locks, and fake tax refunds induces impulsive panic.',
        'Emergence of high-coercion syndicates: Digital arrest extortion, reverse UPI QR code scams, and fake courier parcels.',
        'Existing browser scanners are opaque black-boxes that fail to explain WHY a communication is dangerous to non-technical citizens.'
      ]
    },
    {
      num: '02 / 05',
      badge: 'THE SOLUTION',
      icon: CheckCircle2,
      title: 'PhishGuard: Explainable, Multi-Channel Client-Side Cyber Defense',
      bulletPoints: [
        'Multi-Vector Inspection: Analyzes URLs, SMS messages, raw emails, and screenshots via local OCR.',
        '100% Zero-Network Hazard: NEVER visits or opens suspicious links. Pure string heuristics prevent session token or IP disclosure.',
        'Granular Forensic Explainability: Breaks threats down into 0-100 score with explicit heuristic points (+45 pts Lookalike Domain, +35 pts OTP harvest).',
        'Actionable Citizen Defense: Instant defensive checklists and direct pre-fill into regulatory incident triage.'
      ]
    },
    {
      num: '03 / 05',
      badge: 'ARCHITECTURE',
      icon: Cpu,
      title: 'Privacy-Preserving Edge Architecture',
      bulletPoints: [
        'Detection Engine ("The Brain"): urlAnalyzer, textAnalyzer, ocrService, and dynamic scorer running client-side with sub-10ms latency.',
        'Automated Privacy Guard: Automatic PII masking of telephone numbers, email addresses, and account numbers prior to persistence.',
        'Citizen Transparency: Generates unique PG-2026 tracking IDs with real-time milestone step updates.',
        'SOC Analyst Dashboard: Pattern intelligence clustering repeated domains, recurring phone numbers, and keywords.'
      ]
    },
    {
      num: '04 / 05',
      badge: 'BENCHMARK & ACCURACY',
      icon: Layers,
      title: 'Rigorous Verification Against 60 Ground-Truth Samples',
      bulletPoints: [
        'Balanced Benchmark Dataset: 30 active phishing variations (IP hosts, homoglyphs, userinfo @ spoofs) + 30 legitimate negative controls.',
        'Zero False Alarm Priority: Specifically tuned so authentic bank debits, Google 2FA SMS, and utility statements pass with Low Risk (0-39).',
        'Interactive Confusion Matrix: Displays live accuracy, precision, recall, and false positive rates.',
        'Automated Unit Test Suite: npm run test:brain verifies all 6 core attack vectors.'
      ]
    },
    {
      num: '05 / 05',
      badge: 'IMPACT & FUTURE ROADMAP',
      icon: TrendingUp,
      title: 'Empowering Citizens & National Cybersecurity Infrastructure',
      bulletPoints: [
        'Golden Hour Fund Recovery: Seamless 1-click guidance to Citizen Helpline 1930 and cybercrime.gov.in.',
        'Interactive Cyber Hygiene Education: Spot-the-Phish interactive quiz and zero-transmission local password entropy checker.',
        'Roadmap Phase 1: Native Chromium & Firefox browser extension providing real-time page link defanging.',
        'Roadmap Phase 2: Direct API integration with Telecom Chakshu (Sanchar Saathi) for automated carrier SMS sender blacklisting.'
      ]
    }
  ];

  const current = slides[slide];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                {current.badge}
              </span>
              <h4 className="text-sm font-bold text-slate-200">PhishGuard Pitch Deck</h4>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            {current.num}
          </span>
        </div>

        {/* Slide Content */}
        <div className="space-y-4 min-h-[220px]">
          <h3 className="text-lg md:text-xl font-bold text-slate-100 leading-snug">
            {current.title}
          </h3>

          <div className="space-y-2.5 pt-2">
            {current.bulletPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === slide ? 'w-6 bg-cyan-400' : 'bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={slide === 0}
              onClick={() => setSlide(prev => Math.max(0, prev - 1))}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              disabled={slide === slides.length - 1}
              onClick={() => setSlide(prev => Math.min(slides.length - 1, prev + 1))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 text-slate-950 font-bold text-xs"
            >
              <span>{slide === slides.length - 1 ? 'Finish' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
