import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Helmet } from 'react-helmet-async';
import './Auth.css';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const [form, setForm] = useState({ email:'', password:'' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) navigate(from, { replace: true });
  };

  return (
    <div className="auth-page">
      <Helmet><title>Login — Boomcoart</title></Helmet>
      <div className="auth-card">
        <h1 className="auth-logo">Boomcoart</h1>
        <p className="auth-subtitle">Welcome back! Sign in to continue.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="form-input" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({...form, email:e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-input" placeholder="••••••••" value={form.password}
              onChange={e => setForm({...form, password:e.target.value})} required />
          </div>
          <button className="btn btn-primary btn-block btn-lg auth-submit" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <div style={{ textAlign:'right', marginTop:-8, marginBottom:4 }}>
          <Link to="/forgot-password" style={{ fontSize:13, color:'var(--gray-400)' }}>Forgot password?</Link>
        </div>
        <div className="auth-switch" style={{ marginTop:20 }}>
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}
