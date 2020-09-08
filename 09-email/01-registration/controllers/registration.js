const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const token = uuid();
  const user = new User({
    email: ctx.request.body.email,
    displayName: ctx.request.body.displayName,
    verificationToken: token,
  });
  await user.setPassword(ctx.request.body.password);
  await user.save();
  const mail = await sendMail({
    template: 'confirmation',
    locals: { token: token },
    to: ctx.request.body.email,
    subject: 'Подтвердите почту',
  });
  ctx.body = { status: 'ok' };
  return next();
};

module.exports.confirm = async (ctx, next) => {
  const user = await User.findOne({
    verificationToken: ctx.request.body.verificationToken,
  });
  if (!user)
    ctx.throw(401, 'Ссылка подтверждения недействительна или устарела');
  user.verificationToken = undefined;
  ctx.request.body.email = user.email;
  ctx.request.body.password = '*';
  await user.save();
  const token = await ctx.login(user);
  ctx.body = { token };
  return next();
};
