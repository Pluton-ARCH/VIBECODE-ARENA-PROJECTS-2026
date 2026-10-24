import React, { useState } from 'react';
import { IncidentType } from '../../shared/dictionary';
import { apiService } from '../../services/apiService';
import { CYBER_HELPLINES } from '../../data/seedData';
import {
  FileText,
  Upload,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  PhoneCall,
  ExternalLink,
  Lock,
  ArrowRight
} from 'lucide-react';

interface ReportFormProps {
  preFillData?: {
    channel: string;
    target: string;
    description: string;
  } | null;
  onNavigateToTrack: (trackingCode: string) => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({ preFillData, onNavigateToTrack }) => {
  const [incidentType, setIncidentType] = useState<IncidentType>(
    (preFillData?.channel as IncidentType) || 'WEBSITE'
  );
  const [target, setTarget] = useState(preFillData?.target || '');
  const [description, setDescription] = useState(preFillData?.description || '');
  const [amountLost, setAmountLost] = useState<string>('');
  const [contactInfo, setContactInfo] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [evidenceFiles, setEvidenceFiles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdReportCode, setCreatedReportCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedHelpline, setCopiedHelpline] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileNames = Array.from(e.target.files).map(f => f.name).slice(0, 5);
      setEvidenceFiles(prev => [...prev, ...fileNames].slice(0, 5));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target.trim() || !description.trim() || !consentGiven) return;

    setIsSubmitting(true);
    try {
      const report = await apiService.submitIncident({
        type: incidentType,
        suspiciousTarget: target,
        description,
        amountLost: amountLost ? parseFloat(amountLost) : 0,
        evidenceFiles,
        reporterContact: contactInfo,
        isAnonymous
      });

      setCreatedReportCode(report.trackingCode);
    } catch (err) {
      console.error('Failed to submit report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (createdReportCode) {
      navigator.clipboard.writeText(createdReportCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleCopyHelpline = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedHelpline(code);
    setTimeout(() => setCopiedHelpline(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Submission Success Confirmation Modal */}
      {createdReportCode ? (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1 rounded-full">
              Incident Registered Successfully
            </span>
            <h3 className="text-2xl font-extrabold text-slate-100 mt-3">
              Your Incident Tracking ID
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Save this unique tracking code. You can use it to track triage status, cyber agency notifications, and takedown milestones.
            </p>
          </div>

          {/* Copyable Tracking Code Box */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between max-w-sm mx-auto">
            <span className="text-xl font-mono font-black text-cyan-400 tracking-wider">
              {createdReportCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigateToTrack(createdReportCode)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-cyan-950/50"
            >
              <span>Track Incident Status Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setCreatedReportCode(null);
                setTarget('');
                setDescription('');
                setAmountLost('');
                setContactInfo('');
              }}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form (2 cols) */}
          <div className="lg:col-span-2 bg-slate-900/90 rounded-3xl border border-slate-800 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
            <div className="mb-6">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-3 py-1 rounded-full">
                Citizen Threat Reporting
              </span>
              <h2 className="text-2xl font-extrabold text-slate-100 mt-2">
                Report Phishing & Cyber Fraud
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Your report assists security analysts in cataloging threat syndicates and flagging lookalike infrastructure.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Incident Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Incident Channel / Vector *
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {(['WEBSITE', 'SMS', 'EMAIL', 'CALL', 'UPI_QR'] as IncidentType[]).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setIncidentType(t)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                        incidentType === t
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {t === 'UPI_QR' ? 'UPI / QR' : t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Suspicious Target */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Suspicious URL, Phone Number, or Sender Handle *
                </label>
                <input
                  type="text"
                  required
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                  placeholder="e.g. hxxps://sbi-kyc-update[.]xyz or +91 9876543210"
                  className="w-full p-3.5 bg-slate-950 rounded-xl border border-slate-800 focus:border-cyan-500 text-slate-100 text-xs font-mono transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Incident Description & Details *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe what occurred (e.g. Received SMS claiming power will be disconnected at 9:30 PM with payment demand)..."
                  className="w-full p-3.5 bg-slate-950 rounded-xl border border-slate-800 focus:border-cyan-500 text-slate-100 text-xs transition-colors"
                />
              </div>

              {/* Amount Lost (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Amount Lost (INR) <span className="text-slate-500">(Optional)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={amountLost}
                  onChange={e => setAmountLost(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-3.5 bg-slate-950 rounded-xl border border-slate-800 focus:border-cyan-500 text-slate-100 text-xs font-mono transition-colors"
                />
              </div>

              {/* Evidence Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Attach Evidence Files <span className="text-slate-500">(Screenshots, PDF, Max 5)</span>
                </label>
                <div className="border border-dashed border-slate-800 hover:border-slate-700 rounded-xl p-4 text-center bg-slate-950">
                  <input
                    type="file"
                    multiple
                    id="evidence-file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="evidence-file" className="cursor-pointer flex items-center justify-center gap-2 text-xs text-slate-400">
                    <Upload className="w-4 h-4 text-cyan-400" />
                    <span>Upload screenshots or transaction receipts</span>
                  </label>
                </div>
                {evidenceFiles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {evidenceFiles.map((f, i) => (
                      <span key={i} className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Reporter Contact & Anonymous Option */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Reporter Contact
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={e => setIsAnonymous(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                    />
                    <span>Submit Anonymously</span>
                  </label>
                </div>

                {!isAnonymous && (
                  <input
                    type="text"
                    value={contactInfo}
                    onChange={e => setContactInfo(e.target.value)}
                    placeholder="Email or phone (automatically masked for privacy)"
                    className="w-full p-2.5 bg-slate-900 rounded-lg border border-slate-800 focus:border-cyan-500 text-slate-100 text-xs transition-colors"
                  />
                )}
              </div>

              {/* Consent Checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400 pt-2">
                <input
                  type="checkbox"
                  required
                  checked={consentGiven}
                  onChange={e => setConsentGiven(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span>
                  I consent to submitting this sanitized threat data for cybersecurity analysis, domain takedown coordination, and threat pattern clustering.
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !consentGiven}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-950/50 transition-all cursor-pointer"
              >
                {isSubmitting ? 'Registering Incident...' : 'Submit Incident & Generate Tracking Code'}
              </button>
            </form>
          </div>

          {/* Side Panel: Official Channels & Privacy Guarantee (1 col) */}
          <div className="space-y-6">
            {/* Privacy Shield Info */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2.5 text-cyan-400">
                <Lock className="w-5 h-5" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Built-In Privacy Guard
                </h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                All reporter email addresses, telephone numbers, and sensitive account tokens are automatically masked before persistence. Evidence files stay local to prevent inadvertent data leakage.
              </p>
            </div>

            {/* Official Indian Reporting Channels */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Official Law Enforcement Channels (India)
              </h4>
              <div className="space-y-3">
                {CYBER_HELPLINES.map((h, i) => (
                  <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200">{h.name}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyHelpline(h.code)}
                        className="text-slate-400 hover:text-cyan-400 p-1"
                        title="Copy"
                      >
                        {copiedHelpline === h.code ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <div className="font-mono text-xs text-cyan-400 font-bold">{h.code}</div>
                    <p className="text-[11px] text-slate-400">{h.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
