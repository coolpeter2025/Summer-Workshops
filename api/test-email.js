const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Configure Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.EMAIL_USER || 'summerworkshops25@gmail.com',
        pass: process.env.EMAIL_PASS || 'sxyv pyaw bvav kulh'
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Test SMTP connection
    const isConnected = await transporter.verify();
    
    if (isConnected) {
      // Send test email
      const testEmail = {
        from: {
          name: 'My Purpose Summer Workshop - Test',
          address: process.env.EMAIL_USER || 'summerworkshops25@gmail.com'
        },
        to: 'summerworkshops25@gmail.com',
        subject: 'Email Configuration Test - Summer Workshop',
        html: `
          <h2>✅ Email Configuration Test Successful</h2>
          <p>This is a test email to verify that Gmail SMTP is working correctly.</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'production'}</p>
          <p><strong>User:</strong> ${process.env.EMAIL_USER || 'summerworkshops25@gmail.com'}</p>
          <hr>
          <p><small>If you receive this email, the configuration is working properly!</small></p>
        `
      };

      const info = await transporter.sendMail(testEmail);
      
      res.json({
        success: true,
        message: 'Email configuration test successful!',
        details: {
          connected: true,
          messageId: info.messageId,
          timestamp: new Date().toISOString(),
          emailUser: process.env.EMAIL_USER || 'summerworkshops25@gmail.com'
        }
      });
    } else {
      throw new Error('SMTP connection failed');
    }
    
  } catch (error) {
    console.error('Email test failed:', error);
    
    res.status(500).json({
      success: false,
      message: 'Email configuration test failed',
      error: error.message,
      details: {
        connected: false,
        timestamp: new Date().toISOString(),
        errorCode: error.code
      }
    });
  }
}