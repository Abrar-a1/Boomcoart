import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import Loader from '../../components/common/Loader';
import { AdminNav } from './Dashboard';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import './Admin.css';

const STATUSES = ['pending','confirmed','processing','shipped','delivered','cancelled','refunded'];
const BADGE = { pending:'badge-orange', confirmed:'badge-blue', processing:'badge-blue', shipped:'badge-blue', delivered:'badge-green', cancelled:'badge-red', refunded:'badge-gray' };

export default function AdminOrders() {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('');
  const [updating, setUpdating] = useState(null);

  const load = (status='') => {
    setLoading(true);
    getAllOrders(status ? { status } : {}).then(({ data }) => setOrders(data.data)).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => load(filter), [filter]);

  const handleStatusUpdate = async (orderId, status, trackingNumber) => {
    setUpdating(orderId);
    try { await updateOrderStatus(orderId, { status, trackingNumber }); toast.success('Status updated'); load(filter); }
    catch { toast.error('Failed to update'); }
    finally { setUpdating(null); }
  };

  return (
    <div className="admin-layout">
      <Helmet><title>Orders — Admin | Boomcoart</title></Helmet>
      <AdminNav />
      <div className="admin-content">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12, marginBottom:24 }}>
          <h1 className="admin-page-title" style={{ marginBottom:0 }}>Orders</h1>
          <select className="form-input" style={{ width:'auto', minWidth:160 }} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
          </select>
        </div>

        {loading ? <Loader /> : (
          <div className="card" style={{ padding:0, overflow:'hidden' }}>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Update Status</th><th>Tracking #</th></tr></thead>
                <tbody>
                  {orders.map(o => (
                    <OrderRow key={o._id} order={o} onUpdate={handleStatusUpdate} updating={updating === o._id} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderRow({ order: o, onUpdate, updating }) {
  const [status, setStatus]   = useState(o.orderStatus);
  const [tracking, setTracking] = useState(o.trackingNumber || '');

  return (
    <tr>
      <td>
        <p style={{ fontFamily:'monospace', fontSize:13, fontWeight:600 }}>#{o._id.slice(-8).toUpperCase()}</p>
        <p style={{ fontSize:12, color:'var(--gray-400)' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
        <p style={{ fontSize:11, color: o.isPaid?'var(--green)':'var(--orange)', fontWeight:600, marginTop:2 }}>{o.isPaid?'PAID':o.paymentMethod==='cod'?'COD':'UNPAID'}</p>
      </td>
      <td>
        <p style={{ fontWeight:600, color:'var(--navy)', fontSize:14 }}>{o.user?.name}</p>
        <p style={{ fontSize:12, color:'var(--gray-400)' }}>{o.user?.email}</p>
      </td>
      <td>
        <div style={{ display:'flex', gap:4 }}>
          {o.orderItems.slice(0,3).map(i => <img key={i._id} src={i.image} alt={i.name} style={{ width:36, height:44, objectFit:'cover', borderRadius:4 }} />)}
          {o.orderItems.length>3 && <span style={{ fontSize:11, color:'var(--gray-400)', alignSelf:'center' }}>+{o.orderItems.length-3}</span>}
        </div>
        <p style={{ fontSize:11, color:'var(--gray-400)', marginTop:4 }}>{o.orderItems.length} item{o.orderItems.length>1?'s':''}</p>
      </td>
      <td style={{ fontWeight:700, color:'var(--navy)' }}>₹{o.totalPrice?.toLocaleString()}</td>
      <td><span className={`badge ${BADGE[o.orderStatus]||'badge-gray'}`}>{o.orderStatus}</span></td>
      <td>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <select className="form-input" style={{ fontSize:13, padding:'6px 10px' }} value={status} onChange={e => setStatus(e.target.value)}>
            {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
          </select>
          <button className="btn btn-primary btn-sm" disabled={updating} onClick={() => onUpdate(o._id, status, tracking)}>
            {updating ? '…' : 'Update'}
          </button>
        </div>
      </td>
      <td>
        <input className="form-input" style={{ fontSize:13, padding:'6px 10px', width:130 }} placeholder="Enter tracking #" value={tracking} onChange={e => setTracking(e.target.value)} />
      </td>
    </tr>
  );
}
