import { DetectionIndicator, defangUrl } from '../../shared/dictionary';

export interface UrlAnalysisResult {
  indicators: DetectionIndicator[];
  defangedUrl: string;
  detectedBrand?: string;
  isDefective: boolean;
}

// Top frequently impersonated global & regional financial, tech and ecommerce brands
export const TOP_TARGETED_BRANDS = [
  'paypal',
  'amazon',
  'google',
  'microsoft',
  'apple',
  'netflix',
  'chase',
  'bankofamerica',
  'wellsfargo',
  'sbi',
  'hdfc',
  'icici',
  'axisbank',
  'paytm',
  'phonepe',
  'facebook',
  'instagram',
  'whatsapp',
  'telegram',
  'binance',
  'coinbase',
  'incometax',
  'indiapost',
  'epfindia',
  'dhl',
  'fedex'
];

// High-abuse TLDs commonly seen in phishing and cyberfraud campaigns
const SUSPICIOUS_TLDS = new Set([
  'xyz',
  'top',
  'click',
  'zip',
  'mov',
  'fit',
  'work',
  'rest',
  'tk',
  'ml',
  'ga',
  'cf',
  'gq',
  'surf',
  'monster',
  'quest',
  'cam',
  'icu',
  'link'
]);

// Known URL shortener services
const URL_SHORTENERS = new Set([
  'bit.ly',
  'tinyurl.com',
  'is.gd',
  't.co',
  'cutt.ly',
  'ow.ly',
  'rb.gy',
  'shorturl.at',
  'goo.gl',
  'bl.ink'
]);

// Levenshtein distance helper
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

// Normalizes common homoglyphs / lookalikes (0->o, 1->l, rn->m, vv->w)
function normalizeLookalikes(str: string): string {
  return str
    .toLowerCase()
    .replace(/0/g, 'o')
    .replace(/[1!|]/g, 'l')
    .replace(/rn/g, 'm')
    .replace(/vv/g, 'w')
    .replace(/@/g, 'a')
    .replace(/3/g, 'e')
    .replace(/5/g, 's');
}

/**
 * Pure client-side string URL analyzer. NEVER fetches or contacts the destination.
 */
