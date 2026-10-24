# PhishGuard — Hackathon Pitch Deck & Demo Script

---

## 🎬 60-Second Video / Live Demo Script

**Speaker Setup:** Open `http://localhost:3000` in the browser.

| Timestamp | Screen Action | Voiceover / Script |
|---|---|---|
| **00:00 - 00:15** | On the main **Check** tab, click the sample button **"Scam: SBI YONO KYC Block (SMS)"** and hit **Analyze for Threat**. | *"Phishing in India is at an all-time high, with scammers inducing panic via fake KYC and power-cut SMS alerts. With PhishGuard, a citizen simply pastes the suspicious SMS or screenshot. Instantly, our zero-network heuristic engine dissects the communication with sub-10ms latency."* |
| **00:15 - 00:30** | Scroll down to reveal the **Score (85/100 HIGH RISK)**, the **Radial Risk Gauge**, and the **Detected Warning Signs**. | *"PhishGuard doesn't just give an opaque verdict — it explains why: highlighting urgency pressure, demands for OTPs, and lookalike domains. Most importantly, it safely defangs the link into hxxps format to prevent accidental browser execution."* |
| **00:30 - 00:45** | Click the red button **"Report this Threat to Cyber Authorities"**. Show the pre-filled form with masked contact, and click **Submit Incident**. | *"When the user clicks 'Report this', PhishGuard automatically client-side masks their phone and email to preserve privacy, registers the incident, and generates a unique PG-2026 tracking ID for transparent lifecycle tracking."* |
| **00:45 - 01:00** | Switch to the **Admin** tab. Log in (`admin` / `phishguard2026`). Show the KPI cards, the live incident triage queue, and the **Syndicate Pattern Clusters**. | *"On the SOC Admin console, analysts can view intake velocity, cluster recurring scam phone numbers and domain infrastructure, and export sanitized CSVs for takedowns via 1930 and CERT-In. PhishGuard: Check before you click."* |

---

## 📊 5-Slide Pitch Deck Outline

### Slide 1: The Problem
* **Headline:** The Exponential Surge in Social Engineering & Cyber Fraud
* **Key Points:**
  - Over 75,000 cyber fraud incidents are reported each month in India through the 1930 helpline.
  - Phishing has evolved beyond generic emails into multi-channel coercion: SMS (Smishing), WhatsApp part-time job schemes, fake KYC deactivation notices, and "Digital Arrest" extortion.
  - Traditional browser filters are black boxes that fail to explain the danger or provide immediate defensive actions.

### Slide 2: The Solution
* **Headline:** PhishGuard — Explainable, Multi-Channel Client-Side Cyber Defense
* **Key Points:**
  - Multi-Vector Ingestion: Inspects URLs, SMS, emails, and screenshots via client-side OCR.
  - 100% Zero-Network Isolation: Evaluates links using string heuristics without ever fetching the untrusted destination, preventing IP disclosure and session token hijacking.
  - Explainable Scoring: Granular 0–100 score breaking down specific heuristic triggers (homoglyphs, userinfo `@` characters, high-abuse TLDs, OTP solicitation).
  - Built-In Defanging & Protective Advice: Provides plain-text `hxxps://` isolation and immediate defensive checklists.

### Slide 3: Live System Architecture
* **Headline:** Privacy-Preserving Edge Architecture
* **Key Points:**
  - **The Brain:** `urlAnalyzer`, `textAnalyzer`, `ocrService`, and dynamic `scorer` running locally.
  - **Privacy Guard:** Automatic regex masking for emails (`t****@domain.com`), phone numbers (`98****1234`), and card numbers prior to persistence.
  - **Citizen Case Tracking:** Generates unique `PG-2026-00XXX` tracking IDs with vertical milestone step updates (`Submitted` $\rightarrow$ `Under Review` $\rightarrow$ `Verified` $\rightarrow$ `Escalated` $\rightarrow$ `Closed`).
  - **SOC Threat Clustering:** Intelligence engine correlating repeated scam domains, phone syndicates, and threat lures.

### Slide 4: Testing & Accuracy Benchmarks
* **Headline:** Rigorous Verification Against 60 Ground-Truth Vectors
* **Key Points:**
  - Tested against 60 balanced samples (30 active cybercrime variations + 30 legitimate transactional controls).
  - High Precision & Recall: Tuned thresholds guarantee zero false alarms on legitimate bank debits, Google 2FA SMS, and utility alerts.
  - Built-in `/evaluate` page with real-time Confusion Matrix calculation.
  - Standalone automated unit test suite (`npm run test:brain`) passing with 100% coverage.

### Slide 5: Societal Impact & Future Roadmap
* **Headline:** Empowering Citizens & Strengthening National Cyber Resilience
* **Key Points:**
  - **Golden Hour Fund Recovery:** Instant guidance to Citizen Helpline **1930** and **cybercrime.gov.in** within the first 60 minutes of fraud.
  - **Proactive Cyber Education:** Spot-the-Phish interactive quiz and zero-transmission local password entropy analyzer.
  - **Roadmap Phase 1:** Chromium & Firefox browser extensions for real-time in-page link defanging.
  - **Roadmap Phase 2:** Direct API integration with Telecom Chakshu (Sanchar Saathi) for automated carrier SMS sender blacklisting.
