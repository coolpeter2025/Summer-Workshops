const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    console.log('Testing email configuration...');
    
    // Configure Gmail SMTP
    const transporter = nodemailer.createTransporter({
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

    // Test email content
    const testEmailBody = `
EMAIL CONFIGURATION TEST
========================

This is a test email to verify the email configuration is working properly.

Test Details:
- Timestamp: ${new Date().toLocaleString()}
- Server: ${req.headers.host || 'Unknown'}
- User Agent: ${req.headers['user-agent'] || 'Unknown'}

If you receive this email, the configuration is working correctly!

For questions, contact: 727-637-3362
    `;

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #6366f1; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .section { margin-bottom: 20px; padding: 15px; border-left: 4px solid #6366f1; background: #f8fafc; }
        .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; }
        .success { background: #f0fdf4; border-left-color: #10b981; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧪 Email Configuration Test</h1>
        <p>Summer Workshop Email System Test</p>
    </div>
    
    <div class="content">
        <div class="section success">
            <h3>✅ Test Email Successful</h3>
            <p>This email confirms that the email configuration is working properly.</p>
        </div>

        <div class="section">
            <h3>📊 Test Details</h3>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Server:</strong> ${req.headers.host || 'Unknown'}</p>
            <p><strong>User Agent:</strong> ${req.headers['user-agent'] || 'Unknown'}</p>
        </div>
    </div>

    <div class="footer">
        <p>If you receive this email, both registration and volunteer forms should work properly!</p>
        <p>For questions, contact: 727-637-3362</p>
    </div>
</body>
</html>
    `;

    const mailOptions = {
      from: {
        name: 'Summer Workshop Email Test',
        address: process.env.EMAIL_USER || 'summerworkshops25@gmail.com'
      },
      to: 'summerworkshops25@gmail.com',
      subject: 'Email Configuration Test - Summer Workshop',
      text: testEmailBody,
      html: htmlBody
    };

    // Verify SMTP connection first
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('SMTP connection verified successfully');
    
    // Send test email
    console.log('Sending test email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Test email sent successfully:', info.messageId);
    
    res.json({ 
      success: true, 
      message: 'Test email sent successfully!',
      messageId: info.messageId,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Email test error:', {
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack
    });
    
    // Detailed error response
    let errorMessage = 'Email test failed.';
    let errorDetails = {};
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Authentication failed. Check email credentials.';
      errorDetails.issue = 'Invalid email or password';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Connection failed. Check internet connection.';
      errorDetails.issue = 'Network connectivity problem';
    } else if (error.message.includes('Invalid login')) {
      errorMessage = 'Login failed. Check app password.';
      errorDetails.issue = 'App password may be incorrect';
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      error: error.message,
      code: error.code,
      details: errorDetails,
      timestamp: new Date().toISOString()
    });
  }
}
