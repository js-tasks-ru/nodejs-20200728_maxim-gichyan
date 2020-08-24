const path = require('path');
const Koa = require('koa');
const Chat = require('./Chat');

const chat = new Chat({ size: 20 });
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

router.get('/subscribe', async (ctx, next) => {
  try {
    ctx.body = await new Promise((resolve, reject) => {
      chat.once('message', (err, message) => {
        if (message) {
          resolve(message);
        } else {
          reject(err);
        }
      });
    });
    return next();
  } catch (err) {
    ctx.status = 500;
    return next();
  }
});

router.post('/publish', async (ctx, next) => {
  try {
    const { message } = ctx.request.body;
    if (message) {
      chat.publish(message);
      ctx.body = 'ok';
    }
    return next();
  } catch (err) {
    ctx.status = 500;
    return next();
  }
});

app.use(router.routes());

module.exports = app;
