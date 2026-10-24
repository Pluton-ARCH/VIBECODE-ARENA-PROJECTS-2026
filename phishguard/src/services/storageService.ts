import { IncidentReport, IncidentStatus, IncidentType, maskEmail, maskPhoneNumber, maskPii } from '../shared/dictionary';
import { SEED_INCIDENT_REPORTS } from '../data/seedData';

const STORAGE_KEY_INCIDENTS = 'phishguard_incidents_v1';
const STORAGE_KEY_AUTH = 'phishguard_admin_token_v1';
const STORAGE_KEY_AUDIT = 'phishguard_audit_log_v1';

export interface AuditEntry {
  id: string;
  adminUser: string;
  action: string;
  reportId: string;
  timestamp: string;
}

export interface PatternCluster {
  value: string;
  type: 'domain' | 'phone' | 'keyword';
  count: number;
  incidentIds: string[];
}

class StorageService {
  private inMemoryIncidents: IncidentReport[] = [];
  private auditLog: AuditEntry[] = [];

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_INCIDENTS);
        if (stored) {
          this.inMemoryIncidents = JSON.parse(stored);
        } else {
          this.inMemoryIncidents = [...SEED_INCIDENT_REPORTS];
          this.saveToDisk();
        }

        const storedAudit = localStorage.getItem(STORAGE_KEY_AUDIT);
        if (storedAudit) {
          this.auditLog = JSON.parse(storedAudit);
        }
      } catch {
        this.inMemoryIncidents = [...SEED_INCIDENT_REPORTS];
      }
    } else {
      this.inMemoryIncidents = [...SEED_INCIDENT_REPORTS];
    }
  }

  private saveToDisk() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_INCIDENTS, JSON.stringify(this.inMemoryIncidents));
        localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(this.auditLog));
      } catch (err) {
        console.warn('LocalStorage save failed:', err);
      }
    }
  }

  // Generate unique tracking code: PG-2026-00XXX
  public generateTrackingCode(): string {
    const existingCount = this.inMemoryIncidents.length + 101;
    return `PG-2026-00${existingCount}`;
  }

  public getIncidents(): IncidentReport[] {
    return [...this.inMemoryIncidents];
  }

  public getIncidentByTrackingCode(code: string): IncidentReport | undefined {
    const cleanCode = code.trim().toUpperCase();
    return this.inMemoryIncidents.find(inc => inc.trackingCode.toUpperCase() === cleanCode);
  }

  public getIncidentById(id: string): IncidentReport | undefined {
    return this.inMemoryIncidents.find(inc => inc.id === id);
  }

  public createIncident(data: {
    type: IncidentType;
    description: string;
    suspiciousTarget: string;
    amountLost?: number;
    evidenceFiles?: string[];
    reporterContact?: string;
    isAnonymous: boolean;
  }): IncidentReport {
    const trackingCode = this.generateTrackingCode();
    const id = `inc_${Date.now()}`;
    const timestamp = new Date().toISOString();

    let maskedContact = data.reporterContact?.trim();
    if (maskedContact) {
      if (maskedContact.includes('@')) {
        maskedContact = maskEmail(maskedContact);
      } else {
        maskedContact = maskPhoneNumber(maskedContact);
      }
    }

    const newReport: IncidentReport = {
      id,
      trackingCode,
      type: data.type,
      description: maskPii(data.description),
      date: timestamp,
      suspiciousTarget: data.suspiciousTarget.trim(),
      amountLost: data.amountLost || 0,
      evidenceFiles: data.evidenceFiles || [],
      reporterContact: data.isAnonymous ? 'Anonymous Citizen' : maskedContact,
      isAnonymous: data.isAnonymous,
      status: 'SUBMITTED',
      timeline: [
        {
          status: 'SUBMITTED',
          timestamp,
          note: 'Incident report received and queued for automated threat intelligence correlation.'
        }
      ],
      createdAt: timestamp,
      updatedAt: timestamp
    };

    this.inMemoryIncidents.unshift(newReport);
    this.saveToDisk();
    return newReport;
  }

  public updateIncidentStatus(id: string, newStatus: IncidentStatus, adminNote?: string): IncidentReport | null {
    const incident = this.inMemoryIncidents.find(inc => inc.id === id);
    if (!incident) return null;

    incident.status = newStatus;
    incident.updatedAt = new Date().toISOString();
    incident.timeline.push({
      status: newStatus,
      timestamp: incident.updatedAt,
      note: adminNote || `Status updated to ${newStatus} by Security Analyst.`
    });

    this.saveToDisk();
    return { ...incident };
  }

  // Privacy protection: log when sensitive info is revealed
  public logPrivacyReveal(reportId: string, adminUser: string = 'analyst_demo') {
    const entry: AuditEntry = {
      id: `audit_${Date.now()}`,
      adminUser,
      action: 'REVEAL_PII',
      reportId,
      timestamp: new Date().toISOString()
    };
    this.auditLog.unshift(entry);
    this.saveToDisk();
  }

  public getAuditLog(): AuditEntry[] {
    return [...this.auditLog];
  }

  // Repeated pattern detection & intelligence clustering
  public getPatternClusters(): { domains: PatternCluster[]; phones: PatternCluster[]; keywords: PatternCluster[] } {
    const domainCounts: Record<string, { count: number; ids: string[] }> = {};
    const phoneCounts: Record<string, { count: number; ids: string[] }> = {};
    const keywordCounts: Record<string, { count: number; ids: string[] }> = {};

    const keywordsList = ['kyc', 'electricity', 'lottery', 'telegram', 'refund', 'parcel', 'card', 'customs'];

    for (const report of this.inMemoryIncidents) {
      const target = report.suspiciousTarget.toLowerCase();

      // Extract domains (supports both defanged [.] and raw .)
      const domainMatch = target.match(/([a-zA-Z0-9-]+(?:\.|\[\.\])(?:xyz|top|click|com|org|net|in|top))/);
      if (domainMatch) {
        const d = domainMatch[1].replace(/\[\.\]/g, '.');
        if (!domainCounts[d]) domainCounts[d] = { count: 0, ids: [] };
        domainCounts[d].count++;
        domainCounts[d].ids.push(report.trackingCode);
      }

      // Extract phone
      const phoneMatch = target.match(/(?:\+91\s?)?[789]\d{9}/);
      if (phoneMatch) {
        const p = phoneMatch[0];
        if (!phoneCounts[p]) phoneCounts[p] = { count: 0, ids: [] };
        phoneCounts[p].count++;
        phoneCounts[p].ids.push(report.trackingCode);
      }

      // Extract keywords
      for (const kw of keywordsList) {
        if (report.description.toLowerCase().includes(kw)) {
          if (!keywordCounts[kw]) keywordCounts[kw] = { count: 0, ids: [] };
          keywordCounts[kw].count++;
          keywordCounts[kw].ids.push(report.trackingCode);
        }
      }
    }

    const domains: PatternCluster[] = Object.entries(domainCounts)
      .map(([value, d]) => ({ value, type: 'domain' as const, count: d.count, incidentIds: d.ids }))
      .sort((a, b) => b.count - a.count);

    const phones: PatternCluster[] = Object.entries(phoneCounts)
      .map(([value, d]) => ({ value, type: 'phone' as const, count: d.count, incidentIds: d.ids }))
      .sort((a, b) => b.count - a.count);

    const keywords: PatternCluster[] = Object.entries(keywordCounts)
      .map(([value, d]) => ({ value, type: 'keyword' as const, count: d.count, incidentIds: d.ids }))
      .sort((a, b) => b.count - a.count);

    return { domains, phones, keywords };
  }

  // Export reports to sanitized CSV format
  public exportSanitizedCsv(): string {
    const headers = ['Tracking Code', 'Incident Type', 'Date', 'Suspicious Target', 'Amount Lost (INR)', 'Status', 'Masked Reporter', 'Description'];
    const rows = this.inMemoryIncidents.map(inc => [
      inc.trackingCode,
      inc.type,
      inc.date,
      `"${inc.suspiciousTarget.replace(/"/g, '""')}"`,
      inc.amountLost || 0,
      inc.status,
      inc.reporterContact || 'Anonymous',
      `"${inc.description.replace(/"/g, '""')}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  // Auth management
  public setAdminToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_AUTH, token);
    }
  }

  public getAdminToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY_AUTH);
    }
    return null;
  }

  public clearAdminToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }
  }
}

export const storageService = new StorageService();
