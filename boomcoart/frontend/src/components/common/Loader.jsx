export default function Loader({ size = 44 }) {
  return (
    <div className="loader-center">
      <div className="spinner" style={{ width: size, height: size }} />
    </div>
  );
}

export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Build truncated page list: always show first, last, current ±1, with '…' gaps
  const buildPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    const addPage = (p) => { if (!pages.includes(p) && p >= 1 && p <= totalPages) pages.push(p); };
    [1, currentPage - 1, currentPage, currentPage + 1, totalPages].forEach(addPage);
    pages.sort((a, b) => a - b);
    // Insert '…' where gaps exist
    const result = [];
    for (let i = 0; i < pages.length; i++) {
      if (i > 0 && pages[i] - pages[i - 1] > 1) result.push('…');
      result.push(pages[i]);
    }
    return result;
  };

  const btnStyle = (p) => ({
    width: 36, height: 36, borderRadius: 6, border: '2px solid', fontWeight: p === currentPage ? 700 : 400,
    fontSize: 13, cursor: p === '…' ? 'default' : 'pointer',
    borderColor: p === currentPage ? 'var(--navy)' : 'var(--gray-200)',
    background: p === currentPage ? 'var(--navy)' : 'var(--white)',
    color: p === currentPage ? 'var(--gold)' : 'var(--gray-700)',
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 40, flexWrap: 'wrap' }}>
      <button className="btn btn-outline btn-sm" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>← Prev</button>
      {buildPages().map((p, i) => (
        p === '…'
          ? <span key={`ellipsis-${i}`} style={{ width: 36, textAlign: 'center', color: 'var(--gray-400)', fontSize: 13 }}>…</span>
          : <button key={p} onClick={() => onPageChange(p)} style={btnStyle(p)}>{p}</button>
      ))}
      <button className="btn btn-outline btn-sm" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>Next →</button>
    </div>
  );
}
