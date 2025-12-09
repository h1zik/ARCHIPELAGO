import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Package, MapPin, ShoppingCart, TrendingUp } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalIslands: 6,
    totalOrders: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/admin/orders`)
      ]);

      setStats({
        totalProducts: productsRes.data.length,
        totalIslands: 6,
        totalOrders: ordersRes.data.length,
        pendingOrders: ordersRes.data.filter(o => o.status === 'pending').length
      });

      setRecentOrders(ordersRes.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="spinner"></div>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-[#A27B5C]' },
    { label: 'Islands', value: stats.totalIslands, icon: MapPin, color: 'bg-[#5F7161]' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-[#3F4E4F]' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: TrendingUp, color: 'bg-[#D4AF37]' },
  ];

  return (
    <AdminLayout>
      <div data-testid="admin-dashboard">
        <h1
          className="text-4xl mb-8"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white p-6 rounded-lg shadow-sm"
                data-testid={`stat-card-${stat.label.toLowerCase().replace(' ', '-')}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 ${stat.color} text-white rounded-lg`}>
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                </div>
                <p className="text-sm text-[#5C6B70] mb-1">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-2xl"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Recent Orders
            </h2>
            <Link to="/admin/orders" className="text-[#A27B5C] hover:underline">
              View All
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-[#5C6B70]" data-testid="no-orders">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#D1CCC0] text-left">
                    <th className="pb-3 text-sm uppercase tracking-widest">Order ID</th>
                    <th className="pb-3 text-sm uppercase tracking-widest">Customer</th>
                    <th className="pb-3 text-sm uppercase tracking-widest">Total</th>
                    <th className="pb-3 text-sm uppercase tracking-widest">Status</th>
                    <th className="pb-3 text-sm uppercase tracking-widest">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-[#D1CCC0]/50" data-testid={`order-row-${order.id}`}>
                      <td className="py-4 text-sm font-mono">{order.id.substring(0, 8)}</td>
                      <td className="py-4">{order.customer_name}</td>
                      <td className="py-4">Rp {order.total.toLocaleString('id-ID')}</td>
                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs uppercase tracking-wide ${
                            order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'confirmed'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'shipped'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-[#5C6B70]">
                        {new Date(order.created_at).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;