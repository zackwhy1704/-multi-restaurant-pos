# 💳 Payment Methods Guide

Your POS system now supports 5 different payment methods with merchant control!

## 🎯 Available Payment Methods

### 1. 💳 Credit/Debit Card
- **How it works**: Stripe Elements integration
- **Cards accepted**: Visa, Mastercard, Amex
- **Test card**: `4242 4242 4242 4242`
- **Processing**: Real-time via Stripe

### 2.  Apple Pay
- **How it works**: Stripe Payment Request Button
- **Requirements**: Safari browser on iOS/macOS
- **Devices**: iPhone, iPad, Mac with Touch ID/Face ID
- **Speed**: One-tap checkout

### 3. 🟢 Google Pay
- **How it works**: Stripe Payment Request Button
- **Requirements**: Chrome browser with Google Pay enabled
- **Devices**: Android phones, Chrome desktop
- **Speed**: One-tap checkout

### 4. 📱 PayNow (Singapore)
- **How it works**: QR code payment
- **Requirements**: Banking app with PayNow
- **Flow**: Scan QR → Open banking app → Confirm payment
- **Popular with**: Singapore customers

### 5. 🏪 Pay at Counter
- **How it works**: Order without payment
- **Payment timing**: When customer collects order
- **Status**: Order created as "pending payment"
- **Use case**: Cash payments, reduce fees

---

## 🏪 Merchant Dashboard

### Access the Dashboard
Navigate to: **http://localhost:3000?view=merchant**

Or click the **🏪 Merchant** button in the top navigation.

### Enable/Disable Payment Methods

1. Open Merchant Dashboard
2. Toggle any payment method on/off
3. Click **"Save Changes"**
4. Changes apply immediately to customer checkout

**Example: Disable Apple Pay**
```
1. Go to Merchant Dashboard
2. Find "Apple Pay" toggle
3. Click to disable (grey)
4. Click "Save Changes"
5. Customers won't see Apple Pay option anymore
```

---

## 🧪 Testing Each Payment Method

### Test Flow

1. **Open Customer App**: http://localhost:3000
2. **Select Restaurant**: Click "Bella Vista"
3. **Add Items**: Add menu items to cart
4. **Go to Cart**: Click cart icon (🛒)
5. **Select Payment Method**: Click "Select Payment Method"
6. **Choose Method**: Pick one of 5 options

### Testing Each Method

#### 💳 Card Payment
1. Select "Credit/Debit Card"
2. Enter card: `4242 4242 4242 4242`
3. Expiry: Any future date
4. CVC: Any 3 digits
5. Click "Pay"
6. ✅ Order confirmed!

#### 📱 PayNow
1. Select "PayNow"
2. See QR code displayed
3. (In production: scan with banking app)
4. Click "I've Completed Payment"
5. ✅ Order confirmed!

#### 🏪 Pay at Counter
1. Select "Pay at Counter"
2. Order created immediately
3. ✅ Order confirmed!
4. Payment status: "pending"
5. Kitchen can still prepare order

#### Apple Pay / Google Pay
1. Select "Apple Pay" or "Google Pay"
2. Uses Stripe Payment Request Button
3. One-tap confirmation
4. ✅ Order confirmed!

**Note**: Apple Pay and Google Pay require specific browsers/devices. If not available, the option won't show.

---

## 📊 Payment Method Configuration

### Backend Configuration (server.js)

```javascript
paymentMethods: {
  card: {
    enabled: true,
    name: 'Credit/Debit Card'
  },
  applePay: {
    enabled: true,
    name: 'Apple Pay'
  },
  googlePay: {
    enabled: true,
    name: 'Google Pay'
  },
  payNow: {
    enabled: true,
    name: 'PayNow',
    uenNumber: '202012345A' // Singapore UEN
  },
  payAtCounter: {
    enabled: true,
    name: 'Pay at Counter'
  },
}
```

### Update Payment Settings via API

```bash
# Get payment methods
curl http://localhost:3001/api/restaurants/rest_001/payment-methods

# Update payment methods
curl -X PATCH http://localhost:3001/api/restaurants/rest_001/payment-methods \
  -H "Content-Type: application/json" \
  -d '{
    "applePay": { "enabled": false },
    "googlePay": { "enabled": false }
  }'
```

---

## 🌐 Production Setup

### Stripe Configuration

For Apple Pay and Google Pay to work in production:

