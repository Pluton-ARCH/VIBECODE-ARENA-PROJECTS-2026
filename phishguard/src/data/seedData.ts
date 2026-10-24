import { IncidentReport, EvaluationSample, IncidentStatus, IncidentType } from '../shared/dictionary';

// 6 Quick Samples for the Scanner Demo
export const QUICK_SCAN_SAMPLES = [
  {
    label: 'Scam: SBI YONO KYC Block (SMS)',
    type: 'SMS' as const,
    content: 'Dear Customer, your SBI YONO account will be BLOCKED today. Please update your PAN Card immediately by clicking http://sbi-kyc-portal.xyz/login to maintain active banking services.'
  },
  {
    label: 'Scam: Urgent Electricity Cut (SMS)',
    type: 'SMS' as const,
    content: 'URGENT NOTICE: Your electricity power will be disconnected tonight at 9:30 PM because previous month bill was not updated. Please immediately contact our power officer at 9876543210 or visit http://bescom-bill-update.xyz'
  },
  {
    label: 'Scam: PayPal Unauthorized Login (Email)',
    type: 'EMAIL' as const,
    content: `Dear Customer,
We detected an unauthorized transaction of $499.00 on your PayPal account from IP 192.168.1.55. If this was not you, please verify your credentials within 24 hours at http://paypa1-security-verification.top/confirm or your account will be permanently suspended.
Never share your OTP with anyone.`
  },
  {
    label: 'Scam: Lookalike URL with @ Spoof (URL)',
    type: 'URL' as const,
    content: 'https://amazon.com@arnazon-orders-verification.click/account/signin'
  },
  {
    label: 'Legit: HDFC Transaction Alert (SMS)',
    type: 'SMS' as const,
    content: 'Dear Customer, INR 1,250.00 debited from HDFC Bank A/c **3421 on 24-OCT-26 14:15 at Reliance Fresh via UPI. Available balance: INR 35,420.00. If this transaction was not authorized by you, call 18002026123.'
  },
  {
    label: 'Legit: Google Security Code (SMS)',
    type: 'SMS' as const,
    content: 'G-749102 is your Google verification code. Do not share this code with anyone. Google will never ask for this code.'
  }
];

