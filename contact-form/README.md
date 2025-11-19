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

## Deployment on Vercel

### Option 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project directory**
   ```bash
   cd New-Testament-Backend/contact-form
   vercel
   ```

4. **Follow the prompts**
   - Set up and deploy: Yes
   - Which scope: Select your account
   - Link to existing project: No
   - Project name: ntcogk-contact-form-api
   - Directory: ./
   - Override settings: No

5. **Add Environment Variables**
   ```bash
   vercel env add MONGO_URI
   vercel env add EMAIL_HOST
   vercel env add EMAIL_PORT
   vercel env add EMAIL_USER
   vercel env add EMAIL_PASS
   vercel env add ADMIN_EMAIL
   vercel env add JWT_SECRET
   vercel env add JWT_EXPIRES_IN
   vercel env add RATE_LIMIT_WINDOW
   vercel env add RATE_LIMIT_MAX
   vercel env add CORS_ORIGIN
   ```

6. **Deploy to production**
   ```bash
   vercel --prod
   ```

### Option 2: Using Vercel Dashboard

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import Project on Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Project**
   - **Framework Preset**: Other
   - **Root Directory**: `New-Testament-Backend/contact-form`
   - **Build Command**: Leave empty (not needed)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   - `MONGO_URI` - Your MongoDB connection string
   - `EMAIL_HOST` - smtp.gmail.com
   - `EMAIL_PORT` - 587
   - `EMAIL_USER` - Your Gmail address
   - `EMAIL_PASS` - Your Gmail app password
   - `ADMIN_EMAIL` - Email to receive notifications
   - `JWT_SECRET` - Generate a secure random string
   - `JWT_EXPIRES_IN` - 7d
   - `RATE_LIMIT_WINDOW` - 15
   - `RATE_LIMIT_MAX` - 100
   - `CORS_ORIGIN` - Your frontend URL (e.g., https://yourdomain.com)

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically

### Post-Deployment

1. **Test your deployment**
   ```bash
   curl https://your-app.vercel.app/health
   ```

2. **Update frontend API URL**
   - Update `NEXT_PUBLIC_CONTACT_API_URL` in your frontend `.env`
   - Set it to your Vercel URL: `https://your-app.vercel.app/api/contact`

3. **Monitor logs**
   - Check Vercel dashboard for logs and errors
   - Use `vercel logs` command for CLI access

## Production Checklist

- [ ] Set `ENV=production` in environment variables
- [ ] Use strong `JWT_SECRET` (generate with: `openssl rand -base64 32`)
- [ ] Configure proper `CORS_ORIGIN` (your frontend domain)
- [ ] Set up MongoDB Atlas with proper security rules
- [ ] Use Gmail App Password (not regular password)
- [ ] Test all endpoints after deployment
- [ ] Monitor error logs regularly
- [ ] Configure custom domain (optional)
- [ ] Set up Vercel Analytics (optional)

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

### Vercel-specific issues
- Serverless functions have 10s timeout on Hobby plan
- Use Vercel Pro for longer timeouts (60s)
- Check function logs in Vercel dashboard

## Vercel Features

### Custom Domain
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### Environment Variables
- Production, Preview, and Development environments
- Update via dashboard or CLI: `vercel env add`

### Analytics
- Enable Vercel Analytics in project settings
- Monitor API performance and usage

## Support

For issues or questions, contact the development team.

## License

Private - NTCOGK Organization
