import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import Home from './pages/Home';

// Category Pages
import KidsCatalog from './pages/kids/KidsCatalog';
import BridalCatalog from './pages/bridal/BridalCatalog';
import ProductDetail from './pages/product/ProductDetail';

import Cart from './pages/cart/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderTracking from './pages/OrderTracking';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FDF7F0' }}>
      {/* ── Single global Navbar — never duplicated ── */}
      <Navbar />

      <main className="flex-grow flex justify-center">
        <div className="w-full max-w-[1100px] px-4 md:px-6 lg:px-8 py-6">
          <Routes>
            {/* Public */}
          <Route path="/"                       element={<Home />} />
          <Route path="/kids"                   element={<KidsCatalog />} />
          <Route path="/bridal"                 element={<BridalCatalog />} />
          <Route path="/product/:id"            element={<ProductDetail />} />
          <Route path="/cart"                   element={<Cart />} />
          <Route path="/login"                  element={<Login />} />
          <Route path="/register"               element={<Register />} />
          <Route path="/forgot-password"        element={<ForgotPassword />} />
          <Route path="/reset-password/:token"  element={<ResetPassword />} />

          {/* Protected (logged-in users only) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout"          element={<Checkout />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/order/:id"         element={<OrderTracking />} />
            <Route path="/wishlist"          element={<Wishlist />} />
            <Route path="/profile"           element={<Profile />} />
          </Route>

          {/* Admin only */}
          <Route element={<AdminRoute />}>
            <Route path="/admin"           element={<AdminDashboard />} />
            <Route path="/admin/products"  element={<AdminProducts />} />
            <Route path="/admin/orders"    element={<AdminOrders />} />
            <Route path="/admin/users"     element={<AdminUsers />} />
          </Route>

          <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>

      {/* ── Single global Footer ── */}
      <Footer />
    </div>
  );
}
