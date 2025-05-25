const nodemailer = require('nodemailer');

export default async function handler(req, res) {
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
    const requiredFields = ['childName', 'dateOfBirth', 'age', 'street', 'city', 'state', 'zip', 'parent1Name', 'parent1Email', 'parent1Phone'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Validate age range
    const age = parseInt(data.age);
    if (age < 6 || age > 12) {
      return res.status(400).json({
        success: false,
        message: 'Age must be between 6 and 12 years. For other ages, please contact 727-637-3362.'
      });
    }
    
    console.log('Processing registration for:', data.childName, 'Age:', data.age);
    
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

    // Create email content
    const emailSubject = 'Summer Workshop Registration - Slavic Full Gospel Church';
    const emailBody = `
SUMMER WORKSHOP REGISTRATION
============================

CHILD'S INFORMATION:
- Full Name: ${data.childName}
- Date of Birth: ${data.dateOfBirth}
- Age: ${data.age}
- Gender: ${data.gender || 'Not specified'}
- Grade (Fall 2025): ${data.grade || 'Not specified'}

CONTACT INFORMATION:
- Address: ${data.address}
- City: ${data.city}
- State: ${data.state}
- ZIP Code: ${data.zip}
- Phone: ${data.phone || 'Not provided'}

PARENT/GUARDIAN INFORMATION:
- Parent 1 Name: ${data.parent1Name}
- Parent 1 Phone: ${data.parent1Phone}
- Parent 1 Email: ${data.parent1Email}
- Parent 2 Name: ${data.parent2Name || 'N/A'}
- Parent 2 Phone: ${data.parent2Phone || 'N/A'}
- Parent 2 Email: ${data.parent2Email || 'N/A'}

EMERGENCY CONTACT:
- Name: ${data.emergencyName || 'Not provided'}
- Phone: ${data.emergencyPhone || 'Not provided'}
- Relationship: ${data.emergencyRelationship || 'Not provided'}

MEDICAL INFORMATION:
- Allergies: ${data.hasAllergies === 'yes' ? data.allergies : 'None'}
- Medical Conditions: ${data.hasMedical === 'yes' ? data.medicalConditions : 'None'}

ADDITIONAL INFORMATION:
- Special Instructions: ${data.specialInstructions || 'None'}

PAYMENT STATUS: Pending ($35.00)

Registration submitted on: ${new Date().toLocaleString()}
    `;

    // Enhanced email options with proper formatting
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
        .section h3 { margin-top: 0; color: #6366f1; }
        .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; }
        .important { background: #fef3c7; border-left-color: #f59e0b; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 New Summer Workshop Registration</h1>
        <p>Slavic Full Gospel Church - My Purpose Kids Summer Workshop</p>
    </div>
    
    <div class="content">
        <div class="section">
            <h3>👶 Child Information</h3>
            <p><strong>Full Name:</strong> ${data.childName}</p>
            <p><strong>Date of Birth:</strong> ${data.dateOfBirth}</p>
            <p><strong>Age:</strong> ${data.age} years old</p>
            <p><strong>Gender:</strong> ${data.gender || 'Not specified'}</p>
            <p><strong>Grade (Fall 2025):</strong> ${data.grade || 'Not specified'}</p>
        </div>

        <div class="section">
            <h3>📍 Contact Information</h3>
            <p><strong>Address:</strong> ${data.address}</p>
            <p><strong>City:</strong> ${data.city}</p>
            <p><strong>State:</strong> ${data.state}</p>
            <p><strong>ZIP Code:</strong> ${data.zip}</p>
            <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
        </div>

        <div class="section">
            <h3>👨‍👩‍👧‍👦 Parent/Guardian Information</h3>
            <h4>Parent/Guardian #1:</h4>
            <p><strong>Name:</strong> ${data.parent1Name}</p>
            <p><strong>Phone:</strong> ${data.parent1Phone}</p>
            <p><strong>Email:</strong> ${data.parent1Email}</p>
            
            ${data.parent2Name ? `
            <h4>Parent/Guardian #2:</h4>
            <p><strong>Name:</strong> ${data.parent2Name}</p>
            <p><strong>Phone:</strong> ${data.parent2Phone || 'Not provided'}</p>
            <p><strong>Email:</strong> ${data.parent2Email || 'Not provided'}</p>
            ` : '<p><em>No second parent/guardian provided</em></p>'}
        </div>

        ${data.emergencyName ? `
        <div class="section">
            <h3>🚨 Emergency Contact</h3>
            <p><strong>Name:</strong> ${data.emergencyName}</p>
            <p><strong>Phone:</strong> ${data.emergencyPhone}</p>
            <p><strong>Relationship:</strong> ${data.emergencyRelationship}</p>
        </div>
        ` : ''}

        <div class="section important">
            <h3>🏥 Medical Information</h3>
            <p><strong>Allergies:</strong> ${data.hasAllergies === 'yes' ? data.allergies || 'Specified but details not provided' : 'None reported'}</p>
            <p><strong>Medical Conditions:</strong> ${data.hasMedical === 'yes' ? data.medicalConditions || 'Specified but details not provided' : 'None reported'}</p>
            ${data.specialInstructions ? `<p><strong>Special Instructions:</strong> ${data.specialInstructions}</p>` : ''}
        </div>

        <div class="section">
            <h3>📅 Workshop Details</h3>
            <p><strong>Event:</strong> My Purpose Summer Workshops</p>
            <p><strong>Dates:</strong> June 17 - July 24, 2025</p>
            <p><strong>Schedule:</strong> Every Tuesday & Thursday</p>
            <p><strong>Time:</strong> 9:30 AM - 1:00 PM</p>
            <p><strong>Location:</strong> 300 N Highland Ave, Tarpon Springs, FL 34688</p>
            <p><strong>Fee:</strong> $35.00</p>
        </div>

        <div class="section important">
            <h3>💳 Payment Status</h3>
            <p><strong>Status:</strong> PENDING</p>
            <p><strong>Amount Due:</strong> $35.00</p>
            <p><em>Payment link provided to parent during registration</em></p>
        </div>
    </div>

    <div class="footer">
        <p>Registration submitted on: ${new Date().toLocaleString()}</p>
        <p>For questions, contact: 727-637-3362</p>
        <p>Remember: Child needs lunch box & water bottle daily!</p>
    </div>
</body>
</html>
    `;

    const mailOptions = {
      from: {
        name: 'My Purpose Summer Workshop',
        address: process.env.EMAIL_USER || 'summerworkshops25@gmail.com'
      },
      to: 'summerworkshops25@gmail.com',
      subject: `${emailSubject} - ${data.childName}`,
      text: emailBody,
      html: htmlBody
    };

    // Verify SMTP connection first
    await transporter.verify();
    console.log('SMTP connection verified');
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    res.json({ 
      success: true, 
      message: 'Registration submitted successfully!',
      paymentUrl: 'https://checkout.square.site/merchant/DB6RWNMMZ1ZZ6/checkout/VW35TFNYJLVMFXN4D5STESZQ?src=sheet'
    });
    
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack
    });
    
    // More specific error messages
    let errorMessage = 'Failed to submit registration. Please try again.';
    
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