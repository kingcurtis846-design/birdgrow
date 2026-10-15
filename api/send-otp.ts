import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

// Read either RESEND_API_KEY (server) or VITE_RESEND_API_KEY
const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!apiKey) {
    console.error('RESEND_API_KEY is missing on the server');
    return res.status(500).json({ 
      success: false, 
      error: 'Server configuration error: Resend API Key missing' 
    });
  }

  const resend = new Resend(apiKey);
  const { email, otp, type } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, error: 'Email and OTP are required.' });
  }

  try {
    const isRegister = type === 'register';
    const subject = isRegister
      ? 'Your BirdGrow Verification Code'
      : 'Your BirdGrow Password Reset Code';

    const { data, error } = await resend.emails.send({
      from: 'BirdGrow <onboarding@resend.dev>', // Or your verified custom domain email
      to: email,
      subject: subject,
      html: `<p>Your verification code is: <strong>${otp}</strong></p>`,
    });

    if (error) {
      console.error('Resend SDK Error:', error);
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    console.error('API Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
  }
}