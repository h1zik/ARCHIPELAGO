import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Toaster } from './components/ui/sonner';

// Public Pages
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import IslandsCollection from './pages/IslandsCollection';
import IslandStory from './pages/IslandStory';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import DiscoverySet from './pages/DiscoverySet';
import About from './pages/About';
import Support from './pages/Support';
import Checkout from './pages/Checkout';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageIslands from './pages/admin/ManageIslands';
import ManageProducts from './pages/admin/ManageProducts';
import ManageOrders from './pages/admin/ManageOrders';
import ManageQuiz from './pages/admin/ManageQuiz';
import ThemeSettings from './pages/admin/ThemeSettings';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<><Navigation /><Home /><Footer /></>} />
              <Route path="/islands" element={<><Navigation /><IslandsCollection /><Footer /></>} />
              <Route path="/islands/:slug" element={<><Navigation /><IslandStory /><Footer /></>} />
              <Route path="/shop" element={<><Navigation /><Shop /><Footer /></>} />
              <Route path="/products/:id" element={<><Navigation /><ProductDetail /><Footer /></>} />
              <Route path="/discovery-set" element={<><Navigation /><DiscoverySet /><Footer /></>} />
              <Route path="/about" element={<><Navigation /><About /><Footer /></>} />
              <Route path="/support" element={<><Navigation /><Support /><Footer /></>} />
              <Route path="/checkout" element={<><Navigation /><Checkout /><Footer /></>} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/islands"
                element={
                  <PrivateRoute>
                    <ManageIslands />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <PrivateRoute>
                    <ManageProducts />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <PrivateRoute>
                    <ManageOrders />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/quiz"
                element={
                  <PrivateRoute>
                    <ManageQuiz />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/theme"
                element={
                  <PrivateRoute>
                    <ThemeSettings />
                  </PrivateRoute>
                }
              />
              <Route path="/admin/*" element={<Navigate to="/admin/dashboard" />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
