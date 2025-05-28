const nodemailer = require('nodemailer');

async function testGmail() {
  console.log('Testing Gmail SMTP configuration...');
  
  try {
    // Test the exact same configuration as the volunteer form
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'summerworkshops25@gmail.com',
        pass: 'sxyv pyaw bvav kulh'
      }
    });
    
    console.log('1. Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
    
    console.log('2. Sending test email...');
    const testEmail = {
      from: 'summerworkshops25@gmail.com',
      to: 'summerworkshops25@gmail.com',
      subject: 'Gmail Test - Volunteer Form',
      text: `
Gmail SMTP Test
===============

This is a test email to verify Gmail SMTP is working.

Test Details:
- Time: ${new Date().toLocaleString()}
- Configuration: service: 'gmail'
- From: summerworkshops25@gmail.com
- To: summerworkshops25@gmail.com

If you receive this email, the Gmail configuration is working!
      `
    };
    
    const info = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Gmail test failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('🔑 Authentication failed - check app password');
    } else if (error.code === 'ECONNECTION') {
      console.error('🌐 Connection failed - check internet/firewall');
    }
    
    return { success: false, error: error.message, code: error.code };
  }
}

// Run the test
testGmail().then(result => {
  console.log('\n=== TEST COMPLETE ===');
  if (result.success) {
    console.log('✅ Gmail is working! Check summerworkshops25@gmail.com for test email.');
  } else {
    console.log('❌ Gmail test failed:', result.error);
  }
  process.exit(result.success ? 0 : 1);
});
