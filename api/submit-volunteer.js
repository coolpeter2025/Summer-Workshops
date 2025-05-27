import nodemailer from 'nodemailer';

// Retry function for email sending
async function retryEmailSend(transporter, mailOptions, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Email send attempt ${attempt}/${maxRetries}`);
      const result = await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully on attempt ${attempt}:`, result.messageId);
      return result;
    } catch (error) {
      console.error(`Email send attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retry (exponential backoff)
      const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
      console.log(`Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();
  console.log('Volunteer application started at:', new Date().toISOString());

  try {
    const { data } = req.body;
    
    // Validate required fields
    if (!data || !data.volunteerName || !data.volunteerEmail || !data.timeSlot) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Volunteer name, email, and time slot are required'
      });
    }

    console.log('Processing volunteer application for:', data.volunteerName);
    
    const selectedDates = data.availableDates ? data.availableDates.join(', ') : 'None selected';
    
    // Create email content
    const emailContent = `
VOLUNTEER APPLICATION
====================

VOLUNTEER INFORMATION:
Name: ${data.volunteerName}
Phone: ${data.volunteerPhone}
Email: ${data.volunteerEmail}

AVAILABILITY:
Available Dates: ${selectedDates}
Preferred Time Slot: ${data.timeSlot}

ADDITIONAL INFORMATION:
Experience with Children: ${data.volunteerExperience || 'Not provided'}
Activity Interests: ${data.volunteerInterests || 'Not provided'}

WORKSHOP DETAILS:
Event: My Purpose Summer Workshops
Dates: June 17 - July 24, 2025
Schedule: Every Tuesday & Thursday, 9:30 AM - 1:00 PM
Location: 300 N Highland Ave, Tarpon Springs, FL 34688

Application submitted on: ${new Date().toLocaleString()}

For questions, contact: 727-637-3362
    `.trim();

    // Log environment check
    const envStatus = {
      EMAIL_USE: process.env.EMAIL_USE ? 'SET' : 'FALLBACK',
      EMAIL_PASS: process.env.EMAIL_PASS ? 'SET' : 'FALLBACK',
      SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com (default)',
      SMTP_PORT: process.env.SMTP_PORT || '587 (default)'
    };
    console.log('Environment status:', envStatus);

    // Configure nodemailer transporter with enhanced settings
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USE || 'summerworkshops25@gmail.com',
        pass: process.env.EMAIL_PASS || 'sxyv pyaw bvav kulh'
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
      },
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000,   // 30 seconds
      socketTimeout: 60000,     // 60 seconds
      debug: false,             // Set to true for debugging
      logger: false             // Set to true for debugging
    });

    console.log('Testing SMTP connection...');
    
    // Verify connection configuration with timeout
    const verifyPromise = transporter.verify();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection verification timeout')), 30000)
    );
    
    await Promise.race([verifyPromise, timeoutPromise]);
    console.log('SMTP connection verified successfully');

    // Prepare email options
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'summerworkshops25@gmail.com',
      to: process.env.EMAIL_TO || 'summerworkshops25@gmail.com',
      subject: `Volunteer Application - ${data.volunteerName}`,
      text: emailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Volunteer Application</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
            ${emailContent.replace(/\n/g, '<br>')}
          </div>
        </div>
      `
    };

    console.log('Sending volunteer application email...');
    
    // Send email with retry logic
    const emailResult = await retryEmailSend(transporter, mailOptions);
    
    const processingTime = Date.now() - startTime;
    console.log(`Volunteer application processed successfully in ${processingTime}ms`);

    res.status(200).json({ 
      success: true, 
      message: 'Volunteer application submitted and email sent successfully',
      details: {
        messageId: emailResult.messageId,
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('Volunteer application error:', error);
    
    // Detailed error analysis
    let errorType = 'Unknown Error';
    let userMessage = 'Failed to process volunteer application';
    let suggestion = 'Please try again or contact us directly';
    
    if (error.code === 'EAUTH') {
      errorType = 'Authentication Failed';
      userMessage = 'Email service authentication failed';
      suggestion = 'Please contact us directly at 727-637-3362';
    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      errorType = 'Connection Failed';
      userMessage = 'Email service temporarily unavailable';
      suggestion = 'Please try again in a few minutes or contact us at 727-637-3362';
    } else if (error.message.includes('timeout')) {
      errorType = 'Timeout';
      userMessage = 'Request timed out';
      suggestion = 'Please try again or contact us at 727-637-3362';
    }

    res.status(500).json({ 
      error: userMessage,
      errorType,
      suggestion,
      fallbackEmail: {
        to: 'summerworkshops25@gmail.com',
        subject: `Volunteer Application - ${req.body?.data?.volunteerName || 'Unknown'}`,
        body: 'There was an error processing the volunteer application. Please contact us directly at 727-637-3362.'
      },
      details: {
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString(),
        errorCode: error.code || 'UNKNOWN'
      }
    });
  }
}
