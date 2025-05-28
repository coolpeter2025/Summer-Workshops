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
    // Parse form data
    const data = {};
    
    // Handle both JSON and form data
    if (req.headers['content-type']?.includes('application/json')) {
      Object.assign(data, req.body);
    } else {
      // Parse form data from body
      const body = req.body;
      for (const [key, value] of Object.entries(body)) {
        if (key === 'dates') {
          // Handle multiple checkbox values
          data.dates = Array.isArray(value) ? value : [value];
        } else {
          data[key] = value;
        }
      }
    }
    
    console.log('Volunteer form data received:', data);
    
    // Validate required fields
    if (!data.name || !data.phone || !data.email || !data.timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, phone, email, or timeSlot'
      });
    }
    
    // Validate at least one date is selected
    if (!data.dates || data.dates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one available date'
      });
    }
    
    // Configure Gmail SMTP (simple and direct)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'summerworkshops25@gmail.com',
        pass: 'sxyv pyaw bvav kulh'
      }
    });
    
    // Format selected dates
    const selectedDates = Array.isArray(data.dates) ? data.dates.join(', ') : data.dates;
    
    // Create simple email content
    const emailSubject = `Volunteer Application - ${data.name}`;
    const emailBody = `
NEW VOLUNTEER APPLICATION
========================

VOLUNTEER INFORMATION:
Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email}

AVAILABILITY:
Available Dates: ${selectedDates}
Preferred Time: ${data.timeSlot}

ADDITIONAL INFORMATION:
Experience with Children: ${data.experience || 'Not provided'}
Activity Interests: ${data.interests || 'Not provided'}

WORKSHOP DETAILS:
Event: My Purpose Summer Workshops
Dates: June 17 - July 24, 2025
Schedule: Every Tuesday & Thursday, 9:30 AM - 1:00 PM
Location: 300 N Highland Ave, Tarpon Springs, FL 34688

Submitted: ${new Date().toLocaleString()}
Contact: 727-637-3362
    `;
    
    // Simple email options
    const mailOptions = {
      from: 'summerworkshops25@gmail.com',
      to: 'summerworkshops25@gmail.com',
      subject: emailSubject,
      text: emailBody
    };
    
    // Send email
    console.log('Sending volunteer email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Volunteer email sent:', info.messageId);
    
    // Success response
    res.json({ 
      success: true, 
      message: 'Volunteer application submitted successfully!',
      volunteer: data.name
    });
    
  } catch (error) {
    console.error('Volunteer form error:', error);
    
    // Simple error response
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit application. Please try again or call 727-637-3362'
    });
  }
}
