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
    const data = req.body;
    
    // Validate required fields
    const requiredFields = ['volunteerName', 'volunteerPhone', 'volunteerEmail', 'timeSlot'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Check if at least one date is selected
    if (!data.availableDates || data.availableDates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one available date.'
      });
    }
    
    console.log('Processing volunteer application for:', data.volunteerName);
    
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

    // Format available dates
    const selectedDates = Array.isArray(data.availableDates) 
      ? data.availableDates.join(', ') 
      : data.availableDates || 'None selected';

    // Create email content
    const emailSubject = 'Volunteer Application - My Purpose Summer Workshop';
    const emailBody = `
VOLUNTEER APPLICATION
====================

VOLUNTEER INFORMATION:
- Full Name: ${data.volunteerName}
- Phone Number: ${data.volunteerPhone}
- Email Address: ${data.volunteerEmail}

AVAILABILITY:
- Available Dates: ${selectedDates}
- Preferred Time Slot: ${data.timeSlot}

ADDITIONAL INFORMATION:
- Experience with Children: ${data.volunteerExperience || 'Not provided'}
- Activity Interests: ${data.volunteerInterests || 'Not provided'}

WORKSHOP DETAILS:
- Event: My Purpose Summer Workshops
- Dates: June 17 - July 24, 2025
- Schedule: Every Tuesday & Thursday, 9:30 AM - 1:00 PM
- Location: 300 N Highland Ave, Tarpon Springs, FL 34688
- Age Group: Children ages 6-12

Application submitted on: ${new Date().toLocaleString()}

For questions, contact: 727-637-3362
    `;

    // Enhanced HTML email
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #10b981; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .section { margin-bottom: 20px; padding: 15px; border-left: 4px solid #10b981; background: #f0fdf4; }
        .section h3 { margin-top: 0; color: #10b981; }
        .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; }
        .highlight { background: #ecfdf5; border-left-color: #059669; }
        .dates { background: #fef3c7; border-left-color: #f59e0b; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🤝 New Volunteer Application</h1>
        <p>My Purpose Kids Summer Workshop - Volunteer Program</p>
    </div>
    
    <div class="content">
        <div class="section">
            <h3>👤 Volunteer Information</h3>
            <p><strong>Full Name:</strong> ${data.volunteerName}</p>
            <p><strong>Phone Number:</strong> ${data.volunteerPhone}</p>
            <p><strong>Email Address:</strong> ${data.volunteerEmail}</p>
        </div>

        <div class="section dates">
            <h3>📅 Availability</h3>
            <p><strong>Available Dates:</strong> ${selectedDates}</p>
            <p><strong>Preferred Time Slot:</strong> ${data.timeSlot}</p>
        </div>

        <div class="section">
            <h3>📝 Additional Information</h3>
            <p><strong>Experience with Children:</strong> ${data.volunteerExperience || 'Not provided'}</p>
            <p><strong>Activity Interests:</strong> ${data.volunteerInterests || 'Not provided'}</p>
        </div>

        <div class="section highlight">
            <h3>📅 Workshop Details</h3>
            <p><strong>Event:</strong> My Purpose Summer Workshops</p>
            <p><strong>Dates:</strong> June 17 - July 24, 2025</p>
            <p><strong>Schedule:</strong> Every Tuesday & Thursday</p>
            <p><strong>Time:</strong> 9:30 AM - 1:00 PM</p>
            <p><strong>Location:</strong> 300 N Highland Ave, Tarpon Springs, FL 34688</p>
            <p><strong>Age Group:</strong> Children ages 6-12</p>
        </div>
    </div>

    <div class="footer">
        <p>Application submitted on: ${new Date().toLocaleString()}</p>
        <p>For questions, contact: 727-637-3362</p>
        <p>Thank you for volunteering to make a difference in children's lives! 🌟</p>
    </div>
</body>
</html>
    `;

    const mailOptions = {
      from: {
        name: 'My Purpose Volunteer Program',
        address: process.env.EMAIL_USER || 'summerworkshops25@gmail.com'
      },
      to: 'summerworkshops25@gmail.com',
      subject: `${emailSubject} - ${data.volunteerName}`,
      text: emailBody,
      html: htmlBody
    };

    // Verify SMTP connection first
    await transporter.verify();
    console.log('SMTP connection verified for volunteer application');
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Volunteer application email sent successfully:', info.messageId);
    
    res.json({ 
      success: true, 
      message: 'Volunteer application submitted successfully! We will contact you soon.',
      volunteerName: data.volunteerName
    });
    
  } catch (error) {
    console.error('Volunteer application error details:', {
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack
    });
    
    // More specific error messages
    let errorMessage = 'Failed to submit volunteer application. Please try again.';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please contact support at 727-637-3362.';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Connection error. Please check your internet connection and try again.';
    } else if (error.message.includes('Invalid login')) {
      errorMessage = 'Email configuration error. Please contact support at 727-637-3362.';
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
