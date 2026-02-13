import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './MerchantDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function MerchantDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const selectRestaurant = useCallback((restaurant) => {
    setSelectedRestaurant(restaurant);
    setPaymentMethods(restaurant.paymentMethods || {});
  }, []);

  const fetchRestaurants = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/restaurants`);
      setRestaurants(response.data.restaurants || []);
      if (response.data.restaurants && response.data.restaurants.length > 0) {
        selectRestaurant(response.data.restaurants[0]);
      }
    } catch (err) {
      console.error('Failed to fetch restaurants:', err);
    }
  }, [selectRestaurant]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const togglePaymentMethod = (method) => {
    setPaymentMethods({
      ...paymentMethods,
      [method]: {
        ...paymentMethods[method],
        enabled: !paymentMethods[method]?.enabled,
      },
    });
  };

  const handleSave = async () => {
    if (!selectedRestaurant) return;

    setSaving(true);
    setMessage('');

    try {
      await axios.patch(
        `${API_URL}/api/restaurants/${selectedRestaurant.id}/payment-methods`,
        paymentMethods
      );
      setMessage('Payment settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to save settings');
      console.error('Error saving payment methods:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!selectedRestaurant) {
    return (
      <div className="merchant-dashboard">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="merchant-dashboard">
      <div className="dashboard-header">
        <h1>🏪 Merchant Dashboard</h1>
        <p className="subtitle">{selectedRestaurant.name}</p>
      </div>

      <div className="dashboard-content">
        <div className="settings-section">
          <h2>Payment Methods</h2>
          <p className="section-description">
            Enable or disable payment methods for your customers
          </p>

          <div className="payment-settings">
            {/* Card Payment */}
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-icon">💳</div>
                <div>
                  <h3>Credit/Debit Card</h3>
                  <p>Visa, Mastercard, Amex</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={paymentMethods.card?.enabled || false}
                  onChange={() => togglePaymentMethod('card')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {/* Apple Pay */}
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-icon"></div>
                <div>
                  <h3>Apple Pay</h3>
                  <p>Quick checkout for Apple users</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={paymentMethods.applePay?.enabled || false}
                  onChange={() => togglePaymentMethod('applePay')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {/* Google Pay */}
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-icon">🟢</div>
                <div>
                  <h3>Google Pay</h3>
                  <p>Quick checkout for Android users</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={paymentMethods.googlePay?.enabled || false}
                  onChange={() => togglePaymentMethod('googlePay')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {/* PayNow */}
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-icon">📱</div>
                <div>
                  <h3>PayNow</h3>
                  <p>Singapore QR code payment</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={paymentMethods.payNow?.enabled || false}
                  onChange={() => togglePaymentMethod('payNow')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {/* Pay at Counter */}
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-icon">🏪</div>
                <div>
                  <h3>Pay at Counter</h3>
                  <p>Pay when collecting order</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={paymentMethods.payAtCounter?.enabled || false}
                  onChange={() => togglePaymentMethod('payAtCounter')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <button
            className="save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          {message && (
            <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </div>

        <div className="info-section">
          <div className="info-card">
            <h3>💡 Tips</h3>
            <ul>
              <li>Enable multiple payment options to increase sales</li>
              <li>PayNow is popular among Singapore customers</li>
              <li>Apple Pay and Google Pay offer faster checkout</li>
              <li>Pay at Counter reduces payment processing fees</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MerchantDashboard;
