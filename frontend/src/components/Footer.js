import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#2C3639] text-[#DCD7C9]" data-testid="footer">
      <div className="container mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <img 
              src="https://customer-assets.emergentagent.com/job_fragrant-isles/artifacts/01hjnpjn_LOGO_HKI__2_-removebg-preview.png" 
              alt="Archipelago Scent" 
              className="h-12 mb-4"
            />
            <p className="text-sm leading-relaxed text-[#DCD7C9]/80 max-w-md mb-6">
              Perjalanan olfaktori melalui enam pulau Indonesia. Setiap aroma adalah cerita, setiap botol adalah kenangan.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#DCD7C9]/10 hover:bg-[#A27B5C] flex items-center justify-center transition-all" data-testid="footer-instagram">
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#DCD7C9]/10 hover:bg-[#A27B5C] flex items-center justify-center transition-all" data-testid="footer-facebook">
                <Facebook size={18} strokeWidth={1.5} />
              </a>
              <a href="mailto:hello@archipelagoscent.com" className="w-10 h-10 rounded-full bg-[#DCD7C9]/10 hover:bg-[#A27B5C] flex items-center justify-center transition-all" data-testid="footer-email">
                <Mail size={18} strokeWidth={1.5} />
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