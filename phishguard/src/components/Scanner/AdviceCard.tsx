import React from 'react';
import { RiskLevel } from '../../shared/dictionary';
import { AlertOctagon, CheckSquare, ShieldCheck, Flag, Copy, Check, Eye } from 'lucide-react';
import { SafeLinkModal } from '../SafeLinkModal';

interface AdviceCardProps {
  riskLevel: RiskLevel;
  advice: string[];
  defangedUrl?: string;
  rawInput: string;
  onReportClick: () => void;
}

export const AdviceCard: React.FC<AdviceCardProps> = ({
  riskLevel,
  advice,
  defangedUrl,
  rawInput,
  onReportClick
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleCopyDefanged = () => {
    if (defangedUrl) {
      navigator.clipboard.writeText(defangedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isHigh = riskLevel === 'HIGH';
  const isMed = riskLevel === 'MEDIUM';

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          {isHigh ? (
            <AlertOctagon className="w-4 h-4 text-rose-400" />
          ) : isMed ? (
            <AlertOctagon className="w-4 h-4 text-amber-400" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          )}
          <span>Recommended Protective Actions</span>
        </h4>
        <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
          Immediate Steps
        </span>
      </div>

      {/* Advice list */}
      <div className="space-y-2">
        {advice.map((item, i) => (
          <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
            <CheckSquare className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* Safe Defanged URL handling */}
      {defangedUrl && (
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Isolated Defanged URL:</span>
            <span className="text-[10px] text-cyan-400 font-mono">SAFE FOR CITATION</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3">
            <code className="text-xs text-slate-300 font-mono truncate select-all">
              {defangedUrl}
            </code>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleCopyDefanged}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1"
                title="Copy defanged string"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors text-xs flex items-center gap-1"
                title="Inspect isolated link"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pre-fill Report Button */}
      {riskLevel !== 'LOW' && (
        <div className="pt-2">
          <button
            onClick={onReportClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-medium text-xs shadow-lg shadow-rose-950/50 transition-all cursor-pointer"
          >
            <Flag className="w-4 h-4" />
            <span>Report this Threat to Cyber Authorities & Admin Triage</span>
          </button>
        </div>
      )}

      {/* Link inspection warning modal */}
      <SafeLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        rawUrl={rawInput}
        defangedUrl={defangedUrl || ''}
      />
    </div>
  );
};
