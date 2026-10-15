import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;
const resend = new Resend(apiKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!apiKey) {
    return res.status(500).json({ success: false, error: 'Resend API key missing in environment' });
  }

  const { email, otp, type } = req.body || {};

  if (!email || !otp) {
    return res.status(400).json({ success: false, error: 'Email and OTP are required.' });
  }

  try {
    const isRegister = type === 'register';
    const title = isRegister ? 'Verify Your Email Address' : 'Reset Your Password';
    const subject = isRegister ? 'BirdGrow Verification Code' : 'BirdGrow Password Reset';

    const securityDisclaimer = isRegister
      ? 'If you did not initiate this registration, please disregard this email and verification code. No further action is required.'
      : 'If you did not request a password reset, please ignore this email or contact support immediately if you suspect unauthorized access.';

    const { data, error } = await resend.emails.send({
      from: 'BirdGrow <onboarding@resend.dev>', // Update to 'BirdGrow <no-reply@birdgrow.net>' after domain verification
      to: email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7f5; margin: 0; padding: 40px 20px; }
              .container { max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; }
              .header { background-color: #0d3b2e; color: #ffffff; padding: 28px; text-align: center; }
              .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
              .header p { margin: 4px 0 0 0; font-size: 13px; color: #a3e635; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
              .content { padding: 32px 28px; color: #374151; }
              .content h2 { font-size: 18px; margin-top: 0; margin-bottom: 12px; color: #111827; }
              .content p { font-size: 14px; line-height: 1.6; color: #4b5563; margin-bottom: 24px; }
              .otp-card { background-color: #f8faf9; border: 2px dashed #0d3b2e; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 24px; }
              .otp-code { font-size: 36px; font-weight: 800; color: #0d3b2e; letter-spacing: 8px; font-family: monospace; }
              .disclaimer-box { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px 16px; border-radius: 4px; margin-bottom: 20px; }
              .disclaimer-text { font-size: 12px; color: #991b1b; line-height: 1.5; margin: 0; }
              .footer { background-color: #f9fafb; border-top: 1px solid #f3f4f6; padding: 20px 28px; text-align: center; font-size: 12px; color: #9ca3af; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>BirdGrow</h1>
                <p>Sustainable Poultry Investment</p>
              </div>
              <div class="content">
                <h2>${title}</h2>
                <p>Use the 6-digit verification code below to complete your process. This code is valid for 10 minutes.</p>
                
                <div class="otp-card">
                  <div class="otp-code">${otp}</div>
                </div>

                <div class="disclaimer-box">
                  <p class="disclaimer-text"><strong>Security Notice:</strong> ${securityDisclaimer}</p>
                </div>
              </div>
              <div class="footer">
                &copy; ${new Date().getFullYear()} BirdGrow Platform. All rights reserved.
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
  }
}