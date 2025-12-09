import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(credentials.username, credentials.password);
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2EFE9] flex items-center justify-center" data-testid="admin-login-page">
      <div className="bg-white p-12 rounded-lg shadow-lg max-w-md w-full">
        <h1
          className="text-4xl mb-8 text-center"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
          data-testid="login-title"
        >
          Admin Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm uppercase tracking-widest mb-2 font-medium">
              Username
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              required
              className="w-full p-4 border border-[#D1CCC0] focus:border-[#A27B5C] outline-none transition-colors"
              data-testid="input-username"
            />
          </div>

          <div>
            <label className="block text-sm uppercase tracking-widest mb-2 font-medium">
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
              className="w-full p-4 border border-[#D1CCC0] focus:border-[#A27B5C] outline-none transition-colors"
              data-testid="input-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="login-button"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-[#5C6B70]">
          <p>Default credentials for first time:</p>
          <p className="mt-2">
            Register via POST /api/auth/register<br />
            with username, email, and password
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;