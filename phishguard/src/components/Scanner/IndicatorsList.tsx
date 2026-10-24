import React from 'react';
import { DetectionIndicator } from '../../shared/dictionary';
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Flag, Shield, Terminal, Zap } from 'lucide-react';

interface IndicatorsListProps {
  indicators: DetectionIndicator[];
}

export const IndicatorsList: React.FC<IndicatorsListProps> = ({ indicators }) => {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  if (indicators.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-center">
        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
        <h4 className="text-sm font-semibold text-emerald-300">No Threat Indicators Triggered</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          The analyzed input did not trigger any known phishing heuristics, spoofed lookalike tokens, or malicious credential solicitation patterns.
        </p>
      </div>
    );
  }

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Flag className="w-4 h-4 text-cyan-400" />
          <span>Detected Warning Signs & Heuristic Triggers ({indicators.length})</span>
        </h4>
        <span className="text-xs text-slate-400">Click item for forensic detail</span>
      </div>

      <div className="space-y-2.5">
        {indicators.map(ind => {
          const isExpanded = expandedId === ind.id;
          let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';
          let pointsColor = 'text-slate-400';

          if (ind.severity === 'high') {
            badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
            pointsColor = 'text-rose-400';
          } else if (ind.severity === 'medium') {
            badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
            pointsColor = 'text-amber-400';
          } else {
            badgeColor = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
            pointsColor = 'text-cyan-400';
          }

          return (
            <div
              key={ind.id}
              onClick={() => toggleExpand(ind.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                isExpanded ? 'bg-slate-900 border-cyan-500/40 shadow-lg' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className={`mt-0.5 p-1 rounded-md border ${badgeColor}`}>
                    {ind.severity === 'high' ? (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    ) : ind.severity === 'medium' ? (
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Shield className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-200 truncate">{ind.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{ind.category}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-mono font-bold ${pointsColor}`}>
                    +{ind.points} pts
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 text-xs text-slate-300 animate-fade-in">
                  <p className="leading-relaxed">{ind.description}</p>
                  {ind.matchedPattern && (
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="text-[11px] text-slate-400 font-mono">Matched Pattern:</span>
                      <code className="text-[11px] text-cyan-300 font-mono bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/30 truncate">
                        {ind.matchedPattern}
                      </code>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
