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
    
    const selectedDates = data.availableDates ? data.availableDates.join(', ') : 'None selected';
    
    // Create email content
    const emailContent = `
VOLUNTEER APPLICATION
====================

VOLUNTEER INFORMATION:
Name: ${data.volunteerName}
Phone: ${data.volunteerPhone}
Email: ${data.volunteerEmail}

AVAILABILITY:
Available Dates: ${selectedDates}
Preferred Time Slot: ${data.timeSlot}

ADDITIONAL INFORMATION:
Experience with Children: ${data.volunteerExperience || 'Not provided'}
Activity Interests: ${data.volunteerInterests || 'Not provided'}

WORKSHOP DETAILS:
Event: My Purpose Summer Workshops
Dates: June 17 - July 24, 2025
Schedule: Every Tuesday & Thursday, 9:30 AM - 1:00 PM
Location: 300 N Highland Ave, Tarpon Springs, FL 34688

Application submitted on: ${new Date().toLocaleString()}

For questions, contact: 727-637-3362
    `.trim();

    // In a real implementation, you would send this via email service
    console.log('Volunteer application received:', emailContent);
    
    res.status(200).json({ 
      success: true, 
      message: 'Volunteer application received successfully',
      fallbackEmail: {
        to: 'summerworkshops25@gmail.com',
        subject: `Volunteer Application - ${data.volunteerName}`,
        body: emailContent
      }
    });

  } catch (error) {
    console.error('Volunteer application error:', error);
    res.status(500).json({ 
      error: 'Failed to process volunteer application',
      fallbackEmail: {
        to: 'summerworkshops25@gmail.com',
        subject: 'Volunteer Application - Error',
        body: 'There was an error processing the volunteer application. Please contact us directly.'
      }
    });
  }
}
