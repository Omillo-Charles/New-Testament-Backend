# Render Deployment Guide - Contact Form API

## Quick Start Deployment

### Step 1: Prepare Your Repository

1. **Ensure all files are committed**
   ```bash
   cd New-Testament-Backend/contact-form
   git status
   git add .
   git commit -m "Prepare contact-form API for Render deployment"
   git push origin main
   ```

### Step 2: Create Render Account

1. Go to [Render.com](https://render.com)
2. Sign up or log in with GitHub
3. Authorize Render to access your repositories

### Step 3: Create New Web Service

1. **From Render Dashboard**
   - Click "New +" button
   - Select "Web Service"

2. **Connect Repository**
   - Find and select your repository
   - Click "Connect"

3. **Configure Service**
   - **Name**: `ntcogk-contact-form-api`
   - **Region**: Oregon (or closest to your users)
   - **Branch**: `main`
   - **Root Directory**: `New-Testament-Backend/contact-form`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or select paid plan)

### Step 4: Add Environment Variables

Click "Advanced" → "Add Environment Variable" and add these:

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

1. Click "Create Web Service"
2. Wait for deployment to complete (5-10 minutes)
3. Render will provide a URL like: `https://ntcogk-contact-form-api.onrender.com`

### Step 6: Test Deployment

1. **Health Check**
   ```bash
   curl https://your-app.onrender.com/health
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
   curl https://your-app.onrender.com/
   ```

3. **Test Contact Form** (using Postman or curl)
   ```bash
   curl -X POST https://your-app.onrender.com/api/contact \
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
NEXT_PUBLIC_CONTACT_API_URL=https://your-app.onrender.com/api/contact
```

Then redeploy your frontend.

## Important Notes

### Free Tier Limitations

- **Spin Down**: Free services spin down after 15 minutes of inactivity
- **Spin Up**: First request after spin down takes 30-60 seconds
- **Solution**: Upgrade to paid plan ($7/month) for always-on service

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

1. Go to Render Dashboard
2. Select your service
3. Click "Logs" tab
4. Monitor for errors or issues

### Update Environment Variables

1. Go to service settings
2. Click "Environment" tab
3. Update variables
4. Service will automatically redeploy

### Manual Redeploy

1. Go to service dashboard
2. Click "Manual Deploy" → "Deploy latest commit"

### Health Monitoring

Set up external monitoring (optional):
- [UptimeRobot](https://uptimerobot.com) - Free monitoring
- [Pingdom](https://www.pingdom.com) - Paid monitoring
- Monitor endpoint: `https://your-app.onrender.com/health`

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
1. Go to Render Dashboard
2. Select your service
3. Click "Events" tab
4. Find previous successful deployment
5. Click "Rollback to this version"

## Scaling

### Upgrade Plan

For production use, consider upgrading:
- **Starter Plan** ($7/month): Always-on, no spin down
- **Standard Plan** ($25/month): More resources, faster performance

### Performance Optimization

1. **Enable HTTP/2**: Automatic on Render
2. **Add Redis**: For caching (separate service)
3. **Database Indexing**: Optimize MongoDB queries
4. **CDN**: Use for static assets

## Security Checklist

- [ ] Strong JWT_SECRET (32+ characters)
- [ ] CORS_ORIGIN set to specific domains
- [ ] MongoDB network access restricted (if possible)
- [ ] Gmail App Password (not regular password)
- [ ] ENV set to "production"
- [ ] Rate limiting enabled
- [ ] HTTPS enforced (automatic on Render)

## Support

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas

## Next Steps

After successful deployment:
1. ✅ Test all API endpoints
2. ✅ Update frontend with production API URL
3. ✅ Set up monitoring
4. ✅ Document API URL for team
5. ✅ Consider upgrading to paid plan for production
