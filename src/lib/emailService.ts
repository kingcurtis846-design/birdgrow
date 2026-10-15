// BirdGrow Official European Email Notification Dispatch Service
// Dispatches professional, compliant HTML & text notifications to investors

import { EmailNotificationRecord } from '../types';
export type { EmailNotificationRecord };

const STORAGE_KEY = 'birdgrow_email_dispatches';

// Read the key from your .env file
const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;

export const sendOtpEmail = async (toEmail: string, otpCode: string, purpose: 'register' | 'reset') => {
  try {
    const response = await fetch('/api/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: toEmail,
        otp: otpCode,
        type: purpose,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to send OTP email.');
    }

    return data;
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (toEmail: string, userName?: string) => {
  try {
    const response = await fetch('/api/send-welcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: toEmail, userName }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to send welcome email.');
    }

    return data;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    // Silent catch so it doesn't block user registration if welcome email fails
  }
};

export const getEmailDispatches = (): EmailNotificationRecord[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load email dispatches:', e);
  }
  return [];
};

export const saveEmailDispatch = (record: EmailNotificationRecord): void => {
  if (typeof window === 'undefined') return;
  try {
    const existing = getEmailDispatches();
    const updated = [record, ...existing].slice(0, 50); // keep recent 50
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to persist email dispatch:', e);
  }
};

/**
 * Build professional investment maturation email notification
 */