// 8 Mini Quiz Questions for Spot the Phish
export const QUIZ_QUESTIONS = [
  {
    id: 1,
    title: 'Question 1: Urgent Banking Alert',
    scenario: 'You receive an SMS: "Dear Customer, your bank account will be blocked within 2 hours due to pending KYC. Click http://bit.ly/bank-kyc-now to update immediately."',
    question: 'Is this legitimate or phishing, and what is the dead giveaway?',
    options: [
      { text: 'Legitimate: Banks regularly send SMS alerts for regulatory KYC updates.', isCorrect: false },
      { text: 'Phishing: The shortener link (bit.ly) and artificial 2-hour panic deadline indicate a scam.', isCorrect: true },
      { text: 'Legitimate: As long as it addresses you as "Dear Customer", it is official.', isCorrect: false }
    ],
    explanation: 'Banks never use generic URL shorteners (bit.ly) or threaten immediate account suspension within hours via SMS. Always visit the bank official app directly.'
  },
  {
    id: 2,
    title: 'Question 2: Lookalike URL Examination',
    scenario: 'You receive an email claiming to be from Amazon asking you to verify a $850 order. The link destination displays as: "https://www.arnazon-support.xyz/orders".',
    question: 'What visual anomaly is present in this domain?',
    options: [
      { text: 'Typosquatting: "arnazon" uses the letters "r" and "n" placed together to mimic the letter "m".', isCorrect: true },
      { text: 'Nothing: It has HTTPS so it is completely safe.', isCorrect: false },
      { text: 'It is official Amazon customer support portal for international orders.', isCorrect: false }
    ],
    explanation: 'Scammers frequently combine "r" and "n" to produce "rn" which looks almost identical to "m" (arnazon vs amazon) and register cheap .xyz domains.'
  },
  {
    id: 3,
    title: 'Question 3: UPI Payment Collection Request',
    scenario: 'Someone calling from OLX wants to buy your couch. He says: "I sent you a QR code on WhatsApp. Scan it and enter your UPI PIN to receive the advance payment of Rs 5,000."',
    question: 'What happens if you scan and enter your PIN?',
    options: [
      { text: 'The Rs 5,000 will be credited to your bank account immediately.', isCorrect: false },
      { text: 'Money will be DEBITED from your account. You NEVER enter a UPI PIN to receive money.', isCorrect: true },
      { text: 'It verifies your identity without any monetary movement.', isCorrect: false }
    ],
    explanation: 'Golden Rule of UPI: You ONLY enter your UPI PIN to SEND or DEBIT money from your bank account. Receiving money never requires a PIN.'
  },
  {
    id: 4,
    title: 'Question 4: Deceptive Link Anchor Text',
    scenario: 'In an email, the blue underlined link text displays "https://paypal.com/verify", but when you hover over it, the browser preview shows "http://185.220.101.4/paypal".',
    question: 'Which destination will your browser actually load?',
    options: [
      { text: 'paypal.com because that is what is written on the page.', isCorrect: false },
      { text: 'The raw IP address 185.220.101.4 specified in the hidden href attribute.', isCorrect: true },
      { text: 'It will open both windows side by side.', isCorrect: false }
    ],
    explanation: 'HTML allows link text to display any text while the href attribute routes to an attacker IP or spoofed server. Always inspect the actual URL destination.'
  },
  {
    id: 5,
    title: 'Question 5: Tech Support Ransom / Lock',
    scenario: 'A loud buzzer plays and a browser pop-up says: "YOUR PC IS INFECTED WITH TROJAN SPYWARE! Call Windows Support at 1-800-456-7890 immediately. Do not shut down."',
    question: 'What is the correct immediate action?',
    options: [
      { text: 'Call the number immediately and give them remote access to fix the virus.', isCorrect: false },
      { text: 'Close the browser tab or terminate the browser process; Microsoft never displays phone numbers in browser alerts.', isCorrect: true },
      { text: 'Enter your credit card number to buy an instant cleaning key.', isCorrect: false }
    ],
    explanation: 'Legitimate operating system security software never uses fullscreen browser sirens or toll-free numbers demanding money or remote desktop control.'
  },
  {
    id: 6,
    title: 'Question 6: Income Tax Refund SMS',
    scenario: 'You receive an SMS: "Income Tax Dept has approved your refund of INR 24,500. A/c number mismatch. Update your bank account details and NetBanking password at http://incometax-refunds.top/claim".',
    question: 'How does the Income Tax Department actually handle refunds?',
    options: [
      { text: 'They send SMS with third-party web forms to enter NetBanking passwords.', isCorrect: false },
      { text: 'Refunds are automatically processed directly to your pre-validated bank account via e-filing portal (e-filing.incometax.gov.in). They NEVER ask for passwords.', isCorrect: true },
      { text: 'You must pay an advance processing tax to unlock the refund.', isCorrect: false }
    ],
    explanation: 'Tax authorities never ask for NetBanking passwords or send links ending in .top/.xyz. Legitimate refunds are credited automatically to pre-validated accounts.'
  },
  {
    id: 7,
    title: 'Question 7: Telegram Part-Time Job Offer',
    scenario: 'You get a WhatsApp message: "Earn Rs 3,000 to 8,000 daily from home just by liking YouTube videos and rating hotels on Google Maps. Join our Telegram group to start."',
    question: 'What scam pattern is this?',
    options: [
      { text: 'A verified Google affiliate partner program.', isCorrect: false },
      { text: 'Pretexting Task Scam: They pay a tiny reward (Rs 150) initially, then demand you deposit large sums into "crypto investment plans" to withdraw earnings.', isCorrect: true },
      { text: 'A standard digital marketing internship.', isCorrect: false }
    ],
    explanation: 'This is the rampant "Telegram task scam". Once you trust them after an initial nominal payment, they coerce you into depositing lakhs into fake trading pools.'
  },
  {
    id: 8,
    title: 'Question 8: Digital Arrest / Courier Parcel Coercion',
    scenario: 'A caller claiming to be from FedEx and Mumbai Police says: "A parcel in your name contains 5 expired passports and 140g MDMA narcotics. You are under digital arrest via Skype."',
    question: 'Is digital arrest a real legal procedure?',
    options: [
      { text: 'Yes, modern law enforcement can arrest you over video calls.', isCorrect: false },
      { text: 'NO: "Digital Arrest" DOES NOT EXIST in Indian or international law. Police or couriers never demand money or conduct trials over WhatsApp/Skype.', isCorrect: true },
      { text: 'You should transfer money to the RBI verification escrow account as demanded.', isCorrect: false }
    ],
    explanation: 'The Ministry of Home Affairs and CERT-In have repeatedly warned: There is NO provision for "Digital Arrest". Disconnect immediately and call 1930.'
  }
];

