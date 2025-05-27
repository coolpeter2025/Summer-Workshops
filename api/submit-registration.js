import nodemailer from 'nodemailer';

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

  try {
    const { data } = req.body;
    
    // Create email content
    const emailContent = `
SUMMER WORKSHOP REGISTRATION
============================

CHILD'S INFORMATION:
Full Name: ${data.childName}
Date of Birth: ${data.dateOfBirth}
Age: ${data.age} years old

CONTACT INFORMATION:
Address: ${data.street}, ${data.city}, ${data.state} ${data.zip}
Country: ${data.country}

PARENT/GUARDIAN INFORMATION:
Name: ${data.parent1Name}
Phone: ${data.parent1Phone}
Email: ${data.parent1Email}

MEDICAL INFORMATION:
Allergies: ${data.allergies}
Medical Conditions: ${data.medicalDetails}

WORKSHOP DETAILS:
Event: My Purpose Summer Workshops
Dates: June 17 - July 24, 2025
Schedule: Every Tuesday & Thursday, 9:30 AM - 1:00 PM
Location: 300 N Highland Ave, Tarpon Springs, FL 34688
Fee: $35.00

PAYMENT STATUS: Pending

Registration submitted on: ${new Date().toLocaleString()}

Remember: Child needs lunch box & water bottle daily!

For questions, contact: 727-637-3362
    `.trim();

    // Configure nodemailer transporter with SMTP
    const transporter = nodemailer.createTransporter({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'summerworkshops25@gmail.com',
        pass: 'sxyv pyaw bvav kulh'
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Send email
    await transporter.sendMail({
      from: 'summerworkshops25@gmail.com',
      to: 'summerworkshops25@gmail.com',
      subject: `Summer Workshop Registration - ${data.childName}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>')
    });

    res.status(200).json({ 
      success: true, 
      message: 'Registration submitted and email sent successfully'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Failed to process registration',
      fallbackEmail: {
        to: 'summerworkshops25@gmail.com',
        subject: 'Summer Workshop Registration - Error',
        body: 'There was an error processing the registration. Please contact us directly.'
      }
    });
  }
}
