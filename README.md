# My Purpose Kids Summer Workshop

A comprehensive website for the My Purpose Kids Summer Workshop registration and volunteer application system with Gmail SMTP integration using Nodemailer.

## 🚀 Features

- **Registration Form**: Complete child registration with parental consent
- **Volunteer Application**: Volunteer signup with availability scheduling
- **Email Integration**: Gmail SMTP with Nodemailer for form submissions
- **Enhanced Error Handling**: Retry logic, timeouts, and detailed error reporting
- **User-Friendly Interface**: Loading states, success/error notifications
- **Responsive Design**: Mobile-friendly layout
- **SMTP Testing**: Dedicated endpoint for diagnosing email issues

## 📧 Email Configuration

### Gmail SMTP Setup

The application uses Gmail SMTP with App Passwords for secure email delivery.

#### Required Environment Variables

Set these in your Vercel dashboard under Project Settings > Environment Variables:

```
EMAIL_USE=summerworkshops25@gmail.com
EMAIL_PASS=your_app_password_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_FROM=summerworkshops25@gmail.com
EMAIL_TO=summerworkshops25@gmail.com
```

#### Gmail App Password Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account Settings > Security > App Passwords
3. Generate a new app password for "Mail"
4. Use this 16-character password (with spaces) as `EMAIL_PASS`

## 🛠️ API Endpoints

### Form Submission Endpoints

- **POST** `/api/submit-registration` - Process registration forms
- **POST** `/api/submit-volunteer` - Process volunteer applications
- **GET/POST** `/api/test-smtp` - Test SMTP connectivity and configuration

### SMTP Test Endpoint

Access `/api/test-smtp` to diagnose email issues:

```bash
curl https://your-domain.vercel.app/api/test-smtp
```

This endpoint will:
- Check environment variable configuration
- Test SMTP connection to Gmail
- Send a test email
- Return detailed error information if issues occur

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Forms Not Submitting

**Symptoms**: Forms show loading state but never complete

**Possible Causes**:
- Missing environment variables in Vercel
- Expired Gmail App Password
- Gmail blocking connections

**Solutions**:
1. Check Vercel environment variables are set correctly
2. Generate a new Gmail App Password
3. Test SMTP connection using `/api/test-smtp`

#### 2. Authentication Errors (EAUTH)

**Error**: `Authentication Failed` or `Invalid login`

**Solutions**:
1. Verify Gmail App Password is correct
2. Ensure 2FA is enabled on Gmail account
3. Generate a fresh App Password
4. Check that EMAIL_USE matches the Gmail account

#### 3. Connection Timeouts (ETIMEDOUT)

**Error**: `Connection timeout` or `ETIMEDOUT`

**Solutions**:
1. Check network connectivity
2. Verify SMTP_HOST and SMTP_PORT settings
3. Try again later (temporary network issues)
4. Contact hosting provider about SMTP restrictions

#### 4. Environment Variables Not Set

**Error**: Environment variables showing as "NOT SET" in test endpoint

**Solutions**:
1. Add variables in Vercel Dashboard:
   - Go to Project Settings > Environment Variables
   - Add each required variable
   - Redeploy the project
2. Ensure variable names match exactly (case-sensitive)

### Error Codes Reference

| Error Code | Description | Solution |
|------------|-------------|----------|
| `EAUTH` | Authentication failed | Check Gmail App Password |
| `ECONNECTION` | Connection failed | Check network/SMTP settings |
| `ETIMEDOUT` | Connection timeout | Retry or check network |
| `ENOTFOUND` | SMTP host not found | Verify SMTP_HOST setting |

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Set Environment Variables**: Add all required email variables
3. **Deploy**: Vercel will automatically deploy on push to main branch

### Environment Variables Setup

In Vercel Dashboard:
1. Go to Project Settings
2. Click Environment Variables
3. Add each variable:
   - `EMAIL_USE`: Gmail address
   - `EMAIL_PASS`: Gmail App Password
   - `SMTP_HOST`: smtp.gmail.com
   - `SMTP_PORT`: 587
   - `EMAIL_FROM`: Sender email
   - `EMAIL_TO`: Recipient email

### Testing Deployment

After deployment:
1. Visit `/api/test-smtp` to verify email configuration
2. Test both registration and volunteer forms
3. Check Vercel function logs for any errors

## 📁 Project Structure

```
├── api/
│   ├── submit-registration.js    # Registration form handler
│   ├── submit-volunteer.js       # Volunteer form handler
│   └── test-smtp.js             # SMTP testing endpoint
├── index.html                   # Main website
├── package.json                 # Dependencies
├── vercel.json                  # Vercel configuration
├── .env.example                 # Environment variables template
└── README.md                    # This file
```

## 🔍 Monitoring and Logs

### Vercel Function Logs

Monitor email delivery in Vercel:
1. Go to Vercel Dashboard > Functions
2. Click on any API function
3. View real-time logs and errors

### Email Delivery Confirmation

Successful submissions include:
- Message ID in response
- Processing time
- Timestamp
- Environment status

## 🛡️ Security Features

- **CORS Protection**: Proper CORS headers
- **Input Validation**: Required field validation
- **Spam Protection**: Honeypot fields
- **Rate Limiting**: Built-in Vercel function limits
- **Secure SMTP**: TLS encryption for email

## 📞 Support

For technical issues:
- Check `/api/test-smtp` endpoint first
- Review Vercel function logs
- Verify environment variables
- Contact: 727-637-3362

## 🔄 Updates and Maintenance

### Regular Maintenance Tasks

1. **Monitor Gmail App Password**: Regenerate if expired
2. **Check Form Submissions**: Verify emails are being received
3. **Update Dependencies**: Keep Nodemailer updated
4. **Test SMTP Connection**: Regular connectivity checks

### Version History

- **v1.0**: Initial release with basic form submission
- **v1.1**: Added enhanced error handling and retry logic
- **v1.2**: Implemented SMTP testing endpoint
- **v1.3**: Added comprehensive user feedback and loading states

## 📄 License

MIT License - See LICENSE file for details

---

**Workshop Information**:
- **Event**: My Purpose Summer Workshops
- **Dates**: June 17 - July 24, 2025
- **Schedule**: Every Tuesday & Thursday, 9:30 AM - 1:00 PM
- **Location**: 300 N Highland Ave, Tarpon Springs, FL 34688
- **Contact**: 727-637-3362
