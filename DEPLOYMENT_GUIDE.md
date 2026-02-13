# 🚀 Deployment Guide - Multi-Restaurant POS

This guide will help you deploy your POS system to the cloud and get a mobile-accessible URL.

## Prerequisites

1. **Stripe Account**: Sign up at [stripe.com](https://stripe.com)
2. **GitHub Account**: For code hosting
3. **Vercel Account**: For frontend hosting (free tier)
4. **Railway Account**: For backend hosting (free tier with $5 credit)

---

## Step 1: Deploy Backend to Railway

### 1.1 Push Code to GitHub

```bash
cd multi-restaurant-pos
git init
git add .
git commit -m "Initial commit: Multi-Restaurant POS"
gh repo create multi-restaurant-pos --public --source=. --remote=origin --push
```

### 1.2 Deploy to Railway

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `multi-restaurant-pos` repository
4. Railway will auto-detect Node.js and deploy
5. Click on your service → "Variables" tab
6. Add environment variables:
   ```
   STRIPE_SECRET_KEY=sk_test_your_actual_stripe_secret_key
   FRONTEND_URL=https://your-app.vercel.app
   PORT=3001
   NODE_ENV=production
   ```
7. Under "Settings" → Set:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
8. Click "Generate Domain" to get your backend URL
9. **Copy your Railway URL** (e.g., `https://multi-restaurant-pos-production.up.railway.app`)

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 2.2 Deploy

```bash
cd frontend
vercel
```

Follow the prompts:
- **Set up and deploy**: Y
- **Which scope**: Your account
- **Link to existing project**: N
- **Project name**: multi-restaurant-pos
- **Directory**: `./`
- **Override settings**: N

### 2.3 Set Environment Variables

```bash
vercel env add REACT_APP_API_URL
# Enter your Railway backend URL: https://multi-restaurant-pos-production.up.railway.app

vercel env add REACT_APP_STRIPE_PUBLISHABLE_KEY
# Enter your Stripe publishable key: pk_test_...
```

### 2.4 Deploy to Production

```bash
vercel --prod
```

**Copy your Vercel URL** (e.g., `https://multi-restaurant-pos.vercel.app`)

---

## Step 3: Update Backend CORS

Go back to Railway and update the `FRONTEND_URL` variable with your actual Vercel URL:

```
FRONTEND_URL=https://multi-restaurant-pos.vercel.app
```

---

## Step 4: Test on Mobile! 📱

1. Open your Vercel URL on your phone: `https://multi-restaurant-pos.vercel.app`
2. Tap "📱 Customer" to start ordering
3. Select a restaurant → Browse menu → Add items → Checkout
4. Use Stripe test card: `4242 4242 4242 4242`
5. Switch to "🍳 Kitchen" view to see orders in real-time

---

## Alternative: One-Click Deploy

### Backend - Render.com

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

1. Go to [render.com](https://render.com)
2. New → Web Service → Connect GitHub repo
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: Add `STRIPE_SECRET_KEY`, `FRONTEND_URL`

### Frontend - Netlify

```bash
cd frontend
npm install netlify-cli -g
netlify deploy --prod
```

---

## Stripe Webhooks (Optional - for Production)

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://your-railway-app.up.railway.app/api/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook secret and add to Railway: `STRIPE_WEBHOOK_SECRET=whsec_...`

---

## Database Setup (Optional - Replace In-Memory)

### Using Supabase (Free PostgreSQL)

1. Go to [supabase.com](https://supabase.com) → Create new project
2. Copy connection string
3. Add to Railway variables:
   ```
   DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
   ```
4. Run migrations (see `backend/migrations.sql` if we add schema later)

---

## QR Code Setup

Once deployed, generate QR codes for each table:

```javascript
// QR Code URLs for tables
Table 1: https://your-app.vercel.app?table=T1
Table 2: https://your-app.vercel.app?table=T2
Table 3: https://your-app.vercel.app?table=T3
```

Print these QR codes and place them on tables!

---

## Monitoring & Logs

- **Railway Logs**: Click on your service → "Deployments" → "View Logs"
- **Vercel Logs**: Dashboard → Your project → "Logs"
- **Stripe Events**: Dashboard → "Events & Logs"

---

## Cost Estimate

- **Stripe**: Free (2.9% + $0.30 per transaction)
- **Railway**: Free tier ($5 credit = ~1 month for light usage)
- **Vercel**: Free tier (100GB bandwidth/month)
- **Supabase**: Free tier (500MB database, 2GB bandwidth)

**Total**: $0-5/month for small restaurants

---

## Troubleshooting

### Frontend can't reach backend
- Check Railway logs for errors
- Verify `FRONTEND_URL` in Railway matches your Vercel URL
- Check CORS settings in `backend/server.js`

### Stripe payments failing
- Verify `STRIPE_SECRET_KEY` is set correctly in Railway
- Check Stripe Dashboard → "Logs" for error details
- Make sure you're using test keys for testing

### Orders not showing in Kitchen Display
- Check browser console for errors
- Verify backend `/api/orders` endpoint is working
- Test backend URL directly: `https://your-railway.app/api/restaurants`

---

## Next Steps

1. ✅ Add PostgreSQL database schema
2. ✅ Implement Stripe Connect for multi-restaurant payouts
3. ✅ Add user authentication (Firebase/Auth0)
4. ✅ Build admin dashboard for analytics
5. ✅ Add SMS/Email notifications for order updates
6. ✅ Implement table management system

---

## Support

- **Stripe Docs**: [stripe.com/docs](https://stripe.com/docs)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)

Need help? Create an issue on GitHub!
