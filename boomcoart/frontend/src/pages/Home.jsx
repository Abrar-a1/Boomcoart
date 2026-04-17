import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX } from 'react-icons/fi';
import { getProducts } from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import ProductFilters from '../components/product/ProductFilters';
import Loader, { Pagination } from '../components/common/Loader';
import { Helmet } from 'react-helmet-async';
import './Home.css';

const SLIDES = [
  { title: 'Bridal Collection 2025', sub: 'Ethereal lehengas & sarees for your special day', cat: 'bridal', bg: 'linear-gradient(135deg,#1a1a2e 0%,#4a1a5e 100%)' },
  { title: "Men's Ethnic Wear",       sub: 'Sherwanis, kurtas & suits crafted to perfection', cat: 'men',    bg: 'linear-gradient(135deg,#0f3460 0%,#1a1a2e 100%)' },
  { title: "Women's Fashion",         sub: 'Sarees, lehengas & western wear for every mood', cat: 'women',  bg: 'linear-gradient(135deg,#2d1b4e 0%,#1a1a2e 100%)' },
];

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [totalPages, setTotalPages]     = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage]                 = useState(1);
  const [slideIdx, setSlideIdx]         = useState(0);
  const [showFilters, setShowFilters]   = useState(false);

  const keyword = searchParams.get('keyword') || '';
  const isFiltered = [...searchParams.keys()].length > 0;

  useEffect(() => {
    setPage(1); // Fix #4: reset to page 1 whenever filters or search change
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const params = { ...Object.fromEntries(searchParams.entries()), page };
    getProducts(params)
      .then(({ data }) => { setProducts(data.data); setTotalPages(data.totalPages); setTotalProducts(data.totalProducts); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchParams, page]);

  useEffect(() => {
    if (isFiltered) return;
    const t = setInterval(() => setSlideIdx(i => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, [isFiltered]);

  const slide = SLIDES[slideIdx];

  return (
    <>
      <Helmet><title>Boomcoart — Premium Fashion Store</title></Helmet>

      {!isFiltered && (
        <section className="hero" style={{ background: slide.bg }}>
          <div className="container hero-inner">
            <div className="hero-content fade-in" key={slideIdx}>
              <span className="badge badge-gold" style={{ marginBottom: 16 }}>New Collection</span>
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-sub">{slide.sub}</p>
              <div className="hero-btns">
                <button className="btn btn-gold btn-lg" onClick={() => setSearchParams({ category: slide.cat })}>
                  Shop Now →
                </button>
                <button className="btn btn-outline-white" onClick={() => setSearchParams({ isFeatured: 'true' })}>
                  View Featured
                </button>
              </div>
            </div>
            <div className="hero-dots">
              {SLIDES.map((_, i) => (
                <button key={i} className={`hero-dot ${i === slideIdx ? 'active' : ''}`} onClick={() => setSlideIdx(i)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {!isFiltered && (
        <section className="cat-strip">
          <div className="container">
            <div className="cat-pills">
              {[['👰 Bridal','bridal'],['👔 Men','men'],['👗 Women','women'],['👦 Boys','boys'],['👧 Girls','girls']].map(([l,v]) => (
                <button key={v} className="cat-pill" onClick={() => setSearchParams({ category: v })}>{l}</button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="products-section">
        <div className="container products-layout">
          <aside className="filters-sidebar">
            <ProductFilters />
          </aside>

          <div className="products-main">
            <div className="products-topbar">
              <div>
                <h2 style={{ fontSize: 22, fontFamily: 'var(--font-serif)', color: 'var(--navy)' }}>
                  {keyword ? `Results for "${keyword}"` : isFiltered ? 'Filtered Products' : 'All Products'}
                </h2>
                <p style={{ color: 'var(--gray-400)', fontSize: 14, marginTop: 2 }}>{totalProducts} items found</p>
              </div>
              <button className="mobile-filter-btn" onClick={() => setShowFilters(true)}>
                <FiFilter size={15} /> Filters
              </button>
            </div>

            {showFilters && (
              <div className="mobile-drawer-overlay" onClick={() => setShowFilters(false)}>
                <div className="mobile-drawer" onClick={e => e.stopPropagation()}>
                  <button className="mobile-drawer-close" onClick={() => setShowFilters(false)}><FiX size={20} /></button>
                  <ProductFilters onClose={() => setShowFilters(false)} />
                </div>
              </div>
            )}

            {loading ? <Loader /> : products.length === 0 ? (
              <div className="empty-state">
                <p style={{ fontSize: 48 }}>😔</p>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search term.</p>
                <button className="btn btn-primary" onClick={() => setSearchParams({})}>Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={p => { setPage(p); window.scrollTo({ top: 400, behavior: 'smooth' }); }} />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
