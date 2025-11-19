# Vercel Deployment Guide - Contact Form API

## Quick Start Deployment

### Step 1: Prepare Your Repository

1. **Ensure all files are committed**
   ```bash
   cd New-Testament-Backend/contact-form
   git status
   git add .
   git commit -m "Prepare contact-form API for Vercel deployment"
   git push origin main
   ```

### Step 2: Create Vercel Account

1. Go to [Vercel.com](https://vercel.com)
2. Sign up or log in with GitHub
3. Authorize Vercel to access your repositories

### Step 3: Import Project

1. **From Vercel Dashboard**
   - Click "Add New..." button
   - Select "Project"

2. **Import Repository**
   - Find and select your repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Other
   - **Root Directory**: `New-Testament-Backend/contact-form`
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

### Step 4: Add Environment Variables

Click "Environment Variables" section and add these:

#### Required Variables

```
NODE_ENV=production
ENV=production
PORT=5500
APP_NAME=NTCOGK Contact Form API
```

#### Database
```
MONGO_URI=mongodb+srv://ntcogkdbuser:omm1cyfP9ElJdZA6@nttcogk1.ycqnmdg.mongodb.net/ntcogk-contact?retryWrites=true&w=majority&appName=nttcogk1
```

#### Email Configuration
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=fidelomillo812@gmail.com
EMAIL_PASS=sxonpertrjhnrgud
ADMIN_EMAIL=fidelomillo812@gmail.com
```

#### Security
```
JWT_SECRET=kvichayvyudg7hd378tg36e7fgdwubdwydbeydeundeundeuidneinmdenj26783
JWT_EXPIRES_IN=7d
```

#### Rate Limiting
```
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

#### CORS (Update with your frontend URL)
```
CORS_ORIGIN=http://localhost:3000,https://your-frontend-domain.com
```

### Step 5: Deploy

1. Click "Deploy"
2. Wait for deployment to complete (2-5 minutes)
3. Vercel will provide a URL like: `https://ntcogk-contact-form-api.vercel.app`

### Step 6: Test Deployment

1. **Health Check**
   ```bash
   curl https://your-app.vercel.app/health
   ```
   
   Expected response:
   ```json
   {
     "success": true,
     "message": "Server is running",
     "timestamp": "2024-01-01T00:00:00.000Z",
     "environment": "production"
   }
   ```

2. **API Root**
   ```bash
   curl https://your-app.vercel.app/
   ```

3. **Test Contact Form** (using Postman or curl)
   ```bash
   curl -X POST https://your-app.vercel.app/api/contact \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "subject": "Test Subject",
       "message": "Test message"
     }'
   ```

### Step 7: Update Frontend

Update your frontend environment variables:

```env
NEXT_PUBLIC_CONTACT_API_URL=https://your-app.vercel.app/api/contact
```

Then redeploy your frontend.

## Important Notes

### Vercel Hobby Plan Limitations

- **Serverless Functions**: 10-second execution timeout
- **Bandwidth**: 100GB per month
- **Invocations**: Unlimited
- **Solution**: Upgrade to Pro plan ($20/month) for 60s timeout and more features

### MongoDB Atlas Setup

Ensure your MongoDB Atlas is configured:
1. **Network Access**: Add `0.0.0.0/0` to allow connections from anywhere
2. **Database User**: Verify user has read/write permissions
3. **Connection String**: Use the correct database name

### Gmail App Password

If emails aren't sending:
1. Enable 2-Factor Authentication on Google account
2. Generate App Password:
   - Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Copy the 16-character password
3. Use this password as `EMAIL_PASS`

### CORS Configuration

Update `CORS_ORIGIN` with your actual frontend URLs:
- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`
- Multiple origins: Separate with commas

## Monitoring & Maintenance

### View Logs

**Via Dashboard:**
1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments" → Select deployment
4. Click "Functions" tab to see logs

**Via CLI:**
```bash
vercel logs
vercel logs --follow  # Real-time logs
```

### Update Environment Variables

**Via Dashboard:**
1. Go to project settings
2. Click "Environment Variables"
3. Update variables
4. Redeploy for changes to take effect

**Via CLI:**
```bash
vercel env add VARIABLE_NAME
vercel env rm VARIABLE_NAME
vercel env ls
```

### Manual Redeploy

**Via Dashboard:**
1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"

**Via CLI:**
```bash
vercel --prod
```

### Health Monitoring

Set up external monitoring (optional):
- [UptimeRobot](https://uptimerobot.com) - Free monitoring
- [Pingdom](https://www.pingdom.com) - Paid monitoring
- Vercel Analytics - Built-in monitoring
- Monitor endpoint: `https://your-app.vercel.app/health`

## Troubleshooting

### Build Failed

**Check:**
- Node version compatibility (requires Node 16+)
- All dependencies in package.json
- Build logs for specific errors

**Solution:**
```bash
# Test locally first
npm install
npm start
```

### Service Won't Start

**Check:**
- Environment variables are set correctly
- MongoDB connection string is valid
- Port is set to 5500 or use process.env.PORT

**Solution:**
- Review logs in Render dashboard
- Verify all required env vars are present

### Database Connection Error

**Check:**
- MongoDB Atlas network access allows 0.0.0.0/0
- Connection string is correct
- Database user has proper permissions

**Solution:**
- Test connection string locally
- Check MongoDB Atlas status

### Email Not Sending

**Check:**
- Gmail App Password is correct (not regular password)
- 2FA is enabled on Google account
- EMAIL_HOST and EMAIL_PORT are correct

**Solution:**
- Generate new App Password
- Test with a different email service

### CORS Errors

**Check:**
- CORS_ORIGIN includes your frontend URL
- Frontend is using correct API URL

**Solution:**
```env
CORS_ORIGIN=https://your-frontend.com,http://localhost:3000
```

## Rollback

If deployment fails:
1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments" tab
4. Find previous successful deployment
5. Click "..." → "Promote to Production"

**Via CLI:**
```bash
vercel rollback
```

## Scaling

### Upgrade Plan

For production use, consider upgrading:
- **Hobby Plan** (Free): 10s timeout, 100GB bandwidth
- **Pro Plan** ($20/month): 60s timeout, 1TB bandwidth, advanced features
- **Enterprise**: Custom pricing, dedicated support

### Performance Optimization

1. **Edge Functions**: Deploy closer to users (Pro plan)
2. **Caching**: Use Vercel's edge caching
3. **Database Indexing**: Optimize MongoDB queries
4. **CDN**: Automatic on Vercel
5. **Serverless Optimization**: Keep functions lightweight

## Security Checklist

- [ ] Strong JWT_SECRET (32+ characters)
- [ ] CORS_ORIGIN set to specific domains
- [ ] MongoDB network access restricted (if possible)
- [ ] Gmail App Password (not regular password)
- [ ] ENV set to "production"
- [ ] Rate limiting enabled
- [ ] HTTPS enforced (automatic on Render)

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Community**: https://github.com/vercel/vercel/discussions
- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas
- **Vercel CLI Docs**: https://vercel.com/docs/cli

## Next Steps

After successful deployment:
1. ✅ Test all API endpoints
2. ✅ Update frontend with production API URL
3. ✅ Set up monitoring
4. ✅ Document API URL for team
5. ✅ Consider upgrading to paid plan for production
