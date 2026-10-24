# PhishGuard 🛡️
### Smart System for Detecting Phishing and Cyber Fraud
*Check before you click.*

PhishGuard is a high-performance, client-side cyber fraud defense application designed to protect citizens, banking customers, and organizations from social engineering scams, lookalike phishing links, urgency-driven smishing SMS, and credential theft.

---

## ⚡ Core Capabilities & Architecture

### 1. Multi-Channel Detection Engine ("The Brain")
- **Zero-Network URL Isolation:** Never visits, follows, or fetches suspicious links. Pure string heuristics prevent session token or IP leakage.
- **Homoglyph & Typosquatting Analyzer:** Detects lookalikes (`paypa1`, `arnazon`, `g00gle`) via Levenshtein distance and character swap matrices against top targeted global and Indian banking brands.
- **Deceptive Syntax Scrutiny:** Flags bare IP addresses, userinfo `@` characters, excessive subdomains (subdomain stacking), and suspicious/abuse TLDs (`.xyz`, `.top`, `.click`).
- **Urgency & Manipulation Detector:** Flags coercive language ("account suspended", "electricity disconnected tonight", "24 hours", "legal summons").
- **Credential & PII Harvester Traps:** Detects demands for OTP, ATM PIN, CVV, passwords, and Aadhaar/PAN cards.
- **Client-Side OCR Service:** Ingests screenshots of scam SMS and banking apps, extracting text locally without cloud privacy exposure.
- **Normalized 0–100 Scorer:** Assigns explicit points with full forensic explanations (`LOW`, `MEDIUM`, `HIGH`).

### 2. Education Hub
- **Interactive Guides:** Safe browsing, password security, passphrases, and 2FA best practices.
- **Common Scam Modus Operandi:** Deep-dives on fake KYC, UPI/QR reverse charge scams, "Digital Arrest", and Telegram part-time task traps.
- **Spot the Phish Quiz:** 8 interactive scenario questions with immediate forensic feedback and scoring.
- **Local Password Strength Meter:** Evaluates entropy, dictionary patterns, and estimated brute-force crack time 100% in-browser with zero keystroke transmission.
- **"What To Do If Scammed" Emergency Protocol:** Actionable steps for the "Golden Hour" to freeze funds.

### 3. Incident Reporting & Citizen Tracking
- Multi-vector reporting form with local file evidence upload.
- **Automated PII Masking:** Sanitizes email addresses (`t****q@example.com`), phone numbers (`98****1234`), and card numbers prior to persistence.
- Generates unique tracking code (e.g. `PG-2026-00101`).
- Status timeline view: `Submitted` → `Under Review` → `Verified` → `Escalated` / `Closed`.
- Direct copy shortcuts to Indian emergency cyber helplines: Citizen Helpline **1930**, **cybercrime.gov.in**, CERT-In, and Chakshu (Sanchar Saathi).

### 4. Admin SOC Triage Console
- Demo Analyst Login (`admin` / `phishguard2026`).
- Real-time KPI statistics: Total reports, open vs resolved, high-risk count, financial losses tracked.
- SVG visual charts: Incidents by vector (Donut), intake velocity (Area), and top targeted entities (Bar).
- **Syndicate Pattern Intelligence:** Automated clustering on repeated scam domains, recurring phone numbers, and threat keywords.
- Interactive status updating with triage notes.
- **Privacy Audit Log:** Tracks and timestamps any analyst unmasking of PII.
- One-click sanitized CSV export.

### 5. Automated Forensic Benchmark (`/evaluate`)
- Rigorous test harness across **60 balanced samples** (30 phishing variations + 30 legitimate negative controls).
- Live Confusion Matrix: True Positives (TP), False Positives (FP), True Negatives (TN), False Negatives (FN).
- Measured performance: **>95% Accuracy, >95% Recall, Low False Alarm Rate**.

---

## 🚀 Getting Started

### Development Mode
```bash
# Start local Vite development server
npm run dev
```

### Production Build
```bash
npm run build
```

### Running Test Suites
```bash
# Run unit tests on the 6 core attack vectors
npm run test:brain

# Run full end-to-end integration test suite
npm test
```

---

## 🔒 Safety & Defanging Protocols
All analyzed links are rendered in defanged format (`hxxps://evil-domain[.]com`) to prevent accidental browser execution or pre-fetch leaks.

---

## 🔮 Future Roadmap & Limitations
1. **Chromium & Firefox Browser Extension:** Real-time link defanging and hovering threat indicators directly on web pages.
2. **Telecom Chakshu API Integration:** Direct reporting pipeline for automated carrier SMS sender blacklisting.
3. **Hybrid AI/ML Edge Classifier:** Lightweight ONNX client-side model for contextual natural language nuance detection alongside rule heuristics.
4. **Google Safe Browsing & VirusTotal Hybrid Mode:** Optional cloud enrichment API keys when internet access is enabled.
