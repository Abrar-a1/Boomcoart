import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toggleWishlist } from '../../services/userService';
import toast from 'react-hot-toast';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user, wishlistIds, toggleWishlistId } = useAuth();
  // Fix #3: init from real wishlist IDs instead of always false
  const [wishlisted, setWishlisted] = useState(() => wishlistIds.includes(product._id));
  const [hoverImg, setHoverImg] = useState(false);

  const price    = product.discountPrice > 0 ? product.discountPrice : product.price;
  const discount = product.discountPrice > 0 ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Login to wishlist items'); return; }
    try {
      await toggleWishlist(product._id);
      const next = !wishlisted;
      setWishlisted(next);
      toggleWishlistId(product._id);
      toast.success(next ? 'Added to wishlist!' : 'Removed from wishlist');
    } catch { toast.error('Failed to update wishlist'); }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock === 0) return;
    addToCart(product, 1, product.sizes?.[0] || '', product.colors?.[0] || '');
  };

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="pc-img-wrap" onMouseEnter={() => setHoverImg(true)} onMouseLeave={() => setHoverImg(false)}>
        <img
          src={(hoverImg && product.images[1]?.url) ? product.images[1].url : product.images[0]?.url}
          alt={product.name}
          className="pc-img"
          loading="lazy"
        />
        {discount > 0 && <span className="pc-badge">{discount}% OFF</span>}
        {product.stock === 0 && <div className="pc-oos">Out of Stock</div>}
        <div className="pc-actions">
          <button className={`pc-action ${wishlisted ? 'pc-action--active' : ''}`} onClick={handleWishlist} title="Wishlist">
            <FiHeart size={16} />
          </button>
          <button className="pc-action" onClick={handleAddToCart} disabled={product.stock === 0} title="Add to Cart">
            <FiShoppingCart size={16} />
          </button>
        </div>
      </div>
      <div className="pc-info">
        <p className="pc-cat">{product.category} · {product.subCategory}</p>
        <h3 className="pc-name">{product.name}</h3>
        {product.ratings > 0 && (
          <div className="pc-rating">
            <FiStar size={12} className="star-filled" fill="currentColor" />
            <span>{product.ratings}</span>
            <span className="pc-reviews">({product.numReviews})</span>
          </div>
        )}
        <div className="pc-price">
          <span className="pc-price-current">₹{price.toLocaleString()}</span>
          {discount > 0 && <span className="pc-price-orig">₹{product.price.toLocaleString()}</span>}
        </div>
      </div>
    </Link>
  );
}
