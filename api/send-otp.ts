import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

// Use environment variable, falling back to your working key string
const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || 're_K43WxwwA_KL6qQvEfg5oTba3zqtZHS1ms';

const resend = new Resend(apiKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>BirdGrow Verification</h2>
          <p>Your verification code is: <strong style="font-size: 24px;">${otp}</strong></p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    console.error('Server Catch Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
  }
}