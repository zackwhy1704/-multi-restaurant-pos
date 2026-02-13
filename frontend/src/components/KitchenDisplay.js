import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './KitchenDisplay.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function KitchenDisplay() {
  const [orders, setOrders] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('all');
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchRestaurants();
    // Poll for new orders every 3 seconds
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [selectedRestaurant]);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/restaurants`);
      setRestaurants(response.data.restaurants || []);
    } catch (err) {
      console.error('Failed to fetch restaurants:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const params = selectedRestaurant !== 'all' ? { restaurantId: selectedRestaurant } : {};
      const response = await axios.get(`${API_URL}/api/orders`, { params });
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`${API_URL}/api/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error('Failed to update order:', err);
    }
  };

  const getOrderAge = (createdAt) => {
    const minutes = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
    return minutes;
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  const getUrgencyClass = (createdAt) => {
    const age = getOrderAge(createdAt);
    if (age > 20) return 'urgent';
    if (age > 10) return 'warning';
    return '';
  };

  return (
    <div className="kitchen-display">
      <div className="kds-header">
        <h1>🍳 Kitchen Display System</h1>
        <div className="restaurant-filter">
          <select value={selectedRestaurant} onChange={(e) => setSelectedRestaurant(e.target.value)}>
            <option value="all">All Restaurants</option>
            {restaurants.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
        <div className="stats">
          <span className="stat">New: {getOrdersByStatus('pending').length}</span>
          <span className="stat">Preparing: {getOrdersByStatus('preparing').length}</span>
          <span className="stat">Ready: {getOrdersByStatus('ready').length}</span>
        </div>
      </div>

      <div className="kds-columns">
        {/* New Orders */}
        <div className="kds-column">
          <h2 className="column-header new">🆕 New Orders ({getOrdersByStatus('pending').length})</h2>
          <div className="orders-list">
            {getOrdersByStatus('pending').map(order => (
              <div key={order.id} className={`order-card ${getUrgencyClass(order.createdAt)}`}>
                <div className="order-header">
                  <span className="order-number">#{order.orderNumber}</span>
                  <span className="order-time">{getOrderAge(order.createdAt)} min</span>
                </div>
                <div className="restaurant-name">{order.restaurantName}</div>
                <div className="order-items">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <span className="quantity">{item.quantity}x</span>
                      <span className="item-name">{item.name}</span>
                    </div>
                  ))}
                </div>
                <div className="order-total">${order.total.toFixed(2)}</div>
                <button
                  className="btn-start"
                  onClick={() => updateOrderStatus(order.id, 'preparing')}
                >
                  Start Preparing
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Preparing */}
        <div className="kds-column">
          <h2 className="column-header preparing">👨‍🍳 Preparing ({getOrdersByStatus('preparing').length})</h2>
          <div className="orders-list">
            {getOrdersByStatus('preparing').map(order => (
              <div key={order.id} className={`order-card ${getUrgencyClass(order.createdAt)}`}>
                <div className="order-header">
                  <span className="order-number">#{order.orderNumber}</span>
                  <span className="order-time">{getOrderAge(order.createdAt)} min</span>
                </div>
                <div className="restaurant-name">{order.restaurantName}</div>
                <div className="order-items">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <span className="quantity">{item.quantity}x</span>
                      <span className="item-name">{item.name}</span>
                    </div>
                  ))}
                </div>
                <div className="order-total">${order.total.toFixed(2)}</div>
                <button
                  className="btn-ready"
                  onClick={() => updateOrderStatus(order.id, 'ready')}
                >
                  Mark Ready
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Ready for Pickup */}
        <div className="kds-column">
          <h2 className="column-header ready">✅ Ready ({getOrdersByStatus('ready').length})</h2>
          <div className="orders-list">
            {getOrdersByStatus('ready').map(order => (
              <div key={order.id} className={`order-card ${getUrgencyClass(order.createdAt)}`}>
                <div className="order-header">
                  <span className="order-number">#{order.orderNumber}</span>
                  <span className="order-time">{getOrderAge(order.createdAt)} min</span>
                </div>
                <div className="restaurant-name">{order.restaurantName}</div>
                <div className="order-items">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <span className="quantity">{item.quantity}x</span>
                      <span className="item-name">{item.name}</span>
                    </div>
                  ))}
                </div>
                <div className="order-total">${order.total.toFixed(2)}</div>
                <button
                  className="btn-complete"
                  onClick={() => updateOrderStatus(order.id, 'completed')}
                >
                  Complete Order
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default KitchenDisplay;
