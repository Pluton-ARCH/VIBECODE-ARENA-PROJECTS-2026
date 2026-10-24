import React from 'react';
import { RiskLevel } from '../../shared/dictionary';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

interface RiskGaugeProps {
  score: number; // 0 - 100
  riskLevel: RiskLevel;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, riskLevel }) => {
  // Gauge geometry
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  // Use a 270-degree arc
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * score) / 100;

  // Colors & badges
  let strokeColor = '#10b981'; // safe emerald
  let bgColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let badgeText = 'LOW RISK';
  let Icon = ShieldCheck;
  let shadowClass = 'shadow-glow-safe';

  if (riskLevel === 'HIGH') {
    strokeColor = '#ef4444'; // danger red
    bgColor = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    badgeText = 'HIGH RISK / FRAUD DETECTED';
    Icon = ShieldAlert;
    shadowClass = 'shadow-glow-danger';
  } else if (riskLevel === 'MEDIUM') {
    strokeColor = '#f59e0b'; // warning amber
    bgColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    badgeText = 'MEDIUM RISK / SUSPICIOUS';
    Icon = AlertTriangle;
    shadowClass = 'shadow-glow-warning';
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900/90 rounded-2xl border border-slate-800 backdrop-blur-md">
      <div className="relative flex items-center justify-center w-48 h-48">
        <svg className="w-full h-full transform -rotate-135" viewBox="0 0 180 180">
          {/* Background track */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="#1e293b"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Progress fill */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke={strokeColor}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold font-mono text-slate-100 tracking-tight">
            {score}
          </span>
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold mt-0.5">
            / 100
          </span>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">
            Threat Score
          </span>
        </div>
      </div>

      {/* Risk Badge */}
      <div className={`mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${bgColor} ${shadowClass}`}>
        <Icon className="w-4 h-4 animate-pulse" />
        <span>{badgeText}</span>
      </div>
    </div>
  );
};
