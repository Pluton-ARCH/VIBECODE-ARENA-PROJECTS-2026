import React, { useState } from 'react';
import { QUIZ_QUESTIONS, CYBER_HELPLINES } from '../../data/seedData';
import {
  ShieldCheck,
  Lock,
  AlertTriangle,
  HelpCircle,
  Key,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  PhoneCall,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';

export const EducationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guides' | 'quiz' | 'password' | 'checklist'>('guides');
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  // Password checker state
  const [passwordInput, setPasswordInput] = useState('');
  const [copiedHelpline, setCopiedHelpline] = useState<string | null>(null);

  const handleCopyHelpline = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedHelpline(code);
    setTimeout(() => setCopiedHelpline(null), 2000);
  };

  // Password analysis logic (100% client side)
  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, text: 'Enter a password', time: '0 seconds', tips: [] };

    let score = 0;
    const tips: string[] = [];

    if (pwd.length >= 8) score += 20;
    if (pwd.length >= 14) score += 30;
    else tips.push('Use at least 14-16 characters or a 4-word passphrase.');

    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 20;
    else tips.push('Mix uppercase and lowercase letters.');

    if (/[0-9]/.test(pwd)) score += 15;
    else tips.push('Include numbers.');

    if (/[^A-Za-z0-9]/.test(pwd)) score += 15;
    else tips.push('Include special symbols (@, #, $, %, !).');

    // Common patterns penalty
    if (/password|123456|qwerty|admin/i.test(pwd)) {
      score = Math.max(10, score - 50);
      tips.push('Avoid common dictionary words or predictable sequences.');
    }

    let text = 'Weak';
    let time = 'Instantly cracked';
    let color = 'text-rose-400';

    if (score >= 80) {
      text = 'Very Strong';
      time = 'Several centuries';
      color = 'text-emerald-400';
    } else if (score >= 60) {
      text = 'Strong';
      time = 'A few years';
      color = 'text-cyan-400';
    } else if (score >= 40) {
      text = 'Moderate';
      time = 'A few hours or days';
      color = 'text-amber-400';
    }

    return { score, text, time, color, tips };
  };

  const pwdAnalysis = calculatePasswordStrength(passwordInput);

  // Quiz scoring
  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (showExplanation) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    setShowExplanation(true);
  };

  const handleNextQuizQuestion = () => {
    setShowExplanation(false);
    if (currentQuizIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuizIndex(0);
    setUserAnswers({});
    setShowExplanation(false);
    setQuizFinished(false);
  };

  const calculateQuizScore = () => {
    let correct = 0;
    QUIZ_QUESTIONS.forEach(q => {
      const selectedIndex = userAnswers[q.id];
      if (selectedIndex !== undefined && q.options[selectedIndex]?.isCorrect) {
        correct++;
      }
    });
    return correct;
  };

  const educationSections = [
    {
      title: '1. Safe Browsing & Domain Verification',
      icon: ShieldCheck,
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            Always inspect the <strong>true root domain</strong> in your browser address bar. Attackers love setting up subdomains like <code className="text-cyan-400 bg-slate-950 px-1 py-0.5 rounded font-mono">paypal.com.evil-account-login.xyz</code> where the real website is <code className="text-cyan-400 bg-slate-950 px-1 py-0.5 rounded font-mono">evil-account-login.xyz</code>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="font-semibold text-slate-200 block mb-1">Beware of Character Lookalikes</span>
              Scammers substitute letters like <code className="text-amber-300">0</code> for <code className="text-amber-300">O</code>, <code className="text-amber-300">1</code> for <code className="text-amber-300">l</code>, or <code className="text-amber-300">rn</code> for <code className="text-amber-300">m</code> (e.g. <em>arnazon</em> vs <em>amazon</em>).
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="font-semibold text-slate-200 block mb-1">Public Wi-Fi Risks</span>
              Avoid logging into banking apps or entering credentials on unencrypted coffee shop or airport Wi-Fi without a trusted VPN.
            </div>
          </div>
        </div>
      )
    },
    {
      title: '2. Modern Password Security & 2FA',
      icon: Lock,
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            Passphrase length beats complexity every time. A 4-word random passphrase like <code className="text-cyan-400 bg-slate-950 px-1 py-0.5 rounded font-mono">correct-horse-battery-staple</code> has more cryptographic entropy than a short complex string like <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded font-mono">Tr0ub4dor&3</code>, and is far easier to remember.
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-1">
            <li>Never reuse passwords across financial and personal email accounts.</li>
            <li>Use dedicated password managers (Bitwarden, 1Password, Apple Keychain).</li>
            <li>Enable App-based 2FA (Authenticator apps or FIDO2 Security Keys) rather than SMS 2FA whenever possible to prevent SIM swapping.</li>
          </ul>
        </div>
      )
    },
    {
      title: '3. Common Fraud Modus Operandi (India & Global)',
      icon: AlertTriangle,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="font-semibold text-rose-400">Fake KYC & Bank Suspension</span>
            <p className="text-slate-400">SMS claims your account is locked and demands updating PAN/Aadhaar via third-party web forms.</p>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="font-semibold text-amber-400">UPI / QR Code Reverse Scams</span>
            <p className="text-slate-400">Buyers on marketplace platforms trick sellers into scanning QR codes or entering PIN to "receive money". You NEVER enter a PIN to receive funds.</p>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="font-semibold text-cyan-400">"Digital Arrest" & Fake Courier</span>
            <p className="text-slate-400">Callers impersonate police or FedEx, claiming a parcel in your name contains illegal narcotics, demanding Skype video interrogations.</p>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="font-semibold text-emerald-400">Telegram Part-Time Task Scams</span>
            <p className="text-slate-400">Victims are paid Rs 150 for liking videos, then coerced into depositing lakhs into fictitious crypto pools.</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Education Header */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-3 py-1 rounded-full">
              Education & Cyber Defense Hub
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 mt-2">
              Empower Yourself Against Cyber Fraud
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
              Learn how to spot manipulative psychological triggers, test your phishing awareness with interactive scenarios, and verify password resilience locally.
            </p>
          </div>

          {/* Sub-navigation tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('guides')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'guides' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Security Guides
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'quiz' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Spot the Phish Quiz (8)
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'password' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Password Strength
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'checklist' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              If You Got Scammed
            </button>
          </div>
        </div>

        {/* Tab 1: Security Guides */}
        {activeTab === 'guides' && (
          <div className="space-y-4 animate-fade-in">
            {educationSections.map((sec, idx) => {
              const Icon = sec.icon;
              const isExpanded = expandedSection === idx;
              return (
                <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(isExpanded ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold text-slate-200">{sec.title}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {isExpanded && <div className="p-4 pt-0 border-t border-slate-800/60">{sec.content}</div>}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Spot the Phish Quiz */}
        {activeTab === 'quiz' && (
          <div className="animate-fade-in">
            {!quizFinished ? (
              <div className="space-y-6">
                {/* Quiz header & progress */}
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                  <span className="font-semibold text-cyan-400">
                    Question {currentQuizIndex + 1} of {QUIZ_QUESTIONS.length}
                  </span>
                  <span>Score: {calculateQuizScore()} correct</span>
                </div>

                {/* Question body */}
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
                    <span className="text-xs text-slate-400 font-mono uppercase tracking-wider block mb-1">
                      {QUIZ_QUESTIONS[currentQuizIndex].title}
                    </span>
                    <p className="text-sm text-slate-100 font-medium leading-relaxed mb-3">
                      {QUIZ_QUESTIONS[currentQuizIndex].scenario}
                    </p>
                    <p className="text-xs text-cyan-400 font-semibold">
                      {QUIZ_QUESTIONS[currentQuizIndex].question}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {QUIZ_QUESTIONS[currentQuizIndex].options.map((opt, optIdx) => {
                      const isSelected = userAnswers[QUIZ_QUESTIONS[currentQuizIndex].id] === optIdx;
                      let btnStyle = 'bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-300';

                      if (showExplanation) {
                        if (opt.isCorrect) {
                          btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold';
                        } else if (isSelected && !opt.isCorrect) {
                          btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={showExplanation}
                          onClick={() => handleSelectOption(QUIZ_QUESTIONS[currentQuizIndex].id, optIdx)}
                          className={`w-full p-4 rounded-xl border text-left text-xs transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                        >
                          <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center shrink-0 font-mono text-[11px] text-slate-400">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation reveal */}
                  {showExplanation && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2 animate-fade-in">
                      <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                        <Info className="w-4 h-4" />
                        <span>Security Analysis & Forensic Reasoning</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {QUIZ_QUESTIONS[currentQuizIndex].explanation}
                      </p>
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={handleNextQuizQuestion}
                          className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
                        >
                          {currentQuizIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question →' : 'View Results'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-100">Quiz Completed!</h3>
                <p className="text-sm text-slate-300">
                  You scored <strong className="text-cyan-400 text-base">{calculateQuizScore()}</strong> out of{' '}
                  <strong className="text-slate-100">{QUIZ_QUESTIONS.length}</strong> questions correctly.
                </p>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 max-w-md mx-auto text-xs text-slate-400">
                  {calculateQuizScore() >= 7 ? (
                    <span className="text-emerald-400 font-bold">
                      Cyber Ninja Badge: Excellent discernment! You are well-shielded against deceptive digital traps.
                    </span>
                  ) : (
                    <span>
                      Good effort! Review the security guidelines to sharpen your detection of subtle lookalikes and social engineering tricks.
                    </span>
                  )}
                </div>
                <button
                  onClick={handleResetQuiz}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  Retake Quiz
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Password Strength Checker */}
        {activeTab === 'password' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono uppercase tracking-wider mb-2">
                <Key className="w-4 h-4 text-cyan-400" />
                <span>Zero-Transmission Local Entropy Analyzer</span>
              </div>
              <input
                type="text"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="Type or test a passphrase (e.g. blue-mountain-coffee-morning)..."
                className="w-full p-4 bg-slate-900 rounded-xl border border-slate-800 focus:border-cyan-500 text-slate-100 text-sm font-mono transition-colors"
              />
              <span className="text-[10px] text-slate-500 block mt-2">
                Evaluated 100% locally in browser memory. Keystrokes are never logged, stored, or transmitted over any network.
              </span>
            </div>

            {passwordInput && (
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">Strength Assessment:</span>
                    <span className={`text-sm font-bold uppercase tracking-wider ${pwdAnalysis.color}`}>
                      {pwdAnalysis.text} ({pwdAnalysis.score}/100)
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Est. Brute-Force Time: <strong className="text-slate-200">{pwdAnalysis.time}</strong>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 transition-all duration-300"
                    style={{ width: `${pwdAnalysis.score}%` }}
                  />
                </div>

                {pwdAnalysis.tips.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-xs font-semibold text-slate-300 block">Recommended Improvements:</span>
                    {pwdAnalysis.tips.map((tip, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-amber-300/90">
                        <Zap className="w-3.5 h-3.5 shrink-0" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Emergency Checklist ("If you got scammed") */}
        {activeTab === 'checklist' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-slate-200 leading-relaxed">
              <strong className="text-rose-400 block mb-1 font-semibold text-sm">
                CRITICAL "GOLDEN HOUR" PROTOCOL (FIRST 60 MINUTES)
              </strong>
              If money has been fraudulently debited, immediately report the transaction to your bank fraud department and call <span className="font-mono font-bold text-rose-300">1930</span>. Prompt reporting triggers automated bank-to-bank account liens to freeze funds before mule syndicates cash out at ATMs.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Step 1: Freeze Cards & Bank Access</span>
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Open your official mobile banking app and immediately toggle "Disable Debit/Credit Cards", "Lock UPI", and "Lock NetBanking".
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-cyan-400" />
                  <span>Step 2: Call Citizen Helpline 1930</span>
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Call 1930 (National Cyber Crime Helpline). Keep your account number, transaction reference (UTR/RRN), and scammer details ready.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-cyan-400" />
                  <span>Step 3: File at cybercrime.gov.in</span>
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Lodge a formal electronic First Information Report (e-FIR) on the National Cyber Crime Reporting Portal with transaction receipts.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Step 4: Change Master Passwords</span>
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  From a separate, uncompromised device, change your primary email and banking passwords and terminate all active web sessions.
                </p>
              </div>
            </div>

            {/* Helpline quick dial / copy panel */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Official Cybercrime Response Helplines & Portals (India)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CYBER_HELPLINES.map((h, i) => (
                  <div key={i} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{h.name}</div>
                      <div className="text-xs font-mono text-cyan-400 font-bold">{h.code}</div>
                    </div>
                    <button
                      onClick={() => handleCopyHelpline(h.code)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors shrink-0"
                      title="Copy helpline code"
                    >
                      {copiedHelpline === h.code ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
