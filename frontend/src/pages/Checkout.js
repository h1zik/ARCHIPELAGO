import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const Checkout = () => {
  const { cart, getTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    notes: ''
  });

  const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        ...formData,
        items: cart.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      };

      await axios.post(`${API}/orders`, orderData);
      clearCart();
      toast.success('Order placed successfully! We will contact you shortly.');
      navigate('/');
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F2EFE9] flex items-center justify-center" data-testid="empty-checkout">
        <div className="text-center">
          <h1
            className="text-4xl mb-6"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Your cart is empty
          </h1>
          <button
            onClick={() => navigate('/shop')}
            className="btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2EFE9] section-padding" data-testid="checkout-page">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <h1
          className="text-4xl md:text-5xl mb-12 text-center"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
          data-testid="checkout-title"
        >
          Checkout
        </h1>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Order Form */}
          <div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Shipping Information
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm uppercase tracking-widest mb-2 font-medium">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 bg-transparent border-b border-[#D1CCC0] focus:border-[#A27B5C] outline-none transition-colors"
                  data-testid="input-name"
                />
              </div>

              <div>
                <label className="block text-sm uppercase tracking-widest mb-2 font-medium">
                  Email *
                </label>
                <input
                  type="email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 bg-transparent border-b border-[#D1CCC0] focus:border-[#A27B5C] outline-none transition-colors"
                  data-testid="input-email"
                />
              </div>

              <div>
                <label className="block text-sm uppercase tracking-widest mb-2 font-medium">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 bg-transparent border-b border-[#D1CCC0] focus:border-[#A27B5C] outline-none transition-colors"
                  data-testid="input-phone"
                />
              </div>

              <div>
                <label className="block text-sm uppercase tracking-widest mb-2 font-medium">
                  Shipping Address *
                </label>
                <textarea
                  name="customer_address"
                  value={formData.customer_address}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full p-4 bg-transparent border border-[#D1CCC0] focus:border-[#A27B5C] outline-none transition-colors"
                  data-testid="input-address"
                />
              </div>

              <div>
                <label className="block text-sm uppercase tracking-widest mb-2 font-medium">
                  Order Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Special instructions for your order..."
                  className="w-full p-4 bg-transparent border border-[#D1CCC0] focus:border-[#A27B5C] outline-none transition-colors placeholder:text-[#5C6B70]/40"
                  data-testid="input-notes"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="submit-order-button"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Order Summary
            </h2>
            <div className="bg-[#EAE7E2] p-8 rounded space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between" data-testid={`summary-item-${item.id}`}>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-[#5C6B70]">Qty: {item.quantity} × Rp {item.price.toLocaleString('id-ID')}</p>
                  </div>
                  <p className="font-medium">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                </div>
              ))}

              <div className="border-t border-[#D1CCC0] pt-6">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>Rp {getTotal().toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between mb-2 text-sm text-[#5C6B70]">
                  <span>Shipping</span>
                  <span>{getTotal() >= 500000 ? 'FREE' : 'Calculated at next step'}</span>
                </div>
              </div>

              <div
                className="border-t border-[#D1CCC0] pt-6 flex justify-between text-xl"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                <span className="font-bold">Total</span>
                <span className="font-bold text-[#A27B5C]" data-testid="order-total">
                  Rp {getTotal().toLocaleString('id-ID')}
                </span>
              </div>

              <div className="text-sm text-[#5C6B70] leading-relaxed">
                <p className="mb-2">✓ Secure checkout</p>
                <p className="mb-2">✓ Our team will contact you for payment confirmation</p>
                <p>✓ Shipping in 3-7 business days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;