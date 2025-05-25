# Summer Workshop Registration System

A complete registration system for Slavic Full Gospel Church Summer Workshops with automated email notifications and Square payment integration. Optimized for Vercel deployment.

## Features

- ✅ Complete registration form with inline validation and messaging
- 📧 **Multiple email options**: Vercel API + mailto fallback + FormSubmit standalone
- 💳 Square payment integration ($35.00 fee)
- 📱 Responsive design for all devices
- 🔒 Age validation (6-12 years) with contact info for other ages
- 🎯 Two-step process: Registration → Payment
- ⚡ Works anywhere: Vercel, GitHub Pages, or any web host

## Vercel Deployment

### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/coolpeter2025/Summer-Workshops)

### Manual Deployment
1. Fork this repository
2. Connect your Vercel account to GitHub
3. Import the project in Vercel
4. Add environment variables in Vercel dashboard:
   - `EMAIL_USER`: summerworkshops25@gmail.com
   - `EMAIL_PASS`: (Gmail app password)
5. Deploy!

### Environment Variables for Vercel
**IMPORTANT:** Add these in your Vercel dashboard (Settings → Environment Variables):

| Variable | Value |
|----------|--------|
| `EMAIL_USER` | `summerworkshops25@gmail.com` |
| `EMAIL_PASS` | `sxyv pyaw bvav kulh` |

**Note:** Do NOT put credentials in vercel.json - always use the dashboard!

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local`:
```env
EMAIL_USER=summerworkshops25@gmail.com
EMAIL_PASS=sxyv pyaw bvav kulh
```

### 3. Start Development Server
```bash
npm run dev
```

For testing the Vercel API locally:
```bash
vercel dev
```

## Features

### Age Requirements
- Workshop designed for children **ages 6-12**
- Real-time age validation with helpful messages
- Contact information (727-637-3362) provided for younger children

### Two-Step Process
1. **Registration**: Form submission with email notification
2. **Payment**: Optional immediate payment or pay later option

### No Popups
- All notifications use inline messages
- Perfect for mobile devices and Vercel hosting
- Better user experience

## Workshop Details

- **Event**: My Purpose Summer Workshops
- **Age Range**: 6-12 years old
- **Dates**: June 17 - July 24, 2025
- **Schedule**: Tuesday & Thursday, 9:30 AM - 1:00 PM
- **Location**: 300 N Highland Ave, Tarpon Springs, FL 34688
- **Fee**: $35.00

## Testing Email Configuration

Visit `/api/test-email` to test Gmail SMTP configuration:
```
https://your-vercel-domain.vercel.app/api/test-email
```

This will verify the email setup and send a test email.

## Email Options

### 1. Full Version (index.html)
- **Primary**: Vercel API with Gmail SMTP
- **Fallback**: mailto link if server unavailable
- **Best for**: Vercel deployment

### 2. Standalone Version (standalone.html)  
- **Uses**: FormSubmit.co service (no server needed)
- **Direct email**: Goes straight to summerworkshops25@gmail.com
- **Best for**: GitHub Pages, any static hosting

### 3. Quick Deploy Standalone
For immediate use without any server:
```html
<!-- Use standalone.html directly -->
<!-- Works on any web host -->
<!-- No configuration needed -->
```

## Contact

For questions or younger children: **727-637-3362**