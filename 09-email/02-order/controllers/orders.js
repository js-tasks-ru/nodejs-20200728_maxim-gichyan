const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
  order = await Order.create({
    product: ctx.request.body.product,
    phone: ctx.request.body.phone,
    address: ctx.request.body.address,
    user: ctx.user.id,
  });
  product = await Product.findById(ctx.request.body.product);
  await sendMail({
    to: ctx.user.email,
    subject: 'Подтверждение заказа',
    locals: { order: order.id, product: product.title },
    template: 'order-confirmation',
  });
  ctx.body = { order: order.id };
  return next();
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  orders = await Order.find({ user: ctx.user.id }).populate('product');
  ctx.body = { orders: orders.map(mapOrder) };
  return next();
};