1. **Verify your domain** in Stripe Dashboard
   - Dashboard → Settings → Payment methods → Apple Pay
   - Add your domain: `your-app.vercel.app`

2. **Enable Payment Methods** in Stripe
   - Dashboard → Settings → Payment methods
   - Enable: Cards, Apple Pay, Google Pay

3. **Test with real devices**
   - Apple Pay: Test on iPhone/Mac with Safari
   - Google Pay: Test on Android/Chrome

### PayNow Configuration

For PayNow in production:

1. **Get your UEN number** (Singapore businesses)
2. **Update backend** with real UEN:
   ```javascript
   payNow: {
     enabled: true,
     uenNumber: 'YOUR_REAL_UEN'
   }
   ```
3. **Implement payment verification**
   - Use bank webhooks to verify payment
   - Update order status when payment confirmed

### Payment Verification

**Current (Test Mode)**:
- PayNow: Manual confirmation
- Pay at Counter: No verification

**Production (Recommended)**:
```javascript
// Add webhook endpoint for PayNow verification
app.post('/api/webhook/paynow', (req, res) => {
  // Verify payment from bank webhook
  // Update order status to 'completed'
});

// Add staff endpoint to confirm counter payment
app.post('/api/orders/:id/confirm-payment', (req, res) => {
  // Staff confirms cash received
  // Update paymentStatus to 'completed'
});
```

---

## 💡 Best Practices

### For Merchants

1. **Enable Multiple Options**: More choices = higher conversion
2. **PayNow for Singapore**: Very popular, reduces card fees
3. **Pay at Counter**: Good for regular customers
4. **Apple Pay/Google Pay**: Faster checkout, less cart abandonment

### For Developers

1. **Always verify payments** in production
2. **Handle payment failures** gracefully
3. **Store payment method** with each order
4. **Log payment attempts** for debugging

### Fee Comparison

| Method | Typical Fee | Processing Time |
|--------|-------------|-----------------|
| Card | 2.9% + $0.30 | Instant |
| Apple Pay | 2.9% + $0.30 | Instant |
| Google Pay | 2.9% + $0.30 | Instant |
| PayNow | Free or 0.5% | 1-2 minutes |
| Pay at Counter | 0% | Manual |

---

## 🔧 Customization

### Add New Payment Method

1. **Update backend** (server.js):
```javascript
paymentMethods: {
  // ... existing methods
  grabPay: {
    enabled: true,
    name: 'GrabPay',
    merchantId: 'YOUR_GRAB_MERCHANT_ID'
  }
}
```

2. **Update frontend** (CustomerApp.js):
```javascript
{paymentMethods.grabPay?.enabled && (
  <div
    className="payment-method-card"
    onClick={() => handleGrabPay()}
  >
    <div className="payment-icon">🟢</div>
    <h4>GrabPay</h4>
    <p>Pay with GrabPay</p>
  </div>
)}
```

3. **Add payment handler**:
```javascript
const handleGrabPay = async () => {
  // Integrate with GrabPay API
};
```

---

## 📱 Mobile Testing URLs

Once deployed:

- **Customer App**: `https://your-app.vercel.app`
- **Merchant Dashboard**: `https://your-app.vercel.app?view=merchant`
- **Kitchen Display**: `https://your-app.vercel.app?view=kitchen`

Test each payment method on your phone!

---

## ❓ Troubleshooting

### Apple Pay not showing
- ✅ Must use Safari on iOS/macOS
- ✅ Must have card added to Apple Wallet
- ✅ Domain must be verified in Stripe (production)

### Google Pay not showing
- ✅ Must use Chrome browser
- ✅ Must have card added to Google Pay
- ✅ Must be on supported device

### PayNow QR not working
- ✅ Check UEN number format
- ✅ Ensure banking app supports PayNow QR
- ✅ Amount must be valid (> 0)

### Pay at Counter not creating order
- ✅ Check backend is running
- ✅ Check network connection
- ✅ Look for errors in browser console

---

## 🚀 Next Steps

1. ✅ Test all payment methods locally
2. ✅ Use Merchant Dashboard to toggle methods
3. ✅ Deploy to production
4. ✅ Verify domains in Stripe
5. ✅ Test on real mobile devices
6. ✅ Add payment verification webhooks
7. ✅ Go live!

**Questions?** Check the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for deployment instructions.
