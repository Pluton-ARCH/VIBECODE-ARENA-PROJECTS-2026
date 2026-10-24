import React, { useState, useEffect } from 'react';
import { IncidentReport, IncidentStatus } from '../../shared/dictionary';
import { apiService } from '../../services/apiService';
import {
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Calendar,
  DollarSign
} from 'lucide-react';

interface TrackReportProps {
  initialCode?: string;
}

export const TrackReport: React.FC<TrackReportProps> = ({ initialCode }) => {
  const [trackingInput, setTrackingInput] = useState(initialCode || '');
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<IncidentReport | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleTrack = async (codeToSearch?: string) => {
    const code = (codeToSearch || trackingInput).trim();
    if (!code) return;

    setIsLoading(true);
    setNotFound(false);
    try {
      const res = await apiService.trackIncident(code);
      if (res) {
        setReport(res);
        setNotFound(false);
      } else {
        setReport(null);
        setNotFound(true);
      }
    } catch (err) {
      console.error('Failed to track incident:', err);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      setTrackingInput(initialCode);
      handleTrack(initialCode);
    }
  }, [initialCode]);

  const statusSteps: IncidentStatus[] = ['SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'ESCALATED', 'CLOSED'];

  const getStepIndex = (status: IncidentStatus) => {
    return statusSteps.indexOf(status);
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'CLOSED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'ESCALATED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'VERIFIED':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'UNDER_REVIEW':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Search Bar Card */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="max-w-xl mx-auto text-center space-y-3 mb-6">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-3 py-1 rounded-full">
            Citizen Case Transparency
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100">
            Track Incident Investigation
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Enter your PG-2026 Tracking Code to view live triage status, forensic verification, and escalation updates.
          </p>
        </div>

        <div className="max-w-md mx-auto flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={trackingInput}
              onChange={e => setTrackingInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleTrack()}
              placeholder="e.g. PG-2026-00101"
              className="w-full pl-4 pr-10 py-3.5 bg-slate-950 rounded-xl border border-slate-800 focus:border-cyan-500 text-slate-100 text-sm font-mono tracking-wider transition-colors uppercase"
            />
          </div>
          <button
            onClick={() => handleTrack()}
            disabled={isLoading || !trackingInput.trim()}
            className="px-5 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-cyan-950/50 cursor-pointer flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Track</span>
          </button>
        </div>

        {/* Quick Demo Pre-fills */}
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-500">
          <span>Try demo tracking ID:</span>
          <button
            onClick={() => {
              setTrackingInput('PG-2026-00101');
              handleTrack('PG-2026-00101');
            }}
            className="text-cyan-400 hover:underline font-mono"
          >
            PG-2026-00101
          </button>
          <span>•</span>
          <button
            onClick={() => {
              setTrackingInput('PG-2026-00102');
              handleTrack('PG-2026-00102');
            }}
            className="text-cyan-400 hover:underline font-mono"
          >
            PG-2026-00102
          </button>
        </div>
      </div>

      {notFound && (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center text-xs text-rose-300 animate-fade-in">
          No incident report found with tracking code <strong>{trackingInput}</strong>. Please check the code format or submit a new report.
        </div>
      )}

      {/* Report Tracking Results */}
      {report && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 space-y-8 animate-fade-in shadow-2xl">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold">{report.trackingCode}</span>
              <h3 className="text-xl font-bold text-slate-100 mt-1">
                {report.type} Fraud Vector Investigation
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(report.date).toLocaleDateString()}
                </span>
                <span>•</span>
                <span>Reported by: <strong>{report.reporterContact || 'Anonymous'}</strong></span>
                {report.amountLost && report.amountLost > 0 ? (
                  <>
                    <span>•</span>
                    <span className="text-rose-400 font-semibold flex items-center">
                      Reported Loss: INR {report.amountLost.toLocaleString()}
                    </span>
                  </>
                ) : null}
              </div>
            </div>

            <div className={`self-start md:self-auto px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider ${getStatusBadge(report.status)}`}>
              {report.status.replace('_', ' ')}
            </div>
          </div>

          {/* Stepper Progression */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Investigation Lifecycle Timeline
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {statusSteps.map((step, idx) => {
                const currentIdx = getStepIndex(report.status);
                const isPassed = currentIdx >= idx;
                const isCurrent = currentIdx === idx;

                return (
                  <div
                    key={step}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isCurrent
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-950/50'
                        : isPassed
                        ? 'bg-slate-950 border-slate-800 text-slate-300'
                        : 'bg-slate-950/40 border-slate-900 text-slate-600'
                    }`}
                  >
                    <div className="text-[10px] font-mono uppercase text-slate-400">Step {idx + 1}</div>
                    <div className="text-xs font-bold mt-0.5">{step.replace('_', ' ')}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline Milestones Log */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Audit & Triage History
            </h4>

            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {report.timeline.map((entry, i) => (
                <div key={i} className="relative">
                  {/* Step dot */}
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-slate-900" />
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-cyan-300 uppercase tracking-wider">
                        {entry.status.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{entry.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
