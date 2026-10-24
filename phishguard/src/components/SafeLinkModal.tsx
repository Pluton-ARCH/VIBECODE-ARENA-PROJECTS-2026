import React from 'react';
import { ShieldAlert, AlertTriangle, X, Copy, Check, ExternalLink } from 'lucide-react';

interface SafeLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  rawUrl: string;
  defangedUrl: string;
}

export const SafeLinkModal: React.FC<SafeLinkModalProps> = ({ isOpen, onClose, rawUrl, defangedUrl }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(defangedUrl || rawUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-rose-500/40 rounded-2xl p-6 shadow-2xl shadow-rose-950/50">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 text-rose-400">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Safe Link Isolation Protocol</h3>
            <p className="text-xs text-rose-400 font-medium">POTENTIALLY MALICIOUS OR UNVERIFIED LINK</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 mb-4">
          <div className="text-xs text-slate-400 mb-1 font-mono uppercase tracking-wider">Defanged Presentation:</div>
          <div className="font-mono text-sm text-cyan-400 break-all select-all font-semibold">
            {defangedUrl || rawUrl}
          </div>
        </div>

        <div className="space-y-3 mb-6 text-xs text-slate-300 leading-relaxed bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl">
          <div className="flex items-start gap-2 text-amber-300 font-medium">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>PhishGuard strictly prohibits automatic browser navigation to untrusted destinations to protect your session tokens, IP address, and browser security.</span>
          </div>
          <p className="text-slate-400 pl-6">
            If you are a cyber analyst needing to investigate this destination, only open it inside an isolated sandbox, virtual machine, or dedicated security analysis environment.
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm rounded-xl border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Defanged URL' : 'Copy Defanged URL'}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm rounded-xl transition-colors shadow-lg shadow-rose-900/30"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
