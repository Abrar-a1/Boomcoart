import { useState, useEffect, useRef } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiUpload, FiX } from 'react-icons/fi';
import { getAdminProducts, createProduct, updateProduct, deleteProduct, toggleProductStatus } from '../../services/productService';
import Loader from '../../components/common/Loader';
import { AdminNav } from './Dashboard';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import './Admin.css';

const CATS    = ['men','women','bridal','boys','girls','unisex'];
const SUBCATS = ['shirts','pants','kurta','saree','lehenga','dress','jeans','jacket','suit','sherwani','tops','skirts','ethnic','western','accessories'];
const SIZES   = ['XS','S','M','L','XL','XXL','XXXL','Free Size'];
const EMPTY   = { name:'', description:'', price:'', discountPrice:'', category:'men', subCategory:'shirts', sizes:[], colors:'', stock:'', tags:'', isFeatured:false };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [files, setFiles]       = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [saving, setSaving]     = useState(false);
  const [search, setSearch]     = useState('');
  const fileRef = useRef();
  const videoRef = useRef();

  const load = () => {
    setLoading(true);
    getAdminProducts().then(({ data }) => setProducts(data.data)).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setFiles([]); setPreviews([]); setVideoFile(null); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ name:p.name, description:p.description, price:p.price, discountPrice:p.discountPrice||'', category:p.category, subCategory:p.subCategory, sizes:p.sizes||[], colors:(p.colors||[]).join(', '), stock:p.stock, tags:(p.tags||[]).join(', '), isFeatured:p.isFeatured||false });
    setFiles([]); setPreviews(p.images.map(i=>i.url)); setVideoFile(null); setShowModal(true);
  };

  const handleFiles = (e) => {
    const f = Array.from(e.target.files);
    setFiles(f);
    setPreviews(f.map(fi => URL.createObjectURL(fi)));
  };

  const toggleSize = (s) => setForm(prev => ({ ...prev, sizes: prev.sizes.includes(s) ? prev.sizes.filter(x=>x!==s) : [...prev.sizes, s] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editing && files.length === 0) { toast.error('Please upload at least one image'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => {
        if (k === 'sizes') fd.append(k, JSON.stringify(v));
        else if (k === 'colors') fd.append(k, JSON.stringify(v.split(',').map(s=>s.trim()).filter(Boolean)));
        else if (k === 'tags')   fd.append(k, JSON.stringify(v.split(',').map(s=>s.trim()).filter(Boolean)));
        else fd.append(k, v);
      });
      files.forEach(f => fd.append('images', f));
      if (videoFile) fd.append('video', videoFile);
      if (editing) { await updateProduct(editing._id, fd); toast.success('Product updated!'); }
      else         { await createProduct(fd); toast.success('Product created!'); }
      setShowModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleToggle = async (id, isActive) => {
    try { await toggleProductStatus(id); toast.success(isActive ? 'Product deactivated' : 'Product activated'); load(); }
    catch { toast.error('Failed'); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await deleteProduct(id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  return (
    <div className="admin-layout">
      <Helmet><title>Products — Admin | Boomcoart</title></Helmet>
      <AdminNav />
      <div className="admin-content">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
          <h1 className="admin-page-title" style={{ marginBottom:0 }}>Products</h1>
          <button className="btn btn-primary" onClick={openAdd}><FiPlus /> Add Product</button>
        </div>

        {/* Search bar */}
        <div style={{ marginBottom:16, display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' }}>
          <input className="form-input" style={{ maxWidth:280, fontSize:14 }} placeholder="Search products..."
            value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className="btn btn-outline btn-sm" onClick={() => setSearch('')}>Clear</button>}
          <span style={{ fontSize:13, color:'var(--gray-400)', marginLeft:'auto' }}>
            {products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.includes(search.toLowerCase())).length} products
          </span>
        </div>

        {loading ? <Loader /> : (
          <div className="card" style={{ padding:0, overflow:'hidden' }}>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()) || p.subCategory.toLowerCase().includes(search.toLowerCase())).map(p => (
                    <tr key={p._id}>
                      <td><img src={p.images[0]?.url} alt={p.name} style={{ width:48, height:58, objectFit:'cover', borderRadius:6 }} /></td>
                      <td style={{ maxWidth:200 }}>
                        <p style={{ fontWeight:600, color:'var(--navy)', fontSize:14 }}>{p.name}</p>
                        <p style={{ fontSize:12, color:'var(--gray-400)' }}>{p.subCategory}</p>
                      </td>
                      <td><span className="badge badge-navy">{p.category}</span></td>
                      <td>
                        <p style={{ fontWeight:700, color:'var(--navy)' }}>₹{(p.discountPrice||p.price).toLocaleString()}</p>
                        {p.discountPrice>0 && <p style={{ fontSize:12, color:'var(--gray-400)', textDecoration:'line-through' }}>₹{p.price.toLocaleString()}</p>}
                      </td>
                      <td><span style={{ fontWeight:600, color:p.stock>0?'var(--green)':'var(--red)' }}>{p.stock}</span></td>
                      <td><span className={`badge ${p.isActive?'badge-green':'badge-red'}`}>{p.isActive?'Active':'Inactive'}</span></td>
                      <td>
                        <div style={{ display:'flex', gap:6 }}>
                          <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)} title="Edit"><FiEdit2 size={13}/></button>
                          <button className={`btn btn-sm ${p.isActive?'btn-outline':'btn-primary'}`} onClick={() => handleToggle(p._id, p.isActive)} title={p.isActive?'Deactivate':'Activate'} style={{ fontSize:11 }}>
                            {p.isActive ? 'Hide' : 'Show'}
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id, p.name)} title="Delete"><FiTrash2 size={13}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-box" style={{ maxWidth:700 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editing ? 'Edit Product' : 'Add New Product'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}><FiX /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="admin-form-grid">
                  <div className="form-group full">
                    <label>Product Name *</label>
                    <input className="form-input" value={form.name} onChange={e => setForm({...form,name:e.target.value})} required />
                  </div>
                  <div className="form-group full">
                    <label>Description *</label>
                    <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm({...form,description:e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Price (₹) *</label>
                    <input type="number" className="form-input" value={form.price} onChange={e => setForm({...form,price:e.target.value})} required min="0" />
                  </div>
                  <div className="form-group">
                    <label>Discount Price (₹)</label>
                    <input type="number" className="form-input" value={form.discountPrice} onChange={e => setForm({...form,discountPrice:e.target.value})} min="0" />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select className="form-input" value={form.category} onChange={e => setForm({...form,category:e.target.value})}>
                      {CATS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Sub-Category *</label>
                    <select className="form-input" value={form.subCategory} onChange={e => setForm({...form,subCategory:e.target.value})}>
                      {SUBCATS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Stock *</label>
                    <input type="number" className="form-input" value={form.stock} onChange={e => setForm({...form,stock:e.target.value})} required min="0" />
                  </div>
                  <div className="form-group">
                    <label>Colors (comma-separated)</label>
                    <input className="form-input" placeholder="#ff0000, #00ff00" value={form.colors} onChange={e => setForm({...form,colors:e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Tags (comma-separated)</label>
                    <input className="form-input" placeholder="cotton, festive, sale" value={form.tags} onChange={e => setForm({...form,tags:e.target.value})} />
                  </div>
                  <div className="form-group" style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <input type="checkbox" id="feat" checked={form.isFeatured} onChange={e => setForm({...form,isFeatured:e.target.checked})} />
                    <label htmlFor="feat" style={{ marginBottom:0 }}>Mark as Featured</label>
                  </div>
                  <div className="form-group full">
                    <label>Sizes</label>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                      {SIZES.map(s => (
                        <button key={s} type="button" className={`size-btn ${form.sizes.includes(s)?'active':''}`} style={{ minWidth:44, height:36, padding:'0 10px', borderRadius:'var(--radius-md)', border:'1.5px solid', borderColor:form.sizes.includes(s)?'var(--navy)':'var(--gray-200)', background:form.sizes.includes(s)?'var(--navy)':'var(--white)', color:form.sizes.includes(s)?'var(--gold)':'var(--gray-600)', cursor:'pointer', fontSize:13, fontWeight:600 }}
                          onClick={() => toggleSize(s)}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group full">
                    <label>Product Images {editing ? '(upload to replace)' : '*'}</label>
                    <div className="upload-zone" onClick={() => fileRef.current.click()}>
                      <FiUpload size={28} style={{ margin:'0 auto 8px', color:'var(--gray-400)', display:'block' }} />
                      <p style={{ fontSize:14, color:'var(--gray-500)' }}>Click to upload images (max 5, JPG/PNG/WebP)</p>
                      <p style={{ fontSize:12, color:'var(--gray-400)', marginTop:4 }}>Max 5 MB each</p>
                      <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleFiles} />
                    </div>
                    {previews.length > 0 && (
                      <div className="img-preview-grid">
                        {previews.map((src, i) => <img key={i} src={src} alt={`Preview ${i+1}`} className="img-preview" />)}
                      </div>
                    )}
                  </div>
                  <div className="form-group full" style={{ marginTop:8 }}>
                    <label>Product Video (optional — max 50 MB)</label>
                    <div className="upload-zone" onClick={() => videoRef.current.click()} style={{ padding:'16px 20px' }}>
                      <p style={{ fontSize:14, color:'var(--gray-500)' }}>🎥 Click to upload a product video (MP4, MOV)</p>
                      {videoFile && <p style={{ fontSize:13, color:'var(--green)', marginTop:6, fontWeight:600 }}>✅ {videoFile.name}</p>}
                      <input ref={videoRef} type="file" accept="video/*" onChange={e => setVideoFile(e.target.files[0] || null)} />
                    </div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:12, marginTop:24, justifyContent:'flex-end' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'Saving…':editing?'Update Product':'Create Product'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
