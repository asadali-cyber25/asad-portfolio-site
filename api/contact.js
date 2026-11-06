import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address.' });
  }

  const recipient = process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER || 'mrxasad33@gmail.com';

  // Professional HTML Email Template
  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Portfolio Message</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0c10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e0e0e0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0c10; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background: #13151b; border: 1px solid #232733; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.5);">
          
          <!-- Header Bar -->
          <tr>
            <td style="background: linear-gradient(135deg, #e8212b 0%, #8b0008 100%); padding: 28px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #ffffff; opacity: 0.9;">ASAD ALI // PORTFOLIO ALERT</span>
                    <h1 style="margin: 6px 0 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">New Client Transmission</h1>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.2); border-radius: 20px; padding: 4px 12px; font-family: monospace; font-size: 11px; color: #fff;">
                      ● LIVE INQUIRY
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px;">
              
              <!-- Sender Info Cards -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td width="50%" style="padding-right: 8px; vertical-align: top;">
                    <div style="background: #1a1d26; border: 1px solid #2a2e3d; border-radius: 10px; padding: 14px 16px;">
                      <div style="font-size: 11px; font-family: monospace; text-transform: uppercase; color: #e8212b; letter-spacing: 1px; margin-bottom: 4px;">SENDER NAME</div>
                      <div style="font-size: 15px; font-weight: 600; color: #ffffff;">${escapeHtml(name)}</div>
                    </div>
                  </td>
                  <td width="50%" style="padding-left: 8px; vertical-align: top;">
                    <div style="background: #1a1d26; border: 1px solid #2a2e3d; border-radius: 10px; padding: 14px 16px;">
                      <div style="font-size: 11px; font-family: monospace; text-transform: uppercase; color: #e8212b; letter-spacing: 1px; margin-bottom: 4px;">EMAIL ADDRESS</div>
                      <div style="font-size: 15px; font-weight: 600; color: #ffffff;">
                        <a href="mailto:${escapeHtml(email)}" style="color: #ffffff; text-decoration: none;">${escapeHtml(email)}</a>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Message Section -->
              <div style="background: #1a1d26; border: 1px solid #2a2e3d; border-radius: 12px; padding: 22px; margin-bottom: 24px;">
                <div style="font-size: 11px; font-family: monospace; text-transform: uppercase; color: #8892b0; letter-spacing: 1.5px; margin-bottom: 12px;">MESSAGE BODY</div>
                <div style="font-size: 15px; line-height: 1.7; color: #e2e8f0; white-space: pre-wrap;">${escapeHtml(message)}</div>
              </div>

              <!-- Quick Reply Action Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="mailto:${escapeHtml(email)}?subject=${encodeURIComponent(`Re: Portfolio inquiry from ${name}`)}" 
                       style="display: inline-block; background: #e8212b; color: #ffffff; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; padding: 14px 32px; border-radius: 999px; box-shadow: 0 4px 20px rgba(232, 33, 43, 0.4);">
                      Direct Reply to ${escapeHtml(name)} ↗
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer Metadata -->
          <tr>
            <td style="background: #0d0f14; border-top: 1px solid #1f232f; padding: 18px 32px; text-align: center;">
              <p style="margin: 0; font-family: monospace; font-size: 11px; color: #64748b; letter-spacing: 1px;">
                ORIGIN: asadali-cyber.vercel.app · TIMESTAMP: ${new Date().toUTCString()}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // Fallback if SMTP credentials aren't set in environment yet
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    // Forward via Web3Forms if SMTP is not yet populated
    try {
      const fallbackRes = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: process.env.WEB3FORMS_KEY || '16c4f04a-5f1e-40fe-bab1-6941c9c63304',
          subject: `Portfolio inquiry from ${name}`,
          from_name: name,
          name,
          email,
          message,
        }),
      });
      const data = await fallbackRes.json();
      if (data.success) {
        return res.status(200).json({ success: true, message: 'Message sent successfully.' });
      }
      return res.status(500).json({ success: false, message: data.message || 'Error sending message.' });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to deliver message.' });
    }
  }

  // Active SMTP via Nodemailer
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465 || !process.env.SMTP_PORT, // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${name} (Portfolio)" <${process.env.SMTP_USER}>`,
      to: recipient,
      replyTo: email,
      subject: `🚨 Portfolio Inquiry from ${name} [${email}]`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: htmlTemplate,
    });

    return res.status(200).json({ success: true, message: 'Message transmitted successfully.' });
  } catch (err) {
    console.error('SMTP error:', err);
    return res.status(500).json({ success: false, message: 'SMTP transmission failed. Please try again or reach via WhatsApp.' });
  }
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
