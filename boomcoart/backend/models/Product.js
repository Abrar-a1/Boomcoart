const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, maxlength: 2000 },
  price:        { type: Number, required: true, min: 0 },
  discountPrice:{ type: Number, default: 0, min: 0 },
  category: {
    type: String, required: true,
    enum: ['men','women','bridal','boys','girls','unisex'],
  },
  subCategory: {
    type: String, required: true,
    enum: ['shirts','pants','kurta','saree','lehenga','dress','jeans',
           'jacket','suit','sherwani','tops','skirts','ethnic','western','accessories'],
  },
  images: [{ url: { type: String, required: true }, publicId: { type: String, required: true } }],
  video:  { url: { type: String, default: '' }, publicId: { type: String, default: '' } },
  sizes:  { type: [String], enum: ['XS','S','M','L','XL','XXL','XXXL','Free Size'], default: [] },
  colors: [{ type: String }],
  stock:      { type: Number, required: true, min: 0, default: 0 },
  ratings:    { type: Number, default: 0, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 },
  tags:       [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  isActive:   { type: Boolean, default: true },
  createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, subCategory: 1 });
productSchema.index({ price: 1 });

module.exports = mongoose.model('Product', productSchema);
