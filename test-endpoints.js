const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

// Test what endpoints are available
const app = express();

// Add the same middleware as server.js
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// Configure nodemailer with Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'summerworkshops25@gmail.com',
    pass: 'sxyv pyaw bvav kulh'
  }
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

// Add the volunteer endpoint with full email functionality
app.post('/api/volunteer-submit', async (req, res) => {
  try {
    const data = req.body;
    
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
    
    // Format selected dates
    const selectedDates = Array.isArray(data.dates) ? data.dates.join(', ') : data.dates;
    
    // Create email content
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
    
    // Email options
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
    
    res.json({ 
      success: true, 
      message: 'Volunteer application submitted successfully!',
      volunteer: data.name
    });
    
  } catch (error) {
    console.error('Volunteer form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit application. Please try again or call 727-637-3362'
    });
  }
});

// List all routes
app.get('/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach(function(r){
    if (r.route && r.route.path){
      routes.push({
        method: Object.keys(r.route.methods)[0].toUpperCase(),
        path: r.route.path
      });
    }
  });
  res.json({ routes });
});

const PORT = 3001; // Use different port to avoid conflict

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT}/routes to see available endpoints`);
  console.log(`Test volunteer endpoint: curl -X POST http://localhost:${PORT}/api/volunteer-submit -H "Content-Type: application/json" -d '{"name":"test"}'`);
});
