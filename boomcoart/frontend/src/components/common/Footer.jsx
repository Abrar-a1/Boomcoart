import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">Boomcoart</Link>
          <p className="footer-tagline">Premium fashion for every occasion — bridal, ethnic, western & more.</p>
          <div className="footer-socials">
            <a href="#" aria-label="Instagram"><FiInstagram /></a>
            <a href="#" aria-label="Twitter"><FiTwitter /></a>
            <a href="#" aria-label="Facebook"><FiFacebook /></a>
          </div>
        </div>
        <div>
          <h4 className="footer-heading">Shop</h4>
          <ul className="footer-links">
            {[['Bridal Wear','/?category=bridal'],['Men\'s Clothing','/?category=men'],['Women\'s Clothing','/?category=women'],['Kids Wear','/?category=boys'],['Featured Items','/?isFeatured=true']].map(([l,h]) => (
              <li key={l}><Link to={h}>{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="footer-heading">Account</h4>
          <ul className="footer-links">
            {[['My Profile','/profile'],['My Orders','/profile?tab=orders'],['Wishlist','/wishlist'],['Cart','/cart']].map(([l,h]) => (
              <li key={l}><Link to={h}>{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="footer-heading">Support</h4>
          <ul className="footer-links">
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Return Policy</a></li>
            <li><a href="#">Shipping Info</a></li>
            <li><a href="#">Size Guide</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} Boomcoart. All rights reserved.</p>
          <div className="footer-payments">
            <span>Secure payments via</span>
            <strong>Razorpay</strong>
          </div>
        </div>
      </div>
    </footer>
  );
}
