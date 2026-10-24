import React, { useState, useEffect } from 'react';
import { IncidentReport, IncidentStatus, IncidentType } from '../../shared/dictionary';
import { apiService, AdminStats } from '../../services/apiService';
import { PatternCluster, AuditEntry } from '../../services/storageService';
import {
  ShieldAlert,
  Lock,
  Download,
  Filter,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
  Layers,
  Database,
  Search,
  LogOut,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('phishguard2026');
  const [authError, setAuthError] = useState('');

  // Dashboard Data State
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [patterns, setPatterns] = useState<{ domains: PatternCluster[]; phones: PatternCluster[]; keywords: PatternCluster[] } | null>(null);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);

  // Filtering & Search
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<IncidentType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  // Status update modal / inline
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);
  const [newStatus, setNewStatus] = useState<IncidentStatus>('UNDER_REVIEW');
  const [adminNote, setAdminNote] = useState('');
  const [activeTab, setActiveTab] = useState<'triage' | 'patterns' | 'audit'>('triage');

  useEffect(() => {
    // Check if demo token exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('phishguard_admin_token_v1') : null;
    if (token) {
      setIsAuthenticated(true);
      loadDashboardData();
    }
  }, []);

  const loadDashboardData = async () => {
    try {
      const s = await apiService.getAdminStats();
      const inc = await apiService.getAdminIncidents({
        status: statusFilter,
        type: typeFilter,
        search: searchQuery
      });
      const p = await apiService.getPatternClusters();
      const a = apiService.getAuditLog();

      setStats(s);
      setIncidents(inc);
      setPatterns(p);
      setAuditLog(a);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [statusFilter, typeFilter, searchQuery, isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const res = await apiService.adminLogin(username, password);
    if (res.success) {
      setIsAuthenticated(true);
      loadDashboardData();
    } else {
      setAuthError(res.error || 'Authentication failed');
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('phishguard_admin_token_v1');
    }
    setIsAuthenticated(false);
  };

  const handleRevealPii = (reportId: string) => {
    apiService.logPrivacyReveal(reportId);
    setRevealedIds(prev => new Set(prev).add(reportId));
    setAuditLog(apiService.getAuditLog());
  };

  const handleStatusUpdate = async () => {
    if (!selectedIncident) return;
    await apiService.updateIncidentStatus(selectedIncident.id, newStatus, adminNote);
    setSelectedIncident(null);
    setAdminNote('');
    loadDashboardData();
  };

  const handleExportCsv = () => {
    const csvContent = apiService.exportCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `phishguard_incidents_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Login View if unauthenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-slate-900/90 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-2xl">
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">Security Analyst Login</h3>
          <p className="text-xs text-slate-400">
            Authorized access for incident triage, threat clustering, and regulatory escalation.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Analyst Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 text-xs font-mono"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono">
            Demo Credentials: <span className="text-cyan-400">admin</span> / <span className="text-cyan-400">phishguard2026</span>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {authError}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-cyan-950/50"
          >
            Access Triage Console
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900/90 rounded-3xl border border-slate-800 backdrop-blur-xl">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-3 py-1 rounded-full">
            Security Operations Center (SOC) Console
          </span>
          <h2 className="text-2xl font-extrabold text-slate-100 mt-2">
            Incident Triage & Threat Intelligence
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export Sanitized CSV</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Reports</span>
            <div className="text-2xl font-bold font-mono text-slate-100 mt-1">{stats.totalReports}</div>
            <span className="text-[11px] text-cyan-400 mt-1 block">Live Citizen Ingestion</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">High-Risk Threats</span>
            <div className="text-2xl font-bold font-mono text-rose-400 mt-1">{stats.highRiskCount}</div>
            <span className="text-[11px] text-rose-400/80 mt-1 block">Escalated / Verified</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Open vs Resolved</span>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
              {stats.openReports} <span className="text-xs text-slate-500 font-sans">/ {stats.resolvedReports} closed</span>
            </div>
            <span className="text-[11px] text-amber-400/80 mt-1 block">In Active Triage</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Reports This Week</span>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">+{stats.reportsThisWeek}</div>
            <span className="text-[11px] text-cyan-400/80 mt-1 block">Past 7-Day Velocity</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 col-span-2 lg:col-span-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Loss Tracked</span>
            <div className="text-xl font-bold font-mono text-slate-100 mt-1">
              ₹{(stats.totalLoss / 1000).toFixed(1)}k
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Prevented & Reported</span>
          </div>
        </div>
      )}

      {/* SVG Visualizations Row */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chart 1: Reports by Vector (Donut Chart) */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-cyan-400" />
              <span>Incidents by Vector</span>
            </h4>
            <div className="flex items-center justify-center h-44">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" stroke="#1e293b" strokeWidth="12" fill="none" />
                {/* SVG Donut Slices */}
                <circle cx="50" cy="50" r="38" stroke="#06b6d4" strokeWidth="12" fill="none" strokeDasharray="60 238" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="38" stroke="#3b82f6" strokeWidth="12" fill="none" strokeDasharray="50 238" strokeDashoffset="-60" />
                <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="12" fill="none" strokeDasharray="45 238" strokeDashoffset="-110" />
                <circle cx="50" cy="50" r="38" stroke="#ef4444" strokeWidth="12" fill="none" strokeDasharray="45 238" strokeDashoffset="-155" />
                <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="none" strokeDasharray="38 238" strokeDashoffset="-200" />
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-500" /> SMS ({stats.byType.SMS})</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Website ({stats.byType.WEBSITE})</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Email ({stats.byType.EMAIL})</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> Calls ({stats.byType.CALL})</div>
            </div>
          </div>

          {/* Chart 2: Timeline Trend Area */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Reporting Ingestion Velocity</span>
            </h4>
            <div className="h-44 flex items-end justify-between gap-1 pt-6 px-2">
              {[4, 7, 3, 9, 12, 8, 15, 11, 14, 18].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                  <div
                    className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-md transition-all duration-500"
                    style={{ height: `${val * 6}px` }}
                  />
                  <span className="text-[9px] font-mono text-slate-500">D{idx + 1}</span>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-slate-400 text-center">
              Daily threat filings across last 10-day monitoring window
            </div>
          </div>

          {/* Chart 3: Top Targeted Impersonation Targets */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Top Impersonated Entities</span>
            </h4>
            <div className="space-y-3 pt-2">
              {[
                { name: 'SBI / YONO Bank', pct: 88, count: 14, color: 'bg-rose-500' },
                { name: 'Electricity Boards (BESCOM)', pct: 72, count: 10, color: 'bg-amber-500' },
                { name: 'PayPal / Amazon Lures', pct: 60, count: 8, color: 'bg-cyan-500' },
                { name: 'Telegram Task Pretexting', pct: 45, count: 6, color: 'bg-blue-500' }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">{item.name}</span>
                    <span className="font-mono text-slate-400">{item.count} attacks</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabs: Triage Table vs Threat Clustering vs Privacy Audit Log */}
      <div className="flex gap-2 p-1 bg-slate-900 rounded-2xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('triage')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'triage' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
          }`}
        >
          Incident Triage Queue ({incidents.length})
        </button>
        <button
          onClick={() => setActiveTab('patterns')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'patterns' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
          }`}
        >
          Syndicate Pattern Clusters
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'audit' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
          }`}
        >
          Privacy Audit Log ({auditLog.length})
        </button>
      </div>

      {/* TAB 1: Incident Triage Table */}
      {activeTab === 'triage' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search tracking code, target or description..."
                className="w-full p-2 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-100"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300"
              >
                <option value="ALL">All Statuses</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="VERIFIED">Verified</option>
                <option value="ESCALATED">Escalated</option>
                <option value="CLOSED">Closed</option>
              </select>

              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value as any)}
                className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300"
              >
                <option value="ALL">All Vectors</option>
                <option value="SMS">SMS</option>
                <option value="WEBSITE">Website</option>
                <option value="EMAIL">Email</option>
                <option value="CALL">Call</option>
                <option value="UPI_QR">UPI / QR</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-mono">
                <tr>
                  <th className="p-3 rounded-l-xl">Code</th>
                  <th className="p-3">Vector</th>
                  <th className="p-3">Suspicious Target</th>
                  <th className="p-3">Loss (INR)</th>
                  <th className="p-3">Reporter (Privacy Protected)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {incidents.map(inc => {
                  const isRevealed = revealedIds.has(inc.id);
                  return (
                    <tr key={inc.id} className="hover:bg-slate-950/40 transition-colors">
                      <td className="p-3 font-mono text-cyan-400 font-bold">{inc.trackingCode}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                          {inc.type}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-300 max-w-[200px] truncate select-all">
                        {inc.suspiciousTarget}
                      </td>
                      <td className="p-3 font-mono">
                        {inc.amountLost && inc.amountLost > 0 ? (
                          <span className="text-rose-400 font-bold">₹{inc.amountLost.toLocaleString()}</span>
                        ) : (
                          <span className="text-slate-500">₹0</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-slate-300">
                            {isRevealed ? `${inc.reporterContact} (UNMASKED)` : inc.reporterContact || 'Anonymous'}
                          </span>
                          {!isRevealed && !inc.isAnonymous && (
                            <button
                              onClick={() => handleRevealPii(inc.id)}
                              className="p-1 rounded text-slate-400 hover:text-cyan-400 transition-colors"
                              title="Reveal PII (Logged to Audit Trail)"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          inc.status === 'ESCALATED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                          inc.status === 'VERIFIED' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' :
                          inc.status === 'CLOSED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}>
                          {inc.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => {
                            setSelectedIncident(inc);
                            setNewStatus(inc.status);
                          }}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-medium transition-colors"
                        >
                          Change Status
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Syndicate Pattern Clusters */}
      {activeTab === 'patterns' && patterns && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          {/* Recurring Domains */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-rose-400" />
              <span>Repeated Scam Domains</span>
            </h4>
            <div className="space-y-2.5">
              {patterns.domains.slice(0, 6).map((d, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-mono text-xs text-rose-400 font-bold">{d.value}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Linked reports: {d.incidentIds.slice(0, 3).join(', ')}</div>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs font-bold">
                    {d.count} hits
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recurring Phone Numbers */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Repeated Fraud Caller Numbers</span>
            </h4>
            <div className="space-y-2.5">
              {patterns.phones.slice(0, 6).map((p, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-mono text-xs text-cyan-400 font-bold">{p.value}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Linked reports: {p.incidentIds.slice(0, 3).join(', ')}</div>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold">
                    {p.count} hits
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Common Fraud Keywords */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Recurring Threat Lures</span>
            </h4>
            <div className="space-y-2.5">
              {patterns.keywords.slice(0, 6).map((k, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-mono text-xs text-amber-400 font-bold uppercase">{k.value}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Present across {k.count} incident filings</div>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold">
                    {k.count} cases
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Privacy Audit Log */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <Lock className="w-4 h-4" />
            <span>Immutable Privacy Compliance Audit Log</span>
          </div>
          <p className="text-xs text-slate-400">
            Every unmasking of citizen telephone numbers or email addresses is recorded here for oversight.
          </p>

          <div className="space-y-2">
            {auditLog.length === 0 ? (
              <div className="text-xs text-slate-500 py-4 text-center">No unmasking events recorded yet.</div>
            ) : (
              auditLog.map(a => (
                <div key={a.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-[10px] font-bold">
                      {a.action}
                    </span>
                    <span className="text-slate-300">
                      Analyst <strong className="text-cyan-400">{a.adminUser}</strong> accessed protected PII on Case <strong className="text-slate-100">{a.reportId}</strong>
                    </span>
                  </div>
                  <span className="font-mono text-slate-500 text-[11px]">
                    {new Date(a.timestamp).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100">
              Update Case Status: {selectedIncident.trackingCode}
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Target Status
              </label>
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value as IncidentStatus)}
                className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-100"
              >
                <option value="SUBMITTED">SUBMITTED</option>
                <option value="UNDER_REVIEW">UNDER REVIEW</option>
                <option value="VERIFIED">VERIFIED</option>
                <option value="ESCALATED">ESCALATED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Forensic / Regulatory Triage Note
              </label>
              <textarea
                rows={3}
                value={adminNote}
                onChange={e => setAdminNote(e.target.value)}
                placeholder="e.g. Domain forwarded to NCIIPC & CERT-In for domain revocation..."
                className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-100"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                Commit Status Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
