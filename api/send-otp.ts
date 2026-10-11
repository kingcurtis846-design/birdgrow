import type { VercelRequest, VercelResponse } from '@vercel/node';
// api/send-otp.js
import { Resend } from 'resend';

// Hardcoded Resend API Key for quick setup
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow CORS / preflight requests if needed
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, otp, type } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, error: 'Email and OTP are required.' });
  }

  const isRegister = type === 'register';
  const subject = isRegister
    ? 'Your BirdGrow Verification Code'
    : 'Your BirdGrow Password Reset Code';

  const html = `
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; rounded: 12px;">
      <h2 style="color: #1B3B2B; margin-top: 0;">BirdGrow Security Code</h2>
      <p style="color: #374151; font-size: 14px;">
        ${
          isRegister
            ? 'Thank you for registering. Use the verification code below to complete your registration:'
            : 'You requested a password reset. Use the code below to reset your password:'
        }
      </p>
      <div style="background-color: #f3f4f6; padding: 16px; text-align: center; border-radius: 8px; margin: 20px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1B3B2B;">${otp}</span>
      </div>
      <p style="color: #6b7280; font-size: 12px;">If you did not request this code, please ignore this email.</p>
    </div>
  `;

  try {
    const data = await resend.emails.send({
      from: 'BirdGrow <admin@birdgrow.net>',
      to: email,
      subject: subject,
      html: html,
    });

    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error('Resend API Error:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Internal server error' });
  }
}