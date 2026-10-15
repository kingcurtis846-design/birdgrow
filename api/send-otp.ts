import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

// Read API key strictly from Vercel Environment Variables
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
    const subject = isRegister
      ? 'Your BirdGrow Verification Code'
      : 'Your BirdGrow Password Reset Code';

    const { data, error } = await resend.emails.send({
      from: 'BirdGrow <onboarding@resend.dev>',
      to: email,
      subject: subject,
      html: `<p>Your verification code is: <strong>${otp}</strong></p>`,
    });

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
  }
}