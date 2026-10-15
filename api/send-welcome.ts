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

  const { email, userName } = req.body || {};

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'BirdGrow <onboarding@resend.dev>', // Update to 'BirdGrow <welcome@birdgrow.net>' once domain is verified
      to: email,
      subject: 'Welcome to BirdGrow! Account Confirmed',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7f5; margin: 0; padding: 40px 20px; }
              .container { max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; }
              .header { background-color: #0d3b2e; color: #ffffff; padding: 32px 28px; text-align: center; }
              .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
              .header p { margin: 6px 0 0 0; font-size: 13px; color: #a3e635; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
              .content { padding: 32px 28px; color: #374151; }
              .content h2 { font-size: 20px; color: #111827; margin-top: 0; }
              .content p { font-size: 14px; line-height: 1.6; color: #4b5563; }
              .btn-card { text-align: center; margin: 30px 0; }
              .btn { background-color: #0d3b2e; color: #ffffff; padding: 14px 28px; text-align: center; border-radius: 8px; font-weight: 600; font-size: 14px; text-decoration: none; display: inline-block; }
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
                <h2>Welcome to BirdGrow${userName ? `, ${userName}` : ''}! 🎉</h2>
                <p>Your registration is now complete and your account is active.</p>
                <p>You can now log in to explore investment cycles, track portfolio growth, and manage your poultry farming investments securely.</p>
                
                <div class="btn-card">
                  <a href="https://birdgrow.net/login" class="btn">Go to Dashboard</a>
                </div>

                <p style="font-size: 12px; color: #6b7280;">If you have any questions or need assistance setting up your account, reply directly to this email.</p>
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