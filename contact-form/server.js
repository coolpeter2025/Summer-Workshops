const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configure nodemailer with Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'summerworkshops25@gmail.com',
    pass: process.env.EMAIL_PASS || 'sxyv pyaw bvav kulh'
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Serve the volunteer form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle volunteer application submission
app.post('/send-email', async (req, res) => {
  try {
    const { name, phone, email, timeSlot, availability, experience, activities } = req.body;
    
    // Validate required fields
    if (!name || !phone || !email || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }
    
    // Validate availability
    if (!availability || availability.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one available date'
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }
    
    // Format availability dates
    const availabilityList = Array.isArray(availability) ? availability.join(', ') : availability;
    
    // Create HTML email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 18px; font-weight: bold; color: #667eea; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 5px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; }
          .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border-left: 4px solid #667eea; }
          .availability-list { background: white; padding: 15px; border-radius: 4px; border: 1px solid #ddd; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🤝 New Volunteer Application</h2>
            <p>My Purpose Summer Workshops</p>
          </div>
          <div class="content">
            <div class="section">
              <div class="section-title">👤 Volunteer Information</div>
              <div class="field">
                <div class="label">Full Name:</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Phone Number:</div>
                <div class="value">${phone}</div>
              </div>
              <div class="field">
                <div class="label">Email Address:</div>
                <div class="value">${email}</div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">📅 Availability</div>
              <div class="field">
                <div class="label">Available Dates:</div>
                <div class="availability-list">${availabilityList}</div>
              </div>
              <div class="field">
                <div class="label">Preferred Time Slot:</div>
                <div class="value">${timeSlot}</div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">📝 Additional Information</div>
              <div class="field">
                <div class="label">Experience with Children:</div>
                <div class="value">${experience || 'Not provided'}</div>
              </div>
              <div class="field">
                <div class="label">Interested Activities:</div>
                <div class="value">${activities || 'Not provided'}</div>
              </div>
            </div>
            
            <div class="footer">
              <p><strong>Workshop Details:</strong></p>
              <p>Event: My Purpose Summer Workshops</p>
              <p>Dates: June 17 - July 24, 2025</p>
              <p>Location: 300 N Highland Ave, Tarpon Springs, FL 34688</p>
              <p>Age Group: Children ages 6-12</p>
              <hr style="margin: 15px 0;">
              <p>Application submitted on: ${new Date().toLocaleString()}</p>
              <p>You can reply directly to this email to contact ${name}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Create plain text version
    const textContent = `
NEW VOLUNTEER APPLICATION - MY PURPOSE SUMMER WORKSHOPS
======================================================

👤 VOLUNTEER INFORMATION:
- Full Name: ${name}
- Phone Number: ${phone}
- Email Address: ${email}

📅 AVAILABILITY:
- Available Dates: ${availabilityList}
- Preferred Time Slot: ${timeSlot}

📝 ADDITIONAL INFORMATION:
- Experience with Children: ${experience || 'Not provided'}
- Interested Activities: ${activities || 'Not provided'}

WORKSHOP DETAILS:
- Event: My Purpose Summer Workshops
- Dates: June 17 - July 24, 2025
- Schedule: Every Tuesday and Thursday, 9:30 AM - 1:00 PM
- Location: 300 N Highland Ave, Tarpon Springs, FL 34688
- Age Group: Children ages 6-12

---
Application submitted on: ${new Date().toLocaleString()}
Reply directly to this email to contact ${name}
    `;
    
    // Email options
    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER || 'summerworkshops25@gmail.com'}>`,
      to: process.env.RECIPIENT_EMAIL || 'summerworkshops25@gmail.com',
      replyTo: email,
      subject: `Volunteer Application: ${name} - My Purpose Summer Workshops`,
      text: textContent,
      html: htmlContent
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    console.log(`Volunteer application email sent from ${name} (${email})`);
    
    res.json({
      success: true,
      message: 'Your volunteer application has been submitted successfully! We\'ll review your application and contact you soon.'
    });
    
  } catch (error) {
    console.error('Error sending volunteer application email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application. Please try again later.'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Volunteer application server running on port ${PORT}`);
  console.log(`Access the volunteer form at: http://localhost:${PORT}`);
});
