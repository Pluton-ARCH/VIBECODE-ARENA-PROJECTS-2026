import { describe, it, expect } from 'vitest';
import { apiService } from '../src/services/apiService';
import { storageService } from '../src/services/storageService';
import { runDetection } from '../src/server/engine/scorer';
import { maskEmail, maskPhoneNumber, maskPii, defangUrl } from '../src/shared/dictionary';

describe('PhishGuard End-to-End Integration Test Lifecycle', () => {
  it('E2E Step 1: Scan Phase - Successfully analyzes multi-channel threat vectors', async () => {
    // 1. URL with @ spoof and suspicious TLD
    const urlResult = await apiService.scan({
      channel: 'URL',
      payload: 'https://paypal.com@arnazon-orders-verification.click/signin'
    });

    expect(urlResult.score).toBeGreaterThanOrEqual(70);
    expect(urlResult.riskLevel).toBe('HIGH');
    expect(urlResult.defangedUrl).toBe('hxxps://paypal[.]com@arnazon-orders-verification[.]click/signin');
    expect(urlResult.advice.length).toBeGreaterThan(0);

    // 2. Urgent KYC Smishing SMS
    const smsResult = await apiService.scan({
      channel: 'SMS',
      payload: 'URGENT: SBI YONO account blocked. Update KYC at http://sbi-kyc.xyz immediately. Never share OTP.'
    });

    expect(smsResult.score).toBeGreaterThanOrEqual(70);
    expect(smsResult.riskLevel).toBe('HIGH');
  });

  it('E2E Step 2: Citizen Incident Reporting - Generates PG-2026 code & masks PII', async () => {
    const rawEmail = 'victim.citizen@example.com';
    const rawPhone = '+91 9876543210';

    const report = await apiService.submitIncident({
      type: 'SMS',
      suspiciousTarget: 'hxxps://bescom-bill-update[.]xyz',
      description: `Threat SMS demanding payment to avoid electricity cut. Call me at ${rawPhone} or email ${rawEmail}.`,
      amountLost: 4500,
      evidenceFiles: ['bill_screenshot.png'],
      reporterContact: rawEmail,
      isAnonymous: false
    });

    expect(report.trackingCode).toMatch(/^PG-2026-00\d+$/);
    expect(report.status).toBe('SUBMITTED');
    expect(report.timeline.length).toBe(1);

    // Assert reporter contact was masked
    expect(report.reporterContact).not.toBe(rawEmail);
    expect(report.reporterContact).toContain('@example.com');
    expect(report.reporterContact).toContain('*');

    // Assert description PII was sanitized
    expect(report.description).not.toContain(rawEmail);
  });

  it('E2E Step 3: Admin Triage & Pattern Intelligence - Analyzes clusters & records audit logs', async () => {
    // 1. Admin Login
    const loginRes = await apiService.adminLogin('admin', 'phishguard2026');
    expect(loginRes.success).toBe(true);
    expect(loginRes.token).toBeDefined();

    // 2. Fetch stats
    const stats = await apiService.getAdminStats();
    expect(stats.totalReports).toBeGreaterThan(25);
    expect(stats.highRiskCount).toBeGreaterThan(0);

    // 3. Syndicate Pattern Clustering
    const patterns = await apiService.getPatternClusters();
    expect(patterns.domains.length).toBeGreaterThan(0);
    expect(patterns.phones.length).toBeGreaterThan(0);

    // 4. Update status of the first incident
    const incidents = await apiService.getAdminIncidents();
    const targetIncident = incidents[0];
    const updated = await apiService.updateIncidentStatus(
      targetIncident.id,
      'ESCALATED',
      'Escalated to Cyber Fraud Helpline 1930 for bank account freeze.'
    );

    expect(updated?.status).toBe('ESCALATED');
    expect(updated?.timeline.some(t => t.status === 'ESCALATED')).toBe(true);

    // 5. Audit Logging on PII reveal
    const initialAuditCount = apiService.getAuditLog().length;
    apiService.logPrivacyReveal(targetIncident.id);
    const newAuditLog = apiService.getAuditLog();
    expect(newAuditLog.length).toBe(initialAuditCount + 1);
    expect(newAuditLog[0].reportId).toBe(targetIncident.id);
    expect(newAuditLog[0].action).toBe('REVEAL_PII');
  });

  it('E2E Step 4: Tracking Lookup - Citizen tracks report progression in real-time', async () => {
    const incidents = await apiService.getAdminIncidents();
    const testCase = incidents[0];

    const tracked = await apiService.trackIncident(testCase.trackingCode);
    expect(tracked).not.toBeNull();
    expect(tracked?.trackingCode).toBe(testCase.trackingCode);
    expect(tracked?.status).toBe(testCase.status);
    expect(tracked?.timeline.length).toBeGreaterThanOrEqual(1);
  });

  it('E2E Step 5: Data Safety & Defanging Integrity', () => {
    // Plain text defanging (defangs all dots to protect against malicious downloads)
    const defanged = defangUrl('http://dangerous-malware-server.click/payload.exe');
    expect(defanged).toBe('hxxp://dangerous-malware-server[.]click/payload[.]exe');
    expect(defanged).not.toContain('http://');

    // Phone masking
    const maskedPhone = maskPhoneNumber('9876543210');
    expect(maskedPhone).toBe('98****3210');

    // Email masking
    const maskedEmail = maskEmail('tanishq@cyberdomain.com');
    expect(maskedEmail).toBe('t****q@cyberdomain.com');
  });
});
