import { describe, it, expect } from 'vitest';
import { runDetection } from '../src/server/engine/scorer';
import { analyzeUrl } from '../src/server/engine/urlAnalyzer';
import { analyzeText } from '../src/server/engine/textAnalyzer';

describe('PhishGuard Detection Engine ("The Brain")', () => {
  // Vector 1: Raw IP Address Hostname
  it('Vector 1: Detects raw IP address hostname as High Risk', () => {
    const result = runDetection('URL', 'http://185.220.101.5/banking/sbi/login');
    expect(result.score).toBeGreaterThanOrEqual(70);
    expect(result.riskLevel).toBe('HIGH');
    expect(result.indicators.some(i => i.id === 'url-ip-host')).toBe(true);
  });

  // Vector 2: Homoglyph / Typosquatting Character Substitution
  it('Vector 2: Detects typosquatted brand lookalikes (paypa1 / arnazon) as High Risk', () => {
    const result = runDetection('URL', 'http://paypa1-security-verification.xyz/login');
    expect(result.score).toBeGreaterThanOrEqual(70);
    expect(result.riskLevel).toBe('HIGH');
    expect(result.indicators.some(i => i.category === 'BRAND_IMPERSONATION')).toBe(true);
  });

  // Vector 3: Userinfo "@" Character Spoofing
  it('Vector 3: Detects "@" credential spoofing syntax as High Risk', () => {
    const result = runDetection('URL', 'https://paypal.com@evil-phishing-host.com/account');
    expect(result.score).toBeGreaterThanOrEqual(70);
    expect(result.riskLevel).toBe('HIGH');
    expect(result.indicators.some(i => i.id === 'url-userinfo-spoof')).toBe(true);
  });

  // Vector 4: Urgent Credential & OTP Harvesting SMS
  it('Vector 4: Detects SMS with artificial panic, OTP requests, and suspicious links', () => {
    const sms = 'URGENT: Your SBI YONO account has been suspended. Update KYC within 24 hours to prevent permanent block. Enter OTP at http://sbi-kyc-update.top/login';
    const result = runDetection('SMS', sms);
    expect(result.score).toBeGreaterThanOrEqual(75);
    expect(result.riskLevel).toBe('HIGH');
    expect(result.indicators.some(i => i.category === 'URGENCY_PRESSURE')).toBe(true);
    expect(result.indicators.some(i => i.category === 'FINANCIAL_CREDENTIALS')).toBe(true);
  });

  // Vector 5: Subdomain Brand Impersonation on Untrusted Root Domain
  it('Vector 5: Detects brand placed inside a subdomain of an unrelated domain', () => {
    const result = runDetection('URL', 'https://netflix.com.account-update-billing.click/login');
    expect(result.score).toBeGreaterThanOrEqual(70);
    expect(result.riskLevel).toBe('HIGH');
    expect(result.indicators.some(i => i.id.startsWith('url-brand-subdomain'))).toBe(true);
  });

  // Vector 6: Legitimate Transaction Alert (Zero False Positive Check)
  it('Vector 6: Correctly classifies legitimate bank transaction notification as Low Risk', () => {
    const legitSms = 'Dear Customer, your HDFC Bank account **4589 has been debited for INR 750.00 at Starbucks on 24-OCT-26. Clear balance is INR 24,190.00. If this was not done by you, call 18002026123.';
    const result = runDetection('SMS', legitSms);
    expect(result.score).toBeLessThan(40);
    expect(result.riskLevel).toBe('LOW');
  });

  // Test URL Defanging Utility
  it('Safety: Properly defangs malicious URLs', () => {
    const res = analyzeUrl('https://evil-hacker.com/steal?token=123');
    expect(res.defangedUrl).toBe('hxxps://evil-hacker[.]com/steal?token=123');
  });

  // Test HTML Anchor Mismatch
  it('Vector Extended: Detects deceptive HTML anchor text mismatch', () => {
    const html = '<p>Click <a href="http://scam-site.xyz/fake">https://amazon.com</a> to view order</p>';
    const res = runDetection('EMAIL', html);
    expect(res.indicators.some(i => i.id === 'url-html-mismatch')).toBe(true);
    expect(res.riskLevel).toBe('HIGH');
  });
});
