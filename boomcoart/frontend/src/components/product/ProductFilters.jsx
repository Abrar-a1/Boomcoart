import { useSearchParams } from 'react-router-dom';
import './ProductFilters.css';

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
    onClose?.();
  };

  const clearAll = () => { setParams({}); onClose?.(); };
  const active = (key, val) => params.get(key) === val;

  return (
    <div className="filters">
      <div className="filters-header">
        <h3>Filters</h3>
        <button className="filters-clear" onClick={clearAll}>Clear All</button>
      </div>

      <div className="filter-section">
        <h4>Category</h4>
        <div className="filter-pills">
          {CATEGORIES.map(c => (
            <button key={c} className={`filter-pill ${active('category', c) ? 'active' : ''}`}
              onClick={() => set('category', active('category', c) ? '' : c)}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Sub-category</h4>
        <div className="filter-pills">
          {SUB_CATS.map(s => (
            <button key={s} className={`filter-pill ${active('subCategory', s) ? 'active' : ''}`}
              onClick={() => set('subCategory', active('subCategory', s) ? '' : s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Price Range</h4>
        {PRICE_RANGES.map(([label, min, max]) => {
          const isActive = params.get('minPrice') === min && params.get('maxPrice') === max;
          return (
            <button key={label} className={`filter-row ${isActive ? 'active' : ''}`}
              onClick={() => {
                const next = new URLSearchParams(params);
                if (isActive) { next.delete('minPrice'); next.delete('maxPrice'); }
                else { if (min) next.set('minPrice', min); else next.delete('minPrice'); if (max) next.set('maxPrice', max); else next.delete('maxPrice'); }
                next.delete('page'); setParams(next); onClose?.();
              }}>
              {label}
            </button>
          );
        })}
      </div>

      <div className="filter-section">
        <h4>Sort By</h4>
        {SORT_OPTIONS.map(([label, val]) => (
          <button key={val} className={`filter-row ${active('sort', val) ? 'active' : ''}`}
            onClick={() => set('sort', active('sort', val) ? '' : val)}>
            {label}
          </button>
        ))}
      </div>

      <div className="filter-section">
        <button className={`filter-row ${params.get('isFeatured') === 'true' ? 'active' : ''}`}
          onClick={() => set('isFeatured', params.get('isFeatured') === 'true' ? '' : 'true')}>
          ⭐ Featured Only
        </button>
      </div>
    </div>
  );
}
