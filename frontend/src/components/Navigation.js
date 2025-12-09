import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import CartDrawer from './CartDrawer';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { getItemCount } = useCart();
  const location = useLocation();
  
  const isAdmin = location.pathname.startsWith('/admin');
  
  if (isAdmin) return null;

  const navLinks = [
    { name: 'Islands', path: '/islands' },
    { name: 'Shop', path: '/shop' },
    { name: 'Discovery Set', path: '/discovery-set' },
    { name: 'About', path: '/about' },
    { name: 'Support', path: '/support' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F2EFE9]/95 backdrop-blur-sm border-b border-[#D1CCC0]" data-testid="main-navigation">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center" data-testid="nav-logo">
              <img 
                src="https://customer-assets.emergentagent.com/job_fragrant-isles/artifacts/01hjnpjn_LOGO_HKI__2_-removebg-preview.png" 
                alt="Archipelago Scent" 
                className="h-16"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm uppercase tracking-widest hover:text-[#A27B5C] transition-colors"
                  data-testid={`nav-link-${link.name.toLowerCase().replace(' ', '-')}`}
                >
                  {link.name}
                </Link>
              ))}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 hover:text-[#A27B5C] transition-colors"
                data-testid="cart-button"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {getItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#A27B5C] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" data-testid="cart-count">
                    {getItemCount()}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2"
                data-testid="mobile-cart-button"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {getItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#A27B5C] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getItemCount()}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
                data-testid="mobile-menu-button"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#F2EFE9] border-t border-[#D1CCC0]" data-testid="mobile-menu">
            <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm uppercase tracking-widest hover:text-[#A27B5C] transition-colors"
                  data-testid={`mobile-nav-link-${link.name.toLowerCase().replace(' ', '-')}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-32"></div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navigation;