export function analyzeUrl(rawInput: string, textContext?: string): UrlAnalysisResult {
  const indicators: DetectionIndicator[] = [];
  const cleanInput = rawInput.trim();
  const defanged = defangUrl(cleanInput);

  if (!cleanInput) {
    return { indicators, defangedUrl: '', isDefective: true };
  }

  // 1. Check for HTML anchor mismatch (e.g. <a href="evil.com">paypal.com</a>)
  if (textContext) {
    const htmlAnchorRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi;
    let match: RegExpExecArray | null;
    while ((match = htmlAnchorRegex.exec(textContext)) !== null) {
      const href = match[1].toLowerCase();
      const innerText = match[2].toLowerCase().replace(/<[^>]+>/g, '').trim();

      // If inner text looks like a URL or brand domain that differs from href
      if ((innerText.includes('http') || innerText.includes('.com') || innerText.includes('.org')) && !href.includes(innerText)) {
        indicators.push({
          id: 'url-html-mismatch',
          label: 'Deceptive Link Text vs Actual Destination Mismatch',
          category: 'TECHNICAL_OBFUSCATION',
          severity: 'high',
          points: 45,
          description: `The visible link text claims to be "${innerText}" but redirects to an entirely different destination "${href}". This is a classic phishing technique.`,
          matchedPattern: match[0]
        });
      }
    }
  }

  // Extract hostname safely using URL parsing fallback
  let parsedUrl: URL | null = null;
  let testUrl = cleanInput;
  if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) {
    testUrl = 'http://' + testUrl;
  }

  try {
    parsedUrl = new URL(testUrl);
  } catch {
    // Malformed URL
    indicators.push({
      id: 'url-malformed',
      label: 'Malformed URL Syntax',
      category: 'URL_STRUCTURE',
      severity: 'medium',
      points: 20,
      description: 'The URL syntax is malformed or intentionally corrupted to evade standard browser security filters.'
    });
    return { indicators, defangedUrl: defanged, isDefective: false };
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  const pathname = parsedUrl.pathname.toLowerCase();
  const fullUrl = testUrl.toLowerCase();

  // 2. IP Address check (e.g. http://192.168.1.1 or http://185.220.101.5)
  const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  const hexIpRegex = /^0x[0-9a-f]+/i;
  if (ipv4Regex.test(hostname) || hexIpRegex.test(hostname)) {
    indicators.push({
      id: 'url-ip-host',
      label: 'Direct IP Address Used as Hostname',
      category: 'TECHNICAL_OBFUSCATION',
      severity: 'high',
      points: 40,
      description: `The URL uses a raw IP address (${hostname}) instead of a legitimate registered domain name. Legitimate banking and commercial services rarely use bare IP links.`,
      matchedPattern: hostname
    });
  }

  // 3. Userinfo '@' in URL check (e.g. https://paypal.com@evil-site.com)
  if (cleanInput.includes('@')) {
    indicators.push({
      id: 'url-userinfo-spoof',
      label: 'Deceptive "@" Symbol in URL',
      category: 'TECHNICAL_OBFUSCATION',
      severity: 'high',
      points: 35,
      description: 'The URL contains an "@" character. Browsers treat everything before the "@" as user credentials and actually navigate to the domain after the "@", effectively spoofing the visible brand.',
      matchedPattern: '@'
    });
  }

  // 4. Excessive Subdomains (>= 3 subdomains)
  const domainParts = hostname.split('.');
  if (domainParts.length >= 4 && !ipv4Regex.test(hostname)) {
    indicators.push({
      id: 'url-excessive-subdomains',
      label: 'Excessive Subdomain Stacking',
      category: 'URL_STRUCTURE',
      severity: 'medium',
      points: 25,
      description: `Domain has ${domainParts.length - 2} subdomains (${hostname}). Scammers stack subdomains to disguise the true root domain on mobile screens.`,
      matchedPattern: hostname
    });
  }

  // 5. Insecure HTTP protocol check
  if (cleanInput.startsWith('http://')) {
    indicators.push({
      id: 'url-insecure-http',
      label: 'Insecure Unencrypted HTTP Protocol',
      category: 'TECHNICAL_OBFUSCATION',
      severity: 'low',
      points: 15,
      description: 'The URL uses unencrypted HTTP rather than HTTPS. Legitimate login portals and payment gateways require HTTPS.',
      matchedPattern: 'http://'
    });
  }

  // 6. Suspicious TLD check
  const tld = domainParts[domainParts.length - 1];
  if (SUSPICIOUS_TLDS.has(tld)) {
    indicators.push({
      id: 'url-suspicious-tld',
      label: `High-Risk Top-Level Domain (.${tld})`,
      category: 'URL_STRUCTURE',
      severity: 'medium',
      points: 25,
      description: `The TLD .${tld} is frequently associated with disposable phishing campaigns and cybercrime infrastructure due to low registration costs and loose oversight.`,
      matchedPattern: `.${tld}`
    });
  }

  // 7. URL Shortener check
  const baseDomain = domainParts.slice(-2).join('.');
  if (URL_SHORTENERS.has(baseDomain) || URL_SHORTENERS.has(hostname)) {
    indicators.push({
      id: 'url-shortener-service',
      label: 'Shortened URL Masking Real Destination',
      category: 'TECHNICAL_OBFUSCATION',
      severity: 'medium',
      points: 20,
      description: `The URL uses a shortening service (${baseDomain}). Shorteners hide the final destination and are widely used in phishing SMS (smishing) and scams to bypass domain scanners.`,
      matchedPattern: baseDomain
    });
  }

  // 8. Hyphen-Stuffed Domain check (e.g. login-account-verification-security.com)
  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (hyphenCount >= 3) {
    indicators.push({
      id: 'url-hyphen-stuffed',
      label: 'Suspicious Hyphen-Stuffed Domain',
      category: 'URL_STRUCTURE',
      severity: 'medium',
      points: 20,
      description: `The domain name contains ${hyphenCount} hyphens. Attackers frequently stitch security keywords together with hyphens to mimic legitimate services.`,
      matchedPattern: hostname
    });
  }

  // 9. Length of URL (> 95 characters)
  if (cleanInput.length > 95) {
    indicators.push({
      id: 'url-excessive-length',
      label: 'Suspiciously Long URL',
      category: 'URL_STRUCTURE',
      severity: 'low',
      points: 15,
      description: `URL is ${cleanInput.length} characters long. Long URLs are frequently used to push the actual malicious domain offscreen on mobile devices or convey obfuscated tracking payloads.`,
      matchedPattern: `${cleanInput.length} characters`
    });
  }

  // 10. Brand Impersonation & Typosquatting / Lookalike analysis
  let detectedBrand: string | undefined;
  const normalizedHost = normalizeLookalikes(hostname);

  for (const brand of TOP_TARGETED_BRANDS) {
    // Check if brand appears in subdomain but root domain is NOT official
    // e.g. paypal.com.evil-site.net -> baseDomain is evil-site.net, not paypal.com
    if (hostname.includes(brand) && !baseDomain.startsWith(brand)) {
      detectedBrand = brand;
      indicators.push({
        id: `url-brand-subdomain-${brand}`,
        label: `Brand Impersonation in Subdomain (${brand.toUpperCase()})`,
        category: 'BRAND_IMPERSONATION',
        severity: 'high',
        points: 40,
        description: `The brand "${brand.toUpperCase()}" appears in the subdomain prefix, but the real registered root domain is "${baseDomain}". This is a deceptive impersonation attack.`,
        matchedPattern: hostname
      });
      break;
    }

    // Check for lookalikes (e.g., paypa1, arnazon, g00gle)
    const hostTokens = hostname.split(/[\.-]/);
    for (const token of hostTokens) {
      if (token === brand) continue; // Exact match on legit token handled above
      const normalizedToken = normalizeLookalikes(token);

      // Direct substitution match (e.g. paypa1 normalized -> paypal)
      if (normalizedToken === brand) {
        detectedBrand = brand;
        indicators.push({
          id: `url-homoglyph-${brand}`,
          label: `Lookalike Typosquatting / Character Substitution (${brand.toUpperCase()})`,
          category: 'BRAND_IMPERSONATION',
          severity: 'high',
          points: 45,
          description: `The token "${token}" uses visual character substitution (homoglyphs) to visually impersonate the trusted brand "${brand.toUpperCase()}".`,
          matchedPattern: token
        });
        break;
      }

      // Levenshtein distance 1 or 2 check on similar length tokens
      if (Math.abs(token.length - brand.length) <= 2 && brand.length >= 4) {
        const dist = levenshtein(token, brand);
        if (dist === 1 || (dist === 2 && brand.length >= 7)) {
          detectedBrand = brand;
          indicators.push({
            id: `url-levenshtein-${brand}`,
            label: `Typosquatted Brand Lookalike (${brand.toUpperCase()})`,
            category: 'BRAND_IMPERSONATION',
            severity: 'high',
            points: 35,
            description: `The domain token "${token}" is only ${dist} edit distance away from the well-known brand "${brand.toUpperCase()}" (Typosquatting).`,
            matchedPattern: token
          });
          break;
        }
      }
    }

    if (detectedBrand) break;
  }

  // 11. Sensitive keywords in path or query
  const securityKeywords = ['login', 'signin', 'verify', 'account', 'banking', 'secure', 'update', 'confirm', 'password', 'wallet'];
  const matchedKeywords = securityKeywords.filter(k => pathname.includes(k) || fullUrl.includes(k));
  if (matchedKeywords.length >= 2 && !baseDomain.includes('google.com') && !baseDomain.includes('microsoft.com')) {
    indicators.push({
      id: 'url-credential-path-keywords',
      label: 'Security & Credential Lure Keywords in URL',
      category: 'URL_STRUCTURE',
      severity: 'medium',
      points: 20,
      description: `URL contains multiple high-risk credential keywords: [${matchedKeywords.join(', ')}].`,
      matchedPattern: matchedKeywords.join(', ')
    });
  }

  return {
    indicators,
    defangedUrl: defanged,
    detectedBrand,
    isDefective: false
  };
}
