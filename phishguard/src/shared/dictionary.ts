/**
 * PhishGuard - Shared Schema, Enums, Interfaces & Safety Utilities
 */

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type ChannelType = 'URL' | 'EMAIL' | 'SMS' | 'SCREENSHOT';

export type IncidentType = 'EMAIL' | 'SMS' | 'CALL' | 'WEBSITE' | 'UPI_QR' | 'OTHER';

export type IncidentStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'VERIFIED' | 'ESCALATED' | 'CLOSED';

export type IndicatorCategory =
  | 'URL_STRUCTURE'
  | 'BRAND_IMPERSONATION'
  | 'URGENCY_PRESSURE'
  | 'FINANCIAL_CREDENTIALS'
  | 'SENDER_MISMATCH'
  | 'TECHNICAL_OBFUSCATION';

export interface DetectionIndicator {
  id: string;
  label: string;
  category: IndicatorCategory;
  severity: 'low' | 'medium' | 'high';
  points: number;
  description: string;
  matchedPattern?: string;
}

export interface ScanResult {
  id: string;
  timestamp: string;
  channel: ChannelType;
  input: string;
  defangedUrl?: string;
  extractedText?: string;
  score: number; // 0 - 100
  riskLevel: RiskLevel;
  indicators: DetectionIndicator[];
  advice: string[];
  targetBrand?: string;
}

export interface TimelineEntry {
  status: IncidentStatus;
  timestamp: string;
  note: string;
}

export interface IncidentReport {
  id: string;
  trackingCode: string; // e.g. "PG-2026-00123"
  type: IncidentType;
  description: string;
  date: string;
  suspiciousTarget: string; // Defanged URL, phone, or sender
  amountLost?: number;
  evidenceFiles?: string[];
  reporterContact?: string;
  isAnonymous: boolean;
  status: IncidentStatus;
  timeline: TimelineEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface EvaluationSample {
  id: string;
  channel: ChannelType;
  title: string;
  content: string;
  groundTruth: 'phishing' | 'legitimate';
  targetBrand?: string;
  description: string;
}

export interface ConfusionMatrix {
  tp: number; // True Positives (Phishing correctly identified as High/Med risk)
  fp: number; // False Positives (Legitimate flagged as High risk)
  tn: number; // True Negatives (Legitimate classified as Low risk)
  fn: number; // False Negatives (Phishing missed as Low risk)
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  falsePositiveRate: number;
}

/* =========================================================================
   Safety & Data Masking Utilities
   ========================================================================= */

/**
 * Defangs a URL so that it cannot be accidentally clicked or pre-fetched.
 * Example: https://paypal.com/verify -> hxxps://paypal[.]com/verify
 */
export function defangUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  let defanged = rawUrl.trim();
  // Replace http with hxxp
  defanged = defanged.replace(/^https:\/\//i, 'hxxps://');
  defanged = defanged.replace(/^http:\/\//i, 'hxxp://');
  // Defang dots in the host/domain portion
  defanged = defanged.replace(/\./g, '[.]');
  return defanged;
}

/**
 * Mask email address for privacy (e.g. j***e@example.com)
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email || '';
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) {
    return `${localPart[0]}*@${domain}`;
  }
  const maskedLocal = `${localPart[0]}${'*'.repeat(Math.min(localPart.length - 2, 4))}${localPart[localPart.length - 1]}`;
  return `${maskedLocal}@${domain}`;
}

/**
 * Mask phone number for privacy (e.g. 98****1234 or +91 98****1234)
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 6) return '****';
  const countryCode = digits.length > 10 ? '+' + digits.slice(0, digits.length - 10) + ' ' : '';
  const mainDigits = digits.length > 10 ? digits.slice(-10) : digits;
  const prefix = mainDigits.slice(0, 2);
  const lastFour = mainDigits.slice(-4);
  return `${countryCode}${prefix}****${lastFour}`;
}

/**
 * Mask credit card / account numbers
 */
export function maskCardNumber(card: string): string {
  if (!card) return '';
  const cleaned = card.replace(/\s+/g, '');
  if (cleaned.length < 8) return '****';
  const lastFour = cleaned.slice(-4);
  return `**** **** **** ${lastFour}`;
}

/**
 * Auto-mask any PII text (emails, phones, cards) found in free-form descriptions
 */
export function maskPii(text: string): string {
  if (!text) return '';
  let sanitized = text;

  // Mask emails
  sanitized = sanitized.replace(/([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, (_match, user, domain) => {
    return `${user[0]}***@${domain}`;
  });

  // Mask 10-12 digit phone numbers
  sanitized = sanitized.replace(/(?:\+?\d{1,3}[-.\s]?)?(\d{3})[-.\s]?(\d{3})[-.\s]?(\d{4})/g, (_match, _p1, _p2, p3) => {
    return `***-***-${p3}`;
  });

  // Mask 16-digit credit cards
  sanitized = sanitized.replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?(\d{4})\b/g, '****-****-****-$1');

  return sanitized;
}
