const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting SMTP test...');

    const envCheck = {
      EMAIL_USER: process.env.EMAIL_USER ? 'SET' : 'NOT SET',
      EMAIL_PASS: process.env.EMAIL_PASS ? 'SET' : 'NOT SET',
      SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com (default)',
      SMTP_PORT: process.env.SMTP_PORT || '587 (default)',
      EMAIL_FROM: process.env.EMAIL_FROM ? 'SET' : 'NOT SET',
      EMAIL_TO: process.env.EMAIL_TO ? 'SET' : 'NOT SET'
    };
    console.log('Environment variables check:', envCheck);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || 'summerworkshops25@gmail.com',
        pass: process.env.EMAIL_PASS || 'sxyv pyaw bvav kulh'
      },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
      debug: true,
      logger: true
    });

    console.log('Testing SMTP connection...');
    await transporter.verify();
    console.log('SMTP connection verified');

    const testMailOptions = {
      from: process.env.EMAIL_FROM || 'summerworkshops25@gmail.com',
      to: process.env.EMAIL_TO || 'summerworkshops25@gmail.com',
      subject: 'SMTP Test - ' + new Date().toISOString(),
      text: `SMTP Test Email

Sent at: ${new Date().toLocaleString()}
Environment: ${process.env.NODE_ENV || 'development'}
Host: ${process.env.SMTP_HOST || 'smtp.gmail.com'}
Port: ${process.env.SMTP_PORT || '587'}

This is a test email to verify SMTP connectivity.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">SMTP Test Email</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
            <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
            <p><strong>Host:</strong> ${process.env.SMTP_HOST || 'smtp.gmail.com'}</p>
            <p><strong>Port:</strong> ${process.env.SMTP_PORT || '587'}</p>
            <p>This is a test email to verify SMTP connectivity.</p>
          </div>
        </div>
      `
    };

    const emailResult = await transporter.sendMail(testMailOptions);
    console.log('Test email sent successfully:', emailResult.messageId);

    res.status(200).json({
      success: true,
      message: 'SMTP test completed successfully',
      details: {
        connectionTest: true,
        emailSent: true,
        messageId: emailResult.messageId,
        environment: envCheck,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('SMTP test error:', error);

    let errorType = 'Unknown';
    let suggestion = 'Check server logs for more details';

    if (error.code === 'EAUTH') {
      errorType = 'Authentication Failed';
      suggestion = 'Check Gmail App Password and ensure 2FA is enabled. Generate a new App Password at myaccount.google.com → Security → App passwords.';
    } else if (error.code === 'ECONNECTION') {
      errorType = 'Connection Failed';
      suggestion = 'Check network connectivity and SMTP server settings';
    } else if (error.code === 'ETIMEDOUT') {
      errorType = 'Connection Timeout';
      suggestion = 'Server may be blocking SMTP connections or network is slow';
    } else if (error.message && error.message.includes('Invalid login')) {
      errorType = 'Invalid Credentials';
      suggestion = 'Generate a new Gmail App Password and update EMAIL_PASS in Vercel';
    }

    res.status(500).json({
      success: false,
      error: 'SMTP test failed',
      details: {
        errorType,
        errorCode: error.code,
        errorMessage: error.message,
        suggestion,
        environment: {
          EMAIL_USER: process.env.EMAIL_USER ? 'SET' : 'NOT SET',
          EMAIL_PASS: process.env.EMAIL_PASS ? 'SET' : 'NOT SET',
          SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com (default)',
          SMTP_PORT: process.env.SMTP_PORT || '587 (default)'
        },
        timestamp: new Date().toISOString()
      }
    });
  }
}
