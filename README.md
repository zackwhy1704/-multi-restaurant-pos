# 🍽️ Multi-Restaurant POS System

Production-ready full-stack POS with Stripe payments, QR ordering, and kitchen display.

## ✨ Features

- 📱 **Mobile QR Ordering**: Customers scan QR codes to order from their phones
- 💳 **5 Payment Methods**: Card, Apple Pay, Google Pay, PayNow, Pay at Counter
- 🏪 **Merchant Dashboard**: Enable/disable payment methods with toggle switches
- 🍳 **Kitchen Display System**: Real-time order management for kitchen staff
- 🏢 **Multi-Restaurant Support**: Manage multiple restaurants from one system
- 📊 **Live Order Tracking**: Orders update in real-time across all screens
- 🎨 **Responsive Design**: Works on mobile, tablet, and desktop

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Stripe keys
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL and Stripe publishable key
npm start
```

## 📱 Local Testing

Your app is now running at:
- **Customer App**: http://localhost:3000 (Mobile view)
- **Kitchen Display**: http://localhost:3000?view=kitchen (Desktop view)
- **Merchant Dashboard**: http://localhost:3000?view=merchant (Payment settings)
- **Backend API**: http://localhost:3001

### Test the Full Flow:

1. Open http://localhost:3000 in your browser
2. Click "📱 Customer" button
3. Select "Bella Vista" restaurant
4. Add items to cart → "Select Payment Method"
5. **Choose payment option**:
   - 💳 Card: `4242 4242 4242 4242`
   -  Apple Pay (Safari only)
   - 🟢 Google Pay (Chrome only)
   - 📱 PayNow (QR code)
   - 🏪 Pay at Counter
6. Complete payment → Order confirmed!
7. Click "🍳 Kitchen" to see your order in real-time!
8. Click "🏪 Merchant" to enable/disable payment methods

### Stripe Test Cards:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002

## 🔑 Stripe Setup

1. Create account at https://stripe.com
2. Get API keys from Dashboard → Developers → API Keys
3. Add to .env files
4. Configure webhook endpoint for production

## 💳 Payment Methods

See `PAYMENT_METHODS_GUIDE.md` for detailed payment configuration and testing.

**Available methods:**
- Credit/Debit Cards (Stripe)
- Apple Pay & Google Pay (Stripe)
- PayNow (Singapore QR)
- Pay at Counter (Cash)

Merchants can enable/disable each method via the dashboard!

## 🌐 Deployment

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

**Quick Deploy:**
- Backend: Railway.app or Render.com
- Frontend: Vercel
- Database: Supabase (PostgreSQL)

Your mobile-accessible URL will be provided after deployment!
