const Router = require('koa-router');
const passport = require('koa-passport');

const router = new Router();

// router.get('/', (ctx, next) => {
//     ctx.body = 'Hello World!';
//    });


  router.post('/auth/login', async (ctx) => {
    console.log("Route Email : " + ctx.request.body.email + "Route Password : " + ctx.request.body.password);
    return passport.authenticate('local', (err, account, info, status) => {
        console.log('Route Callback');
        console.log('Account : ' + account);
      if (account) {
        ctx.login(account);
      } else {
        ctx.status = 400;
        ctx.body = { status: 'Route error' };
      }
    })(ctx);
  });


module.exports = router;