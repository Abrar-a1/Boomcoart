const Joi = require('joi');

const authSchemas = {
  register: Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).required(),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  updateProfile: Joi.object({
    name: Joi.string().trim().min(2).max(50),
    email: Joi.string().email().lowercase(),
  }).min(1), // At least one field required
  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
  }),
  forgotPassword: Joi.object({
    email: Joi.string().email().required(),
  }),
  resetPassword: Joi.object({
    password: Joi.string().min(6).required(),
  }),
};

const productSchemas = {
  create: Joi.object({
    name: Joi.string().trim().max(120).required(),
    description: Joi.string().max(2000).required(),
    price: Joi.number().min(0).required(),
    discountPrice: Joi.number().min(0).default(0),
    category: Joi.string().valid('men', 'women', 'bridal', 'boys', 'girls', 'unisex').required(),
    subCategory: Joi.string().valid('shirts', 'pants', 'kurta', 'saree', 'lehenga', 'dress', 'jeans', 'jacket', 'suit', 'sherwani', 'tops', 'skirts', 'ethnic', 'western', 'accessories').required(),
    sizes: Joi.any(),
    colors: Joi.any(),
    stock: Joi.number().min(0).required(),
    tags: Joi.any(),
    isFeatured: Joi.any()
  }).options({ allowUnknown: true }), // Allow req.file/req.files to bypass
  update: Joi.object({
    name: Joi.string().trim().max(120),
    description: Joi.string().max(2000),
    price: Joi.number().min(0),
    discountPrice: Joi.number().min(0),
    category: Joi.string().valid('men', 'women', 'bridal', 'boys', 'girls', 'unisex'),
    subCategory: Joi.string().valid('shirts', 'pants', 'kurta', 'saree', 'lehenga', 'dress', 'jeans', 'jacket', 'suit', 'sherwani', 'tops', 'skirts', 'ethnic', 'western', 'accessories'),
    sizes: Joi.any(),
    colors: Joi.any(),
    stock: Joi.number().min(0),
    tags: Joi.any(),
    isFeatured: Joi.any()
  }).options({ allowUnknown: true }),
};

const appointmentSchemas = {
  create: Joi.object({
    productId: Joi.string().required(),
    date: Joi.date().iso().required(),
    timeSlot: Joi.string().valid('10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM').required(),
    type: Joi.string().valid('home_try_on', 'virtual').required(),
    address: Joi.object({
      addressLine1: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      pincode: Joi.string().required(),
    }).when('type', {
      is: 'home_try_on',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
  }),
  updateStatus: Joi.object({
    status: Joi.string().valid('pending', 'confirmed', 'cancelled').required()
  })
};

module.exports = { authSchemas, productSchemas, appointmentSchemas };
