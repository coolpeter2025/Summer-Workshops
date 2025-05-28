const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'summerworkshops25@gmail.com',
    pass: process.env.EMAIL_PASS || 'sxyv pyaw bvav kulh'
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/submit-registration', async (req, res) => {
  try {
    const data = req.body;
    
    // Create email content
    const emailSubject = 'Summer Workshop Registration - Slavic Full Gospel Church';
    const emailBody = `
SUMMER WORKSHOP REGISTRATION
============================

CHILD'S INFORMATION:
- Full Name: ${data.childName}
- Date of Birth: ${data.dateOfBirth}
- Age: ${data.age}
- Gender: ${data.gender}
- Grade (Fall 2025): ${data.grade}

CONTACT INFORMATION:
- Address: ${data.address}
- City: ${data.city}
- State: ${data.state}
- ZIP Code: ${data.zip}
- Phone: ${data.phone}

PARENT/GUARDIAN INFORMATION:
- Parent 1 Name: ${data.parent1Name}
- Parent 1 Phone: ${data.parent1Phone}
- Parent 1 Email: ${data.parent1Email}
- Parent 2 Name: ${data.parent2Name || 'N/A'}
- Parent 2 Phone: ${data.parent2Phone || 'N/A'}
- Parent 2 Email: ${data.parent2Email || 'N/A'}

EMERGENCY CONTACT:
- Name: ${data.emergencyName}
- Phone: ${data.emergencyPhone}
- Relationship: ${data.emergencyRelationship}

MEDICAL INFORMATION:
- Allergies: ${data.hasAllergies === 'yes' ? data.allergies : 'None'}
- Medical Conditions: ${data.hasMedical === 'yes' ? data.medicalConditions : 'None'}

ADDITIONAL INFORMATION:
- Special Instructions: ${data.specialInstructions || 'None'}

PAYMENT STATUS: Pending ($35.00)

Registration submitted on: ${new Date().toLocaleString()}
    `;

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: 'summerworkshops25@gmail.com',
      subject: emailSubject,
      text: emailBody,
      html: emailBody.replace(/\n/g, '<br>')
    };

    // Send email
    await transporter.sendMail(mailOptions);
    
    res.json({ 
      success: true, 
      message: 'Registration submitted successfully!',
      paymentUrl: 'https://checkout.square.site/merchant/DB6RWNMMZ1ZZ6/checkout/VW35TFNYJLVMFXN4D5STESZQ?src=sheet'
    });
    
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit registration. Please try again.' 
    });
  }
});

// Handle volunteer form submission
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
