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
    
    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'summerworkshops25@gmail.com',
        pass: process.env.EMAIL_PASS || 'sxyv pyaw bvav kulh'
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

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER || 'summerworkshops25@gmail.com',
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
}