export const buildInvestmentMaturedEmail = (params: {
  recipientName: string;
  recipientEmail: string;
  planTitle: string;
  principalAmount: number;
  profitAmount: number;
  totalPayout: number;
  currencySymbol?: string;
  investmentId: string;
  txRef: string;
  dateStr?: string;
}): EmailNotificationRecord => {
  const sym = params.currencySymbol || '€';
  const dateStr = params.dateStr || new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const subject = `[BirdGrow] Investment Matured: Contractual Settlement of ${sym}${params.totalPayout.toLocaleString()} Credited`;
  const previewText = `Your ${params.planTitle} production cycle has successfully matured. ${sym}${params.totalPayout.toLocaleString()} is now available in your wallet.`;

  const textBody = `
BIRDGROW EUROPEAN AGRI-FINTECH S.A.
OFFICIAL SETTLEMENT NOTICE — CONTRACT MATURATION
==================================================

Date: ${dateStr}
Reference: ${params.txRef}
Recipient: ${params.recipientName} (${params.recipientEmail})

Dear ${params.recipientName},

We are pleased to inform you that your contractual poultry cycle for "${params.planTitle}" (ID: ${params.investmentId}) has reached full biological maturation and concluded successfully.

In accordance with your European agricultural participation agreement, your initial principal capital alongside your contractual harvest yield has been credited directly to your BirdGrow wallet balance.

SETTLEMENT BREAKDOWN:
--------------------------------------------------
* Production Horizon:      ${params.planTitle}
* Principal Capital:        ${sym}${params.principalAmount.toLocaleString()}
* Contractual Net Profit:   +${sym}${params.profitAmount.toLocaleString()}
* Total Settlement Payout:  ${sym}${params.totalPayout.toLocaleString()}
* Settlement Timestamp:     ${new Date().toISOString()}
* Settlement Status:        SETTLED & CLEARED

NEXT STEPS:
Your funds are immediately liquid. You may:
1. Re-allocate capital into new European production cycles to compound agricultural yield.
2. Request a direct SEPA bank transfer or crypto settlement to your verified address.

Thank you for partnering with BirdGrow in driving sustainable European food security.

Warm regards,

Elena Vance
Chief Operating Officer & Head of Settlements
BirdGrow European Agri-Fintech S.A.
Am Hauptbahnhof 12, 60329 Frankfurt am Main, Germany
Registry No: HRB 109842 · BaFin & AFM Compliant
`.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #F7F6F2; color: #2D3748; }
    .wrapper { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E5E3D8; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: #1B3B2B; padding: 32px 28px; text-align: center; color: #ffffff; }
    .logo { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
    .logo span { color: #C5A059; }
    .badge { display: inline-block; background: rgba(197, 160, 89, 0.2); color: #C5A059; border: 1px solid #C5A059; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 12px; border-radius: 999px; margin-top: 12px; }
    .content { padding: 32px 28px; line-height: 1.6; }
    .headline { font-size: 20px; font-weight: 700; color: #1B3B2B; margin-top: 0; margin-bottom: 12px; }
    .table-box { background: #F7F6F2; border-radius: 12px; border: 1px solid #E5E3D8; padding: 18px 20px; margin: 24px 0; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #EAE8E0; font-size: 13px; }
    .row:last-child { border-bottom: none; font-size: 16px; font-weight: 800; color: #1B3B2B; padding-top: 12px; }
    .label { color: #5C6572; font-weight: 500; }
    .val { font-family: monospace; font-weight: 700; color: #1B3B2B; }
    .val-profit { color: #16A34A; }
    .val-total { color: #C5A059; }
    .cta-button { display: block; text-align: center; background: #1B3B2B; color: #ffffff !important; text-decoration: none; padding: 14px 24px; border-radius: 10px; font-weight: 700; font-size: 14px; margin-top: 24px; }
    .footer { background: #FAF9F5; padding: 24px 28px; border-top: 1px solid #E5E3D8; font-size: 11px; color: #7C887E; line-height: 1.5; text-align: center; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">Bird<span>Grow</span></div>
      <div style="font-size: 12px; color: #D8DFD9; margin-top: 4px;">European Agricultural Agri-Fintech Platform</div>
      <div class="badge">Official Settlement Notification</div>
    </div>
    <div class="content">
      <h2 class="headline">Your Investment Has Fully Matured</h2>
      <p>Dear <strong>${params.recipientName}</strong>,</p>
      <p>We are delighted to confirm that your poultry production cycle under <strong>${params.planTitle}</strong> has concluded its contractual tenure. All birds have completed their biological cycle and your contractual returns are certified.</p>
      
      <div class="table-box">
        <div class="row">
          <span class="label">Production Plan:</span>
          <span class="val">${params.planTitle}</span>
        </div>
        <div class="row">
          <span class="label">Principal Capital:</span>
          <span class="val">${sym}${params.principalAmount.toLocaleString()}</span>
        </div>
        <div class="row">
          <span class="label">Contractual Profit:</span>
          <span class="val val-profit">+${sym}${params.profitAmount.toLocaleString()}</span>
        </div>
        <div class="row">
          <span class="label">Settlement Reference:</span>
          <span class="val">${params.txRef}</span>
        </div>
        <div class="row">
          <span class="label">Total Maturity Deposit:</span>
          <span class="val val-total">${sym}${params.totalPayout.toLocaleString()}</span>
        </div>
      </div>

      <p style="font-size: 13px; color: #5C6572;">Your capital is liquid and immediately available in your wallet. You may allocate into new high-performing European production horizons or initiate an instant withdrawal.</p>

      <a href="https://birdgrow.eu/dashboard" class="cta-button">View Wallet &amp; Manage Allocations</a>
    </div>
    <div class="footer">
      <strong>BirdGrow European Agri-Fintech S.A.</strong><br>
      Am Hauptbahnhof 12, 60329 Frankfurt am Main, Germany · Reg: HRB 109842<br>
      Regulated under EU Crowdfunding Service Providers Regulation (ECSP 2020/1503).
    </div>
  </div>
</body>
</html>
`.trim();

  return {
    id: `email-mat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type: 'investment_matured',
    recipientEmail: params.recipientEmail,
    recipientName: params.recipientName,
    subject,
    previewText,
    htmlBody,
    textBody,
    metadata: {
      investmentId: params.investmentId,
      planTitle: params.planTitle,
      principalAmount: params.principalAmount,
      profitAmount: params.profitAmount,
      totalPayout: params.totalPayout,
      txRef: params.txRef,
    },
    sentAt: new Date().toISOString(),
    status: 'delivered',
  };
};

/**
 * Build professional review approved email notification
 */
export const buildReviewApprovedEmail = (params: {
  recipientName: string;
  recipientEmail: string;
  planTitle?: string;
  rating: number;
  quote: string;
  reviewId: string;
}): EmailNotificationRecord => {
  const planName = params.planTitle || 'European Poultry Production Horizon';
  const subject = `[BirdGrow] Verified Review Approved: Your Testimonial is Now Live`;
  const previewText = `Your ${params.rating}-star review for ${planName} has been authenticated by our administration and published to the homepage.`;

  const textBody = `
BIRDGROW EUROPEAN AGRI-FINTECH S.A.
INVESTOR RELATIONS & COMPLIANCE DESK
==================================================

Recipient: ${params.recipientName} (${params.recipientEmail})
Status: VERIFIED & PUBLISHED

Dear ${params.recipientName},

We are pleased to inform you that your recent investor review and operational testimonial has been formally reviewed, authenticated, and approved by the BirdGrow Executive Administration.

Your feedback is now featured live on the official BirdGrow global homepage under our Verified Investor Testimonials showcase.

REVIEW SUMMARY:
--------------------------------------------------
* Production Horizon:  ${planName}
* Authenticated Rating: ${'★'.repeat(params.rating)}${'☆'.repeat(5 - params.rating)} (${params.rating}/5 Stars)
* Testimonial Excerpt: "${params.quote}"
* Visibility:           BirdGrow Home Screen (Global)

Transparent investor testimonials are vital to our European agricultural community, giving prospective participants verifiable visibility into biological cycle yields and automated settlement reliability.

We sincerely appreciate your dedication to sustainable agriculture and thank you for being a valued part of BirdGrow.

Warm regards,

Sarah Lindqvist
Head of Investor Relations & Compliance
BirdGrow European Agri-Fintech S.A.
Herengracht 450, 1017 CA Amsterdam, Netherlands
Registry No: NL-8839210
`.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #F7F6F2; color: #2D3748; }
    .wrapper { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E5E3D8; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: #1B3B2B; padding: 32px 28px; text-align: center; color: #ffffff; }
    .logo { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
    .logo span { color: #C5A059; }
    .badge { display: inline-block; background: rgba(34, 197, 94, 0.2); color: #4ADE80; border: 1px solid #22C55E; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 12px; border-radius: 999px; margin-top: 12px; }
    .content { padding: 32px 28px; line-height: 1.6; }
    .headline { font-size: 20px; font-weight: 700; color: #1B3B2B; margin-top: 0; margin-bottom: 12px; }
    .quote-box { background: #FAF9F5; border-left: 4px solid #C5A059; border-radius: 0 12px 12px 0; padding: 18px 20px; margin: 20px 0; font-style: italic; color: #1B3B2B; font-size: 14px; }
    .stars { color: #C5A059; font-size: 18px; margin-bottom: 8px; }
    .meta-tag { display: inline-block; background: #EAE8E0; padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; color: #1B3B2B; margin-bottom: 12px; }
    .cta-button { display: block; text-align: center; background: #1B3B2B; color: #ffffff !important; text-decoration: none; padding: 14px 24px; border-radius: 10px; font-weight: 700; font-size: 14px; margin-top: 24px; }
    .footer { background: #FAF9F5; padding: 24px 28px; border-top: 1px solid #E5E3D8; font-size: 11px; color: #7C887E; line-height: 1.5; text-align: center; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">Bird<span>Grow</span></div>
      <div style="font-size: 12px; color: #D8DFD9; margin-top: 4px;">European Agricultural Agri-Fintech Platform</div>
      <div class="badge">Review Authentication Approved</div>
    </div>
    <div class="content">
      <h2 class="headline">Your Verified Review is Live on Homepage</h2>
      <p>Dear <strong>${params.recipientName}</strong>,</p>
      <p>We are delighted to inform you that your investor review has been verified by the Compliance &amp; Administration team and approved for global publication.</p>
      
      <div class="meta-tag">Plan: ${planName}</div>
      <div class="stars">${'★'.repeat(params.rating)}${'☆'.repeat(5 - params.rating)}</div>

      <div class="quote-box">
        "${params.quote}"
      </div>

      <p style="font-size: 13px; color: #5C6572;">Your testimonial is now visible to all platform visitors on our homepage, reinforcing trust and real-world agricultural performance data.</p>

      <a href="https://birdgrow.eu/#testimonials" class="cta-button">View Your Review on Homepage</a>
    </div>
    <div class="footer">
      <strong>BirdGrow European Agri-Fintech S.A.</strong><br>
      Herengracht 450, 1017 CA Amsterdam, Netherlands · Reg: NL-8839210<br>
      Thank you for being part of Europe's leading agricultural transparency network.
    </div>
  </div>
</body>
</html>
`.trim();

  return {
    id: `email-rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type: 'review_approved',
    recipientEmail: params.recipientEmail,
    recipientName: params.recipientName,
    subject,
    previewText,
    htmlBody,
    textBody,
    metadata: {
      reviewId: params.reviewId,
      planTitle: planName,
      rating: params.rating,
      quote: params.quote,
    },
    sentAt: new Date().toISOString(),
    status: 'delivered',
  };
};

/**
 * Build professional withdrawal declined email notification with detailed error & issues list
 */
export const buildWithdrawalDeclinedEmail = (params: {
  recipientName: string;
  recipientEmail: string;
  amount: number;
  currencySymbol?: string;
  txRef: string;
  errorMessage: string;
  issues: string[];
  refundedToWallet?: boolean;
}): EmailNotificationRecord => {
  const sym = params.currencySymbol || '€';
  const subject = `[BirdGrow] Withdrawal Notice: Payout of ${sym}${params.amount.toLocaleString()} Declined (Action Required)`;
  const previewText = `Your withdrawal request of ${sym}${params.amount.toLocaleString()} could not be processed due to compliance or routing issues.`;

  const issuesListText =
    params.issues.length > 0
      ? params.issues.map((issue, idx) => `  ${idx + 1}. ${issue}`).join('\n')
      : `  • ${params.errorMessage}`;

  const textBody = `
BIRDGROW EUROPEAN AGRI-FINTECH S.A.
OFFICIAL SETTLEMENT NOTICE — WITHDRAWAL STATUS
==================================================

Recipient: ${params.recipientName} (${params.recipientEmail})
Reference: ${params.txRef}
Status: TRANSFER DECLINED

Dear ${params.recipientName},

We are writing to notify you that your withdrawal request for ${sym}${params.amount.toLocaleString()} (Ref: ${params.txRef}) could not be completed and has been declined by our Treasury & Compliance Operations desk.

SUMMARY OF ISSUES & REASON FOR DECLINE:
--------------------------------------------------
Error Note: ${params.errorMessage}

Detected Issues / Compliance Flags:
${issuesListText}

CAPITAL SECURITY & WALLET RESTORATION:
--------------------------------------------------
${
  params.refundedToWallet !== false
    ? `Your principal balance of ${sym}${params.amount.toLocaleString()} has been restored to your BirdGrow main wallet balance without penalties. Your capital remains safe and under audit oversight.`
    : `Please review your payout destination details and resubmit once the highlighted issues are resolved.`
}

ACTION REQUIRED:
1. Review your destination address / IBAN details for correctness and network compatibility.
2. Ensure compliance dossiers or KYC identity verification requirements are up to date.
3. If this relates to active farm capital allocations (production, feed production, or bio-dome construction), verify the corresponding cycle liquidity window.

If you have questions or require manual clearance assistance, you may reach out directly to our live Executive Operations Desk.

Sincerely,

Henrik De Vries
Chief Risk Officer & Head of European Settlements
BirdGrow European Agri-Fintech S.A.
Am Hauptbahnhof 12, 60329 Frankfurt am Main, Germany
`.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #F7F6F2; color: #2D3748; }
    .wrapper { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E5E3D8; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: #7F1D1D; padding: 32px 28px; text-align: center; color: #ffffff; }
    .logo { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
    .logo span { color: #FCA5A5; }
    .badge { display: inline-block; background: rgba(254, 202, 202, 0.2); color: #FEE2E2; border: 1px solid #FCA5A5; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 12px; border-radius: 999px; margin-top: 12px; }
    .content { padding: 32px 28px; line-height: 1.6; }
    .headline { font-size: 20px; font-weight: 700; color: #991B1B; margin-top: 0; margin-bottom: 12px; }
    .error-box { background: #FEF2F2; border-left: 4px solid #DC2626; border-radius: 0 12px 12px 0; padding: 18px 20px; margin: 20px 0; }
    .error-title { font-weight: 800; color: #991B1B; font-size: 14px; margin-bottom: 6px; }
    .error-message { font-size: 13px; color: #7F1D1D; margin-bottom: 12px; }
    .issue-item { font-size: 12px; color: #991B1B; margin-bottom: 6px; display: flex; align-items: flex-start; }
    .issue-item span { font-weight: bold; margin-right: 6px; }
    .table-box { background: #F7F6F2; border-radius: 12px; border: 1px solid #E5E3D8; padding: 16px 18px; margin: 20px 0; font-size: 13px; }
    .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #EAE8E0; }
    .row:last-child { border-bottom: none; font-weight: 700; }
    .cta-button { display: block; text-align: center; background: #1B3B2B; color: #ffffff !important; text-decoration: none; padding: 14px 24px; border-radius: 10px; font-weight: 700; font-size: 14px; margin-top: 24px; }
    .footer { background: #FAF9F5; padding: 24px 28px; border-top: 1px solid #E5E3D8; font-size: 11px; color: #7C887E; line-height: 1.5; text-align: center; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">Bird<span>Grow</span></div>
      <div style="font-size: 12px; color: #FEE2E2; margin-top: 4px;">European Agricultural Agri-Fintech Platform</div>
      <div class="badge">Withdrawal Status Notice</div>
    </div>
    <div class="content">
      <h2 class="headline">Withdrawal Transfer Request Declined</h2>
      <p>Dear <strong>${params.recipientName}</strong>,</p>
      <p>Your withdrawal payout of <strong>${sym}${params.amount.toLocaleString()}</strong> (Reference: <code>${params.txRef}</code>) could not be dispatched by our Treasury department.</p>

      <div class="error-box">
        <div class="error-title">Reason for Decline / Error Message:</div>
        <div class="error-message">${params.errorMessage}</div>

        ${
          params.issues.length > 0
            ? `<div style="font-size: 11px; font-weight: 700; color: #991B1B; text-transform: uppercase; margin-top: 10px; margin-bottom: 6px;">Identified Issues:</div>` +
              params.issues
                .map((issue) => `<div class="issue-item"><span>⚠️</span> <div>${issue}</div></div>`)
                .join('')
            : ''
        }
      </div>

      <div class="table-box">
        <div class="row">
          <span style="color:#5C6572;">Requested Amount:</span>
          <span style="font-family: monospace; font-weight: 700;">${sym}${params.amount.toLocaleString()}</span>
        </div>
        <div class="row">
          <span style="color:#5C6572;">Transaction Reference:</span>
          <span style="font-family: monospace;">${params.txRef}</span>
        </div>
        <div class="row">
          <span style="color:#5C6572;">Capital Status:</span>
          <span style="color: #16A34A; font-weight: 700;">${
            params.refundedToWallet !== false
              ? `Refunded to Wallet Balance (+${sym}${params.amount.toLocaleString()})`
              : 'Action Pending'
          }</span>
        </div>
      </div>

      <p style="font-size: 13px; color: #5C6572;">
        Please log into your investor dashboard to review the issues, update your destination credentials, or resubmit your transfer request.
      </p>

      <a href="https://birdgrow.eu/dashboard" class="cta-button">Open Investor Dashboard</a>
    </div>
    <div class="footer">
      <strong>BirdGrow European Agri-Fintech S.A.</strong><br>
      Am Hauptbahnhof 12, 60329 Frankfurt am Main, Germany · Reg: HRB 109842<br>
      BaFin &amp; AFM Compliant European Agricultural Custody Network
    </div>
  </div>
</body>
</html>
`.trim();

  return {
    id: `email-dec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type: 'withdrawal_declined',
    recipientEmail: params.recipientEmail,
    recipientName: params.recipientName,
    subject,
    previewText,
    htmlBody,
    textBody,
    metadata: {
      txRef: params.txRef,
      requestedAmount: params.amount,
      errorMessage: params.errorMessage,
      issues: params.issues,
    },
    sentAt: new Date().toISOString(),
    status: 'delivered',
  };
};

/**
 * Build professional partial payout email notification with tranche explanation & capital pairing details
 */
export const buildWithdrawalPartialEmail = (params: {
  recipientName: string;
  recipientEmail: string;
  requestedAmount: number;
  partialAmount: number;
  remainingAmount: number;
  currencySymbol?: string;
  txRef: string;
  explanationMessage: string;
  capitalPairingCategory?: string;
}): EmailNotificationRecord => {
  const sym = params.currencySymbol || '€';
  const categoryLabel =
    params.capitalPairingCategory === 'feed_production'
      ? 'Feed Production & Grain Milling Cycles'
      : params.capitalPairingCategory === 'facility_building'
      ? 'Bio-Dome Facility Building & Expansion'
      : params.capitalPairingCategory === 'operational_expenses'
      ? 'Farm Operational Overheads & Logistics'
      : 'Live Poultry Flock Production & Growth Cycles';

  const subject = `[BirdGrow] Partial Payout Cleared: ${sym}${params.partialAmount.toLocaleString()} Dispatched (Requested: ${sym}${params.requestedAmount.toLocaleString()})`;
  const previewText = `A partial disbursement of ${sym}${params.partialAmount.toLocaleString()} has been processed. The remaining ${sym}${params.remainingAmount.toLocaleString()} has been credited to your available balance.`;

  const textBody = `
BIRDGROW EUROPEAN AGRI-FINTECH S.A.
OFFICIAL SETTLEMENT NOTICE — PARTIAL TRANCHE DISBURSEMENT
==================================================

Recipient: ${params.recipientName} (${params.recipientEmail})
Reference: ${params.txRef}
Status: PARTIAL DISBURSEMENT CLEARED

Dear ${params.recipientName},

We are writing to confirm that a partial payout disbursement for your withdrawal request has been approved and cleared by the BirdGrow Treasury Operations desk.

DISBURSEMENT BREAKDOWN:
--------------------------------------------------
* Initial Withdrawal Request:  ${sym}${params.requestedAmount.toLocaleString()}
* Partial Amount Dispatched:    ${sym}${params.partialAmount.toLocaleString()} (CLEARED & SENT)
* Remaining Balance:            ${sym}${params.remainingAmount.toLocaleString()} (CREDITED TO MAIN WALLET)
* Capital Expense Pairing:     ${categoryLabel}

EXECUTIVE EXPLANATION / OPERATIONAL NOTE:
--------------------------------------------------
"${params.explanationMessage}"

HOW AGRICULTURAL CAPITAL PAIRING WORKS:
Under the BirdGrow European Agricultural model, all investor capital is paired directly with real, physical farm operational expenses:
- Live Bird Production & Day-Old Placement
- Feed Production & Automated Grain Milling
- Bio-Dome Facility Construction & Modernization
- Operational & Cold-Chain Farm Logistics

Because capital is actively working on the ground in real-world biological and operational cycles, staggered liquidity tranches ensure biological continuity and farm stability while delivering continuous yield to investors.

Your remaining balance of ${sym}${params.remainingAmount.toLocaleString()} has been credited directly back to your main wallet balance. You may allocate it to alternative production horizons or initiate a new withdrawal at the next liquidity window.

Warm regards,

Elena Vance
Chief Operating Officer & Head of Settlements
BirdGrow European Agri-Fintech S.A.
Am Hauptbahnhof 12, 60329 Frankfurt am Main, Germany
`.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #F7F6F2; color: #2D3748; }
    .wrapper { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E5E3D8; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: #1B3B2B; padding: 32px 28px; text-align: center; color: #ffffff; }
    .logo { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
    .logo span { color: #C5A059; }
    .badge { display: inline-block; background: rgba(197, 160, 89, 0.25); color: #F5E6C4; border: 1px solid #C5A059; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 12px; border-radius: 999px; margin-top: 12px; }
    .content { padding: 32px 28px; line-height: 1.6; }
    .headline { font-size: 20px; font-weight: 700; color: #1B3B2B; margin-top: 0; margin-bottom: 12px; }
    .notice-box { background: #FEF9EE; border-left: 4px solid #C5A059; border-radius: 0 12px 12px 0; padding: 18px 20px; margin: 20px 0; }
    .notice-title { font-weight: 800; color: #8F702B; font-size: 13px; text-transform: uppercase; margin-bottom: 6px; }
    .notice-text { font-size: 13px; color: #5C4314; font-style: italic; }
    .table-box { background: #F7F6F2; border-radius: 12px; border: 1px solid #E5E3D8; padding: 18px 20px; margin: 24px 0; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #EAE8E0; font-size: 13px; }
    .row:last-child { border-bottom: none; font-size: 14px; font-weight: 800; color: #1B3B2B; padding-top: 10px; }
    .label { color: #5C6572; font-weight: 500; }
    .val { font-family: monospace; font-weight: 700; color: #1B3B2B; }
    .val-sent { color: #16A34A; }
    .val-restored { color: #C5A059; }
    .pairing-card { background: #FAF9F5; border: 1px dashed #DCDAD0; border-radius: 10px; padding: 12px 16px; margin-top: 16px; font-size: 12px; color: #4A5568; }
    .cta-button { display: block; text-align: center; background: #1B3B2B; color: #ffffff !important; text-decoration: none; padding: 14px 24px; border-radius: 10px; font-weight: 700; font-size: 14px; margin-top: 24px; }
    .footer { background: #FAF9F5; padding: 24px 28px; border-top: 1px solid #E5E3D8; font-size: 11px; color: #7C887E; line-height: 1.5; text-align: center; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">Bird<span>Grow</span></div>
      <div style="font-size: 12px; color: #D8DFD9; margin-top: 4px;">European Agricultural Agri-Fintech Platform</div>
      <div class="badge">Partial Payout Disbursement</div>
    </div>
    <div class="content">
      <h2 class="headline">Partial Tranche Withdrawal Processed</h2>
      <p>Dear <strong>${params.recipientName}</strong>,</p>
      <p>Your withdrawal request (Ref: <code>${params.txRef}</code>) has been partially approved and dispatched. Below is the settlement breakdown for your records:</p>

      <div class="table-box">
        <div class="row">
          <span class="label">Total Requested Amount:</span>
          <span class="val">${sym}${params.requestedAmount.toLocaleString()}</span>
        </div>
        <div class="row">
          <span class="label">Partial Amount Dispatched:</span>
          <span class="val val-sent">✓ ${sym}${params.partialAmount.toLocaleString()}</span>
        </div>
        <div class="row">
          <span class="label">Remaining Balance Restored to Wallet:</span>
          <span class="val val-restored">${sym}${params.remainingAmount.toLocaleString()}</span>
        </div>
        <div class="row">
          <span class="label">Capital Expense Allocation:</span>
          <span class="val" style="font-size: 11px;">${categoryLabel}</span>
        </div>
      </div>

      <div class="notice-box">
        <div class="notice-title">Official Operational Notice from Administration:</div>
        <div class="notice-text">"${params.explanationMessage}"</div>
      </div>

      <div class="pairing-card">
        <strong style="color: #1B3B2B;">🌾 How Farm Capital Pairing Operates:</strong><br>
        Your capital directly funds physical agricultural assets: live bird production, automated feed milling, and bio-dome construction. Tranche distributions maintain continuous flock bio-security and feed supplies while preserving liquidity.
      </div>

      <p style="font-size: 13px; color: #5C6572; margin-top: 18px;">
        Your remaining balance of <strong>${sym}${params.remainingAmount.toLocaleString()}</strong> is available in your main wallet for re-allocation or withdrawal.
      </p>

      <a href="https://birdgrow.eu/dashboard" class="cta-button">View Updated Wallet Balance</a>
    </div>
    <div class="footer">
      <strong>BirdGrow European Agri-Fintech S.A.</strong><br>
      Am Hauptbahnhof 12, 60329 Frankfurt am Main, Germany · Reg: HRB 109842<br>
      Sustainable European Poultry Production &amp; Direct Agri-Fintech Settlements
    </div>
  </div>
</body>
</html>
`.trim();

  return {
    id: `email-part-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type: 'withdrawal_partial',
    recipientEmail: params.recipientEmail,
    recipientName: params.recipientName,
    subject,
    previewText,
    htmlBody,
    textBody,
    metadata: {
      txRef: params.txRef,
      requestedAmount: params.requestedAmount,
      partialAmount: params.partialAmount,
      remainingAmount: params.remainingAmount,
      partialMessage: params.explanationMessage,
      capitalPairingCategory: params.capitalPairingCategory,
    },
    sentAt: new Date().toISOString(),
    status: 'delivered',
  };
};
