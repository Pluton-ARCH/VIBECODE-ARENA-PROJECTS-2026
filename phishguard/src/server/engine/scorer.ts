import { ChannelType, DetectionIndicator, RiskLevel, ScanResult, defangUrl } from '../../shared/dictionary';
import { analyzeUrl } from './urlAnalyzer';
import { analyzeText } from './textAnalyzer';

/**
 * Aggregates indicator weights into a normalized 0-100 score and determines RiskLevel.
 */
export function calculateRiskScore(indicators: DetectionIndicator[]): { score: number; riskLevel: RiskLevel } {
  if (indicators.length === 0) {
    return { score: 5, riskLevel: 'LOW' };
  }

  // Deduplicate indicators by id
  const seenIds = new Set<string>();
  const uniqueIndicators = indicators.filter(ind => {
    if (seenIds.has(ind.id)) return false;
    seenIds.add(ind.id);
    return true;
  });

  // Calculate total raw points
  let rawTotal = 0;
  let hasHighSeverity = false;

  for (const ind of uniqueIndicators) {
    rawTotal += ind.points;
    if (ind.severity === 'high') {
      hasHighSeverity = true;
    }
  }

  // Diminishing returns formula to smooth out score into 0-100 range
  // Score = 100 * (1 - e^(-rawTotal / 65))
  let normalizedScore = Math.round(100 * (1 - Math.exp(-rawTotal / 65)));

  // Ensure high severity flags hit at least 70
  if (hasHighSeverity && normalizedScore < 70) {
    normalizedScore = Math.max(70, normalizedScore);
  }

  // Cap between 0 and 100
  const finalScore = Math.min(100, Math.max(0, normalizedScore));

  let riskLevel: RiskLevel = 'LOW';
  if (finalScore >= 70) {
    riskLevel = 'HIGH';
  } else if (finalScore >= 40) {
    riskLevel = 'MEDIUM';
  } else {
    riskLevel = 'LOW';
  }

  return { score: finalScore, riskLevel };
}

/**
 * Generates tailored, actionable safety advice based on the risk level and detected indicator categories.
 */
export function generateAdvice(riskLevel: RiskLevel, indicators: DetectionIndicator[]): string[] {
  const advice: string[] = [];

  if (riskLevel === 'HIGH') {
    advice.push('DO NOT click on any links, open attachments, or call the telephone numbers listed.');
    advice.push('DO NOT share OTP, CVV, passwords, ATM PIN, or Aadhaar/PAN details under any circumstances.');
    advice.push('If you already entered banking credentials or passwords, IMMEDIATELY call your bank fraud helpline (or 1930 in India) to freeze cards and accounts.');
    advice.push('Submit a report using the "Report this" button below so cyber analysts can catalog and escalate this vector.');
  } else if (riskLevel === 'MEDIUM') {
    advice.push('Exercise caution: This communication exhibits multiple suspicious characteristics common in phishing lures.');
    advice.push('Verify the sender directly through their official mobile app or bookmarked website — never use the contact information provided in this message.');
    advice.push('Look closely at the sender address or URL for subtle typos, lookalike characters, or unusual domains.');
  } else {
    advice.push('No obvious phishing indicators or malicious patterns were identified in this sample.');
    advice.push('As standard cyber hygiene, always verify that login pages have valid SSL certificates and never share sensitive authentication codes.');
  }

  // Add specific category-driven advice
  const categories = new Set(indicators.map(i => i.category));
  if (categories.has('FINANCIAL_CREDENTIALS')) {
    advice.push('Reminder: Legitimate banks, tax agencies, and couriers will never threaten immediate account suspension to demand OTPs via SMS.');
  }
  if (categories.has('TECHNICAL_OBFUSCATION')) {
    advice.push('URL obfuscation or shorteners detected: Always expand shortened links or inspect the root domain before proceeding.');
  }

  return advice;
}

/**
 * Master scanner engine unifying URL, Email, SMS, and Screenshot channels.
 */
export function runDetection(channel: ChannelType, rawInput: string, textContext?: string): ScanResult {
  const timestamp = new Date().toISOString();
  const id = `scan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  let indicators: DetectionIndicator[] = [];
  let detectedBrand: string | undefined;
  let defangedUrlResult: string | undefined;

  if (channel === 'URL') {
    const urlAnalysis = analyzeUrl(rawInput, textContext);
    indicators = urlAnalysis.indicators;
    detectedBrand = urlAnalysis.detectedBrand;
    defangedUrlResult = urlAnalysis.defangedUrl;
  } else {
    // EMAIL, SMS, or SCREENSHOT text
    const textAnalysis = analyzeText(rawInput);
    indicators = textAnalysis.indicators;
    detectedBrand = textAnalysis.detectedBrand;

    if (textAnalysis.extractedUrls.length > 0) {
      defangedUrlResult = defangUrl(textAnalysis.extractedUrls[0]);
    }
  }

  const { score, riskLevel } = calculateRiskScore(indicators);
  const advice = generateAdvice(riskLevel, indicators);

  return {
    id,
    timestamp,
    channel,
    input: rawInput,
    defangedUrl: defangedUrlResult,
    score,
    riskLevel,
    indicators,
    advice,
    targetBrand: detectedBrand
  };
}
