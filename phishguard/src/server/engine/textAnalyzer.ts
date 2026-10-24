import { DetectionIndicator } from '../../shared/dictionary';
import { analyzeUrl } from './urlAnalyzer';

export interface TextAnalysisResult {
  indicators: DetectionIndicator[];
  extractedUrls: string[];
  extractedPhones: string[];
  detectedBrand?: string;
}

// Urgency & Fear Pressure Patterns
const URGENCY_PATTERNS = [
  { regex: /\b(act now|immediately|immediate action required|urgent|urgently)\b/i, label: 'Urgent Action Demand', points: 25 },
  { regex: /\b(account (?:suspended|blocked|locked|terminated|disabled|restricted))\b/i, label: 'Account Suspension Threat', points: 30 },
  { regex: /\b(within (?:24|12|48|2) hours|today only|expires soon|final warning)\b/i, label: 'Artificial Time Limit & Panic Trigger', points: 20 },
  { regex: /\b(electricity (?:power cut|will be disconnected|cut off tonight))\b/i, label: 'Utility Disconnection Threat', points: 35 },
  { regex: /\b(legal action|arrest warrant|court summons|cyber crime police|cbi inquiry)\b/i, label: 'Legal Intimidation & Coercion', points: 40 }
];

// Sensitive Credentials & PII Requests
const CREDENTIAL_PATTERNS = [
  { regex: /\b(otp|one time password|verification code|security code)\b/i, label: 'Request for Sensitive OTP / Verification Code', points: 40 },
  { regex: /\b(cvv|cvv2|card verification value|expiry date|atm pin|mpin)\b/i, label: 'Request for Credit Card CVV / Debit PIN', points: 45 },
  { regex: /\b(aadhaar|pan card|pan number|ssn|social security number)\b/i, label: 'Demanding Sensitive National Identity (PAN/Aadhaar/SSN)', points: 30 },
  { regex: /\b(enter (?:your )?password|confirm (?:your )?login|netbanking credentials)\b/i, label: 'Direct Password / Credential Harvesting', points: 35 }
];

// Scam Vector Categories
const SCAM_THEMES = [
  {
    regex: /\b(kyc (?:expired|update|verification|mandatory)|update kyc|link pan with bank)\b/i,
    label: 'Fake KYC / Bank Account Freezing Scam',
    points: 35,
    description: 'Fraudsters impersonate banks claiming your KYC has expired and your account will be permanently blocked unless you update immediately via an unverified link.'
  },
  {
    regex: /\b(lottery|congratulations you won|cash prize|lucky draw|claim reward points|claim refund)\b/i,
    label: 'Fake Prize / Lottery / Refund Bait',
    points: 30,
    description: 'Advance-fee fraud lure claiming an unexpected lottery win, reward points redemption, or tax refund.'
  },
  {
    regex: /\b(part[ -]?time job|earn \d+ (?:daily|per day)|like youtube videos|telegram task|work from home earn)\b/i,
    label: 'Pretexting Task / Part-Time Job Scam',
    points: 35,
    description: 'Fraudulent employment scheme soliciting prepaid tasks or investment returns through messaging channels like Telegram or WhatsApp.'
  },
  {
    regex: /\b(customs department|parcel (?:held|seized)|illegal package|drugs found|narcotics bureau)\b/i,
    label: 'Digital Arrest / Fake Parcel Coercion Scam',
    points: 40,
    description: 'Extortion scheme falsely claiming illegal substances were intercepted in a parcel addressed to the victim.'
  },
  {
    regex: /\b(tech support|virus detected|malware alert|windows support|call (?:toll free )?1-?800)\b/i,
    label: 'Fake Tech Support Alert',
    points: 30,
    description: 'Impersonates Microsoft, Apple, or antivirus vendors demanding the victim call a rogue hotline or install remote desktop software.'
  }
];

// High-Risk Payment Mechanisms
const PAYMENT_TRAPS = [
  { regex: /\b(gift cards?|steam card|apple gift card|itunes card|google play card)\b/i, label: 'Untraceable Gift Card Payment Request', points: 35 },
  { regex: /\b(bitcoin|crypto|usdt|eth|wallet address|binance deposit)\b/i, label: 'Cryptocurrency Transfer Demand', points: 30 },
  { regex: /\b(send money to \d{10}@|upi collect request|enter pin to receive money)\b/i, label: 'UPI / Reverse Payment Fraud Trap', points: 35 }
];

// Impersonation Brand Checks in Text
const BRAND_MENTIONS = [
  { brand: 'sbi', regex: /\b(sbi|state bank of india|yono)\b/i },
  { brand: 'hdfc', regex: /\b(hdfc|hdfc bank)\b/i },
  { brand: 'icici', regex: /\b(icici|icici bank|imobile)\b/i },
  { brand: 'axis', regex: /\b(axis bank)\b/i },
  { brand: 'paypal', regex: /\b(paypal)\b/i },
  { brand: 'amazon', regex: /\b(amazon|amazon prime|amazon pay)\b/i },
  { brand: 'netflix', regex: /\b(netflix)\b/i },
  { brand: 'apple', regex: /\b(apple id|icloud|apple support)\b/i },
  { brand: 'google', regex: /\b(google account|gmail verification)\b/i },
  { brand: 'microsoft', regex: /\b(microsoft account|office 365|windows defender)\b/i },
  { brand: 'paytm', regex: /\b(paytm|paytm wallet|paytm kyc)\b/i },
  { brand: 'electricity', regex: /\b(electricity board|bses|tneb|bescom|uppcl|mahadiscom)\b/i }
];

