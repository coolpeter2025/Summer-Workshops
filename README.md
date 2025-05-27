# My Purpose Kids Summer Workshop

A professional website for My Purpose Kids Summer Workshop with Vercel serverless functions for form handling and email notifications.

## Features

- 🎨 **Beautiful Design** - Modern, responsive website with Christ-centered content
- 📧 **Email Integration** - Real email sending via SMTP for form submissions
- ⚡ **Serverless Functions** - Vercel-powered API endpoints for form processing
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🔒 **Secure Forms** - Proper validation and error handling

## Deployment on Vercel

### 1. Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import from GitHub: `https://github.com/coolpeter2025/Summer-Workshop-2`

### 2. Configure Environment Variables
In Vercel project settings, add these environment variables:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=summerworkshops25@gmail.com
SMTP_PASS=sxyv pyaw bvav kulh
EMAIL_FROM=summerworkshops25@gmail.com
EMAIL_TO=summerworkshops25@gmail.com
```

### 3. Deploy
- Vercel will automatically deploy from the main branch
- Forms will send emails to `summerworkshops25@gmail.com`
- Website will be live at your Vercel domain

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## API Endpoints

- `POST /api/submit-registration` - Handle registration form submissions
- `POST /api/submit-volunteer` - Handle volunteer form submissions

## Email Configuration

The project uses **Gmail SMTP with Google App Password** for secure email delivery:

- **Email Provider:** Gmail (Google)
- **Host:** smtp.gmail.com
- **Port:** 587 (STARTTLS)
- **Authentication:** Google App Password (NOT regular Gmail password)
- **Security:** TLS encryption
- **Account:** summerworkshops25@gmail.com
- **App Password:** sxyv pyaw bvav kulh

### Important Notes:
- This uses a **Google App Password**, not the regular Gmail password
- App passwords are required when 2-factor authentication is enabled
- The app password is specifically generated for this application

## Form Features

### Registration Form
- Child information collection
- Parent/guardian details
- Medical information and allergies
- Consent and liability agreements
- Email confirmation to organizers

### Volunteer Form
- Volunteer contact information
- Availability selection
- Experience and interests
- Email notification to organizers

## Technical Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Vercel Serverless Functions (Node.js)
- **Email:** Nodemailer with Gmail SMTP
- **Deployment:** Vercel
- **Version Control:** Git/GitHub

## Support

For technical issues or questions:
- Email: summerworkshops25@gmail.com
- Phone: 727-637-3362

## License

MIT License - See LICENSE file for details.
