import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1E3A3A' }}>
      {/* Main grid */}
      <div className="max-w-[1000px] mx-auto px-6 py-16 lg:py-20 text-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">

          {/* Shop */}
          <div>
            <h4 className="text-[13px] font-bold tracking-[0.2em] uppercase mb-5" style={{ color: '#D4AF37' }}>Shop</h4>
            <ul className="flex flex-col items-center gap-3">
              {[['Bridal Wear','/?category=bridal'],["Men's Clothing",'/?category=men'],["Women's Clothing",'/?category=women'],['Kids Wear','/kids'],['Featured Items','/?isFeatured=true']].map(([l,h]) => (
                <li key={l}>
                  <Link
                    to={h}
                    className="inline-block text-[14px] font-medium transition-all duration-300 hover:text-[#D4AF37]"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                  >{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-[13px] font-bold tracking-[0.2em] uppercase mb-5" style={{ color: '#D4AF37' }}>Account</h4>
            <ul className="flex flex-col items-center gap-3">
              {[['My Profile','/profile'],['My Orders','/profile?tab=orders'],['Wishlist','/wishlist'],['Cart','/cart']].map(([l,h]) => (
                <li key={l}>
                  <Link
                    to={h}
                    className="inline-block text-[14px] font-medium transition-all duration-300 hover:text-[#D4AF37]"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                  >{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[13px] font-bold tracking-[0.2em] uppercase mb-5" style={{ color: '#D4AF37' }}>Support</h4>
            <ul className="flex flex-col items-center gap-3">
              {['Contact Us','Return Policy','Shipping Info','Size Guide','FAQ'].map(l => (
                <li key={l}>
                  <a
                    href="#"
                    className="inline-block text-[14px] font-medium transition-all duration-300 hover:text-[#D4AF37]"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                  >{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[13px] font-bold tracking-[0.2em] uppercase mb-5" style={{ color: '#D4AF37' }}>Company</h4>
            <ul className="flex flex-col items-center gap-3">
              {['About Us', 'Careers', 'Our Stores', 'Press', 'Sustainability'].map(l => (
                <li key={l}>
                  <a
                    href="#"
                    className="inline-block text-[14px] font-medium transition-all duration-300 hover:text-[#D4AF37]"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                  >{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us */}
          <div className="sm:col-span-2 md:col-span-4 lg:col-span-1 border-t border-white/10 lg:border-t-0 pt-8 lg:pt-0">
            <h4 className="text-[13px] font-bold tracking-[0.2em] uppercase mb-5" style={{ color: '#D4AF37' }}>Follow Us</h4>
            <div className="flex gap-4 justify-center">
              {[FiInstagram, FiFacebook, FiTwitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#D4AF37'; e.currentTarget.style.color = '#1E3A3A'; e.currentTarget.style.borderColor = '#D4AF37'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                  aria-label="Social"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="max-w-[1000px] mx-auto px-6 py-5 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <span>Secure payments via</span>
            <div className="flex gap-2">
              {['Razorpay','UPI','VISA','AMEX'].map(p => (
                <span
                  key={p}
                  className="rounded px-2 flex items-center font-bold tracking-widest italic"
                  style={{ color: 'rgba(255,255,255,0.9)' }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
            © {new Date().getFullYear()} Boomcoart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