// 30 Pre-Seeded Incident Reports for Admin Dashboard & Analytics
export const SEED_INCIDENT_REPORTS: IncidentReport[] = [
  {
    id: 'inc-101',
    trackingCode: 'PG-2026-00101',
    type: 'SMS',
    description: 'Received SMS threatening electricity disconnection tonight at 9:30 PM with a phone number to call.',
    date: '2026-10-24T09:12:00Z',
    suspiciousTarget: '+91 9876543210 (bescom-bill-update[.]xyz)',
    amountLost: 0,
    evidenceFiles: ['screenshot_bescom.png'],
    reporterContact: 'r***h@gmail.com',
    isAnonymous: false,
    status: 'VERIFIED',
    timeline: [
      { status: 'SUBMITTED', timestamp: '2026-10-24T09:12:00Z', note: 'Report submitted by citizen.' },
      { status: 'UNDER_REVIEW', timestamp: '2026-10-24T10:00:00Z', note: 'Analyst assigned to domain bescom-bill-update.xyz.' },
      { status: 'VERIFIED', timestamp: '2026-10-24T11:30:00Z', note: 'Confirmed active phishing infrastructure targeting state electricity users.' }
    ],
    createdAt: '2026-10-24T09:12:00Z',
    updatedAt: '2026-10-24T11:30:00Z'
  },
  {
    id: 'inc-102',
    trackingCode: 'PG-2026-00102',
    type: 'WEBSITE',
    description: 'Lookalike fake banking login page impersonating SBI YONO. Solicits NetBanking ID and OTP.',
    date: '2026-10-24T08:30:00Z',
    suspiciousTarget: 'hxxps://sbi-kyc-update[.]xyz/yono-login',
    amountLost: 45000,
    evidenceFiles: ['login_fake_sbi.jpg'],
    reporterContact: 'a***t@yahoo.co.in',
    isAnonymous: false,
    status: 'ESCALATED',
    timeline: [
      { status: 'SUBMITTED', timestamp: '2026-10-24T08:30:00Z', note: 'Victim reported financial loss of Rs 45,000.' },
      { status: 'UNDER_REVIEW', timestamp: '2026-10-24T08:45:00Z', note: 'Triage team alerted cyber cell.' },
      { status: 'VERIFIED', timestamp: '2026-10-24T09:00:00Z', note: 'Domain matches known phishing registrar syndicate.' },
      { status: 'ESCALATED', timestamp: '2026-10-24T09:30:00Z', note: 'Escalated to 1930 Cyber Fraud Helpline and Registrar abuse desk for takedown.' }
    ],
    createdAt: '2026-10-24T08:30:00Z',
    updatedAt: '2026-10-24T09:30:00Z'
  },
  {
    id: 'inc-103',
    trackingCode: 'PG-2026-00103',
    type: 'CALL',
    description: 'Fake courier call claiming FedEx parcel intercepted with contraband; demanded payment via UPI.',
    date: '2026-10-23T16:20:00Z',
    suspiciousTarget: '+91 9988776655',
    amountLost: 0,
    evidenceFiles: ['call_log.png'],
    reporterContact: 'p***a@outlook.com',
    isAnonymous: true,
    status: 'UNDER_REVIEW',
    timeline: [
      { status: 'SUBMITTED', timestamp: '2026-10-23T16:20:00Z', note: 'Anonymous submission of caller ID.' },
      { status: 'UNDER_REVIEW', timestamp: '2026-10-24T07:15:00Z', note: 'Correlating with Chakshu Sanchar Saathi database.' }
    ],
    createdAt: '2026-10-23T16:20:00Z',
    updatedAt: '2026-10-24T07:15:00Z'
  },
  {
    id: 'inc-104',
    trackingCode: 'PG-2026-00104',
    type: 'EMAIL',
    description: 'PayPal account suspension warning with link pointing to paypa1-verify.top.',
    date: '2026-10-23T14:10:00Z',
    suspiciousTarget: 'hxxp://paypa1-verify[.]top/auth',
    amountLost: 0,
    evidenceFiles: ['paypal_phish.eml'],
    reporterContact: 's***m@corp.com',
    isAnonymous: false,
    status: 'CLOSED',
    timeline: [
      { status: 'SUBMITTED', timestamp: '2026-10-23T14:10:00Z', note: 'Report received.' },
      { status: 'VERIFIED', timestamp: '2026-10-23T15:00:00Z', note: 'Takedown notice issued.' },
      { status: 'CLOSED', timestamp: '2026-10-24T06:00:00Z', note: 'Host disabled malicious DNS records.' }
    ],
    createdAt: '2026-10-23T14:10:00Z',
    updatedAt: '2026-10-24T06:00:00Z'
  },
  {
    id: 'inc-105',
    trackingCode: 'PG-2026-00105',
    type: 'UPI_QR',
    description: 'OLX buyer sent reverse charge QR code claiming to pay token advance for second-hand bike.',
    date: '2026-10-23T12:00:00Z',
    suspiciousTarget: 'paytmqr281001@paytm (+91 9765432109)',
    amountLost: 12000,
    evidenceFiles: ['qr_evidence.jpg'],
    reporterContact: 'v***k@gmail.com',
    isAnonymous: false,
    status: 'ESCALATED',
    timeline: [
      { status: 'SUBMITTED', timestamp: '2026-10-23T12:00:00Z', note: 'Victim scanned QR code and lost Rs 12,000.' },
      { status: 'VERIFIED', timestamp: '2026-10-23T13:00:00Z', note: 'Mule account identified on Paytm UPI.' },
      { status: 'ESCALATED', timestamp: '2026-10-23T14:30:00Z', note: 'Lien request forwarded to bank nodal officer.' }
    ],
    createdAt: '2026-10-23T12:00:00Z',
    updatedAt: '2026-10-23T14:30:00Z'
  },
  {
    id: 'inc-106',
    trackingCode: 'PG-2026-00106',
    type: 'SMS',
    description: 'KBC 25 Lakh lottery winner SMS with WhatsApp number to submit PAN and processing charge.',
    date: '2026-10-22T19:40:00Z',
    suspiciousTarget: '+91 9811223344',
    amountLost: 2500,
    evidenceFiles: [],
    reporterContact: 'k***n@rediffmail.com',
    isAnonymous: false,
    status: 'VERIFIED',
    timeline: [
      { status: 'SUBMITTED', timestamp: '2026-10-22T19:40:00Z', note: 'Submission received.' },
      { status: 'VERIFIED', timestamp: '2026-10-23T09:00:00Z', note: 'Pattern matches recurring KBC lottery advance-fee syndicate.' }
    ],
    createdAt: '2026-10-22T19:40:00Z',
    updatedAt: '2026-10-23T09:00:00Z'
  },
  {
    id: 'inc-107',
    trackingCode: 'PG-2026-00107',
    type: 'OTHER',
    description: 'Work-from-home Telegram scheme paying Rs 150 for YouTube likes, then asked Rs 50k deposit.',
    date: '2026-10-22T15:15:00Z',
    suspiciousTarget: 'Telegram @Global_Media_Task_9',
    amountLost: 50000,
    evidenceFiles: ['telegram_chat.pdf'],
    reporterContact: 'd***a@gmail.com',
    isAnonymous: false,
    status: 'ESCALATED',
    timeline: [
      { status: 'SUBMITTED', timestamp: '2026-10-22T15:15:00Z', note: 'Report submitted.' },
      { status: 'UNDER_REVIEW', timestamp: '2026-10-22T17:00:00Z', note: 'Bank transfer receipt analyzed.' },
      { status: 'ESCALATED', timestamp: '2026-10-23T10:00:00Z', note: 'Case packet filed with Cyber Crime Station.' }
    ],
    createdAt: '2026-10-22T15:15:00Z',
    updatedAt: '2026-10-23T10:00:00Z'
  },
  {
    id: 'inc-108',
    trackingCode: 'PG-2026-00108',
    type: 'SMS',
    description: 'SBI YONO KYC block SMS directing users to sbi-kyc-update.xyz.',
    date: '2026-10-22T11:20:00Z',
    suspiciousTarget: 'hxxps://sbi-kyc-update[.]xyz/pan',
    amountLost: 0,
    evidenceFiles: [],
    reporterContact: 'm***h@gmail.com',
    isAnonymous: true,
    status: 'VERIFIED',
    timeline: [
      { status: 'SUBMITTED', timestamp: '2026-10-22T11:20:00Z', note: 'Submitted.' },
      { status: 'VERIFIED', timestamp: '2026-10-22T14:00:00Z', note: 'Added to cluster pattern: sbi-kyc-update.xyz.' }
    ],
    createdAt: '2026-10-22T11:20:00Z',
    updatedAt: '2026-10-22T14:00:00Z'
  },
  {
    id: 'inc-109',
    trackingCode: 'PG-2026-00109',
    type: 'WEBSITE',
    description: 'Fake Netflix subscription renewal discount site collecting credit card CVVs.',
    date: '2026-10-21T20:10:00Z',
    suspiciousTarget: 'hxxp://netflix-special-offer[.]click/pay',
    amountLost: 1500,
    evidenceFiles: ['card_statement.png'],
    reporterContact: 'n***a@gmail.com',
    isAnonymous: false,
    status: 'CLOSED',
    timeline: [
      { status: 'SUBMITTED', timestamp: '2026-10-21T20:10:00Z', note: 'Submitted.' },
      { status: 'CLOSED', timestamp: '2026-10-22T16:00:00Z', note: 'Card blocked and bank issued replacement.' }
    ],
    createdAt: '2026-10-21T20:10:00Z',
    updatedAt: '2026-10-22T16:00:00Z'
  },
  {
    id: 'inc-110',
    trackingCode: 'PG-2026-00110',
    type: 'EMAIL',
    description: 'Microsoft 365 credential harvesting email with lookalike domain micr0soft-online.com.',
    date: '2026-10-21T14:00:00Z',
    suspiciousTarget: 'hxxps://micr0soft-online[.]com/login',
    amountLost: 0,
    evidenceFiles: ['email_header.txt'],
    reporterContact: 'i***t@company.org',
    isAnonymous: false,
    status: 'VERIFIED',
    timeline: [
      { status: 'SUBMITTED', timestamp: '2026-10-21T14:00:00Z', note: 'Submitted by company IT.' },
      { status: 'VERIFIED', timestamp: '2026-10-21T15:30:00Z', note: 'Domain blocked on perimeter firewalls.' }
    ],
    createdAt: '2026-10-21T14:00:00Z',
    updatedAt: '2026-10-21T15:30:00Z'
  },
  // Additional realistic incident reports (11 to 30) for full dashboard depth
  ...Array.from({ length: 20 }, (_, idx) => {
    const num = 111 + idx;
    const types: IncidentType[] = ['SMS', 'EMAIL', 'WEBSITE', 'CALL', 'UPI_QR'];
    const statuses: IncidentStatus[] = ['SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'ESCALATED', 'CLOSED'];
    const type = types[idx % types.length];
    const status: IncidentStatus = statuses[idx % statuses.length];
    const amounts = [0, 0, 4500, 18000, 0, 75000, 0, 1250, 0, 9200];
    const amount = amounts[idx % amounts.length];
    const repeatedDomain = idx % 3 === 0 ? 'sbi-kyc-update[.]xyz' : (idx % 3 === 1 ? 'bescom-bill-update[.]xyz' : 'quick-loan-instant[.]top');
    const repeatedPhone = idx % 2 === 0 ? '+91 9876543210' : '+91 9123456789';

    return {
      id: `inc-${num}`,
      trackingCode: `PG-2026-00${num}`,
      type,
      description: `Suspected ${type} phishing campaign targeting bank accounts and identity credentials via ${repeatedDomain}.`,
      date: new Date(Date.now() - (idx + 1) * 86400000 * 0.7).toISOString(),
      suspiciousTarget: `${repeatedPhone} / ${repeatedDomain}`,
      amountLost: amount,
      evidenceFiles: amount > 0 ? ['proof_transaction.pdf'] : [],
      reporterContact: `user_${num}@masked.in`,
      isAnonymous: idx % 4 === 0,
      status,
      timeline: [
        { status: 'SUBMITTED' as IncidentStatus, timestamp: new Date(Date.now() - (idx + 1) * 86400000 * 0.7).toISOString(), note: 'Initial incident filing registered.' },
        { status, timestamp: new Date().toISOString(), note: `Case triaged to status: ${status}.` }
      ],
      createdAt: new Date(Date.now() - (idx + 1) * 86400000 * 0.7).toISOString(),
      updatedAt: new Date().toISOString()
    };
  })
];

// 60 Evaluation Samples (30 Phishing + 30 Legitimate) for the Benchmark Runner (/evaluate)
export const EVALUATION_DATASET: EvaluationSample[] = [
  // 30 PHISHING SAMPLES
  {
    id: 'phish-01',
    channel: 'SMS',
    title: 'SBI YONO KYC Suspension SMS',
    content: 'Dear SBI Customer, your YONO account is suspended. Update KYC at http://sbi-kyc-verify.xyz/yono immediately to activate.',
    groundTruth: 'phishing',
    targetBrand: 'sbi',
    description: 'High-risk KYC panic lure on .xyz suspicious domain.'
  },
  {
    id: 'phish-02',
    channel: 'URL',
    title: 'Raw IP Hostname Login URL',
    content: 'http://185.220.101.5/chase/online-banking/verify.php',
    groundTruth: 'phishing',
    targetBrand: 'chase',
    description: 'Bare IP address impersonating Chase banking portal.'
  },
  {
    id: 'phish-03',
    channel: 'EMAIL',
    title: 'PayPal Unauthorized Device Security Alert',
    content: 'Dear Client, Unauthorized login from Russia. Confirm your account details at http://paypa1-security.click within 12 hours or card will be blocked.',
    groundTruth: 'phishing',
    targetBrand: 'paypal',
    description: 'Homoglyph substitution paypa1 and urgency deadline.'
  },
  {
    id: 'phish-04',
    channel: 'SMS',
    title: 'Electricity Bill Disconnection Threat',
    content: 'Electricity power will be cut tonight at 9:30 PM due to unpaid bill. Call electricity officer immediately at 9876543210 or click http://bescom-bill.xyz',
    groundTruth: 'phishing',
    targetBrand: 'electricity',
    description: 'Classic utility extortion scam targeting Indian households.'
  },
  {
    id: 'phish-05',
    channel: 'URL',
    title: 'Deceptive Userinfo @ Spoofing URL',
    content: 'https://paypal.com@verify-credentials-access-portal.net/login',
    groundTruth: 'phishing',
    targetBrand: 'paypal',
    description: 'Uses userinfo @ syntax to camouflage the actual root domain.'
  },
  {
    id: 'phish-06',
    channel: 'SMS',
    title: 'KBC Lottery Advance Fee SMS',
    content: 'Congratulations! You won 25,00,000 INR in KBC Lucky Draw. To claim, send your PAN Card and OTP to WhatsApp 9811223344.',
    groundTruth: 'phishing',
    description: 'Advance fee fraud demanding sensitive identity credentials.'
  },
  {
    id: 'phish-07',
    channel: 'URL',
    title: 'Typosquatted Amazon Domain',
    content: 'https://arnazon-orders-check.xyz/track/order-id-491',
    groundTruth: 'phishing',
    targetBrand: 'amazon',
    description: 'Subtle "rn" homoglyph mimicking the letter "m" in Amazon.'
  },
  {
    id: 'phish-08',
    channel: 'EMAIL',
    title: 'Income Tax Refund Approval Bait',
    content: 'Dear Taxpayer, Refund of INR 28,450 approved. Update bank account number and NetBanking password at http://incometax-refunds-india.top/claim',
    groundTruth: 'phishing',
    targetBrand: 'incometax',
    description: 'Fake tax refund lure on disposable .top domain.'
  },
  {
    id: 'phish-09',
    channel: 'URL',
    title: 'Brand Impersonation in Subdomain',
    content: 'https://netflix.com.verify-billing-suspended.click/login',
    groundTruth: 'phishing',
    targetBrand: 'netflix',
    description: 'Places netflix.com in the subdomain of a rogue root domain.'
  },
  {
    id: 'phish-10',
    channel: 'SMS',
    title: 'Part-Time Telegram Job Offer',
    content: 'Earn Rs 5,000 daily from home by liking YouTube videos and subscribing to channels. Contact manager on Telegram @WorkFast99.',
    groundTruth: 'phishing',
    description: 'Pretexting task scam funneling users into crypto deposit traps.'
  },
  {
    id: 'phish-11',
    channel: 'URL',
    title: 'Hyphen-Stuffed Credential Phishing URL',
    content: 'http://secure-login-account-verification-identity-bank.com/signin',
    groundTruth: 'phishing',
    description: 'Contains 5 hyphens and multiple credential lure keywords.'
  },
  {
    id: 'phish-12',
    channel: 'EMAIL',
    title: 'Apple ID Disabled Alert',
    content: 'Dear Customer, Your Apple ID has been locked for security reasons. Enter your password and credit card CVV at http://appleid-unlock.xyz within 24 hours.',
    groundTruth: 'phishing',
    targetBrand: 'apple',
    description: 'Demands Apple ID credentials and payment card CVV.'
  },
  {
    id: 'phish-13',
    channel: 'SMS',
    title: 'Fake Courier Parcel Held Notification',
    content: 'Your IndiaPost parcel is withheld due to incorrect address. Pay Rs 25 re-delivery fee immediately at http://indiapost-redelivery.top or parcel will be returned.',
    groundTruth: 'phishing',
    targetBrand: 'indiapost',
    description: 'India Post parcel smishing scam harvesting credit cards.'
  },
  {
    id: 'phish-14',
    channel: 'URL',
    title: 'Google Lookalike g00gle Typosquatting',
    content: 'http://g00gle-accounts-security.xyz/recovery',
    groundTruth: 'phishing',
    targetBrand: 'google',
    description: 'Zero homoglyphs replacing letter o with numbers 0.'
  },
  {
    id: 'phish-15',
    channel: 'EMAIL',
    title: 'HTML Anchor Text Mismatch Scam',
    content: '<p>Please secure your account at <a href="http://malicious-vault.xyz/steal">https://chase.com/secure</a> immediately.</p>',
    groundTruth: 'phishing',
    targetBrand: 'chase',
    description: 'Anchor displays legit chase.com but href leads to malicious server.'
  },
  {
    id: 'phish-16',
    channel: 'SMS',
    title: 'HDFC PAN Link Mandate Scam',
    content: 'Dear HDFC User, your netbanking will be blocked today. Link your PAN card immediately at http://hdfc-pan-update.click or visit nearest branch.',
    groundTruth: 'phishing',
    targetBrand: 'hdfc',
    description: 'Impersonates HDFC with PAN update panic.'
  },
  {
    id: 'phish-17',
    channel: 'URL',
    title: 'Excessive Subdomain Stacking',
    content: 'http://secure.login.verify.update.banking.portal.scamserver.xyz/auth',
    groundTruth: 'phishing',
    description: '6 stacked subdomains hiding the malicious root domain.'
  },
  {
    id: 'phish-18',
    channel: 'SMS',
    title: 'EPFO PF Withdrawal Approved Lure',
    content: 'Your EPFO claim of INR 45,000 is ready for transfer. Enter your Aadhaar and OTP at http://epfindia-portal.top to receive amount.',
    groundTruth: 'phishing',
    targetBrand: 'epfindia',
    description: 'Solits Aadhaar and OTP under guise of PF withdrawal.'
  },
  {
    id: 'phish-19',
    channel: 'EMAIL',
    title: 'Tech Support Virus Warning',
    content: 'CRITICAL ALERT: Windows Defender detected Trojan Spyware on your PC. Call toll-free 1-800-456-7890 immediately to avoid complete data erasure.',
    groundTruth: 'phishing',
    targetBrand: 'microsoft',
    description: 'Rogue tech support lure soliciting phone call.'
  },
  {
    id: 'phish-20',
    channel: 'URL',
    title: 'Shortened Link Hiding Phishing Host',
    content: 'http://bit.ly/sbi-urgent-kyc-reactivate',
    groundTruth: 'phishing',
    targetBrand: 'sbi',
    description: 'Shortened bit.ly link masking unverified backend.'
  },
  // 10 more phishing variations
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `phish-${21 + i}`,
    channel: (i % 2 === 0 ? 'SMS' : 'URL') as 'SMS' | 'URL',
    title: `Targeted Fraud Vector #${21 + i}`,
    content: i % 2 === 0
      ? `URGENT: Your Axis Bank account has been blocked due to suspicious activity. Verify OTP at http://axis-verify-${i}.xyz within 2 hours.`
      : `http://192.168.1.${10 + i}/bank-login/verification?token=credential-harvest`,
    groundTruth: 'phishing' as const,
    description: 'Phishing campaign soliciting credentials or utilizing direct IP.'
  })),

  // 30 LEGITIMATE SAMPLES (Negative Controls - Ensuring Low False Positives)
  {
    id: 'legit-01',
    channel: 'SMS',
    title: 'Legitimate HDFC Bank Debit Alert',
    content: 'Dear Customer, INR 450.00 debited from HDFC Bank A/c **4120 on 24-OCT-26 via UPI. Available balance: INR 18,340.00. If not done by you, call 18002026123.',
    groundTruth: 'legitimate',
    description: 'Standard transaction debit SMS with masked account and official hotline.'
  },
  {
    id: 'legit-02',
    channel: 'URL',
    title: 'Official Google Account Security',
    content: 'https://myaccount.google.com/security',
    groundTruth: 'legitimate',
    targetBrand: 'google',
    description: 'Authentic HTTPS Google security settings page.'
  },
  {
    id: 'legit-03',
    channel: 'SMS',
    title: 'Google Verification Code SMS',
    content: 'G-394821 is your Google verification code. Do not share this code with anyone. Google will never call or ask for this code.',
    groundTruth: 'legitimate',
    description: 'Authentic 2FA code SMS with explicit security warning.'
  },
  {
    id: 'legit-04',
    channel: 'URL',
    title: 'Official Amazon Order Tracking',
    content: 'https://www.amazon.com/gp/your-account/order-history',
    groundTruth: 'legitimate',
    targetBrand: 'amazon',
    description: 'Legitimate Amazon order history URL on official root domain.'
  },
  {
    id: 'legit-05',
    channel: 'EMAIL',
    title: 'GitHub Monthly Security Summary',
    content: 'Hi developer, here is your monthly Dependabot security summary for your repositories. No vulnerable dependencies were detected this month.',
    groundTruth: 'legitimate',
    description: 'Informational developer newsletter without urgency or credential traps.'
  },
  {
    id: 'legit-06',
    channel: 'SMS',
    title: 'SBI Salary Credit Notification',
    content: 'Dear Customer, your SBI Account **8912 has been credited with INR 65,000.00 on 24-OCT-26 by salary transfer. Clear balance is INR 72,400.00.',
    groundTruth: 'legitimate',
    description: 'Benign salary credit SMS without links or action demands.'
  },
  {
    id: 'legit-07',
    channel: 'URL',
    title: 'Official Microsoft 365 Login',
    content: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    groundTruth: 'legitimate',
    targetBrand: 'microsoft',
    description: 'Official Microsoft authentication endpoint.'
  },
  {
    id: 'legit-08',
    channel: 'SMS',
    title: 'Zomato Food Delivery Status',
    content: 'Your Zomato order from Biryani House is picked up by delivery partner Rajesh. Track live on the Zomato app.',
    groundTruth: 'legitimate',
    description: 'Transactional delivery update directing user to the official app.'
  },
  {
    id: 'legit-09',
    channel: 'URL',
    title: 'Official National Cyber Crime Portal',
    content: 'https://cybercrime.gov.in/Webform/Accept.aspx',
    groundTruth: 'legitimate',
    description: 'Official Indian Government Cyber Crime reporting portal.'
  },
  {
    id: 'legit-10',
    channel: 'EMAIL',
    title: 'Netflix Monthly Receipt',
    content: 'Thank you for your payment. Your Netflix Standard plan subscription of INR 499 has been processed. You can review your billing history at netflix.com.',
    groundTruth: 'legitimate',
    targetBrand: 'netflix',
    description: 'Standard receipt notification with no suspicious calls to action.'
  },
  {
    id: 'legit-11',
    channel: 'SMS',
    title: 'Electricity Department Meter Reading',
    content: 'BESCOM Alert: Your meter reading for consumer number 458921 is 142 units. Bill amount is INR 840. Due date is 05-NOV-26. Pay via BESCOM Mithra app.',
    groundTruth: 'legitimate',
    description: 'Normal monthly utility statement with reasonable due date.'
  },
  {
    id: 'legit-12',
    channel: 'URL',
    title: 'Official PayPal Login Page',
    content: 'https://www.paypal.com/signin',
    groundTruth: 'legitimate',
    targetBrand: 'paypal',
    description: 'Official PayPal secure sign-in page.'
  },
  {
    id: 'legit-13',
    channel: 'SMS',
    title: 'IRCTC Train Ticket PNR Confirmation',
    content: 'PNR 2849102841, Train 12952 MUMBAI RAJDHANI, Date 25-OCT-26, Class 3A, Coach B4 Berth 23 (Confirmed). Have a pleasant journey.',
    groundTruth: 'legitimate',
    description: 'Indian Railways ticket booking confirmation.'
  },
  {
    id: 'legit-14',
    channel: 'URL',
    title: 'Official Reserve Bank of India Portal',
    content: 'https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx',
    groundTruth: 'legitimate',
    description: 'Official press release on RBI governmental domain.'
  },
  {
    id: 'legit-15',
    channel: 'EMAIL',
    title: 'Flight Booking E-Ticket Confirmation',
    content: 'Your Indigo booking 6E-204 from Delhi to Bengaluru on 28-OCT is confirmed. Web check-in opens 48 hours prior to departure at goindigo.in.',
    groundTruth: 'legitimate',
    description: 'Legitimate airline booking confirmation.'
  },
  // 15 more legitimate variations
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `legit-${16 + i}`,
    channel: (i % 2 === 0 ? 'SMS' : 'URL') as 'SMS' | 'URL',
    title: `Legitimate Notification #${16 + i}`,
    content: i % 2 === 0
      ? `Dear Customer, your monthly mutual fund SIP of INR 2,000 for folio 1092${i} was successfully processed on 24-OCT-26. Nav: INR 84.12.`
      : `https://www.apple.com/in/support/system-status/service-${i}`,
    groundTruth: 'legitimate' as const,
    description: 'Legitimate operational notification on genuine root domain.'
  }))
];

// Official Emergency Cyber Reporting Hotlines
export const CYBER_HELPLINES = [
  {
    name: 'National Cyber Crime Reporting Portal',
    code: 'cybercrime.gov.in',
    url: 'https://cybercrime.gov.in',
    badge: 'Govt of India',
    desc: 'Official portal to register complaints regarding financial fraud, identity theft, and cybercrime.'
  },
  {
    name: 'Citizen Cyber Fraud Helpline',
    code: '1930',
    badge: 'Toll-Free 24x7',
    desc: 'Immediate reporting within golden hour to freeze stolen funds in scammer bank/wallet accounts.'
  },
  {
    name: 'CERT-In Incident Desk',
    code: 'incident@cert-in.org.in',
    badge: 'National CERT',
    desc: 'Indian Computer Emergency Response Team for malware, zero-days, and coordinated threat vectors.'
  },
  {
    name: 'Chakshu (Sanchar Saathi)',
    code: 'sancharsaathi.gov.in',
    url: 'https://sancharsaathi.gov.in',
    badge: 'Telecom Dept',
    desc: 'Report suspected fraud communication via SMS, calls, or WhatsApp for instant carrier disconnection.'
  }
];
