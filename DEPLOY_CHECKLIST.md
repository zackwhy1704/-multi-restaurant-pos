# ✅ Deployment Checklist - Your Code is Ready!

**GitHub Repository:** ✅ https://github.com/zackwhy1704/-multi-restaurant-pos

---

## 🚀 Part 1: Deploy Frontend (2 minutes)

### Open Vercel and Deploy

**👉 CLICK HERE:** https://vercel.com/new

### Steps:

**1. Import Repository**
- Click "Import Git Repository"
- Find: `-multi-restaurant-pos`
- Click "Import"

**2. Configure Settings**
```
Framework Preset: Create React App
Root Directory: frontend  ⚠️ IMPORTANT: Click Edit and change!
Build Command: npm run build
Output Directory: build
```

**3. Add Environment Variables**

Click "Add" and enter BOTH of these:

**Variable 1:**
```
Name:  REACT_APP_API_URL
Value: http://localhost:3001
```
*(We'll update this after backend deployment)*

**Variable 2:**
```
Name:  REACT_APP_STRIPE_PUBLISHABLE_KEY
Value: pk_test_51QwBeIAyFiHaahk2PvQdtI9HoX9H0IhUPeJ8E1gKkK8dNjuD4QObA1dxbNHkAMPLjmilQoAXHuoGcUcZQxZHoYOv00EhPKMsIK
```

**4. Click "Deploy"**

⏳ Wait 1-2 minutes...

**5. Copy Your Frontend URL**
When done, you'll get a URL like:
```
https://-multi-restaurant-pos.vercel.app
```
**✏️ WRITE IT HERE:** _________________________________

---

## 🔧 Part 2: Deploy Backend (2 minutes)

### Open Railway and Deploy

**👉 CLICK HERE:** https://railway.app/new

### Steps:

**1. Deploy from GitHub**
- Click "Deploy from GitHub repo"
- Find: `-multi-restaurant-pos`
- Click "Deploy"

**2. Configure Root Directory**
- Click on your service (it will be deploying)
- Click "Settings" tab
- Find "Root Directory"
- Click "Edit"
- Change from `/` to `backend`
- Service will auto-redeploy

**3. Add Environment Variables**
- Click "Variables" tab
- Click "+ New Variable" for EACH of these:

**Variable 1:**
```
Name:  STRIPE_SECRET_KEY
Value: sk_test_51QwBeIAyFiHaahk2lbMN8RJ8FMWjCMpdhJVRm0TgKbMk3dMAjkCZ7AEdJpz3rOtxfD7s4aOpV3FCJB4P7PuDy9mL00bP9UY3Cd
```

**Variable 2:**
```
Name:  PORT
Value: 3001
```

**Variable 3:**
```
Name:  NODE_ENV
Value: production
```

**Variable 4:** *(Add this AFTER you have your Vercel URL)*
```
Name:  FRONTEND_URL
Value: [YOUR VERCEL URL FROM ABOVE]
```

**4. Generate Public Domain**
- Click "Settings" tab
- Scroll to "Networking"
- Click "Generate Domain"

**5. Copy Your Backend URL**
You'll get a URL like:
```
https://-multi-restaurant-pos-production.up.railway.app
```
**✏️ WRITE IT HERE:** _________________________________

---

## 🔗 Part 3: Link Frontend & Backend (1 minute)

### Update Frontend Environment Variable

**1. Go to Vercel Dashboard**
- https://vercel.com/dashboard
- Click your project: `-multi-restaurant-pos`
- Click "Settings"
- Click "Environment Variables"

**2. Update REACT_APP_API_URL**
- Find `REACT_APP_API_URL`
- Click "Edit"
- Change value to: **YOUR RAILWAY URL** (from above)
- Click "Save"

**3. Redeploy**
- Go to "Deployments" tab
- Click ⋮ (three dots) on latest deployment
- Click "Redeploy"
- ✅ Uncheck "Use existing Build Cache"
- Click "Redeploy"

### Update Backend Environment Variable

**1. Go back to Railway**
- Click your service
- Click "Variables" tab
- Click "+ New Variable"

**2. Add Frontend URL**
```
Name:  FRONTEND_URL
Value: [YOUR VERCEL URL]
```
*(Service will auto-redeploy)*

---

## 🎉 Part 4: TEST ON YOUR PHONE!

**Your Production URL:** (Vercel URL from above)
```
https://-multi-restaurant-pos.vercel.app
```

### Test Steps:

**On Your Phone:**
1. ✅ Open your Vercel URL
2. ✅ Tap "📱 Customer"
3. ✅ Select "Bella Vista"
4. ✅ See menu with +/- buttons
5. ✅ Add items (try quantity 3)
6. ✅ Tap cart 🛒
7. ✅ Tap "Select Payment Method"
8. ✅ See all 5 payment options
9. ✅ Try "Pay at Counter"
10. ✅ Order confirmed! 🎉

**On Computer:**
1. ✅ Open: `[YOUR-URL]?view=kitchen`
2. ✅ See your order in Kitchen Display
3. ✅ Click "Start Preparing"
4. ✅ Click "Mark Ready"

**Merchant Dashboard:**
1. ✅ Open: `[YOUR-URL]?view=merchant`
2. ✅ Toggle payment methods
3. ✅ Click "Save Changes"

---

## ✅ Final Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway
- [ ] Environment variables added to both
- [ ] URLs linked (frontend knows backend, backend knows frontend)
- [ ] Tested on phone - can see restaurants
- [ ] Tested ordering - order confirmed
- [ ] Tested kitchen display - order appears
- [ ] Tested merchant dashboard - can toggle payments

---

## 🎯 Your Live URLs

**Customer App:** `https://YOUR-VERCEL-URL.vercel.app`
**Kitchen Display:** `https://YOUR-VERCEL-URL.vercel.app?view=kitchen`
**Merchant Dashboard:** `https://YOUR-VERCEL-URL.vercel.app?view=merchant`
**Backend API:** `https://YOUR-RAILWAY-URL.up.railway.app`

---

## 🆘 Quick Fixes

**"Failed to fetch restaurants":**
- Check REACT_APP_API_URL in Vercel points to Railway URL
- Make sure Railway service shows green dot (running)

**CORS errors:**
- Add FRONTEND_URL to Railway variables
- Must be exact Vercel URL with https://

**Orders not saving:**
- Check Railway logs (click on service → Deployments → View Logs)
- Verify STRIPE_SECRET_KEY is set

---

## 🎊 Success Criteria

When everything works:
✅ Phone can browse menu
✅ Can add items with quantity
✅ Can select payment method
✅ Orders confirm successfully
✅ Orders appear in kitchen
✅ Can toggle payment methods
✅ QR code can be scanned

---

**TIME ESTIMATE: 5-7 minutes total**
**COST: $0 (free tiers)**

🚀 **START DEPLOYING!**
