# 🚀 Quick Deployment Guide

Your POS system is ready to deploy! Follow these simple steps to get your mobile URL.

## Step 1: Deploy Frontend to Vercel (2 minutes)

### Option A: One-Command Deploy
```bash
cd frontend
vercel login
vercel --prod
```

When prompted:
- **Set up and deploy**: Yes
- **Which scope**: Your account
- **Link to existing project**: No
- **Project name**: `multi-restaurant-pos` (or your choice)
- **Directory**: `./` (press Enter)
- **Override settings**: No

### Option B: Using Vercel Dashboard
1. Go to https://vercel.com/new
2. Import Git Repository → Browse for `multi-restaurant-pos`
3. Set:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Click **Deploy**

**Copy your Vercel URL**: `https://multi-restaurant-pos-xyz.vercel.app`

---

## Step 2: Deploy Backend to Railway (3 minutes)

### Option A: Using Railway CLI
```bash
npm install -g @railway/cli
cd backend
railway login
railway init
railway up
```

### Option B: Using Railway Dashboard
1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select `multi-restaurant-pos`
4. Railway auto-detects Node.js
5. Click on service → **Settings**:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
6. Click **Deploy**
7. Go to **Settings** → **Networking** → **Generate Domain**

**Copy your Railway URL**: `https://multi-restaurant-pos-production.up.railway.app`

---

## Step 3: Configure Environment Variables

### Vercel (Frontend)
```bash
cd frontend
vercel env add REACT_APP_API_URL production
# Enter: https://your-railway-url.up.railway.app

vercel env add REACT_APP_STRIPE_PUBLISHABLE_KEY production
# Enter: pk_test_51QwBeIAyFiHaahk2PvQdtI9HoX9H0IhUPeJ8E1gKkK8dNjuD4QObA1dxbNHkAMPLjmilQoAXHuoGcUcZQxZHoYOv00EhPKMsIK

# Redeploy with new env vars
vercel --prod
```

Or via Dashboard:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - `REACT_APP_API_URL` = `https://your-railway-url`
   - `REACT_APP_STRIPE_PUBLISHABLE_KEY` = `pk_test_51QwBe...`
3. Redeploy from Deployments tab

### Railway (Backend)
Go to Railway Dashboard → Your Service → Variables:

```
STRIPE_SECRET_KEY=sk_test_51QwBeIAyFiHaahk2lbMN8RJ8FMWjCMpdhJVRm0TgKbMk3dMAjkCZ7AEdJpz3rOtxfD7s4aOpV3FCJB4P7PuDy9mL00bP9UY3Cd
FRONTEND_URL=https://your-vercel-url.vercel.app
PORT=3001
NODE_ENV=production
```

Click **Save** → Service will auto-redeploy

---

## Step 4: Test on Your Phone! 📱

1. Open your Vercel URL: `https://multi-restaurant-pos-xyz.vercel.app`
2. Tap **"📱 Customer"**
3. Select "Bella Vista"
4. Add items with +/- buttons
5. Select payment method
6. Complete order!

### Generate QR Codes for Tables

Once deployed, create QR codes:
- **Table 1**: `https://your-vercel-url.vercel.app?table=T1`
- **Table 2**: `https://your-vercel-url.vercel.app?table=T2`
- **Table 3**: `https://your-vercel-url.vercel.app?table=T3`

Use https://www.qr-code-generator.com/ to generate and print!

---

## 🎯 Quick Test Checklist

- [ ] Frontend loads on phone
- [ ] Can select restaurant
- [ ] Can add items with quantity selector
- [ ] Cart shows correct totals
- [ ] Payment methods all visible
- [ ] Card payment works (test card)
- [ ] PayNow QR displays
- [ ] Pay at Counter creates order
- [ ] Kitchen Display shows orders
- [ ] Merchant Dashboard can toggle payments

---

## 🔧 Troubleshooting

### Frontend can't reach backend
- Check `REACT_APP_API_URL` in Vercel env vars
- Make sure it matches your Railway URL exactly
- Redeploy frontend after changing env vars

### CORS errors
- Update `FRONTEND_URL` in Railway to match your Vercel URL
- Make sure it includes `https://`

### Stripe not working
- Verify publishable key in Vercel env vars
- Check secret key in Railway env vars
- Make sure you're using test keys (start with `pk_test_` and `sk_test_`)

---

## 📊 Cost Estimate

- **Vercel**: Free (100GB bandwidth/month)
- **Railway**: $5 credit (lasts ~1 month for testing)
- **Stripe**: Free (2.9% + $0.30 per transaction)

**Total**: $0-5/month for testing

---

## 🎉 Your URLs

After deployment, you'll have:

✅ **Customer App**: `https://your-app.vercel.app`
✅ **Kitchen Display**: `https://your-app.vercel.app?view=kitchen`
✅ **Merchant Dashboard**: `https://your-app.vercel.app?view=merchant`

Share the customer URL with your phone to test!
