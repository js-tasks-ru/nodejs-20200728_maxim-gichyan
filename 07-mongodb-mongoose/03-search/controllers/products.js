const Product = require('../models/Product');
module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  // console.log(ctx.query.query);
  const products = await Product.find({ $text: { $search: ctx.query.query } });
  ctx.body = { products: products };
};
