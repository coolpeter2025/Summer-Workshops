const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  console.log('🚀 Volunteer API called at:', new Date().toISOString());
  console.log('📝 Request method:', req.method);
  console.log('📦 Request headers:', JSON.stringify(req.headers, null, 2));
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    console.log('✅ OPTIONS request handled');
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    console.log('❌ Invalid method:', req.method);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    console.log('📥 Raw request body:', JSON.stringify(req.body, null, 2));
    const data = req.body;
    
    console.log('🔍 Validating required fields...');
    console.log('- Name:', data.name ? '✅' : '❌');
    console.log('- Email:', data.email ? '✅' : '❌');
    console.log('- Phone:', data.phone ? '✅' : '❌');
    console.log('- Time Slot:', data.timeSlot ? '✅' : '❌');
    
    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.timeSlot) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: name, email, phone, and timeSlot are required' 
      });
    }

    console.log('📅 Checking availability:', data.availability);
    // Validate availability
    if (!data.availability || data.availability.length === 0) {
      console.log('❌ No availability selected');
      return res.status(400).json({ 
        success: false, 
        message: 'Please select at least one available date' 
      });
    }
    
    // Format availability dates
    const availabilityDates = Array.isArray(data.availability) 
      ? data.availability.join(', ') 
      : (data.availability || 'None selected');
    
    console.log('📅 Formatted availability:', availabilityDates);
    
    // Check environment variables
    console.log('🔐 Email configuration:');
    console.log('- EMAIL_USER env:', process.env.EMAIL_USER ? '✅ Set' : '❌ Not set');
    console.log('- EMAIL_PASS env:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Not set');
    console.log('- Using email:', process.env.EMAIL_USER || 'summerworkshops25@gmail.com');
    
    // Configure nodemailer with Gmail
    console.log('📧 Configuring nodemailer...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'summerworkshops25@gmail.com',
        pass: process.env.EMAIL_PASS || 'sxyv pyaw bvav kulh'
      }
    });
    
    // Test transporter configuration
    console.log('🔍 Verifying transporter...');
    try {
      await transporter.verify();
      console.log('✅ Transporter verified successfully');
    } catch (verifyError) {
      console.log('❌ Transporter verification failed:', verifyError.message);
      throw new Error(`Email configuration error: ${verifyError.message}`);
    }
    
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

    console.log('📮 Email options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      replyTo: mailOptions.replyTo
    });

    // Send email
    console.log('📤 Sending email...');
    const emailResult = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', emailResult.messageId);
    
    res.status(200).json({ 
      success: true, 
      message: 'Volunteer application submitted successfully! We will contact you soon.',
      debug: {
        messageId: emailResult.messageId,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error sending volunteer email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit volunteer application. Please try again or contact us at 727-637-3362.' 
    });
  }
}
