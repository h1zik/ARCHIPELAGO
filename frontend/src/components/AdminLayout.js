import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  MapPin,
  Package,
  HelpCircle,
  ShoppingCart,
  Palette,
  LogOut
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Islands', path: '/admin/islands', icon: MapPin },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Quiz', path: '/admin/quiz', icon: HelpCircle },
    { name: 'Theme', path: '/admin/theme', icon: Palette },
  ];

  return (
    <div className="flex min-h-screen bg-[#F2EFE9]" data-testid="admin-layout">
      {/* Sidebar */}
      <aside className="w-64 bg-[#DCD7C9] min-h-screen p-6 flex flex-col">
        <div className="mb-8">
          <img 
            src="https://customer-assets.emergentagent.com/job_fragrant-isles/artifacts/01hjnpjn_LOGO_HKI__2_-removebg-preview.png" 
            alt="Archipelago Scent" 
            className="h-16 mb-2"
          />
          <p className="text-sm text-[#5C6B70]">Admin Panel</p>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded transition-colors ${
                  isActive
                    ? 'bg-[#A27B5C] text-white'
                    : 'hover:bg-[#EAE7E2] text-[#2C3639]'
                }`}
                data-testid={`nav-${item.name.toLowerCase()}`}
              >
                <Icon size={20} strokeWidth={1.5} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded hover:bg-[#EAE7E2] transition-colors text-[#2C3639] mt-auto"
          data-testid="logout-button"
        >
          <LogOut size={20} strokeWidth={1.5} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8" data-testid="admin-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;