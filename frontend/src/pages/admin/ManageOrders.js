import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import AdminLayout from '../../components/AdminLayout';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API}/admin/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`${API}/admin/orders/${orderId}`, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <AdminLayout>
      <div data-testid="manage-orders-page">
        <h1
          className="text-4xl mb-8"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Manage Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-lg text-center" data-testid="no-orders">
            <p className="text-[#5C6B70] text-lg">No orders yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#EAE7E2]">
                <tr>
                  <th className="text-left p-4 text-sm uppercase tracking-widest">Order ID</th>
                  <th className="text-left p-4 text-sm uppercase tracking-widest">Customer</th>
                  <th className="text-left p-4 text-sm uppercase tracking-widest">Items</th>
                  <th className="text-left p-4 text-sm uppercase tracking-widest">Total</th>
                  <th className="text-left p-4 text-sm uppercase tracking-widest">Status</th>
                  <th className="text-left p-4 text-sm uppercase tracking-widest">Date</th>
                  <th className="text-left p-4 text-sm uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-[#D1CCC0]/50" data-testid={`order-row-${order.id}`}>
                    <td className="p-4 font-mono text-sm">{order.id.substring(0, 8)}</td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-[#5C6B70]">{order.customer_email}</p>
                        <p className="text-sm text-[#5C6B70]">{order.customer_phone}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        {order.items.map((item, idx) => (
                          <div key={idx}>
                            {item.product_name} x{item.quantity}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-medium">Rp {order.total.toLocaleString('id-ID')}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs uppercase tracking-wide ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-[#5C6B70]">
                      {new Date(order.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className="text-sm border border-[#D1CCC0] rounded p-2"
                        data-testid={`status-select-${order.id}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageOrders;
