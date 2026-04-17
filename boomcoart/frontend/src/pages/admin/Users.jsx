import { useState, useEffect } from 'react';
import { FiShield, FiUserX } from 'react-icons/fi';
import { getAllUsers, updateUserRole, deactivateUser } from '../../services/userService';
import Loader from '../../components/common/Loader';
import { AdminNav } from './Dashboard';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import './Admin.css';

export default function AdminUsers() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getAllUsers().then(({ data }) => setUsers(data.data)).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Make ${user.name} a ${newRole}?`)) return;
    try { await updateUserRole(user._id, newRole); toast.success(`Role updated to ${newRole}`); load(); } catch { toast.error('Failed'); }
  };

  const deactivate = async (user) => {
    if (!window.confirm(`Deactivate ${user.name}?`)) return;
    try { await deactivateUser(user._id); toast.success('User deactivated'); load(); } catch { toast.error('Failed'); }
  };

  return (
    <div className="admin-layout">
      <Helmet><title>Users — Admin | Boomcoart</title></Helmet>
      <AdminNav />
      <div className="admin-content">
        <h1 className="admin-page-title">Users</h1>
        {loading ? <Loader /> : (
          <div className="card" style={{ padding:0, overflow:'hidden' }}>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--navy)', color:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:14, flexShrink:0 }}>
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                          <span style={{ fontWeight:600, color:'var(--navy)', fontSize:14 }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ fontSize:14, color:'var(--gray-600)' }}>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role==='admin'?'badge-navy':'badge-gray'}`}>
                          {u.role==='admin' && <FiShield size={11} style={{ marginRight:4 }} />}
                          {u.role}
                        </span>
                      </td>
                      <td><span className={`badge ${u.isActive?'badge-green':'badge-red'}`}>{u.isActive?'Active':'Inactive'}</span></td>
                      <td style={{ fontSize:13, color:'var(--gray-400)' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        <div style={{ display:'flex', gap:6 }}>
                          <button className="btn btn-outline btn-sm" onClick={() => toggleRole(u)} title={u.role==='admin'?'Revoke admin':'Make admin'}>
                            <FiShield size={13}/> {u.role==='admin'?'Revoke':'Admin'}
                          </button>
                          {u.isActive && (
                            <button className="btn btn-danger btn-sm" onClick={() => deactivate(u)} title="Deactivate">
                              <FiUserX size={13}/>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
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
