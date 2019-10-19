const Koa = require('koa');
const uuid = require('uuid');
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
let subscribers = {};

function publish(ctx, message) {
  for (const id in subscribers) {
    if (id) {
      subscribers[id].statusCode = 200;
      subscribers[id].end(message);
    }
  };

  subscribers = {};
}

router.get('/subscribe', async (ctx, next) => {
  const id = uuid();
  subscribers[id] = ctx.res;

  await new Promise((resolve) => {
    ctx.req.on('close', function() {
      resolve();
    });
  });
});

router.post('/publish', async (ctx, next) => {
  const {message} = ctx.request.body;
  if (!message) return next();

  publish(ctx, message);

  ctx.body = message;
});

app.use(router.routes());

module.exports = app;
