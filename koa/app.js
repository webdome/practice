const Koa = require('koa');
const app = new Koa();

// x-response-time

// app.use(async (ctx, next) => {
//   const start = Date.now();
//   await next();
//   const ms = Date.now() - start;
//   ctx.set('X-Response-Time', `${ms}ms`);
// });

// logger

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

// response

app.use(async ctx => {
  ctx.cookies.set('id','koa')
  ctx.body = {name:'koa'};
});

app.on('error', err => {
  log.error('server error', err)
});

app.listen(3000);