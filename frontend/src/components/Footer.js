import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#2C3639] text-[#DCD7C9] mt-24" data-testid="footer">
      <div className="container mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Archipelago Scent
            </h3>
            <p className="text-sm leading-relaxed text-[#DCD7C9]/80 max-w-md">
              Perjalanan olfaktori melalui enam pulau Indonesia. Setiap aroma adalah cerita, setiap botol adalah kenangan.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#A27B5C] transition-colors" data-testid="footer-instagram">
                <Instagram size={20} strokeWidth={1.5} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#A27B5C] transition-colors" data-testid="footer-facebook">
                <Facebook size={20} strokeWidth={1.5} />
              </a>
              <a href="mailto:hello@archipelagoscent.com" className="hover:text-[#A27B5C] transition-colors" data-testid="footer-email">
                <Mail size={20} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm uppercase tracking-widest mb-4 font-medium">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/islands" className="hover:text-[#A27B5C] transition-colors" data-testid="footer-link-islands">Islands</Link></li>
              <li><Link to="/shop" className="hover:text-[#A27B5C] transition-colors" data-testid="footer-link-shop">Shop</Link></li>
              <li><Link to="/discovery-set" className="hover:text-[#A27B5C] transition-colors" data-testid="footer-link-discovery">Discovery Set</Link></li>
              <li><Link to="/about" className="hover:text-[#A27B5C] transition-colors" data-testid="footer-link-about">About</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm uppercase tracking-widest mb-4 font-medium">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/support" className="hover:text-[#A27B5C] transition-colors" data-testid="footer-link-faq">FAQ</Link></li>
              <li><Link to="/support" className="hover:text-[#A27B5C] transition-colors" data-testid="footer-link-contact">Contact</Link></li>
              <li><Link to="/support" className="hover:text-[#A27B5C] transition-colors" data-testid="footer-link-shipping">Shipping</Link></li>
              <li><Link to="/support" className="hover:text-[#A27B5C] transition-colors" data-testid="footer-link-returns">Returns</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#DCD7C9]/20 mt-12 pt-8 text-center text-sm text-[#DCD7C9]/60">
          <p>&copy; 2025 Archipelago Scent. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;