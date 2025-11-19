# 🚀 Quick Deploy to Render - Contact Form API

## 1️⃣ Push to GitHub
```bash
git add .
git commit -m "Deploy contact-form API"
git push origin main
```

## 2️⃣ Create Service on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository

## 3️⃣ Configure Service

**Basic Settings:**
- Name: `ntcogk-contact-form-api`
- Region: `Oregon`
- Branch: `main`
- Root Directory: `New-Testament-Backend/contact-form`
- Runtime: `Node`
- Build Command: `npm install`
- Start Command: `npm start`

## 4️⃣ Add Environment Variables

Copy and paste these in Render's Environment section:

```
NODE_ENV=production
ENV=production
PORT=5500
APP_NAME=NTCOGK Contact Form API
MONGO_URI=mongodb+srv://ntcogkdbuser:omm1cyfP9ElJdZA6@nttcogk1.ycqnmdg.mongodb.net/ntcogk-contact?retryWrites=true&w=majority&appName=nttcogk1
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=fidelomillo812@gmail.com
EMAIL_PASS=sxonpertrjhnrgud
ADMIN_EMAIL=fidelomillo812@gmail.com
JWT_SECRET=kvichayvyudg7hd378tg36e7fgdwubdwydbeydeundeundeuidneinmdenj26783
JWT_EXPIRES_IN=7d
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
CORS_ORIGIN=http://localhost:3000
```

**⚠️ Important:** Update `CORS_ORIGIN` with your actual frontend URL after deployment!

## 5️⃣ Deploy

Click **"Create Web Service"** and wait 5-10 minutes.

## 6️⃣ Test

Your API will be available at: `https://ntcogk-contact-form-api.onrender.com`

Test health endpoint:
```bash
curl https://your-app-url.onrender.com/health
```

## 7️⃣ Update Frontend

Update your frontend `.env`:
```
NEXT_PUBLIC_CONTACT_API_URL=https://your-app-url.onrender.com/api/contact
```

## 📝 Notes

- **Free Tier**: Service spins down after 15 min of inactivity
- **First Request**: May take 30-60 seconds after spin down
- **Upgrade**: $7/month for always-on service

## 🔧 Troubleshooting

**Build fails?** Check logs in Render dashboard

**Can't connect to DB?** Verify MongoDB Atlas allows 0.0.0.0/0

**Emails not sending?** Ensure you're using Gmail App Password

**CORS errors?** Update CORS_ORIGIN with your frontend URL

## ✅ Done!

Your Contact Form API is now live! 🎉
