import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiArrowRight } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';
import ProductCard from '../components/product/ProductCard';
import ProductFilters from '../components/product/ProductFilters';
import { Pagination } from '../components/common/Loader';
import productService from '../services/productService';

export default function Home() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const hasFilters = [...params.keys()].length > 0;

  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFilter, setMobileFilter] = useState(false);

  // Dynamic theme state
  const [activeTheme, setActiveTheme] = useState('default'); // 'default' | 'kids' | 'bridal'

  useEffect(() => {
    productService.getProducts({ isFeatured: true, limit: 8 })
      .then(res => { setFeatured(res.data.data || res.data.products || []); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const filters = Object.fromEntries(params.entries());
    filters.page = page;
    filters.limit = 12;
    productService.getProducts(filters)
      .then(res => {
        const d = res.data;
        setProducts(d.data || d.products || []);
        setTotalPages(d.totalPages || d.pages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params, page]);

  // Theme background colors
  const themeBg = {
    default: '#FDF7F0',
    kids:    '#FFF8F0',
    bridal:  '#FAF5F0',
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl border border-[#f0e8da] overflow-hidden">
      <div className="skeleton aspect-[4/5]" />
      <div className="p-4 flex flex-col gap-2.5">
        <div className="skeleton h-3 w-3/5" />
        <div className="skeleton h-4 w-11/12" />
        <div className="skeleton h-3.5 w-2/5" />
        <div className="skeleton h-10 w-full rounded-full" />
      </div>
    </div>
  );

  return (
    <div className="flex justify-center page-transition" style={{ backgroundColor: themeBg[activeTheme] }}>
      <div className="w-full max-w-[1000px] space-y-8 lg:space-y-12">
        <Helmet><title>Boomcoart — Discover Your Style</title></Helmet>

      {/* ═══════════════════════════════════════════════════ */}
      {/* ═══ HERO BANNERS ════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════ */}
      {!hasFilters && (
        <section className="pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* ──── PLAYFUL KIDS BANNER ──── */}
              <div
                onClick={() => { setActiveTheme('kids'); navigate('/kids'); }}
                className="group relative cursor-pointer rounded-2xl overflow-hidden border border-[#E5D9C5] bg-white/40 shadow-sm transition-all duration-300 hover:shadow-md p-6 lg:p-8 flex flex-col justify-center text-center md:text-left"
              >
                <div className="flex flex-col items-center md:items-start z-10">
                  <h2 className="font-heading text-3xl md:text-4xl text-[#1E3A3A] mb-3">
                    Playful Kids
                  </h2>
                  <p className="text-[#2C3E2F] text-sm md:text-base max-w-[280px] mb-6 leading-relaxed">
                    Bright colors, comfy fabrics, and endless adventures for your little ones!
                  </p>
                  <div>
                    <button
                      className="inline-flex items-center justify-center bg-[#C25A3C] text-white px-5 py-2 rounded-full min-h-[44px] hover:bg-[#a4462e] transition-all hover:shadow-md"
                      onClick={(e) => { e.stopPropagation(); navigate('/kids'); }}
                    >
                      SHOP KIDS
                    </button>
                  </div>
                </div>
                {/* Decorative emoji */}
                <div className="absolute right-4 bottom-4 md:right-8 md:bottom-8 text-5xl md:text-7xl opacity-90 drop-shadow-sm pointer-events-none transition-transform group-hover:scale-105">
                  🧸
                </div>
              </div>

              {/* ──── ELEGANT BRIDAL BANNER ──── */}
              <div
                onClick={() => { setActiveTheme('bridal'); navigate('/bridal'); }}
                className="group relative cursor-pointer rounded-2xl overflow-hidden border border-[#E5D9C5] bg-white/40 shadow-sm transition-all duration-300 hover:shadow-md p-6 lg:p-8 flex flex-col justify-center text-center md:text-left"
              >
                <div className="flex flex-col items-center md:items-start z-10">
                  <h2 className="font-heading text-3xl md:text-4xl text-[#1E3A3A] tracking-wider uppercase mb-3 text-center md:text-left">
                    Elegant<br className="hidden md:block"/> Bridal
                  </h2>
                  <p className="text-[#2C3E2F] text-sm md:text-base max-w-[280px] mb-6 leading-relaxed">
                    Reserve your tailored consultation. Experiencing luxury has never been this effortless.
                  </p>
                  <div>
                    <button
                      className="inline-flex items-center justify-center bg-[#C25A3C] text-white px-5 py-2 rounded-full min-h-[44px] hover:bg-[#a4462e] transition-all hover:shadow-md"
                      onClick={(e) => { e.stopPropagation(); navigate('/bridal'); }}
                    >
                      ENTER THE BOUTIQUE
                    </button>
                  </div>
                </div>
                {/* Decorative emoji */}
                <div className="absolute right-4 bottom-4 md:right-8 md:bottom-8 text-5xl md:text-7xl opacity-90 drop-shadow-sm pointer-events-none transition-transform group-hover:scale-105">
                  ✨
                </div>
              </div>

            </div>
        </section>
      )}

      {/* ═══ FEATURED PRODUCTS ═══ */}
      {!hasFilters && featured.length > 0 && (
        <section>
          <div className="w-full">
            <div className="text-center mb-8 flex flex-col items-center">
              <h2 className="font-heading text-3xl text-[#1E3A3A] mb-3">All Products</h2>
              <div className="flex items-center justify-center w-full max-w-xs gap-3">
                <div className="h-[1px] flex-1 bg-[#D4AF37]/50" />
                <span className="text-[10px] text-[#D4AF37]">❖</span>
                <div className="h-[1px] flex-1 bg-[#D4AF37]/50" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featured.slice(0, 8).map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ PRODUCT CATALOG ═══ */}
      <section>
        <div className="w-full">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">

            {/* ── Filter Sidebar — Desktop ── */}
            <aside className="hidden lg:block w-64 shrink-0 sticky top-32">
              <div
                className="rounded-2xl p-5 transition-shadow"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #E5D9C5',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                }}
              >
                <ProductFilters />
              </div>
            </aside>

            {/* ── Products Grid ── */}
            <div className="flex-1 w-full">
              <div className="flex items-end justify-between mb-7">
                <div>
                  <h2 className="font-heading text-3xl lg:text-4xl text-[#1E3A3A]">{hasFilters ? 'Results' : 'All Products'}</h2>
                  <p className="text-sm text-[#6b7c6e] mt-1">{products.length} products found</p>
                </div>
                <button
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-[#1E3A3A] text-white rounded-full text-sm font-semibold hover:bg-[#2a5050] transition-colors shadow-sm"
                  onClick={() => setMobileFilter(true)}
                >
                  <FiFilter size={14} /> Filters
                </button>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                  {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 rounded-2xl w-full" style={{ backgroundColor: '#ffffff', border: '1px solid #E5D9C5', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: '#FDF7F0' }}>
                    <span className="text-3xl text-[#D4AF37]">🛍️</span>
                  </div>
                  <h3 className="font-heading text-3xl font-bold mb-3" style={{ color: '#1E3A3A' }}>0 products found</h3>
                  <p className="text-[#2C3E2F] font-medium" style={{ opacity: 0.8 }}>Try adjusting your filters or search terms.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>
              )}

              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Mobile filter drawer ── */}
      {mobileFilter && (
        <div className="fixed inset-0 bg-black/40 z-[200] backdrop-blur-sm" onClick={() => setMobileFilter(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-[300px] bg-white overflow-y-auto shadow-2xl flex flex-col" onClick={e => e.stopPropagation()} style={{ animation: 'slideInRight 0.2s ease' }}>
            <div className="flex items-center justify-between px-5 py-4 bg-[#1E3A3A] text-white">
              <span className="font-heading text-lg font-bold">Filters</span>
              <button onClick={() => setMobileFilter(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"><FiX size={16} /></button>
            </div>
            <div className="p-4">
              <ProductFilters onClose={() => setMobileFilter(false)} />
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
