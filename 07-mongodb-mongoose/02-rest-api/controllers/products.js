const Product = require('../models/Product');
const mongoose = require('mongoose');

const mapProduct = (product) => ({
  id: product.id,
  title: product.title,
  images: product.images,
  category: product.category,
  subcategory: product.subcategory,
  price: product.price,
  description: product.description,
});

module.exports.validateObjectId = async (ctx, next) => {
  if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
    ctx.status = 400;
    ctx.body = { message: 'invalid object id' };
    return;
  }
  return next();
};
module.exports.productsBySubcategory = async function productsBySubcategory(
  ctx,
  next
) {
  if (ctx.query.subcategory) {
    const products = await Product.find({ subcategory: ctx.query.subcategory });
    ctx.body = { products: products.map(mapProduct) };
    return;
  }
  return next();
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();
  ctx.body = { products: products.map(mapProduct) };
  return;
};

module.exports.productById = async function productById(ctx, next) {
  const product = await Product.findById(ctx.params.id);
  if (!product) {
    ctx.status = 404;
    ctx.body = {};
  } else {
    ctx.body = { product: mapProduct(product) };
  }
  return next();
};
