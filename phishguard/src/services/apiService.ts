import { ChannelType, IncidentReport, IncidentStatus, IncidentType, ScanResult } from '../shared/dictionary';
import { runDetection } from '../server/engine/scorer';
import { storageService, PatternCluster, AuditEntry } from './storageService';

export interface ScanPayload {
  channel: ChannelType;
  payload: string;
  textContext?: string;
}

export interface IncidentPayload {
  type: IncidentType;
  description: string;
  suspiciousTarget: string;
  amountLost?: number;
  evidenceFiles?: string[];
  reporterContact?: string;
  isAnonymous: boolean;
}

export interface AdminStats {
  totalReports: number;
  highRiskCount: number;
  openReports: number;
  resolvedReports: number;
  totalLoss: number;
  reportsThisWeek: number;
  byType: Record<IncidentType, number>;
  byStatus: Record<IncidentStatus, number>;
}

/**
 * Standard API client adhering to Phase 3 endpoints.
 */
export const apiService = {
  /**
   * POST /api/v1/scan
   */
  async scan(payload: ScanPayload): Promise<ScanResult> {
    // Simulated network latency for realistic UX
    await new Promise(res => setTimeout(res, 250));
    return runDetection(payload.channel, payload.payload, payload.textContext);
  },

  /**
   * POST /api/v1/incidents
   */
  async submitIncident(payload: IncidentPayload): Promise<IncidentReport> {
    await new Promise(res => setTimeout(res, 300));
    return storageService.createIncident(payload);
  },

  /**
   * GET /api/v1/incidents/track/:code
   */
  async trackIncident(trackingCode: string): Promise<IncidentReport | null> {
    await new Promise(res => setTimeout(res, 200));
    const incident = storageService.getIncidentByTrackingCode(trackingCode);
    return incident || null;
  },

  /**
   * POST /api/v1/admin/login
   */
  async adminLogin(username: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    await new Promise(res => setTimeout(res, 350));
    // Demo admin credentials: admin / phishguard2026
    if (username.trim().toLowerCase() === 'admin' && password === 'phishguard2026') {
      const token = `jwt_mock_${Date.now()}_analyst_session`;
      storageService.setAdminToken(token);
      return { success: true, token };
    }
    return { success: false, error: 'Invalid admin credentials. Use admin / phishguard2026 for demo.' };
  },

  /**
   * GET /api/v1/admin/incidents
   */
  async getAdminIncidents(filters?: { status?: IncidentStatus | 'ALL'; type?: IncidentType | 'ALL'; search?: string }): Promise<IncidentReport[]> {
    await new Promise(res => setTimeout(res, 150));
    let list = storageService.getIncidents();

    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter(i => i.status === filters.status);
    }
    if (filters?.type && filters.type !== 'ALL') {
      list = list.filter(i => i.type === filters.type);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(i =>
        i.trackingCode.toLowerCase().includes(q) ||
        i.suspiciousTarget.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
      );
    }

    return list;
  },

  /**
   * PATCH /api/v1/admin/incidents/:id/status
   */
  async updateIncidentStatus(id: string, status: IncidentStatus, adminNote?: string): Promise<IncidentReport | null> {
    await new Promise(res => setTimeout(res, 200));
    return storageService.updateIncidentStatus(id, status, adminNote);
  },

  /**
   * GET /api/v1/admin/stats
   */
  async getAdminStats(): Promise<AdminStats> {
    const list = storageService.getIncidents();
    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

    let totalLoss = 0;
    let highRiskCount = 0;
    let openReports = 0;
    let resolvedReports = 0;
    let reportsThisWeek = 0;

    const byType: Record<IncidentType, number> = {
      EMAIL: 0,
      SMS: 0,
      CALL: 0,
      WEBSITE: 0,
      UPI_QR: 0,
      OTHER: 0
    };

    const byStatus: Record<IncidentStatus, number> = {
      SUBMITTED: 0,
      UNDER_REVIEW: 0,
      VERIFIED: 0,
      ESCALATED: 0,
      CLOSED: 0
    };

    for (const item of list) {
      totalLoss += item.amountLost || 0;
      if (item.status === 'ESCALATED' || item.status === 'VERIFIED') {
        highRiskCount++;
      }
      if (item.status === 'CLOSED') {
        resolvedReports++;
      } else {
        openReports++;
      }

      if (new Date(item.date).getTime() >= oneWeekAgo) {
        reportsThisWeek++;
      }

      byType[item.type] = (byType[item.type] || 0) + 1;
      byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    }

    return {
      totalReports: list.length,
      highRiskCount,
      openReports,
      resolvedReports,
      totalLoss,
      reportsThisWeek,
      byType,
      byStatus
    };
  },

  /**
   * GET /api/v1/admin/patterns
   */
  async getPatternClusters(): Promise<{ domains: PatternCluster[]; phones: PatternCluster[]; keywords: PatternCluster[] }> {
    return storageService.getPatternClusters();
  },

  /**
   * Audit & PII logging
   */
  logPrivacyReveal(reportId: string) {
    storageService.logPrivacyReveal(reportId);
  },

  getAuditLog(): AuditEntry[] {
    return storageService.getAuditLog();
  },

  /**
   * Export CSV
   */
  exportCsv(): string {
    return storageService.exportSanitizedCsv();
  }
};
