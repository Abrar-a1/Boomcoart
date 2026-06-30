import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiPackage, FiShield } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../store/useStore';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const cart = useStore((state) => state.cart);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) { 
      navigate('/'); 
      setSearchParams({ keyword: query.trim() }); 
      setMenuOpen(false);
      setSearchOpen(false);
    }
  };

  const NAV_LINKS = [
    ['All', '/'],
    ['Bridal', '/bridal'],
    ['Men', '/?category=men'],
    ['Women', '/?category=women'],
    ['Kids', '/kids'],
    ['Sale', '/?isFeatured=true'],
  ];

  return (
    <header className="sticky top-0 z-50 shadow-sm" style={{ backgroundColor: '#1E3A3A' }}>
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-20">
          
          {/* ── Left: Logo ── */}
          <div className="flex justify-start">
            <Link to="/" className="font-heading text-2xl lg:text-3xl font-bold tracking-tight transition-colors" 
              style={{ color: '#ffffff' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#D4AF37'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#ffffff'; }}
            >
              Boomcoart
            </Link>
          </div>

          {/* ── Center: Navigation ── */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 justify-center items-center gap-6 lg:gap-8">
            {NAV_LINKS.map(([label, href]) => (
              <Link key={label} to={href}
                className="text-sm font-semibold tracking-[0.05em] uppercase transition-colors"
                style={{ color: 'rgba(255,255,255,0.85)' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#D4AF37'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* ── Right: Actions ── */}
          <div className="flex justify-end items-center gap-4 sm:gap-5">
            
            {/* Search Toggle */}
            <div className="relative">
              {!searchOpen ? (
                <button 
                  onClick={() => setSearchOpen(true)}
                  className="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
                  style={{ color: 'rgba(255,255,255,0.85)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#D4AF37'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
                  aria-label="Search"
                >
                  <FiSearch size={22} />
                </button>
              ) : (
                <form onSubmit={handleSearch} className="absolute right-0 top-1/2 -translate-y-1/2 w-[240px] sm:w-[300px] flex items-center bg-white rounded-full overflow-hidden shadow-lg animate-fade-in" style={{ border: '2px solid #D4AF37' }}>
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search premium fashion..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="flex-1 px-4 py-2.5 text-sm outline-none"
                    style={{ color: '#2C3E2F' }}
                  />
                  <button type="submit" className="px-4 py-2.5 bg-[#FDF7F0] hover:bg-[#E5D9C5] transition-colors text-[#1E3A3A]">
                    <FiSearch size={18} />
                  </button>
                  <button type="button" onClick={() => setSearchOpen(false)} className="px-3 hover:text-[#C25A3C] transition-colors text-[#2C3E2F]">
                    <FiX size={18} />
                  </button>
                </form>
              )}
            </div>

            {/* Wishlist */}
            {user && (
              <Link to="/wishlist" className="w-10 h-10 hidden sm:flex items-center justify-center rounded-full transition-colors"
                style={{ color: 'rgba(255,255,255,0.85)' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#D4AF37'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
                aria-label="Wishlist"
              >
                <FiHeart size={22} />
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative w-10 h-10 flex items-center justify-center rounded-full transition-colors"
               style={{ color: 'rgba(255,255,255,0.85)' }}
               onMouseEnter={e => { e.currentTarget.style.color = '#D4AF37'; }}
               onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
               aria-label="Cart"
             >
              <FiShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] flex items-center justify-center rounded-full text-[11px] font-bold px-1.5 shadow-sm"
                  style={{ backgroundColor: '#C25A3C', color: '#ffffff' }}>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account / Login */}
            {user ? (
              <div className="relative hidden sm:block" ref={dropRef}>
                <button onClick={() => setDropOpen(!dropOpen)}
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors shadow-sm"
                  style={{ backgroundColor: '#D4AF37', color: '#1E3A3A' }}
                  aria-label="Account"
                >
                  {user.name?.[0]?.toUpperCase()}
                </button>
                {dropOpen && (
                  <div className="absolute right-0 top-full mt-4 w-60 bg-white rounded-xl shadow-2xl overflow-hidden animate-slide-down z-50 border border-[#E5D9C5]">
                    <div className="px-5 py-4" style={{ backgroundColor: '#FDF7F0', borderBottom: '1px solid #E5D9C5' }}>
                      <p className="font-semibold text-sm" style={{ color: '#1E3A3A' }}>{user.name}</p>
                      <p className="text-xs mt-1" style={{ color: '#6b7c6e' }}>{user.email}</p>
                    </div>
                    <div className="py-2">
                      <Link to="/profile" className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[#FDF7F0]" style={{ color: '#2C3E2F' }} onClick={() => setDropOpen(false)}>
                        <FiUser size={16}/> My Profile
                      </Link>
                      <Link to="/profile?tab=orders" className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[#FDF7F0]" style={{ color: '#2C3E2F' }} onClick={() => setDropOpen(false)}>
                        <FiPackage size={16}/> My Orders
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" className="flex items-center gap-3 px-5 py-2.5 text-sm font-bold transition-colors hover:bg-[#FDF7F0]" style={{ color: '#D4AF37' }} onClick={() => setDropOpen(false)}>
                          <FiShield size={16}/> Admin Panel
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-[#E5D9C5] py-2">
                      <button className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[#fde8e4]"
                        style={{ color: '#C25A3C' }}
                        onClick={() => { logout(); setDropOpen(false); navigate('/'); }}>
                        <FiLogOut size={16}/> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden sm:inline-flex justify-center items-center px-6 py-2.5 ml-3 lg:ml-6 min-h-[44px] text-[15px] font-bold rounded-full transition-all hover:bg-white hover:shadow-lg"
                style={{ backgroundColor: '#D4AF37', color: '#1E3A3A' }}
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button className="md:hidden w-10 h-10 flex items-center justify-center transition-colors" 
              style={{ color: 'rgba(255,255,255,0.85)' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#D4AF37'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
              onClick={() => setMenuOpen(true)} aria-label="Menu"
            >
              <FiMenu size={24} />
            </button>
            
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-[200] transition-opacity" style={{ backgroundColor: 'rgba(30, 58, 58, 0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setMenuOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 w-[320px] max-w-[85vw] bg-[#FDF7F0] z-[201] shadow-2xl flex flex-col animate-slide-in">
            <div className="flex items-center justify-between px-6 py-5" style={{ backgroundColor: '#1E3A3A' }}>
              <span className="font-heading text-2xl font-bold tracking-tight" style={{ color: '#ffffff' }}>Menu</span>
              <button onClick={() => setMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full transition-colors hover:bg-white/10 text-white" aria-label="Close"
              >
                <FiX size={22} />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              <form onSubmit={handleSearch} className="flex rounded-full overflow-hidden shadow-sm mb-8" style={{ border: '1px solid #E5D9C5', backgroundColor: '#ffffff' }}>
                <input type="text" placeholder="Search premium fashion..." value={query} onChange={e => setQuery(e.target.value)}
                  className="flex-1 px-5 py-3 text-sm bg-transparent outline-none" style={{ color: '#2C3E2F' }} />
                <button type="submit" className="px-5 text-white transition-colors hover:opacity-90" style={{ backgroundColor: '#1E3A3A' }}><FiSearch size={18}/></button>
              </form>

              <div className="flex flex-col gap-2 mb-8">
                <span className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#9eaa9f' }}>Categories</span>
                {NAV_LINKS.map(([label, href]) => (
                  <Link key={label} to={href} className="flex items-center px-4 py-3.5 text-base font-semibold rounded-xl transition-colors hover:bg-white hover:shadow-sm"
                    style={{ color: '#1E3A3A' }} onClick={() => setMenuOpen(false)}>
                    {label}
                  </Link>
                ))}
              </div>

              <div className="flex flex-col gap-2 pt-6" style={{ borderTop: '1px solid #E5D9C5' }}>
                <span className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#9eaa9f' }}>Account</span>
                <Link to="/cart" className="flex items-center gap-4 px-4 py-3.5 text-base font-medium rounded-xl transition-colors hover:bg-white hover:shadow-sm"
                  style={{ color: '#2C3E2F' }} onClick={() => setMenuOpen(false)}>
                  <div className="relative">
                    <FiShoppingCart size={20}/>
                    {cartCount > 0 && <span className="absolute -top-1.5 -right-2 bg-[#C25A3C] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
                  </div>
                  Shopping Cart
                </Link>
                {user && <Link to="/wishlist" className="flex items-center gap-4 px-4 py-3.5 text-base font-medium rounded-xl transition-colors hover:bg-white hover:shadow-sm" style={{ color: '#2C3E2F' }} onClick={() => setMenuOpen(false)}><FiHeart size={20}/> Wishlist</Link>}
                {user && <Link to="/profile" className="flex items-center gap-4 px-4 py-3.5 text-base font-medium rounded-xl transition-colors hover:bg-white hover:shadow-sm" style={{ color: '#2C3E2F' }} onClick={() => setMenuOpen(false)}><FiUser size={20}/> My Profile</Link>}
                {isAdmin && <Link to="/admin" className="flex items-center gap-4 px-4 py-3.5 text-base font-bold rounded-xl transition-colors hover:bg-white hover:shadow-sm" style={{ color: '#D4AF37' }} onClick={() => setMenuOpen(false)}><FiShield size={20}/> Admin Panel</Link>}
              </div>
            </div>

            <div className="p-6 bg-white" style={{ borderTop: '1px solid #E5D9C5' }}>
              {user ? (
                <button className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm rounded-full font-bold transition-colors shadow-sm hover:shadow-md"
                  style={{ backgroundColor: '#C25A3C', color: '#ffffff' }}
                  onClick={() => { logout(); setMenuOpen(false); navigate('/'); }}>
                  <FiLogOut size={18}/> Sign Out
                </button>
              ) : (
                <Link to="/login" className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold rounded-full transition-colors shadow-sm hover:shadow-md"
                  style={{ backgroundColor: '#D4AF37', color: '#1E3A3A' }} onClick={() => setMenuOpen(false)}>
                  <FiUser size={18}/> Login / Register
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
