import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import QRCode from 'qrcode.react';
import './CustomerApp.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function CustomerApp() {
  const stripe = useStripe();
  const elements = useElements();

  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState('select'); // 'select', 'menu', 'cart', 'payment-method', 'checkout', 'paynow', 'success'
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);
  const [qrUrl, setQrUrl] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(null); // 'card', 'applePay', 'googlePay', 'payNow', 'payAtCounter'
  const [paymentMethods, setPaymentMethods] = useState({});
  const [menuItemQuantities, setMenuItemQuantities] = useState({}); // Track quantities for menu items before adding to cart

  // Fetch restaurants on mount
  useEffect(() => {
    fetchRestaurants();
    // Generate QR code URL for current page
    setQrUrl(window.location.href);
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/restaurants`);
      setRestaurants(response.data.restaurants || []);
    } catch (err) {
      setError('Failed to load restaurants');
      console.error('Error fetching restaurants:', err);
    }
  };

  const selectRestaurant = async (restaurant) => {
    setSelectedRestaurant(restaurant);
    setPaymentMethods(restaurant.paymentMethods || {});
    setStep('menu');
  };

  const getMenuItemQuantity = (itemId) => {
    return menuItemQuantities[itemId] || 1;
  };

  const updateMenuItemQuantity = (itemId, quantity) => {
    if (quantity < 1) return; // Don't allow quantity less than 1
    setMenuItemQuantities({
      ...menuItemQuantities,
      [itemId]: quantity,
    });
  };

  const addToCart = (item, quantity = 1) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + quantity }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity }]);
    }
    // Reset menu item quantity after adding to cart
    setMenuItemQuantities({
      ...menuItemQuantities,
      [item.id]: 1,
    });
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      const total = getCartTotal();

      // Create payment intent
      const { data } = await axios.post(`${API_URL}/api/payment/create-intent`, {
        amount: total,
        restaurantId: selectedRestaurant.id,
      });

      // Confirm payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
      } else {
        // Create order
        const orderData = {
          restaurantId: selectedRestaurant.id,
          items: cart,
          total,
          paymentIntentId: result.paymentIntent.id,
          paymentMethod: paymentMethod || 'card',
          paymentStatus: 'completed',
        };

        const orderResponse = await axios.post(`${API_URL}/api/orders/create`, orderData);
        setOrderNumber(orderResponse.data.orderNumber);
        setStep('success');
        setCart([]);
        setProcessing(false);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed');
      setProcessing(false);
    }
  };

  const handlePayAtCounter = async () => {
    setProcessing(true);
    setError(null);

    try {
      const total = getCartTotal();

      // Create order without payment
      const orderData = {
        restaurantId: selectedRestaurant.id,
        items: cart,
        total,
        paymentMethod: 'payAtCounter',
        paymentStatus: 'pending',
      };

      const orderResponse = await axios.post(`${API_URL}/api/orders/create`, orderData);
      setOrderNumber(orderResponse.data.orderNumber);
      setStep('success');
      setCart([]);
      setProcessing(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create order');
      setProcessing(false);
    }
  };

  const handlePayNowConfirm = async () => {
    setProcessing(true);
    setError(null);

    try {
      const total = getCartTotal();

      // Create order (in production, verify PayNow payment first)
      const orderData = {
        restaurantId: selectedRestaurant.id,
        items: cart,
        total,
        paymentMethod: 'payNow',
        paymentStatus: 'completed', // In production, verify payment via webhook
      };

      const orderResponse = await axios.post(`${API_URL}/api/orders/create`, orderData);
      setOrderNumber(orderResponse.data.orderNumber);
      setStep('success');
      setCart([]);
      setProcessing(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create order');
      setProcessing(false);
    }
  };

  // Render restaurant selection
  if (step === 'select') {
    return (
      <div className="customer-app">
        <div className="header">
          <h1>🍽️ Select Restaurant</h1>
        </div>
        <div className="restaurant-grid">
          {restaurants.map(restaurant => (
            <div
              key={restaurant.id}
              className="restaurant-card"
              onClick={() => selectRestaurant(restaurant)}
            >
              <h3>{restaurant.name}</h3>
              <p>{restaurant.cuisine}</p>
            </div>
          ))}
        </div>
        <div className="qr-section">
          <h3>📱 Scan to Order</h3>
          <QRCode value={qrUrl} size={200} />
          <p>Customers can scan this QR code to order on their phones</p>
        </div>
      </div>
    );
  }

  // Render menu
  if (step === 'menu') {
    return (
      <div className="customer-app">
        <div className="header">
          <button onClick={() => setStep('select')}>&larr; Back</button>
          <h1>{selectedRestaurant.name}</h1>
          <button onClick={() => setStep('cart')} className="cart-btn">
            🛒 {cart.length}
          </button>
        </div>
        <div className="menu">
          {selectedRestaurant.menu.map(item => {
            const quantity = getMenuItemQuantity(item.id);
            return (
              <div key={item.id} className="menu-item">
                <div className="menu-item-info">
                  <div className="menu-item-emoji">{item.image}</div>
                  <div>
                    <h3>{item.name}</h3>
                    <p className="price">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="menu-item-actions">
                  <div className="quantity-selector">
                    <button
                      className="qty-btn"
                      onClick={() => updateMenuItemQuantity(item.id, quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <span className="qty-display">{quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateMenuItemQuantity(item.id, quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => addToCart(item, quantity)}
                  >
                    Add {quantity > 1 ? `(${quantity})` : ''}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Render cart
  if (step === 'cart') {
    return (
      <div className="customer-app">
        <div className="header">
          <button onClick={() => setStep('menu')}>&larr; Back</button>
          <h1>Your Cart</h1>
        </div>
        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button onClick={() => setStep('menu')}>Browse Menu</button>
          </div>
        ) : (
          <div className="cart">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div>
                  <h4>{item.name}</h4>
                  <p>${item.price.toFixed(2)}</p>
                </div>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <p className="item-total">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="cart-total">
              <h3>Total: ${getCartTotal().toFixed(2)}</h3>
            </div>
            <button className="checkout-btn" onClick={() => setStep('payment-method')}>
              Select Payment Method
            </button>
          </div>
        )}
      </div>
    );
  }

  // Render payment method selection
  if (step === 'payment-method') {
    const enabledMethods = Object.entries(paymentMethods).filter(([_, config]) => config.enabled);

    return (
      <div className="customer-app">
        <div className="header">
          <button onClick={() => setStep('cart')}>&larr; Back</button>
          <h1>Payment Method</h1>
        </div>
        <div className="payment-method-selection">
          <h3>Select how you'd like to pay</h3>
          <div className="payment-methods-grid">
            {paymentMethods.card?.enabled && (
              <div
                className="payment-method-card"
                onClick={() => {
                  setPaymentMethod('card');
                  setStep('checkout');
                }}
              >
                <div className="payment-icon">💳</div>
                <h4>Credit/Debit Card</h4>
                <p>Visa, Mastercard, Amex</p>
              </div>
            )}

            {paymentMethods.applePay?.enabled && (
              <div
                className="payment-method-card"
                onClick={() => {
                  setPaymentMethod('applePay');
                  setStep('checkout');
                }}
              >
                <div className="payment-icon"></div>
                <h4>Apple Pay</h4>
                <p>Pay with Apple Pay</p>
              </div>
            )}

            {paymentMethods.googlePay?.enabled && (
              <div
                className="payment-method-card"
                onClick={() => {
                  setPaymentMethod('googlePay');
                  setStep('checkout');
                }}
              >
                <div className="payment-icon">🟢</div>
                <h4>Google Pay</h4>
                <p>Pay with Google Pay</p>
              </div>
            )}

            {paymentMethods.payNow?.enabled && (
              <div
                className="payment-method-card"
                onClick={() => {
                  setPaymentMethod('payNow');
                  setStep('paynow');
                }}
              >
                <div className="payment-icon">📱</div>
                <h4>PayNow</h4>
                <p>Scan QR to pay</p>
              </div>
            )}

            {paymentMethods.payAtCounter?.enabled && (
              <div
                className="payment-method-card"
                onClick={() => {
                  setPaymentMethod('payAtCounter');
                  handlePayAtCounter();
                }}
              >
                <div className="payment-icon">🏪</div>
                <h4>Pay at Counter</h4>
                <p>Pay when you collect</p>
              </div>
            )}
          </div>
          {enabledMethods.length === 0 && (
            <p className="no-payment-methods">No payment methods available</p>
          )}
        </div>
      </div>
    );
  }

  // Render PayNow QR Code
  if (step === 'paynow') {
    return (
      <div className="customer-app">
        <div className="header">
          <button onClick={() => setStep('payment-method')}>&larr; Back</button>
          <h1>PayNow Payment</h1>
        </div>
        <div className="paynow-screen">
          <h3>Scan to Pay</h3>
          <div className="paynow-qr">
            <QRCode
              value={`SGQR://paynow/1/${paymentMethods.payNow?.uenNumber}/${getCartTotal().toFixed(2)}`}
              size={250}
            />
          </div>
          <div className="paynow-details">
            <p className="amount">Amount: ${getCartTotal().toFixed(2)}</p>
            <p className="instructions">
              1. Open your banking app<br />
              2. Select PayNow QR<br />
              3. Scan the QR code above<br />
              4. Complete payment
            </p>
          </div>
          <button className="confirm-payment-btn" onClick={handlePayNowConfirm}>
            I've Completed Payment
          </button>
          {processing && <p className="processing-message">Processing your order...</p>}
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    );
  }

  // Render checkout
  if (step === 'checkout') {
    const paymentMethodName = paymentMethod === 'card' ? 'Card Payment' :
                              paymentMethod === 'applePay' ? 'Apple Pay' :
                              paymentMethod === 'googlePay' ? 'Google Pay' : 'Checkout';

    return (
      <div className="customer-app">
        <div className="header">
          <button onClick={() => setStep('payment-method')}>&larr; Back</button>
          <h1>{paymentMethodName}</h1>
        </div>
        <div className="checkout">
          <div className="order-summary">
            <h3>Order Summary</h3>
            {cart.map(item => (
              <div key={item.id} className="summary-item">
                <span>{item.quantity}x {item.name}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="summary-total">
              <strong>Total:</strong>
              <strong>${getCartTotal().toFixed(2)}</strong>
            </div>
          </div>

          <form onSubmit={handlePayment} className="payment-form">
            <h3>Payment Details</h3>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={!stripe || processing}>
              {processing ? 'Processing...' : `Pay $${getCartTotal().toFixed(2)}`}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render success
  if (step === 'success') {
    return (
      <div className="customer-app">
        <div className="success-screen">
          <div className="success-icon">✅</div>
          <h1>Order Confirmed!</h1>
          <p className="order-number">Order #{orderNumber}</p>
          <p>Your order has been sent to the kitchen</p>
          <button onClick={() => { setStep('select'); setSelectedRestaurant(null); }}>
            Place Another Order
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default CustomerApp;
