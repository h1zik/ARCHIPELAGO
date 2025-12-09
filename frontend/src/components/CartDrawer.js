import React, { useState } from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, getTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[60]"
        onClick={onClose}
        data-testid="cart-overlay"
      ></div>

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-[#F2EFE9] z-[60] shadow-2xl flex flex-col" data-testid="cart-drawer">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#D1CCC0]">
          <h2 className="text-2xl" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Your Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#EAE7E2] rounded-full transition-colors" data-testid="close-cart-button">
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12" data-testid="empty-cart">
              <p className="text-[#5C6B70] mb-4">Your cart is empty</p>
              <button onClick={onClose} className="btn-primary">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4" data-testid={`cart-item-${item.id}`}>
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-20 h-20 object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{item.name}</h3>
                    <p className="text-sm text-[#5C6B70] mb-2">{item.size}</p>
                    <p className="text-[#A27B5C] font-medium">Rp {item.price.toLocaleString('id-ID')}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-[#EAE7E2] rounded"
                        data-testid={`decrease-quantity-${item.id}`}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm w-8 text-center" data-testid={`quantity-${item.id}`}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-[#EAE7E2] rounded"
                        data-testid={`increase-quantity-${item.id}`}
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto p-1 hover:text-[#9A3B3B] transition-colors"
                        data-testid={`remove-item-${item.id}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-[#D1CCC0] p-6 space-y-4">
            <div className="flex justify-between text-lg" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              <span>Total</span>
              <span className="font-bold" data-testid="cart-total">Rp {getTotal().toLocaleString('id-ID')}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="btn-primary w-full"
              data-testid="checkout-button"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;