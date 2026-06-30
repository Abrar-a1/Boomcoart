import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ProductCard from '../../components/product/ProductCard';
import productService from '../../services/productService';

export default function BridalCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getProducts({ category: 'bridal' })
      .then((res) => {
        setProducts(res.data.data || res.data.products || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const SkeletonCard = () => (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #f0e8da' }}>
      <div className="skeleton" style={{ aspectRatio: '4/5' }} />
      <div className="p-3.5 flex flex-col gap-2">
        <div className="skeleton h-3 w-3/5" />
        <div className="skeleton h-4 w-11/12" />
        <div className="skeleton h-3.5 w-2/5" />
        <div className="skeleton h-9 w-full rounded-full" />
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#FAF5F0', minHeight: '60vh' }}>
      <Helmet><title>Bridal & Couture — Boomcoart</title></Helmet>

      {/* Hero strip */}
      <div className="py-10 sm:py-14 lg:py-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #F5F0EB 0%, #EDE4D9 40%, #E8D5C4 100%)' }}>
        {/* Decorative corners */}
        <div className="absolute top-6 left-6 w-10 h-10" style={{ borderLeft: '2px solid #D4AF37', borderTop: '2px solid #D4AF37', opacity: 0.5 }} />
        <div className="absolute bottom-6 right-6 w-10 h-10" style={{ borderRight: '2px solid #D4AF37', borderBottom: '2px solid #D4AF37', opacity: 0.5 }} />

        {/* Floating sparkle */}
        <div className="absolute top-10 right-20 text-xl animate-float" style={{ color: '#D4AF37' }}>✦</div>
        <div className="absolute bottom-12 left-16 text-lg animate-float" style={{ color: '#D4AF37', opacity: 0.5, animationDelay: '1.5s' }}>❖</div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-sm mb-6">
            <Link to="/" className="transition-colors" style={{ color: '#1E3A3A' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#D4AF37'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#1E3A3A'; }}>Home</Link>
            <span style={{ color: '#9eaa9f' }}>/</span>
            <span style={{ color: '#6b7c6e' }}>Bridal</span>
          </nav>

          <p className="text-xs tracking-[0.3em] uppercase mb-4 font-semibold" style={{ color: '#D4AF37' }}>
            Latest Collection
          </p>
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl sm:text-5xl animate-float">💍</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-light uppercase tracking-[0.15em]" style={{ color: '#1E3A3A' }}>
            Bridal & Couture
          </h1>
          <p className="text-sm sm:text-base max-w-md mx-auto mt-4" style={{ color: '#2C3E2F', opacity: 0.8 }}>
            Our designers are crafting something special for you.
          </p>
          <div className="mx-auto mt-5" style={{ width: 60, height: 1.5, backgroundColor: '#D4AF37' }} />
        </div>
      </div>

      {/* Products */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 rounded-2xl"
            style={{ backgroundColor: '#ffffff', border: '1px solid #f0e8da' }}>
            <p className="text-5xl mb-4" style={{ opacity: 0.3 }}>👰</p>
            <h3 className="font-heading text-2xl mb-2" style={{ color: '#1E3A3A' }}>Bridal collection coming soon</h3>
            <p className="text-sm mb-6" style={{ color: '#6b7c6e' }}>Our designers are crafting something special for you.</p>
            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-colors"
              style={{ backgroundColor: '#1E3A3A', color: '#ffffff' }}>
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
