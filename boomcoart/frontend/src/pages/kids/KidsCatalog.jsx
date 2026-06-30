import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ProductCard from '../../components/product/ProductCard';
import productService from '../../services/productService';

export default function KidsCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    productService.getProducts({ category: 'kids' })
      .then((res) => {
        const data = res.data.data || res.data.products || [];
        setProducts(data);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load products');
      })
      .finally(() => setLoading(false));
  }, []);

  // Also fetch boys & girls to combine into kids
  useEffect(() => {
    Promise.all([
      productService.getProducts({ category: 'boys' }),
      productService.getProducts({ category: 'girls' }),
    ])
      .then(([boysRes, girlsRes]) => {
        const boys = boysRes.data.data || boysRes.data.products || [];
        const girls = girlsRes.data.data || girlsRes.data.products || [];
        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p._id));
          const newProducts = [...boys, ...girls].filter(p => !existingIds.has(p._id));
          return [...prev, ...newProducts];
        });
      })
      .catch(() => {});
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
    <div style={{ backgroundColor: '#FFF8F0', minHeight: '60vh' }}>
      <Helmet><title>Kids Collection — Boomcoart</title></Helmet>

      {/* Hero strip */}
      <div className="py-8 sm:py-12 lg:py-16"
        style={{ background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 50%, #FFCC80 100%)' }}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-4">
            <Link to="/" className="transition-colors" style={{ color: '#1E3A3A' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#D4AF37'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#1E3A3A'; }}>Home</Link>
            <span style={{ color: '#9eaa9f' }}>/</span>
            <span style={{ color: '#6b7c6e' }}>Kids</span>
          </nav>

          <div className="flex items-center gap-4 mb-3">
            <span className="text-4xl sm:text-5xl animate-balloon">🎈</span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold" style={{ color: '#1E3A3A' }}>
              Kids Collection
            </h1>
          </div>
          <p className="text-sm sm:text-base max-w-md" style={{ color: '#2C3E2F', opacity: 0.8 }}>
            Durable, colorful, and fun fabrics for your little ones
          </p>
          <div className="mt-4" style={{ width: 60, height: 3, backgroundColor: '#D4AF37', borderRadius: 2 }} />
        </div>
      </div>

      {/* Products */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="rounded-xl p-5 text-center"
            style={{ backgroundColor: '#fde8e4', color: '#B85C4B', border: '1px solid #B85C4B' }}>
            <p className="font-semibold">{error}</p>
            <p className="text-sm mt-1" style={{ opacity: 0.7 }}>Make sure the backend server is running on port 5000.</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 rounded-2xl"
            style={{ backgroundColor: '#ffffff', border: '1px solid #f0e8da' }}>
            <p className="text-5xl mb-4" style={{ opacity: 0.3 }}>👧</p>
            <h3 className="font-heading text-2xl mb-2" style={{ color: '#1E3A3A' }}>No kids clothes found</h3>
            <p className="text-sm mb-6" style={{ color: '#6b7c6e' }}>Check back soon for new arrivals!</p>
            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-colors"
              style={{ backgroundColor: '#C25A3C', color: '#ffffff' }}>
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
