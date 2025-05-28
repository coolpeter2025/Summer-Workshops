const nodemailer = require('nodemailer');

async function testVolunteerEmail() {
    console.log('🧪 Testing Volunteer Email System...');
    console.log('📧 Email: summerworkshops25@gmail.com');
    console.log('🔑 App Password: sxyv pyaw bvav kulh');
    
    try {
        // Configure nodemailer with Gmail
        console.log('📧 Configuring nodemailer...');
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'summerworkshops25@gmail.com',
                pass: 'sxyv pyaw bvav kulh'
            }
        });
        
        // Test transporter configuration
        console.log('🔍 Verifying transporter...');
        await transporter.verify();
        console.log('✅ Transporter verified successfully');
        
        // Test volunteer data
        const testData = {
            name: 'Test Volunteer',
            email: 'test@example.com',
            phone: '555-123-4567',
            availability: ['Tuesday, June 17', 'Thursday, June 19'],
            timeSlot: '9:30 AM - 1:00 PM (Full Day)',
            experience: 'I have experience working with children at summer camps.',
            activities: 'Arts & crafts, outdoor activities, reading'
        };
        
        // Format availability dates
        const availabilityDates = Array.isArray(testData.availability) 
            ? testData.availability.join(', ') 
            : (testData.availability || 'None selected');
        
        // Create email content
        const emailSubject = 'Volunteer Application - My Purpose Summer Workshop';
        const emailBody = `
VOLUNTEER APPLICATION
====================

VOLUNTEER INFORMATION:
- Full Name: ${testData.name}
- Phone Number: ${testData.phone}
- Email Address: ${testData.email}

AVAILABILITY:
- Available Dates: ${availabilityDates}
- Preferred Time Slot: ${testData.timeSlot}

EXPERIENCE & INTERESTS:
- Experience with Children: ${testData.experience || 'Not provided'}
- Activity Interests: ${testData.activities || 'Not provided'}

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
            from: 'summerworkshops25@gmail.com',
            to: 'summerworkshops25@gmail.com',
            subject: emailSubject,
            text: emailBody,
            html: emailBody.replace(/\n/g, '<br>'),
            replyTo: testData.email
        };

        console.log('📮 Email options:', {
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject,
            replyTo: mailOptions.replyTo
        });

        // Send email
        console.log('📤 Sending test volunteer email...');
        const emailResult = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully!');
        console.log('📧 Message ID:', emailResult.messageId);
        console.log('🎯 Email sent to: summerworkshops25@gmail.com');
        
        return {
            success: true,
            messageId: emailResult.messageId,
            timestamp: new Date().toISOString()
        };
        
    } catch (error) {
        console.error('❌ Error sending volunteer email:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Run the test
testVolunteerEmail()
    .then(result => {
        console.log('\n🏁 Test Result:', result);
        if (result.success) {
            console.log('\n🎉 SUCCESS! Volunteer email system is working correctly!');
            console.log('📧 Check summerworkshops25@gmail.com for the test email');
        } else {
            console.log('\n❌ FAILED! Email system needs debugging');
        }
    })
    .catch(error => {
        console.error('\n💥 Test failed with error:', error);
    });
