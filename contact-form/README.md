# NTCOGK Contact Form API

Backend service for handling contact form submissions with email notifications and admin management.

## Features

- 📧 Contact form submission with email notifications
- 🔐 JWT-based authentication for admin routes
- 📊 Admin dashboard for viewing and managing submissions
- 🛡️ Rate limiting and security middleware
- ✅ Input validation and sanitization
- 📨 Email notifications via Nodemailer
- 🗄️ MongoDB database storage

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT
- **Email**: Nodemailer
- **Security**: Helmet, CORS, Rate Limiting

## Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- SMTP email account (Gmail recommended)

## Local Development Setup

1. **Clone the repository**
   ```bash
   cd New-Testament-Backend/contact-form
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update the values with your credentials:
     ```bash
     cp .env.example .env
     ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Test the API**
   - Health check: `http://localhost:5500/health`
   - API root: `http://localhost:5500/`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | Yes |
| `MONGO_URI` | MongoDB connection string | Yes |
| `EMAIL_HOST` | SMTP server host | Yes |
| `EMAIL_PORT` | SMTP server port | Yes |
| `EMAIL_USER` | SMTP username/email | Yes |
| `EMAIL_PASS` | SMTP password/app password | Yes |
| `ADMIN_EMAIL` | Email to receive notifications | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `JWT_EXPIRES_IN` | JWT token expiration time | Yes |
| `RATE_LIMIT_WINDOW` | Rate limit window (minutes) | Yes |
| `RATE_LIMIT_MAX` | Max requests per window | Yes |
| `ENV` | Environment (development/production) | Yes |
| `APP_NAME` | Application name | Yes |
| `CORS_ORIGIN` | Allowed CORS origins | No |

## Gmail SMTP Setup

To use Gmail for sending emails:

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Use the generated password as `EMAIL_PASS`

## API Endpoints

### Public Routes

- `GET /` - API information
- `GET /health` - Health check
- `POST /api/contact` - Submit contact form

### Protected Routes (Admin)

- `GET /api/contact` - Get all contacts
- `GET /api/contact/stats` - Get contact statistics
- `GET /api/contact/:id` - Get single contact
- `PATCH /api/contact/:id/status` - Update contact status
- `DELETE /api/contact/:id` - Delete contact

## Deployment on Render

### Option 1: Using render.yaml (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Create a new Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml`

3. **Configure Environment Variables**
   Add these in Render dashboard (Settings → Environment):
   - `MONGO_URI` - Your MongoDB connection string
   - `EMAIL_HOST` - smtp.gmail.com
   - `EMAIL_PORT` - 587
   - `EMAIL_USER` - Your Gmail address
   - `EMAIL_PASS` - Your Gmail app password
   - `ADMIN_EMAIL` - Email to receive notifications
   - `JWT_SECRET` - Generate a secure random string
   - `CORS_ORIGIN` - Your frontend URL (e.g., https://yourdomain.com)

4. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy automatically

### Option 2: Manual Configuration

1. **Create new Web Service on Render**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your repository

2. **Configure Build Settings**
   - **Name**: ntcogk-contact-form-api
   - **Region**: Oregon (or your preferred region)
   - **Branch**: main
   - **Root Directory**: New-Testament-Backend/contact-form
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Add Environment Variables** (same as Option 1)

4. **Deploy**

### Post-Deployment

1. **Test your deployment**
   ```bash
   curl https://your-app.onrender.com/health
   ```

2. **Update frontend API URL**
   - Update `NEXT_PUBLIC_CONTACT_API_URL` in your frontend `.env`
   - Set it to your Render URL: `https://your-app.onrender.com/api/contact`

3. **Monitor logs**
   - Check Render dashboard for logs and errors

## Production Checklist

- [ ] Set `ENV=production` in environment variables
- [ ] Use strong `JWT_SECRET` (generate with: `openssl rand -base64 32`)
- [ ] Configure proper `CORS_ORIGIN` (your frontend domain)
- [ ] Set up MongoDB Atlas with proper security rules
- [ ] Use Gmail App Password (not regular password)
- [ ] Test all endpoints after deployment
- [ ] Monitor error logs regularly
- [ ] Set up health check monitoring

## Rate Limiting

The API includes rate limiting to prevent abuse:

- **General API**: 100 requests per 15 minutes per IP
- **Contact Form**: 5 submissions per 15 minutes per IP

## Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation and sanitization
- JWT authentication for admin routes
- MongoDB injection prevention
- XSS protection

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## Troubleshooting

### Email not sending
- Verify Gmail App Password is correct
- Check if 2FA is enabled on Google account
- Ensure EMAIL_HOST and EMAIL_PORT are correct

### Database connection failed
- Verify MONGO_URI is correct
- Check MongoDB Atlas network access (allow all IPs: 0.0.0.0/0)
- Ensure database user has proper permissions

### CORS errors
- Add your frontend URL to CORS_ORIGIN
- Use comma-separated values for multiple origins

## Support

For issues or questions, contact the development team.

## License

Private - NTCOGK Organization
