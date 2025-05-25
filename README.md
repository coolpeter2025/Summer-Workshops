# Summer Workshop Registration System

A complete registration system for Slavic Full Gospel Church Summer Workshops with automated email notifications and Square payment integration.

## Features

- ✅ Complete registration form with validation
- 📧 Automated email notifications using Nodemailer
- 💳 Square payment integration ($35.00 fee)
- 📱 Responsive design for all devices
- 🔒 Form validation and error handling

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Email Settings
1. Copy `.env.example` to `.env`
2. Update the email credentials:
```env
EMAIL_USER=summerworkshops25@gmail.com
EMAIL_PASS=your-gmail-app-password
PORT=3000
```

### 3. Gmail App Password Setup
To send emails through Gmail, you need to:
1. Enable 2-factor authentication on the Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in the `.env` file

### 4. Start the Server
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## Usage

1. Visit `http://localhost:3000`
2. Fill out the registration form
3. Submit - email will be automatically sent to `summerworkshops25@gmail.com`
4. Complete payment through Square checkout
5. Registration complete!

## Workshop Details

- **Event**: My Purpose Summer Workshops
- **Dates**: June 17, 19, 24, 26. July 1, 3, 8, 10, 15, 17, 22, 24
- **Time**: Tuesday & Thursday, 9:30 AM - 1:00 PM
- **Location**: 300 N Highland Ave, Tarpon Springs, FL 34688
- **Fee**: $35.00

## Contact

For questions: 727-637-3362