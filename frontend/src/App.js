import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CustomerApp from './components/CustomerApp';
import KitchenDisplay from './components/KitchenDisplay';
import MerchantDashboard from './components/MerchantDashboard';
import './App.css';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function App() {
  const [view, setView] = useState('customer'); // 'customer', 'kitchen', or 'merchant'

  // Detect view from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam === 'kitchen') {
      setView('kitchen');
    } else if (viewParam === 'merchant') {
      setView('merchant');
    }
  }, []);

  return (
    <div className="App">
      {/* View Switcher - for demo purposes */}
      <div className="view-switcher">
        <button
          className={view === 'customer' ? 'active' : ''}
          onClick={() => setView('customer')}
        >
          📱 Customer
        </button>
        <button
          className={view === 'kitchen' ? 'active' : ''}
          onClick={() => setView('kitchen')}
        >
          🍳 Kitchen
        </button>
        <button
          className={view === 'merchant' ? 'active' : ''}
          onClick={() => setView('merchant')}
        >
          🏪 Merchant
        </button>
      </div>

      {/* Render appropriate view */}
      {view === 'customer' ? (
        <Elements stripe={stripePromise}>
          <CustomerApp />
        </Elements>
      ) : view === 'kitchen' ? (
        <KitchenDisplay />
      ) : (
        <MerchantDashboard />
      )}
    </div>
  );
}

export default App;
