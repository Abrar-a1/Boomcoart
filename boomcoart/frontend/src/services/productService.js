import api from './api';
export const getProducts       = (params) => api.get('/products', { params });
export const getFeaturedProducts = ()     => api.get('/products/featured');
export const getProductById    = (id)     => api.get(`/products/${id}`);
export const getAdminProducts  = ()       => api.get('/products/admin/all');
export const createProduct     = (data)   => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProduct     = (id, data) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProduct     = (id)     => api.delete(`/products/${id}`);
export const toggleProductStatus = (id) => api.patch(`/products/${id}/toggle`);
