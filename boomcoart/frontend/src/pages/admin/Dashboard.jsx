import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiGrid, FiPackage, FiUsers, FiShoppingBag, FiDollarSign, FiTrendingUp, FiClock, FiCheckCircle } from 'react-icons/fi';
import { getDashboardStats } from '../../services/orderService';
import Loader from '../../components/common/Loader';
import { Helmet } from 'react-helmet-async';
import './Admin.css';

function AdminNav() {
  const { pathname } = useLocation();
  const links = [
    { to:'/admin',          label:'Dashboard',  Icon:FiGrid },
    { to:'/admin/products', label:'Products',   Icon:FiShoppingBag },
    { to:'/admin/orders',   label:'Orders',     Icon:FiPackage },
    { to:'/admin/users',    label:'Users',      Icon:FiUsers },
  ];
  return (
    <aside className="admin-sidebar">
      <p className="admin-sidebar-title">Admin Panel</p>
      {links.map(({ to, label, Icon }) => (
        <Link key={to} to={to} className={`admin-nav-link ${pathname===to?'active':''}`}>
          <Icon size={16} /> {label}
        </Link>
      ))}
    </aside>
  );
}

export { AdminNav };

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then(({ data }) => setStats(data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = stats ? [
    { label:'Total Revenue', value:`₹${stats.totalRevenue?.toLocaleString()}`, Icon:FiDollarSign, bg:'#eff6ff', color:'#1d4ed8' },
    { label:'Total Orders',  value:stats.totalOrders,  Icon:FiPackage,     bg:'#f5f3ff', color:'#6d28d9' },
    { label:'Total Users',   value:stats.totalUsers,   Icon:FiUsers,       bg:'#ecfdf5', color:'#065f46' },
    { label:'Products',      value:stats.totalProducts,Icon:FiShoppingBag, bg:'#fff7ed', color:'#c2410c' },
    { label:'Paid Orders',   value:stats.paidOrders,   Icon:FiCheckCircle, bg:'#dcfce7', color:'#15803d' },
    { label:'Pending Orders',value:stats.pendingOrders,Icon:FiClock,       bg:'#fef9c3', color:'#854d0e' },
  ] : [];

  return (
    <div className="admin-layout">
      <Helmet><title>Admin Dashboard — Boomcoart</title></Helmet>
      <AdminNav />
      <div className="admin-content">
        <h1 className="admin-page-title">Dashboard</h1>
        {loading ? <Loader /> : (
          <>
            <div className="stat-grid">
              {STAT_CARDS.map(({ label, value, Icon, bg, color }) => (
                <div key={label} className="stat-card">
                  <div className="stat-icon" style={{ background:bg, color }}><Icon /></div>
                  <div><p className="stat-label">{label}</p><p className="stat-value">{value}</p></div>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding:0, overflow:'hidden' }}>
              <div style={{ padding:'18px 24px', borderBottom:'1px solid var(--gray-100)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <h3 style={{ fontFamily:'var(--font-serif)', fontSize:18, color:'var(--navy)' }}>Recent Orders</h3>
                <Link to="/admin/orders" className="btn btn-outline btn-sm">View All</Link>
              </div>
              <div className="table-wrap">
                <table className="table">
                  <thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {stats?.recentOrders?.map(o => (
                      <tr key={o._id}>
                        <td style={{ fontFamily:'monospace', fontSize:13 }}>#{o._id.slice(-8).toUpperCase()}</td>
                        <td>
                          <p style={{ fontWeight:600, color:'var(--navy)', fontSize:14 }}>{o.user?.name}</p>
                          <p style={{ fontSize:12, color:'var(--gray-400)' }}>{o.user?.email}</p>
                        </td>
                        <td style={{ fontWeight:700, color:'var(--navy)' }}>₹{o.totalPrice?.toLocaleString()}</td>
                        <td><span className={`badge ${o.orderStatus==='delivered'?'badge-green':o.orderStatus==='cancelled'?'badge-red':'badge-blue'}`}>{o.orderStatus}</span></td>
                        <td style={{ fontSize:13, color:'var(--gray-400)' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
