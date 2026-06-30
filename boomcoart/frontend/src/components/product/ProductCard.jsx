import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toggleWishlist } from '../../services/userService';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user, wishlistIds, toggleWishlistId } = useAuth();
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
    <Link to={`/product/${product._id}`} className="group block bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-[#E5D9C5]">
      {/* Image */}
      <div
        className="relative aspect-[4/5] overflow-hidden bg-[#FDF7F0]"
        onMouseEnter={() => setHoverImg(true)}
        onMouseLeave={() => setHoverImg(false)}
      >
        <img
          src={(hoverImg && product.images[1]?.url) ? product.images[1].url : product.images[0]?.url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Discount badge */}
        {discount > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-[#C25A3C] text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
            {discount}% OFF
          </span>
        )}
        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
            <span className="text-white font-bold text-sm tracking-wide">Out of Stock</span>
          </div>
        )}
        {/* Wishlist button */}
        <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-colors ${
              wishlisted
                ? 'bg-[#fde8e4] text-[#B85C4B]'
                : 'bg-white text-[#2C3E2F] hover:bg-[#1E3A3A] hover:text-white'
            }`}
            onClick={handleWishlist}
            title="Wishlist"
          >
            <FiHeart size={14} />
          </button>
        </div>
      </div>

      {/* Info */}
      {/* Info */}
      <div className="p-4 sm:p-5 flex flex-col h-[180px]">
        <p className="text-[10px] uppercase tracking-widest text-[#9eaa9f] mb-1.5 font-semibold">
          {product.category} · {product.subCategory}
        </p>
        <h3 className="font-heading text-lg font-bold text-[#1E3A3A] leading-snug line-clamp-2 mb-2 group-hover:text-[#C25A3C] transition-colors">
          {product.name}
        </h3>
        {product.ratings > 0 && (
          <div className="flex items-center gap-1 text-xs text-[#D4AF37] mb-2.5">
            <FiStar size={12} fill="currentColor" />
            <span className="font-bold">{product.ratings}</span>
            <span className="text-[#9eaa9f] font-medium">({product.numReviews})</span>
          </div>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 mb-4">
          <span className="text-xl font-bold text-[#C25A3C]">₹{price.toLocaleString()}</span>
          {discount > 0 && <span className="text-sm font-medium text-[#9eaa9f] line-through">₹{product.price.toLocaleString()}</span>}
        </div>
        <button
          className="w-full min-h-[44px] bg-[#C25A3C] text-white text-[13px] font-bold uppercase tracking-wide rounded-full flex items-center justify-center gap-2 hover:bg-[#1E3A3A] transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <FiShoppingCart size={16} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
}
