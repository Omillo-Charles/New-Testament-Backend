# 📋 Pre-Deployment Checklist

## Before Deploying to Render

### ✅ Code Preparation

- [x] All dependencies listed in `package.json`
- [x] Node version specified in `package.json` (>=16.0.0)
- [x] Start script configured: `npm start`
- [x] `.gitignore` includes `.env` file
- [x] `.env.example` created with all required variables
- [x] `render.yaml` configuration file created

### ✅ Environment Variables

Verify you have values for:

- [ ] `MONGO_URI` - MongoDB connection string
- [ ] `EMAIL_HOST` - SMTP server (smtp.gmail.com)
- [ ] `EMAIL_PORT` - SMTP port (587)
- [ ] `EMAIL_USER` - Your email address
- [ ] `EMAIL_PASS` - Gmail App Password (not regular password!)
- [ ] `ADMIN_EMAIL` - Email to receive notifications
- [ ] `JWT_SECRET` - Secure random string
- [ ] `CORS_ORIGIN` - Your frontend URL(s)

### ✅ Database Setup

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with read/write permissions
- [ ] Network access allows 0.0.0.0/0 (or Render IPs)
- [ ] Connection string tested locally
- [ ] Database name matches in connection string

### ✅ Email Configuration

- [ ] Gmail 2-Factor Authentication enabled
- [ ] Gmail App Password generated
- [ ] Test email sent successfully locally
- [ ] Admin email address verified

### ✅ Security

- [ ] Strong JWT_SECRET generated (32+ characters)
- [ ] `.env` file NOT committed to Git
- [ ] Sensitive data removed from code
- [ ] Rate limiting configured
- [ ] CORS properly configured

### ✅ Testing

- [ ] Local server starts without errors: `npm start`
- [ ] Health endpoint works: `http://localhost:5500/health`
- [ ] Contact form submission works
- [ ] Email notifications received
- [ ] All API endpoints tested

### ✅ Git Repository

- [ ] Code pushed to GitHub
- [ ] Branch is `main` (or update render.yaml)
- [ ] Repository is accessible
- [ ] `.env` file is gitignored

### ✅ Documentation

- [x] README.md created
- [x] DEPLOYMENT.md created
- [x] QUICK-DEPLOY.md created
- [x] .env.example created

## Deployment Steps

Once all items are checked:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Render deployment"
   git push origin main
   ```

2. **Go to Render**
   - Visit https://dashboard.render.com
   - Follow steps in QUICK-DEPLOY.md

3. **Add Environment Variables**
   - Copy from .env file
   - Paste into Render dashboard

4. **Deploy & Test**
   - Wait for build to complete
   - Test health endpoint
   - Test contact form submission

5. **Update Frontend**
   - Update API URL in frontend .env
   - Redeploy frontend

## Post-Deployment Verification

- [ ] Health check returns 200 OK
- [ ] API root endpoint accessible
- [ ] Contact form submission works
- [ ] Email notifications received
- [ ] CORS allows frontend requests
- [ ] Rate limiting works
- [ ] Logs show no errors

## Common Issues & Solutions

### Build Fails
- Check Node version compatibility
- Verify all dependencies in package.json
- Review build logs for errors

### Can't Connect to Database
- Verify MongoDB Atlas network access
- Check connection string format
- Ensure database user has permissions

### Emails Not Sending
- Use Gmail App Password (not regular password)
- Verify 2FA is enabled
- Check EMAIL_HOST and EMAIL_PORT

### CORS Errors
- Add frontend URL to CORS_ORIGIN
- Use comma-separated list for multiple origins
- Include protocol (http:// or https://)

## Need Help?

- 📖 Full Guide: See DEPLOYMENT.md
- 🚀 Quick Start: See QUICK-DEPLOY.md
- 📚 API Docs: See README.md
- 🔧 Render Docs: https://render.com/docs

## Ready to Deploy? 🚀

If all checkboxes are marked, you're ready to deploy!

Follow the steps in **QUICK-DEPLOY.md** for the fastest deployment.
