import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiSettings, FiPackage, FiShield } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) { navigate('/'); setSearchParams({ keyword: query.trim() }); setMenuOpen(false); }
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-b">B</span>oomcoart
        </Link>

        {/* Search bar — desktop */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            className="navbar-search-input"
            type="text"
            placeholder="Search clothing, brands..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button type="submit" className="navbar-search-btn" aria-label="Search">
            <FiSearch size={18} />
          </button>
        </form>

        {/* Right actions */}
        <div className="navbar-actions">
          {/* Cart */}
          <Link to="/cart" className="nav-icon-btn" aria-label="Cart">
            <FiShoppingCart size={20} />
            {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
          </Link>

          {/* Wishlist */}
          {user && (
            <Link to="/wishlist" className="nav-icon-btn" aria-label="Wishlist">
              <FiHeart size={20} />
            </Link>
          )}

          {/* User menu */}
          {user ? (
            <div className="nav-user-drop" ref={dropRef}>
              <button className="nav-avatar-btn" onClick={() => setDropOpen(!dropOpen)} aria-label="Account">
                <div className="nav-avatar">{user.name?.[0]?.toUpperCase()}</div>
              </button>
              {dropOpen && (
                <div className="drop-menu">
                  <div className="drop-header">
                    <p className="drop-name">{user.name}</p>
                    <p className="drop-email">{user.email}</p>
                  </div>
                  <Link to="/profile" className="drop-item" onClick={() => setDropOpen(false)}><FiUser size={15}/> My Profile</Link>
                  <Link to="/profile?tab=orders" className="drop-item" onClick={() => setDropOpen(false)}><FiPackage size={15}/> My Orders</Link>
                  {isAdmin && <Link to="/admin" className="drop-item drop-item--admin" onClick={() => setDropOpen(false)}><FiShield size={15}/> Admin Panel</Link>}
                  <button className="drop-item drop-item--logout" onClick={() => { logout(); setDropOpen(false); navigate('/'); }}>
                    <FiLogOut size={15}/> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
          )}

          {/* Mobile menu toggle */}
          <button className="nav-mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Category bar */}
      <div className="navbar-cats">
        <div className="container">
          <nav className="cats-nav">
            {[['All',''], ['Bridal','bridal'], ['Men','men'], ['Women','women'], ['Boys','boys'], ['Girls','girls'], ['Sale','isFeatured=true']].map(([label, val]) => (
              <Link key={label} to={val ? `/?${val.includes('=') ? val : `category=${val}`}` : '/'} className="cat-link">
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="mobile-menu">
          <form className="mobile-search" onSubmit={handleSearch}>
            <input className="navbar-search-input" type="text" placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} />
            <button type="submit" className="navbar-search-btn"><FiSearch size={18}/></button>
          </form>
          <div className="mobile-links">
            {[['Home','/'], ['Cart','/cart'], ['Wishlist','/wishlist'], ['Profile','/profile']].map(([l, h]) => (
              <Link key={h} to={h} className="mobile-link" onClick={() => setMenuOpen(false)}>{l}</Link>
            ))}
            {isAdmin && <Link to="/admin" className="mobile-link mobile-link--admin" onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
            {user ? (
              <button className="mobile-link mobile-link--logout" onClick={() => { logout(); setMenuOpen(false); navigate('/'); }}>Logout</button>
            ) : (
              <Link to="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>Login / Register</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