/**
 * Pure text analyzer inspecting message bodies, SMS snippets, emails, and OCR extracts.
 */
export function analyzeText(rawText: string): TextAnalysisResult {
  const indicators: DetectionIndicator[] = [];
  const cleanText = rawText.trim();

  if (!cleanText) {
    return { indicators, extractedUrls: [], extractedPhones: [] };
  }

  // 1. Extract embedded URLs from the text
  const urlRegex = /(?:https?:\/\/|www\.)[^\s<>"{}|\\^`[\]]+|[a-zA-Z0-9-]+\.(?:com|org|net|xyz|top|click|in|info|biz|ru|cn)\/[^\s<>"{}|\\^`[\]]*/gi;
  const rawUrls = cleanText.match(urlRegex) || [];
  const extractedUrls = Array.from(new Set(rawUrls));

  // 2. Extract phone numbers from the text
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b(?:9|8|7|6)\d{9}\b/g;
  const rawPhones = cleanText.match(phoneRegex) || [];
  const extractedPhones = Array.from(new Set(rawPhones));

  // 3. Evaluate Urgency & Panic patterns
  for (const item of URGENCY_PATTERNS) {
    const match = cleanText.match(item.regex);
    if (match) {
      indicators.push({
        id: `urgency-${item.label.toLowerCase().replace(/\s+/g, '-')}`,
        label: item.label,
        category: 'URGENCY_PRESSURE',
        severity: item.points >= 30 ? 'high' : 'medium',
        points: item.points,
        description: `Message uses high-pressure psychological manipulation: "${match[0]}". Cybercriminals exploit urgency to induce impulsive panic.`,
        matchedPattern: match[0]
      });
    }
  }

  // 4. Evaluate Credentials & PII harvesting
  for (const item of CREDENTIAL_PATTERNS) {
    const match = cleanText.match(item.regex);
    if (match) {
      indicators.push({
        id: `credential-${item.label.toLowerCase().replace(/\s+/g, '-')}`,
        label: item.label,
        category: 'FINANCIAL_CREDENTIALS',
        severity: 'high',
        points: item.points,
        description: `Message solicits sensitive credentials: "${match[0]}". Legitimate institutions explicitly state they will never solicit OTPs, passwords, or PINs via text or email.`,
        matchedPattern: match[0]
      });
    }
  }

  // 5. Evaluate Specific Scam Themes
  for (const item of SCAM_THEMES) {
    const match = cleanText.match(item.regex);
    if (match) {
      indicators.push({
        id: `theme-${item.label.toLowerCase().replace(/\s+/g, '-')}`,
        label: item.label,
        category: 'BRAND_IMPERSONATION',
        severity: 'high',
        points: item.points,
        description: `${item.description} (Matched: "${match[0]}").`,
        matchedPattern: match[0]
      });
    }
  }

  // 6. Evaluate High-Risk Payment Traps
  for (const item of PAYMENT_TRAPS) {
    const match = cleanText.match(item.regex);
    if (match) {
      indicators.push({
        id: `payment-${item.label.toLowerCase().replace(/\s+/g, '-')}`,
        label: item.label,
        category: 'FINANCIAL_CREDENTIALS',
        severity: 'high',
        points: item.points,
        description: `Message solicits an untraceable or deceptive payment channel: "${match[0]}".`,
        matchedPattern: match[0]
      });
    }
  }

  // 7. Impersonal / Generic Salutations
  const genericGreetingRegex = /\b(dear customer|dear user|valued customer|dear client|attention account holder|dear sir\/madam)\b/i;
  const greetingMatch = cleanText.match(genericGreetingRegex);
  if (greetingMatch) {
    indicators.push({
      id: 'text-generic-greeting',
      label: 'Impersonal / Generic Greeting',
      category: 'SENDER_MISMATCH',
      severity: 'low',
      points: 10,
      description: `The communication addresses you generically as "${greetingMatch[0]}" instead of your verified name. Mass phishing campaigns broadcast generic templates.`,
      matchedPattern: greetingMatch[0]
    });
  }

  // 8. Brand Impersonation in text
  let detectedBrand: string | undefined;
  for (const item of BRAND_MENTIONS) {
    if (item.regex.test(cleanText)) {
      detectedBrand = item.brand;
      break;
    }
  }

  // 9. If URLs are embedded in text, run URL analyzer on each embedded link
  for (const url of extractedUrls) {
    const urlAnalysis = analyzeUrl(url, cleanText);
    for (const ind of urlAnalysis.indicators) {
      indicators.push(ind);
    }
    if (urlAnalysis.detectedBrand && !detectedBrand) {
      detectedBrand = urlAnalysis.detectedBrand;
    }
  }

  // 10. Strange punctuation or excessive capitalization
  const uppercaseLetters = (cleanText.match(/[A-Z]/g) || []).length;
  const totalLetters = (cleanText.match(/[a-zA-Z]/g) || []).length;
  if (totalLetters > 30 && uppercaseLetters / totalLetters > 0.4) {
    indicators.push({
      id: 'text-excessive-caps',
      label: 'Excessive Capitalization / Screaming Pitch',
      category: 'URGENCY_PRESSURE',
      severity: 'low',
      points: 10,
      description: 'Abnormally high proportion of uppercase characters used to induce anxiety and attention.'
    });
  }

  return {
    indicators,
    extractedUrls,
    extractedPhones,
    detectedBrand
  };
}
