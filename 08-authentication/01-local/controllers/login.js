const { v4: uuid } = require('uuid');
const passport = require('../libs/passport');

module.exports.login = async function login(ctx, next) {
  console.log(ctx.request.body);
  await passport.authenticate('local', async (err, user, info) => {
    if (err) throw err;

    if (!user) {
      ctx.status = 400;
      ctx.body = { error: info };
      return;
    }

    const token = uuid();

    ctx.body = { token };
  })(ctx, next);
};
