import { useSearchParams } from 'react-router-dom';

const CATEGORIES   = ['men','women','bridal','boys','girls','unisex'];
const SUB_CATS     = ['shirts','pants','kurta','saree','lehenga','dress','jeans','jacket','suit','sherwani','tops','skirts','ethnic','western','accessories'];
const PRICE_RANGES = [['Under ₹500','0','500'],['₹500–₹1500','500','1500'],['₹1500–₹3000','1500','3000'],['₹3000–₹8000','3000','8000'],['Above ₹8000','8000','']];
const SORT_OPTIONS = [['Newest','-createdAt'],['Price: Low→High','price'],['Price: High→Low','-price'],['Top Rated','-ratings']];

export default function ProductFilters({ onClose }) {
  const [params, setParams] = useSearchParams();

  const set = (key, val) => {
    const next = new URLSearchParams(params);
    if (val) { next.set(key, val); } else { next.delete(key); }
    next.delete('page');
    setParams(next);
  };

  const clearAll = () => { setParams({}); onClose?.(); };
  const active = (key, val) => params.get(key) === val;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E5D9C5]">
        <h3 className="font-heading text-xl text-[#1E3A3A] font-bold">Filters</h3>
        <button className="text-[11px] font-bold text-[#C25A3C] hover:text-[#a4462e] uppercase tracking-wider transition-colors" onClick={clearAll}>
          Clear All
        </button>
      </div>

      {/* Category */}
      <div className="pb-6 border-b border-[#E5D9C5]">
        <h4 className="text-[13px] font-bold text-[#1E3A3A] uppercase tracking-wider mb-4">Category</h4>
        <div className="flex flex-col gap-3">
          {CATEGORIES.map(c => (
            <label key={c} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center w-5 h-5 rounded border border-[#E5D9C5] bg-[#FDF7F0] group-hover:border-[#D4AF37] transition-colors">
                <input
                  type="checkbox"
                  className="peer appearance-none absolute inset-0 w-full h-full cursor-pointer"
                  checked={active('category', c)}
                  onChange={() => set('category', active('category', c) ? '' : c)}
                />
                <div className="w-3 h-3 bg-[#1E3A3A] rounded-sm opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span className={`text-[14px] transition-colors ${active('category', c) ? 'font-bold text-[#1E3A3A]' : 'font-medium text-[#2C3E2F] group-hover:text-[#C25A3C]'}`}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sub-category */}
      <div className="pb-6 border-b border-[#E5D9C5]">
        <h4 className="text-[13px] font-bold text-[#1E3A3A] uppercase tracking-wider mb-4">Product Type</h4>
        <div className="grid grid-cols-2 gap-3">
          {SUB_CATS.map(s => (
            <label key={s} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center w-5 h-5 rounded border border-[#E5D9C5] bg-[#FDF7F0] group-hover:border-[#D4AF37] transition-colors">
                <input
                  type="checkbox"
                  className="peer appearance-none absolute inset-0 w-full h-full cursor-pointer"
                  checked={active('subCategory', s)}
                  onChange={() => set('subCategory', active('subCategory', s) ? '' : s)}
                />
                <div className="w-3 h-3 bg-[#1E3A3A] rounded-sm opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span className={`text-[13px] transition-colors ${active('subCategory', s) ? 'font-bold text-[#1E3A3A]' : 'font-medium text-[#6b7c6e] group-hover:text-[#1E3A3A]'}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="pb-6 border-b border-[#E5D9C5]">
        <h4 className="text-[13px] font-bold text-[#1E3A3A] uppercase tracking-wider mb-4">Price Range</h4>
        <div className="flex flex-col gap-3">
          {PRICE_RANGES.map(([label, min, max]) => {
            const isActive = params.get('minPrice') === min && params.get('maxPrice') === max;
            return (
              <label key={label} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 rounded-full border border-[#E5D9C5] bg-[#FDF7F0] group-hover:border-[#D4AF37] transition-colors">
                  <input
                    type="radio"
                    name="priceRange"
                    className="peer appearance-none absolute inset-0 w-full h-full cursor-pointer"
                    checked={isActive}
                    onChange={() => {
                      const next = new URLSearchParams(params);
                      if (isActive) { next.delete('minPrice'); next.delete('maxPrice'); }
                      else { if (min) next.set('minPrice', min); else next.delete('minPrice'); if (max) next.set('maxPrice', max); else next.delete('maxPrice'); }
                      next.delete('page'); setParams(next);
                    }}
                  />
                  <div className="w-2.5 h-2.5 bg-[#1E3A3A] rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className={`text-[14px] transition-colors ${isActive ? 'font-bold text-[#1E3A3A]' : 'font-medium text-[#2C3E2F] group-hover:text-[#C25A3C]'}`}>
                  {label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Sort */}
      <div className="pb-6 border-b border-[#E5D9C5]">
        <h4 className="text-[13px] font-bold text-[#1E3A3A] uppercase tracking-wider mb-4">Sort By</h4>
        <div className="flex flex-col gap-3">
          {SORT_OPTIONS.map(([label, val]) => (
            <label key={val} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center w-5 h-5 rounded-full border border-[#E5D9C5] bg-[#FDF7F0] group-hover:border-[#D4AF37] transition-colors">
                <input
                  type="radio"
                  name="sortBy"
                  className="peer appearance-none absolute inset-0 w-full h-full cursor-pointer"
                  checked={active('sort', val)}
                  onChange={() => set('sort', active('sort', val) ? '' : val)}
                />
                <div className="w-2.5 h-2.5 bg-[#1E3A3A] rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span className={`text-[14px] transition-colors ${active('sort', val) ? 'font-bold text-[#1E3A3A]' : 'font-medium text-[#2C3E2F] group-hover:text-[#C25A3C]'}`}>
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Featured Items Only */}
      <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg border border-[#E5D9C5] bg-[#FDF7F0] hover:border-[#D4AF37] transition-all">
        <div className="relative flex items-center justify-center w-5 h-5 rounded border border-[#E5D9C5] group-hover:border-[#D4AF37] bg-white transition-colors">
          <input
            type="checkbox"
            className="peer appearance-none absolute inset-0 w-full h-full cursor-pointer"
            checked={params.get('isFeatured') === 'true'}
            onChange={() => set('isFeatured', params.get('isFeatured') === 'true' ? '' : 'true')}
          />
          <div className="w-3 h-3 bg-[#D4AF37] rounded-sm opacity-0 peer-checked:opacity-100 transition-opacity" />
        </div>
        <span className={`text-[14px] transition-colors ${params.get('isFeatured') === 'true' ? 'font-bold text-[#1E3A3A]' : 'font-medium text-[#1E3A3A]'}`}>
          Show Featured Only
        </span>
        <span className="ml-auto text-lg text-[#D4AF37]">⭐</span>
      </label>
      
      {/* Mobile close button (only visible on mobile layout in home page) */}
      <div className="lg:hidden w-full pt-4">
        <button 
          onClick={() => onClose?.()}
          className="w-full min-h-[44px] bg-[#1E3A3A] text-white font-bold uppercase tracking-widest text-[13px] rounded-full shadow-lg"
        >
          View Results
        </button>
      </div>
    </div>
  );
}
