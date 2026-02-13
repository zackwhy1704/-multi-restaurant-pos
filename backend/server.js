const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// In-memory data store (replace with PostgreSQL in production)
let restaurants = [
  {
    id: 'rest_001',
    name: 'Bella Vista',
    logo: '🍽️',
    stripeAccountId: null, // Will be set after Stripe onboarding
    menu: [
      { id: 'm1', category: 'Mee', name: 'Chilli Pan Mee', price: 9.5, image: '🌶️' },
      { id: 'm2', category: 'Mee', name: 'Pork Chop Noodles', price: 9.5, image: '🥩' },
      { id: 'm3', category: 'Rices', name: 'Chicken Rice', price: 8.5, image: '🍗' },
      { id: 'm4', category: 'Drinks', name: 'Ice Lemon Tea', price: 3.0, image: '🍋' },
    ],
    addOns: [
      { id: 'a1', name: 'Add Egg', price: 1.0 },
      { id: 'a2', name: 'Extra Noodles', price: 2.0 },
    ],
    tables: ['T1', 'T2', 'T3', 'T4', 'T5'],
    paymentMethods: {
      card: { enabled: true, name: 'Credit/Debit Card' },
      applePay: { enabled: true, name: 'Apple Pay' },
      googlePay: { enabled: true, name: 'Google Pay' },
      payNow: { enabled: true, name: 'PayNow', uenNumber: '202012345A' }, // Singapore UEN for PayNow
      payAtCounter: { enabled: true, name: 'Pay at Counter' },
    },
  },
];

let orders = [];

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all restaurants
app.get('/api/restaurants', (req, res) => {
  res.json({ success: true, restaurants });
});

// Get restaurant by ID
app.get('/api/restaurants/:id', (req, res) => {
  const restaurant = restaurants.find(r => r.id === req.params.id);
  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }
  res.json({ success: true, restaurant });
});

// Get payment methods for a restaurant
app.get('/api/restaurants/:id/payment-methods', (req, res) => {
  const restaurant = restaurants.find(r => r.id === req.params.id);
  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }
  res.json({ success: true, paymentMethods: restaurant.paymentMethods || {} });
});

// Update payment methods (Merchant Dashboard)
app.patch('/api/restaurants/:id/payment-methods', (req, res) => {
  const restaurant = restaurants.find(r => r.id === req.params.id);
  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }

  // Update payment methods
  restaurant.paymentMethods = {
    ...restaurant.paymentMethods,
    ...req.body,
  };

  res.json({ success: true, paymentMethods: restaurant.paymentMethods });
});

// Create payment intent
app.post('/api/payment/create-intent', async (req, res) => {
  try {
    const { amount, restaurantId } = req.body;

    // For demo, we'll create a simple payment intent without Connect
    // In production, use destination charges to restaurant's Stripe account
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { restaurantId },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create order
app.post('/api/orders/create', (req, res) => {
  try {
    // Find restaurant to get name
    const restaurant = restaurants.find(r => r.id === req.body.restaurantId);

    // Generate order number
    const orderNumber = Math.floor(1000 + Math.random() * 9000);

    const order = {
      id: `order_${Date.now()}`,
      orderNumber,
      restaurantName: restaurant ? restaurant.name : 'Unknown',
      ...req.body,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    orders.push(order);

    res.json({ success: true, order, orderNumber });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get orders
app.get('/api/orders', (req, res) => {
  const { restaurantId, status } = req.query;

  let filteredOrders = orders;

  if (restaurantId) {
    filteredOrders = filteredOrders.filter(o => o.restaurantId === restaurantId);
  }

  if (status) {
    filteredOrders = filteredOrders.filter(o => o.status === status);
  }

  res.json({ success: true, orders: filteredOrders });
});

// Update order status
app.patch('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const orderIndex = orders.findIndex(o => o.id === req.params.id);

  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  orders[orderIndex].status = status;
  orders[orderIndex].updatedAt = new Date().toISOString();

  res.json({ success: true, order: orders[orderIndex] });
});

// Stripe webhook
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Webhook event:', event.type);
  res.json({ received: true });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
