const nodemailer = require('nodemailer');

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
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const data = req.body;
    
    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.timeSlot) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: name, email, phone, and timeSlot are required' 
      });
    }

    // Validate availability
    if (!data.availability || data.availability.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please select at least one available date' 
      });
    }
    
    // Format availability dates
    const availabilityDates = Array.isArray(data.availability) 
      ? data.availability.join(', ') 
      : (data.availability || 'None selected');
    
    // Configure nodemailer with Gmail
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'summerworkshops25@gmail.com',
        pass: process.env.EMAIL_PASS || 'sxyv pyaw bvav kulh'
      }
    });
    
    // Create email content
    const emailSubject = 'Volunteer Application - My Purpose Summer Workshop';
    const emailBody = `
VOLUNTEER APPLICATION
====================

VOLUNTEER INFORMATION:
- Full Name: ${data.name}
- Phone Number: ${data.phone}
- Email Address: ${data.email}

AVAILABILITY:
- Available Dates: ${availabilityDates}
- Preferred Time Slot: ${data.timeSlot}

EXPERIENCE & INTERESTS:
- Experience with Children: ${data.experience || 'Not provided'}
- Activity Interests: ${data.activities || 'Not provided'}
- Motivation: ${data.motivation || 'Not provided'}

EMERGENCY CONTACT:
- Name: ${data.emergencyName || 'Not provided'}
- Phone: ${data.emergencyPhone || 'Not provided'}
- Relationship: ${data.emergencyRelationship || 'Not provided'}

WORKSHOP DETAILS:
- Event: My Purpose Summer Workshops
- Dates: June 17 - July 24, 2025
- Schedule: Every Tuesday & Thursday, 9:30 AM - 1:00 PM
- Location: 300 N Highland Ave, Tarpon Springs, FL 34688

Application submitted on: ${new Date().toLocaleString()}

For questions, contact: 727-637-3362
    `;

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER || 'summerworkshops25@gmail.com',
      to: 'summerworkshops25@gmail.com',
      subject: emailSubject,
      text: emailBody,
      html: emailBody.replace(/\n/g, '<br>'),
      replyTo: data.email // Allow direct replies to volunteer
    };

    // Send email
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ 
      success: true, 
      message: 'Volunteer application submitted successfully! We will contact you soon.'
    });
    
  } catch (error) {
    console.error('Error sending volunteer email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit volunteer application. Please try again or contact us at 727-637-3362.' 
    });
  }
}
